import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "@/components/ui/sonner";
import { FingerprintProvider } from "@/context/Fingerprint";
import QueryProvider from "@/context/QueryProvider";
import "@/app/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <FingerprintProvider>
        <App />
        <Toaster richColors />
      </FingerprintProvider>
    </QueryProvider>
  </React.StrictMode>
);
