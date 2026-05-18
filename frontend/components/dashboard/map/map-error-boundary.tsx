"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { MapErrorState } from "../error/map-error-state";

type MapErrorBoundaryProps = {
  children: ReactNode;
  resetKey: string | number;
};

type MapErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class MapErrorBoundary extends Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  state: MapErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Map render error", error, errorInfo);
  }

  override componentDidUpdate(prevProps: MapErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <MapErrorState error={this.state.error} onRetry={this.handleRetry} />
      );
    }

    return this.props.children;
  }
}
