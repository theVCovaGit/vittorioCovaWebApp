"use client";

import { createContext, useContext, useState } from "react";

interface IconDisplayContextType {
  iconUrl: string | null;
  setIconUrl: (url: string | null) => void;
}

const IconDisplayContext = createContext<IconDisplayContextType>({
  iconUrl: null,
  setIconUrl: () => {},
});

export const useIconDisplay = () => useContext(IconDisplayContext);

export const IconDisplayProvider = ({ children }: { children: React.ReactNode }) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  return (
    <IconDisplayContext.Provider value={{ iconUrl, setIconUrl }}>
      {children}
    </IconDisplayContext.Provider>
  );
};
