import type { Metadata } from "next";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Termini di Servizio",
  description:
    "Termini e condizioni di utilizzo della piattaforma Synapsy.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg py-16 px-4">
        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-heading text-4xl font-bold text-text mb-3">
              Termini di Servizio
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
                1. Definizioni
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong>Piattaforma</strong>: il sito web e l&apos;applicazione
                  Synapsy, accessibili all&apos;indirizzo synapsy.it
                </li>
                <li>
                  <strong>Gestore</strong>: Synapsy S.r.l., titolare e gestore
                  della piattaforma
                </li>
                <li>
                  <strong>Utente</strong>: qualsiasi persona che accede e
                  utilizza la piattaforma
                </li>
                <li>
                  <strong>Professionista</strong>: psicologo/a iscritto/a
                  all&apos;albo e registrato/a sulla piattaforma
                </li>
                <li>
                  <strong>Servizio di matching</strong>: l&apos;algoritmo che
                  suggerisce abbinamenti tra utenti e professionisti
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                2. Servizio offerto
              </h2>
              <p>
                Synapsy è una piattaforma digitale che facilita l&apos;incontro
                tra persone in cerca di supporto psicologico e professionisti
                della salute mentale qualificati e iscritti all&apos;albo. Il
                servizio di matching è puramente informativo e non costituisce
                consulenza medica o psicologica.
              </p>
              <p className="mt-3">
                Synapsy <strong>non è un servizio di emergenza</strong>. In caso
                di emergenza psichiatrica, contatta il 118 o recati al pronto
                soccorso più vicino.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                3. Registrazione e account
              </h2>
              <p className="mb-3">Per utilizzare la piattaforma è necessario:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Avere almeno 18 anni di età</li>
                <li>Fornire dati veritieri e accurati in fase di registrazione</li>
                <li>
                  Mantenere le credenziali di accesso riservate e sicure
                </li>
                <li>
                  Comunicare tempestivamente eventuali accessi non autorizzati
                </li>
              </ul>
              <p className="mt-3 text-sm text-text-tertiary">
                [Dettagli aggiuntivi da definire]
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                4. Obblighi dell&apos;utente
              </h2>
              <p className="mb-3">L&apos;utente si impegna a:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  Utilizzare la piattaforma in modo lecito e non lesivo dei
                  diritti altrui
                </li>
                <li>
                  Non condividere contenuti offensivi, falsi o inappropriati
                </li>
                <li>
                  Non tentare di accedere in modo non autorizzato ai sistemi
                </li>
                <li>
                  Rispettare i professionisti e mantenere un comportamento
                  rispettoso
                </li>
                <li>
                  Non utilizzare la piattaforma per scopi commerciali non
                  autorizzati
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                5. Pagamenti e rimborsi
              </h2>
              <p>
                I pagamenti per le sessioni con i professionisti avvengono
                tramite i metodi di pagamento disponibili sulla piattaforma,
                gestiti da provider terzi certificati (es. Stripe). I prezzi
                delle sessioni sono fissati da ciascun professionista. La
                politica di cancellazione e rimborso è definita nelle condizioni
                specifiche di ciascun professionista e resa disponibile prima
                della prenotazione.
              </p>
              <p className="mt-3 text-sm text-text-tertiary">
                [Politica di rimborso dettagliata da definire]
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                6. Limitazione di responsabilità
              </h2>
              <p>
                Synapsy non è responsabile per la qualità delle prestazioni
                professionali erogate dai professionisti registrati, né per
                eventuali danni derivanti dall&apos;utilizzo della piattaforma
                al di fuori dei casi di dolo o colpa grave del Gestore. Synapsy
                verifica l&apos;iscrizione all&apos;albo dei professionisti ma
                non può garantire l&apos;esito terapeutico delle sessioni.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                7. Recesso e chiusura account
              </h2>
              <p>
                L&apos;utente può recedere dal servizio in qualsiasi momento,
                richiedendo la chiusura dell&apos;account tramite le impostazioni
                del profilo o scrivendo a{" "}
                <a
                  href="mailto:support@synapsy.it"
                  className="text-primary-600 hover:underline"
                >
                  support@synapsy.it
                </a>
                . Synapsy si riserva il diritto di sospendere o chiudere account
                in caso di violazione dei presenti Termini, previo avviso ove
                possibile.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
