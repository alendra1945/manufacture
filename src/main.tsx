import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "./providers/query-client-providers.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider>
      <App />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
