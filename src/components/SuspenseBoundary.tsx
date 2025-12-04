"use client";

import { Suspense, type PropsWithChildren } from "react";

export default function SuspenseBoundary({ children }: PropsWithChildren) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
