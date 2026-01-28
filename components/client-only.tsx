"use client";

import { useSyncExternalStore } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

// An empty subscribe function because the value (isClient) never changes
// once the app is running on the client.
const subscribe = () => () => {};

const ClientOnly = ({ children }: ClientOnlyProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,       // Client snapshot
    () => false       // Server snapshot
  );

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;