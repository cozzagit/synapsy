import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Per Professionisti",
  description:
    "Unisciti alla rete Synapsy di professionisti della salute mentale e raggiungi pazienti che hanno bisogno di te.",
};

export default function ProfessionistiLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
