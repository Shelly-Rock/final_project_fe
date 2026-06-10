// Copy text vào clipboard, tự động reset trạng thái copied sau 2s
import { useState, useCallback } from "react";

interface UseClipboardOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        options.onSuccess?.();

        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Copy failed");
        setCopied(false);
        setError(error);
        options.onError?.(error);
      }
    },
    [options],
  );

  return { copy, copied, error };
}
