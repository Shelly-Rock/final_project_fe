// Chi tiết trạng thái mạng: isOnline, isSlowConnection, effectiveType, downlink, saveData
import { useEffect, useState } from "react";

interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface NetworkState {
  isOnline: boolean;
  isSlowConnection: boolean;
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export function useNetworkStatus(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>(() => ({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isSlowConnection: false,
  }));

  useEffect(() => {
    const updateNetworkState = () => {
      const connection = navigator.connection;
      const effectiveType = connection?.effectiveType;
      const isSlowConnection =
        effectiveType === "2g" || effectiveType === "slow-2g";

      setNetworkState({
        isOnline: navigator.onLine,
        isSlowConnection: !!isSlowConnection,
        effectiveType,
        downlink: connection?.downlink,
        saveData: connection?.saveData,
      });
    };

    const handleOnline = () =>
      setNetworkState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setNetworkState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener("change", updateNetworkState);
    }

    updateNetworkState();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", updateNetworkState);
      }
    };
  }, []);

  return networkState;
}
