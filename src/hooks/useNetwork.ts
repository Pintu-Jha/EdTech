import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
}

export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((nextState) => {
      setState({
        isConnected: Boolean(nextState.isConnected),
        isInternetReachable: Boolean(nextState.isInternetReachable),
      });
    });

    return unsubscribe;
  }, []);

  return state;
}
