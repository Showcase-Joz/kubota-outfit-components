import { useOutfit } from "@outfit.io/react";
import usePrintready from "../hooks/usePrintready";
import { Container } from "./Container";

export const Template = () => {
  usePrintready();
  const { inputs } = useOutfit();
  return <Container inputs={inputs} />;
};
