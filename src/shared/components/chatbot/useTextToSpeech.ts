"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseTextToSpeechOptions {
  rate?: number;
  volume?: number;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const { rate = 1.0, volume = 1.0 } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [hasVietnameseVoice, setHasVietnameseVoice] = useState(false);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const viVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const deferredTextRef = useRef<string | null>(null);
  const voicesLoadedRef = useRef(false);

  // Store the latest performSpeak in a ref so loadVoices can call it
  const performSpeakRef = useRef<((text: string) => void) | null>(null);

  const performSpeak = useCallback(
    (text: string) => {
      if (!isSupported || !isEnabled) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = rate;
      utterance.volume = volume;

      if (viVoiceRef.current) {
        utterance.voice = viVoiceRef.current;
      } else {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          utterance.voice = voices[0];
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, isEnabled, rate, volume],
  );

  // Sync ref after each render — stable callback, no re-render trigger
  useEffect(() => {
    performSpeakRef.current = performSpeak;
  }, [performSpeak]);

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;

      const viVoice =
        voices.find((v) => v.lang.toLowerCase().includes("vi")) ?? null;
      viVoiceRef.current = viVoice;
      setHasVietnameseVoice(!!viVoice);
      voicesLoadedRef.current = true;

      if (deferredTextRef.current !== null) {
        const text = deferredTextRef.current;
        deferredTextRef.current = null;
        performSpeakRef.current?.(text);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !isEnabled) return;

      if (!voicesLoadedRef.current) {
        deferredTextRef.current = text;
        return;
      }

      performSpeakRef.current?.(text);
    },
    [isSupported, isEnabled],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      if (!prev) stop();
      return !prev;
    });
  }, [stop]);

  return {
    speak,
    stop,
    toggle,
    isSpeaking,
    isEnabled,
    isSupported,
    hasVietnameseVoice,
  };
}
