"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  DashboardHeaderSkeleton,
  DashboardSidebarSkeleton,
} from "../loading/dashboard-skeletons";
import { DashboardErrorState } from "./dashboard-error-state";

type DashboardErrorBoundaryProps = {
  children: ReactNode;
  onRetry: () => void;
  resetKey: string | number;
  fallbackRender?: (retry: () => void, error: Error | null) => ReactNode;
};

type DashboardErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class DashboardErrorBoundary extends Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  state: DashboardErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard render error", error, errorInfo);
  }

  override componentDidUpdate(prevProps: DashboardErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender(this.handleRetry, this.state.error);
      }

      return (
        <div className="relative min-h-screen overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
          <DashboardSidebarSkeleton />

          <div className="flex min-h-screen flex-col lg:pl-[18.5rem]">
            <DashboardHeaderSkeleton />

            <main className="flex min-h-screen items-center justify-center px-4 pt-28 lg:pt-32">
              <DashboardErrorState
                title="El dashboard encontró un error temporal"
                description="Recargamos solo la estructura del dashboard para que puedas recuperar la vista sin salir de la página."
                detail={this.state.error?.message}
                actionLabel="Reintentar dashboard"
                onAction={this.handleRetry}
              />
            </main>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
