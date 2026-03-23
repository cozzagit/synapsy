"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Synapsy] Global error:", error);
  }, [error]);

  return (
    <html lang="it">
      <body
        style={{
          margin: 0,
          padding: "2rem",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          backgroundColor: "#F5F3EF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
          color: "#2D2B28",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#5B8A72",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "1.25rem",
            }}
          >
            S
          </div>
          <span
            style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2D2B28" }}
          >
            Synapsy
          </span>
        </div>

        {/* Illustration circle */}
        <div
          aria-hidden="true"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, #e8c4a0 0%, #c8bfea 55%, #a8c5b5 100%)",
            boxShadow: "0 8px 32px 0 rgba(212,149,106,0.18)",
            marginBottom: "2rem",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 700,
            color: "#2D2B28",
            textAlign: "center",
            marginBottom: "1rem",
            margin: "0 0 1rem",
          }}
        >
          Qualcosa è andato storto
        </h1>
        <p
          style={{
            color: "#6B6860",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "420px",
            marginBottom: "2rem",
            margin: "0 0 2rem",
          }}
        >
          Si è verificato un errore critico. Prova a ricaricare la pagina o
          torna alla home.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            type="button"
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "44px",
              padding: "0 1.5rem",
              borderRadius: "12px",
              backgroundColor: "#5B8A72",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              transition: "background-color 0.15s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#4a7360";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#5B8A72";
            }}
          >
            Riprova
          </button>
          <a
            href="/"
            style={{
              fontSize: "0.875rem",
              color: "#6B6860",
              textDecoration: "none",
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.textDecoration =
                "underline")
            }
            onMouseOut={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.textDecoration =
                "none")
            }
          >
            Torna alla home
          </a>
        </div>
      </body>
    </html>
  );
}
