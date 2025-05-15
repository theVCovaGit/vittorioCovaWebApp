// /context/TransitionContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type TransitionState = {
  category: string | null;
  finalX: number;
  finalY: number;
  textSize: string;
  setTransition: (data: Partial<TransitionState>) => void;
};

const TransitionContext = createContext<TransitionState>({
  category: null,
  finalX: 0,
  finalY: 0,
  textSize: "1.9rem",
  setTransition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<TransitionState, "setTransition">>({
    category: null,
    finalX: 0,
    finalY: 0,
    textSize: "1.9rem",
  });

  const setTransition = (data: Partial<TransitionState>) => {
    setState((prev) => ({ ...prev, ...data }));
    console.log("🔄 Transition Context Updated:", { ...state, ...data });
  };

  return (
    <TransitionContext.Provider value={{ ...state, setTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}
