// Theo dõi trạng thái focus của phần tử. Trả về [ref, { isFocused, blur }]. Dùng cho validation input
import { useEffect, useRef, useState, RefObject } from "react";

export function useFocus<T extends HTMLElement = HTMLElement>(
  initialValue = false,
): [RefObject<T | null>, { isFocused: boolean; blur: () => void }] {
  const ref = useRef<T | null>(null);
  const [isFocused, setIsFocused] = useState(initialValue);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);

    return () => {
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
    };
  }, []);

  const blur = () => ref.current?.blur();

  return [ref, { isFocused, blur }];
}
