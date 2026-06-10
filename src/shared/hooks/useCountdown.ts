// Đếm ngược từ initialSeconds. Hỗ trợ start, pause, resume, reset. Dùng cho OTP resend, countdown
import { useEffect, useRef, useState, useCallback } from "react";

interface UseCountdownOptions {
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown(
  initialSeconds: number,
  options: UseCountdownOptions = {},
): {
  seconds: number;
  isRunning: boolean;
  isComplete: boolean;
  start: (newSeconds?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
} {
  const { onComplete, autoStart = false } = options;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const secondsRef = useRef(seconds);

  useEffect(() => {
    if (initialRef.current === null) {
      initialRef.current = initialSeconds;
    }
    onCompleteRef.current = onComplete;
    secondsRef.current = seconds;
  });

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      const startFrom = newSeconds ?? initialRef.current ?? initialSeconds;
      setSeconds(startFrom);
      setIsRunning(true);
    },
    [clearTimer, initialSeconds],
  );

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    setIsRunning((prev) => {
      if (secondsRef.current > 0) return true;
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setSeconds(initialRef.current ?? initialSeconds);
    setIsRunning(false);
  }, [clearTimer, initialSeconds]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return clearTimer;
  }, [isRunning, seconds, clearTimer]);

  return {
    seconds,
    isRunning,
    isComplete: seconds === 0,
    start,
    pause,
    resume,
    reset,
  };
}
