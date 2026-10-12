import { useEffect } from "react";
import { initializeInteractions } from "../lib/initializeInteractions";

export function usePortfolioInteractions(route: string) {
  useEffect(() => {
    initializeInteractions();
  }, [route]);
}
