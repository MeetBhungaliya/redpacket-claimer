"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { createContext, use, useEffect, useState } from "react";

const DEFAULT_STATE = { loading: true, data: null };

const FingerprintContext = createContext(DEFAULT_STATE);

export function FingerprintProvider({ children }) {
  const [visitorId, setVisitorId] = useState(DEFAULT_STATE);

  const getFingerprint = async () => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setVisitorId((prev) => ({ ...prev, data: result.visitorId }));
    } catch (error) {
      console.log(error);
    } finally {
      setVisitorId((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getFingerprint();
  }, []);

  return (
    <FingerprintContext.Provider value={visitorId}>
      {children}
    </FingerprintContext.Provider>
  );
}

export function useVisitorId() {
  const context = use(FingerprintContext);
  if (!context) {
    throw new Error("useVisitorId must be used within an FingerprintProvider");
  }
  return context;
}
