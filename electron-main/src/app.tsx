import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HomePage } from "./HomePage";

const root = createRoot(document.body);
const queryClient = new QueryClient();
root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <HomePage />
    </QueryClientProvider>
  </Suspense>
);
