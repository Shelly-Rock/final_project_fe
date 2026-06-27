"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SttOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface SttReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = {
  new (): SpeechRecognitionInstance;
};

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

function buildRecognition(
  lang: string,
  continuous: boolean,
  interimResults: boolean,
  onResult: (transcript: string) => void,
  onStart: () => void,
  onEnd: () => void,
  onError: (error: string) => void,
): SpeechRecognitionInstance {
  const SpeechRecognitionCtor = getSpeechRecognitionCtor();
  if (!SpeechRecognitionCtor)
    throw new Error("SpeechRecognition not supported");

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = lang;
  recognition.continuous = continuous;
  recognition.interimResults = interimResults;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript.trim() + " ";
      }
    }
    if (finalTranscript) onResult(finalTranscript);
  };

  recognition.onstart = onStart;
  recognition.onend = onEnd;
  recognition.onerror = (event: SpeechRecognitionErrorEvent) =>
    onError(event.error);

  return recognition;
}

export function useSpeechRecognition(options: SttOptions = {}): SttReturn {
  const { lang = "vi-VN", continuous = true, interimResults = true } = options;

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize support synchronously on mount (avoids setState in effect)
  const SpeechRecognitionCtor = getSpeechRecognitionCtor();
  const isSupported = SpeechRecognitionCtor !== null;

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const handleResult = useCallback((text: string) => {
    setTranscript((prev) => prev + text);
  }, []);

  const handleStart = useCallback(() => {
    setIsListening(true);
    setError(null);
  }, []);

  const handleEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const handleError = useCallback((err: string) => {
    console.error("[STT] onerror:", err);
    setIsListening(false);

    switch (err) {
      case "not-allowed":
      case "service-not-allowed":
        setError(
          "Không có quyền truy cập micro. Vui lòng cho phép trình duyệt sử dụng micro.",
        );
        break;
      case "network":
        setError("Mất kết nối mạng. Edge cần internet để nhận diện giọng nói.");
        break;
      case "no-speech":
        setError("Không phát hiện giọng nói.");
        break;
      case "audio-capture":
        setError("Không tìm thấy micro.");
        break;
      case "aborted":
        setError(null);
        break;
      default:
        setError("Đã xảy ra lỗi khi nhận diện giọng nói.");
    }
  }, []);

  useEffect(() => {
    const recognition = buildRecognition(
      lang,
      continuous,
      interimResults,
      handleResult,
      handleStart,
      handleEnd,
      handleError,
    );
    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
    // lang/continuous/interimResults only change on prop update — safe to include
    // handleResult/handleStart/handleEnd/handleError are stable via useCallback
  }, [
    lang,
    continuous,
    interimResults,
    handleResult,
    handleStart,
    handleEnd,
    handleError,
  ]);

  const startListening = useCallback(() => {
    if (isListening) return;
    setError(null);

    if (!recognitionRef.current) {
      try {
        const recognition = buildRecognition(
          lang,
          continuous,
          interimResults,
          handleResult,
          handleStart,
          handleEnd,
          handleError,
        );
        recognitionRef.current = recognition;
      } catch {
        return;
      }
    }

    try {
      recognitionRef.current.lang = lang;
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.start();
    } catch (err: unknown) {
      if ((err as { name?: string }).name === "InvalidStateError") {
        // Race condition — rebuild and retry
        try {
          const recognition = buildRecognition(
            lang,
            continuous,
            interimResults,
            handleResult,
            handleStart,
            handleEnd,
            handleError,
          );
          recognitionRef.current = recognition;
          recognition.start();
        } catch (retryErr) {
          console.error("[STT] retry error:", retryErr);
        }
      } else {
        console.error("[STT] startListening error:", err);
        setError("Không thể bắt đầu nhận diện giọng nói.");
      }
    }
  }, [
    isListening,
    lang,
    continuous,
    interimResults,
    handleResult,
    handleStart,
    handleEnd,
    handleError,
  ]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // Already stopped
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}
