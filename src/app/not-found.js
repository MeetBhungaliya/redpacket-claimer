"use client";

import { useEffect } from "react";

import EmptyState from "@/components/EmptyState";

const NotFound = ({ error }) => {
  useEffect(() => {
    console.error("🚀 ~ NotFound ~ error:", error);
  }, [error]);

  return (
    <EmptyState
      title="Uh No"
      subtitle="Could not find requested resource"
      showReset
      label="Go back home"
    />
  );
};

export default NotFound;
