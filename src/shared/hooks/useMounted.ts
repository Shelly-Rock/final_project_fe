// Kiểm tra component đã mount chưa. Dùng để tránh setState sau khi unmount
import { useEffect, useRef, useState } from "react";

export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      setIsMounted(true);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMounted;
}
