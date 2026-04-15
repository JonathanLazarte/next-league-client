"use client";

import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import store from "@/redux/store";

export function Providers({ children }) {
  const queryClient = new QueryClient();

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}
