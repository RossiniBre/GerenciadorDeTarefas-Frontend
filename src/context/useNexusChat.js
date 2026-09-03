import { useContext } from "react";
import { NexusChatContext } from "./NexusChatContext";

export function useNexusChat() {
  const context = useContext(NexusChatContext);
  if (!context) {
    throw new Error("useNexusChat deve ser usado dentro de um NexusChatProvider");
  }
  return context;
}