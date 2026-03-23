import type { Metadata } from "next";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali ai sensi del GDPR (Regolamento UE 2016/679).",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg py-16 px-4">
        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-heading text-4xl font-bold text-text mb-3">
              Privacy Policy
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
                1. Titolare del trattamento
              </h2>
              <p>
                Il titolare del trattamento dei dati personali è Synapsy S.r.l.,
                con sede legale in [indirizzo da definire], Italia. Per qualsiasi
                questione relativa alla privacy, è possibile contattarci
                all&apos;indirizzo email{" "}
                <a
                  href="mailto:privacy@synapsy.it"
                  className="text-primary-600 hover:underline"
                >
                  privacy@synapsy.it
                </a>
                .
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                2. Dati raccolti
              </h2>
              <p className="mb-3">
                Nella gestione della piattaforma raccogliamo le seguenti
                categorie di dati personali:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Dati anagrafici (nome, cognome, data di nascita)</li>
                <li>Dati di contatto (indirizzo email, numero di telefono)</li>
                <li>
                  Dati relativi alla salute, forniti volontariamente attraverso
                  il questionario di matching
                </li>
                <li>
                  Dati di utilizzo della piattaforma (log di accesso, preferenze)
                </li>
                <li>
                  Dati di pagamento (gestiti in modo sicuro da provider terzi
                  certificati PCI DSS)
                </li>
              </ul>
              <p className="mt-3 text-sm text-text-tertiary">
                [Sezione da completare con l&apos;elenco dettagliato]
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                3. Finalità del trattamento
              </h2>
              <p className="mb-3">
                I dati personali sono trattati per le seguenti finalità:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  Erogazione del servizio di matching tra utenti e professionisti
                </li>
                <li>Gestione del rapporto contrattuale e delle sessioni</li>
                <li>Comunicazioni di servizio e notifiche</li>
                <li>Adempimento degli obblighi di legge</li>
                <li>
                  Marketing e newsletter (previo consenso esplicito dell&apos;utente)
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                4. Base giuridica
              </h2>
              <p className="mb-3">
                Il trattamento dei dati si fonda sulle seguenti basi giuridiche
                ai sensi dell&apos;art. 6 del GDPR:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong>Esecuzione del contratto</strong> — per erogare il
                  servizio richiesto dall&apos;utente
                </li>
                <li>
                  <strong>Obbligo legale</strong> — per adempiere a obblighi di
                  legge
                </li>
                <li>
                  <strong>Consenso</strong> — per trattamenti di dati particolari
                  (salute) e per attività di marketing
                </li>
                <li>
                  <strong>Legittimo interesse</strong> — per la sicurezza della
                  piattaforma e la prevenzione delle frodi
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                5. Conservazione dei dati
              </h2>
              <p>
                I dati personali sono conservati per il tempo strettamente
                necessario alle finalità per cui sono stati raccolti e in
                conformità alle disposizioni di legge applicabili. In generale,
                i dati degli account attivi sono conservati per tutta la durata
                del rapporto contrattuale e per un periodo di{" "}
                <strong>10 anni</strong> dalla sua cessazione per obblighi
                legali. I dati di navigazione sono conservati per un massimo di{" "}
                <strong>12 mesi</strong>.
              </p>
              <p className="mt-3 text-sm text-text-tertiary">
                [Tabella di retention da completare con il DPO]
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-heading text-xl font-semibold text-text mb-3">
                6. Diritti dell&apos;interessato
              </h2>
              <p className="mb-3">
                In qualità di interessato, hai il diritto di:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong>Accesso</strong> — ottenere conferma del trattamento e
                  copia dei dati (art. 15 GDPR)
                </li>
                <li>
                  <strong>Rettifica</strong> — correggere dati inesatti (art. 16
                  GDPR)
                </li>
                <li>
                  <strong>Cancellazione</strong> — richiedere la rimozione dei
                  dati ("diritto all&apos;oblio", art. 17 GDPR)
                </li>
                <li>
                  <strong>Limitazione</strong> — limitare il trattamento in
                  determinate circostanze (art. 18 GDPR)
                </li>
                <li>
                  <strong>Portabilità</strong> — ricevere i tuoi dati in formato
                  strutturato (art. 20 GDPR)
                </li>
                <li>
                  <strong>Opposizione</strong> — opporti al trattamento per
                  legittimo interesse (art. 21 GDPR)
                </li>
                <li>
                  <strong>Revoca del consenso</strong> — in qualsiasi momento,
                  senza pregiudizio per il trattamento precedente
                </li>
              </ul>
              <p className="mt-4">
                Per esercitare i tuoi diritti, scrivi a{" "}
                <a
                  href="mailto:privacy@synapsy.it"
                  className="text-primary-600 hover:underline"
                >
                  privacy@synapsy.it
                </a>
                . Puoi inoltre proporre reclamo al Garante per la Protezione dei
                Dati Personali (
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  www.garanteprivacy.it
                </a>
                ).
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
