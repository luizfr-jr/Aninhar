import { createContext, useContext } from "react";
import type { ContentDocument } from "../types/content";
import type { Topic } from "./topics";

export interface ContentContextValue {
  topics: Topic[];
  pages: ContentDocument["pages"];
  preview: boolean;
}

export const ContentContext = createContext<ContentContextValue | undefined>(
  undefined,
);

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context)
    throw new Error("useContent must be used inside ContentProvider");
  return context;
}
