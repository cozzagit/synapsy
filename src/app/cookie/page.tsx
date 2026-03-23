import type { Metadata } from "next";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Informativa sull'utilizzo dei cookie e tecnologie di tracciamento sulla piattaforma Synapsy.",
};

export default function CookiePage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg py-16 px-4">
        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-heading text-4xl font-bold text-text mb-3">
              Cookie Policy
            </h1>
            <p className="text-sm text-text-tertiary">
              Ultimo aggiornamento: marzo 2026
            </p>
            <div className="mt-4 rounded-xl bg-primary-50 border border-primary-100 px-4 py-3">
              <p className="text-sm text-primary-700">
                <strong>Nota:</strong> Questo documento è una bozza preliminare.
                Il testo definitivo sarà redatto da un consulente legale prima
                del lancio della piattaforma.
              </p>
            </div>
          </header>

          <div className="space-y-10 text-text-secondary leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                1. Cosa sono i cookie
              </h2>
              <p>
                I cookie sono piccoli file di testo che i siti web salvano sul
                dispositivo dell&apos;utente durante la navigazione. Vengono
                utilizzati per migliorare l&apos;esperienza di utilizzo,
                ricordare le preferenze, analizzare il traffico e, in alcuni
                casi, mostrare pubblicità pertinente.
              </p>
              <p className="mt-3">
                Esistono cookie di sessione (che scadono alla chiusura del
                browser) e cookie persistenti (che rimangono sul dispositivo per
                un periodo definito).
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                2. Cookie tecnici
              </h2>
              <p className="mb-3">
                I cookie tecnici sono essenziali per il corretto funzionamento
                della piattaforma e non richiedono il consenso dell&apos;utente.
                Includiamo in questa categoria:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 text-left font-semibold text-text">
                        Nome
                      </th>
                      <th className="py-2 pr-4 text-left font-semibold text-text">
                        Finalità
                      </th>
                      <th className="py-2 text-left font-semibold text-text">
                        Durata
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">
                        session_token
                      </td>
                      <td className="py-2 pr-4">Autenticazione utente</td>
                      <td className="py-2">Sessione</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">
                        csrf_token
                      </td>
                      <td className="py-2 pr-4">
                        Protezione da attacchi CSRF
                      </td>
                      <td className="py-2">Sessione</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">
                        cookie_consent
                      </td>
                      <td className="py-2 pr-4">
                        Memorizzazione delle preferenze cookie
                      </td>
                      <td className="py-2">12 mesi</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                3. Cookie analitici
              </h2>
              <p>
                I cookie analitici ci aiutano a capire come gli utenti
                interagiscono con la piattaforma, permettendoci di migliorare
                l&apos;esperienza. Questi cookie raccolgono dati in forma
                aggregata e anonimizzata e vengono attivati solo previo consenso
                dell&apos;utente.
              </p>
              <p className="mt-3">
                Utilizziamo [strumento di analytics da definire — es. Plausible
                o PostHog in self-host per massima privacy]. Non utilizziamo
                Google Analytics per evitare trasferimenti di dati verso paesi
                terzi.
              </p>
              <p className="mt-3 text-sm text-text-tertiary">
                [Tabella cookie analitici da completare]
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                4. Gestione dei cookie
              </h2>
              <p className="mb-3">
                Puoi gestire le tue preferenze sui cookie in qualsiasi momento
                attraverso:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  Il pannello preferenze cookie accessibile dal footer della
                  piattaforma
                </li>
                <li>
                  Le impostazioni del tuo browser (consulta la guida specifica
                  per il tuo browser)
                </li>
                <li>
                  Strumenti di opt-out specifici per i provider terzi (dove
                  applicabile)
                </li>
              </ul>
              <p className="mt-4">
                La disabilitazione dei cookie tecnici potrebbe compromettere il
                funzionamento della piattaforma. Per assistenza, scrivi a{" "}
                <a
                  href="mailto:privacy@synapsy.it"
                  className="text-primary-600 hover:underline"
                >
                  privacy@synapsy.it
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
