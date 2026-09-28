// The installed Outfit package has no TypeScript declarations.
declare module "@outfit.io/react" {
  import { ComponentType, ReactNode } from "react";

  export const Limiter: ComponentType<{
    children?: ReactNode;
    maxLines?: number;
    textfit?: boolean;
    textfitConfig?: {
      minFontSize?: number;
      maxFontSize?: number;
    };
  }>;
}
