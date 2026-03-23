import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Lora } from "next/font/google";
import "@/styles/globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Synapsy — La connessione giusta, al momento giusto",
    template: "%s | Synapsy",
  },
  description:
    "Piattaforma di matching intelligente tra chi cerca supporto psicologico e professionisti qualificati. Trova lo psicologo giusto per te.",
  keywords: [
    "psicologo",
    "terapia",
    "matching",
    "supporto psicologico",
    "salute mentale",
  ],
  openGraph: {
    title: "Synapsy — La connessione giusta, al momento giusto",
    description:
      "Trova lo psicologo giusto per te con il nostro sistema di matching intelligente.",
    type: "website",
    locale: "it_IT",
    siteName: "Synapsy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synapsy — La connessione giusta, al momento giusto",
    description:
      "Trova lo psicologo giusto per te con il nostro sistema di matching intelligente.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://synapsy.vibecanyon.com"
  ),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${plusJakarta.variable} ${inter.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
