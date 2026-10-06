import { ComponentStarter } from "kubota-outfit-components";
import { data } from "./data.js";

// Use a container sized for your component, not necessarily the whole advert.
// These are the existing print preset dimensions, not new Figma measurements.
export const ComponentStarterExample = ({ preset = "print", inputs = {} }) => (
  <div style={{ width: 598, height: 181 }}>
    <ComponentStarter
      preset={preset}
      placeholderText={inputs.componentStarterPlaceholderText}
      fallbackContent={data}
    />
  </div>
);
