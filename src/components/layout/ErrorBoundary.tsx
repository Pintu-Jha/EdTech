import type { ReactNode } from "react";
import { Component } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-canvas px-6">
          <Feather name="alert-circle" size={44} color="#2D3A52" />
          <Text className="mt-4 text-base font-semibold text-primary">
            Something went wrong
          </Text>
          <Text className="mt-1.5 max-w-[220px] text-center text-[13px] leading-5 text-secondary">
            The screen crashed unexpectedly. Try reloading this view.
          </Text>
          <Pressable
            onPress={this.reset}
            className="mt-5 rounded-btn bg-accent px-5 py-2.5"
          >
            <Text className="text-sm font-semibold text-white">Retry</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
