import { Placeholder } from "@outfit.io/react";
import { artwork } from "../utils/artwork";

// Shared by every component in both the Outfit and standalone previews.
export const ArtworkPlaceholder = ({ component, preset }) => {
  const selection = artwork[component]?.[preset];

  // Never show another component/preset's artwork or Outfit's generic grey image.
  if (!selection?.image) return null;

  return (
    <Placeholder
      image={selection.image}
      hide={selection.hide ?? true}
      opacity={selection.opacity ?? 0.3}
      offset={false}
    />
  );
};
