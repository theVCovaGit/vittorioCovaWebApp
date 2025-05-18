"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type TransitionState = {
  category: string | null;
  finalX: number;
  finalY: number;
  textSize: string;
  color: string; 
  setTransition: (data: Partial<TransitionState>) => void;
};

const TransitionContext = createContext<TransitionState>({
  category: null,
  finalX: 0,
  finalY: 0,
  textSize: "1.9rem",
  color: "#fef4dc",
  setTransition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<TransitionState, "setTransition">>({
    category: null,
    finalX: 0,
    finalY: 0,
    textSize: "1.9rem",
    color: "#fef4dc",
  });

  const setTransition = (data: Partial<TransitionState>) => {
    setState((prev) => ({ ...prev, ...data }));
    console.log("🔄 Transition Context Updated:", { ...state, ...data });
  };

  const pathname = usePathname();

  const isCreativePage = ["/architecture", "/productdesign", "/film", "/art"].includes(pathname);

  useEffect(() => {
    if (!isCreativePage && state.category !== null) {
      console.log("📭 Left creative page, clearing transition context.");
      setState({
        category: null,
        finalX: 0,
        finalY: 0,
        textSize: "1.9rem",
        color: "#fef4dc",
      });
    }
    // Otherwise, keep the category visible
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ ...state, setTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}
