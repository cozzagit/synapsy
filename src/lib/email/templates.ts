// ─── Shared layout helpers ─────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://synapsy.vibecanyon.com";

const CRISIS_FOOTER = `
  <tr>
    <td style="padding: 12px 0 0 0; border-top: 1px solid #E8E5DF;">
      <p style="margin: 0; font-size: 12px; color: #9C9890; line-height: 1.6;">
        <strong style="color: #C4645A;">Supporto crisi 24/7:</strong>
        Telefono Amico <a href="tel:02-2327-2327" style="color: #5B8A72;">02-2327-2327</a> &nbsp;|&nbsp;
        Telefono Azzurro <a href="tel:19696" style="color: #5B8A72;">19696</a> &nbsp;|&nbsp;
        Emergenza <a href="tel:118" style="color: #5B8A72;">118</a>
      </p>
    </td>
  </tr>
`;

function baseLayout(content: string, includecrisis = false): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Synapsy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px;">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #5B8A72; border-radius: 14px; width: 40px; height: 40px; text-align: center; vertical-align: middle;">
                    <span style="font-size: 20px; color: #ffffff; line-height: 40px; display: inline-block;">⬡</span>
                  </td>
                  <td style="padding-left: 10px; vertical-align: middle;">
                    <span style="font-size: 22px; font-weight: 700; color: #2D2B28; letter-spacing: -0.5px;">Synapsy</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); overflow: hidden;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                ${includecrisis ? CRISIS_FOOTER : ""}
                <tr>
                  <td style="padding-top: 16px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #9C9890; line-height: 1.7;">
                      Synapsy — La connessione giusta, al momento giusto<br />
                      <a href="${APP_URL}/impostazioni/notifiche" style="color: #9C9890; text-decoration: underline;">Gestisci preferenze email</a>
                      &nbsp;·&nbsp;
                      <a href="${APP_URL}/impostazioni/notifiche?unsubscribe=1" style="color: #9C9890; text-decoration: underline;">Annulla iscrizione</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
    <tr>
      <td style="background-color: #5B8A72; border-radius: 12px;">
        <a href="${href}" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.1px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function accentPill(text: string, color = "#8B7EC8"): string {
  return `<span style="display: inline-block; background-color: ${color}20; color: ${color}; font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 20px;">${text}</span>`;
}

// ─── Templates ─────────────────────────────────────────────────────────────

export function welcomeUser(name: string): { subject: string; html: string } {
  const content = `
    <td style="padding: 40px 40px 36px;">
      <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: #5B8A72; letter-spacing: -0.5px;">
        Benvenuto/a su Synapsy, ${name}! 🌿
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7;">
        Hai fatto il primo passo verso il benessere psicologico. Siamo qui per aiutarti a trovare il professionista più adatto a te, in modo semplice e riservato.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #F0F7F3; border-radius: 14px;">
        <tr>
          <td style="padding: 24px;">
            <p style="margin: 0 0 14px; font-size: 14px; font-weight: 600; color: #2D2B28; text-transform: uppercase; letter-spacing: 0.5px;">Come funziona</p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #2D2B28;">
                  <span style="color: #5B8A72; font-weight: 700; margin-right: 8px;">1.</span> Descrivi il tuo bisogno in modo anonimo
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #2D2B28;">
                  <span style="color: #5B8A72; font-weight: 700; margin-right: 8px;">2.</span> Ricevi candidature da psicologi compatibili
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #2D2B28;">
                  <span style="color: #5B8A72; font-weight: 700; margin-right: 8px;">3.</span> Scegli e fai una call conoscitiva gratuita
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Inizia ora", `${APP_URL}/dashboard`)}
          </td>
        </tr>
      </table>

      <p style="margin: 28px 0 0; font-size: 14px; color: #9C9890; text-align: center; line-height: 1.6;">
        La tua privacy è protetta. Nessuno psicologo conosce la tua identità finché non lo decidi tu.
      </p>
    </td>
  `;

  return {
    subject: "Benvenuto/a su Synapsy — inizia il tuo percorso",
    html: baseLayout(`<tr>${content}</tr>`, true),
  };
}

export function welcomePsychologist(name: string): {
  subject: string;
  html: string;
} {
  const content = `
    <td style="padding: 40px 40px 36px;">
      <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: #5B8A72; letter-spacing: -0.5px;">
        Benvenuto nella rete Synapsy, ${name}!
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7;">
        Il tuo profilo è stato creato con successo. Ora puoi iniziare a ricevere casi compatibili con la tua specializzazione e costruire la tua reputazione sulla piattaforma.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #F4F2FB; border-radius: 14px;">
        <tr>
          <td style="padding: 24px;">
            <p style="margin: 0 0 14px; font-size: 14px; font-weight: 600; color: #2D2B28; text-transform: uppercase; letter-spacing: 0.5px;">I tuoi vantaggi</p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #2D2B28;">
                  <span style="color: #8B7EC8; margin-right: 8px;">✦</span> Casi pre-selezionati per compatibilità
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #2D2B28;">
                  <span style="color: #8B7EC8; margin-right: 8px;">✦</span> Sistema di ranking e badge per valorizzare la tua expertise
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #2D2B28;">
                  <span style="color: #8B7EC8; margin-right: 8px;">✦</span> Crediti referral per ogni collega che porti sulla piattaforma
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 15px; color: #2D2B28;">
                  <span style="color: #8B7EC8; margin-right: 8px;">✦</span> Dashboard professionale con analytics sul tuo profilo
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 6px; font-size: 14px; color: #6B6862; line-height: 1.6;">
        <strong style="color: #2D2B28;">Prossimo passo:</strong> Completa il tuo profilo con le tue specializzazioni e disponibilità per iniziare a ricevere casi.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px;">
        <tr>
          <td align="center">
            ${ctaButton("Completa il profilo", `${APP_URL}/psicologo/profilo`)}
          </td>
        </tr>
      </table>
    </td>
  `;

  return {
    subject: "Benvenuto nella rete Synapsy — completa il tuo profilo",
    html: baseLayout(`<tr>${content}</tr>`, false),
  };
}

export function newCaseAvailable(
  psychologistName: string,
  problemArea: string,
  compatibilityScore: number
): { subject: string; html: string } {
  const scoreColor =
    compatibilityScore >= 80
      ? "#5B8A72"
      : compatibilityScore >= 60
        ? "#8B7EC8"
        : "#C47D52";

  const content = `
    <td style="padding: 40px 40px 36px;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #8B7EC8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nuovo caso disponibile</p>
      <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #2D2B28; letter-spacing: -0.3px;">
        Un caso compatibile ti aspetta, ${psychologistName}
      </h1>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; background-color: #FAFAF8; border: 1px solid #E8E5DF; border-radius: 14px;">
        <tr>
          <td style="padding: 20px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 12px; border-bottom: 1px solid #E8E5DF;">
                  <p style="margin: 0; font-size: 13px; color: #9C9890; margin-bottom: 4px;">Area problematica</p>
                  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #2D2B28;">${problemArea}</p>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 12px;">
                  <p style="margin: 0; font-size: 13px; color: #9C9890; margin-bottom: 6px;">Compatibilità stimata</p>
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: ${scoreColor}20; border-radius: 8px; padding: 6px 14px;">
                        <span style="font-size: 22px; font-weight: 700; color: ${scoreColor};">${compatibilityScore}%</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 24px; font-size: 15px; color: #6B6862; line-height: 1.7;">
        Candidati ora per far sapere all'utente che sei disponibile. I casi con alta compatibilità vengono assegnati rapidamente.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Vedi il caso e candidati", `${APP_URL}/psicologo/casi`)}
          </td>
        </tr>
      </table>

      <p style="margin: 20px 0 0; font-size: 13px; color: #9C9890; text-align: center;">
        Hai 48 ore per candidarti prima che il caso venga proposto ad altri professionisti.
      </p>
    </td>
  `;

  return {
    subject: `Nuovo caso compatibile — area: ${problemArea}`,
    html: baseLayout(`<tr>${content}</tr>`, false),
  };
}

export function matchFound(
  userName: string,
  psychologistCount: number
): { subject: string; html: string } {
  const countLabel =
    psychologistCount === 1
      ? "1 professionista si è candidato"
      : `${psychologistCount} professionisti si sono candidati`;

  const content = `
    <td style="padding: 40px 40px 36px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #F0F7F3; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 28px; text-align: center; margin-bottom: 16px;">🌿</div>
      </div>

      <h1 style="margin: 0 0 12px; font-size: 26px; font-weight: 700; color: #5B8A72; letter-spacing: -0.5px; text-align: center;">
        Buone notizie, ${userName}!
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7; text-align: center;">
        ${countLabel} per il tuo caso. Puoi ora consultare i profili e scegliere con chi fare una call conoscitiva gratuita.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #F0F7F3; border-radius: 14px;">
        <tr>
          <td style="padding: 20px 24px; text-align: center;">
            <p style="margin: 0; font-size: 36px; font-weight: 700; color: #5B8A72;">${psychologistCount}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #6B6862;">
              ${psychologistCount === 1 ? "professionista disponibile" : "professionisti disponibili"}
            </p>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 24px; font-size: 15px; color: #6B6862; line-height: 1.7; text-align: center;">
        Puoi selezionare fino a <strong style="color: #2D2B28;">2 psicologi a settimana</strong> per le call conoscitive. Prenditi il tempo che ti serve.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Vedi i professionisti", `${APP_URL}/dashboard`)}
          </td>
        </tr>
      </table>
    </td>
  `;

  return {
    subject: `Abbiamo trovato ${psychologistCount === 1 ? "un professionista" : psychologistCount + " professionisti"} per te`,
    html: baseLayout(`<tr>${content}</tr>`, true),
  };
}

export function candidacyAccepted(
  userName: string,
  psychologistName: string
): { subject: string; html: string } {
  const content = `
    <td style="padding: 40px 40px 36px;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #8B7EC8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nuova candidatura</p>
      <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #2D2B28; letter-spacing: -0.3px;">
        Uno psicologo si è candidato per te, ${userName}
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7;">
        <strong style="color: #5B8A72;">Dott. ${psychologistName}</strong> ha letto il tuo caso e ritiene di poterti supportare al meglio. Puoi consultare il suo profilo e, se sei interessato/a, selezionarlo per una call conoscitiva gratuita.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #F4F2FB; border-radius: 14px;">
        <tr>
          <td style="padding: 20px 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #2D2B28;">Cosa succede dopo?</p>
            <p style="margin: 0; font-size: 14px; color: #6B6862; line-height: 1.7;">
              Se selezioni questo psicologo, organizzerete insieme una <strong>call conoscitiva di 20 minuti</strong> — completamente gratuita — per capire se c'è affinità. Solo allora deciderai se iniziare un percorso.
            </p>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Vedi il profilo", `${APP_URL}/dashboard`)}
          </td>
        </tr>
      </table>
    </td>
  `;

  return {
    subject: `Dott. ${psychologistName} si è candidato per il tuo caso`,
    html: baseLayout(`<tr>${content}</tr>`, true),
  };
}

export function callReminder(
  name: string,
  otherName: string,
  scheduledAt: Date
): { subject: string; html: string } {
  const dateStr = scheduledAt.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeStr = scheduledAt.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <td style="padding: 40px 40px 36px;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #C47D52; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Promemoria call</p>
      <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #2D2B28; letter-spacing: -0.3px;">
        La tua call è domani, ${name}
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7;">
        Ricorda che hai una call conoscitiva programmata con <strong style="color: #2D2B28;">${otherName}</strong>.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #FDF5EF; border: 1px solid #F3D1B4; border-radius: 14px;">
        <tr>
          <td style="padding: 20px 24px; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 14px; color: #A6633C; text-transform: capitalize;">${dateStr}</p>
            <p style="margin: 0; font-size: 30px; font-weight: 700; color: #C47D52;">${timeStr}</p>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
        <tr>
          <td style="padding: 16px; background-color: #FAFAF8; border-radius: 12px; border: 1px solid #E8E5DF;">
            <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #2D2B28;">Consigli per la call:</p>
            <ul style="margin: 0; padding: 0 0 0 20px; font-size: 14px; color: #6B6862; line-height: 1.8;">
              <li>Scegli un posto tranquillo e privato</li>
              <li>Prepara le domande che vuoi fare</li>
              <li>La call dura circa 20 minuti</li>
              <li>Segui il tuo istinto nel valutare l'affinità</li>
            </ul>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Vai alla dashboard", `${APP_URL}/dashboard`)}
          </td>
        </tr>
      </table>
    </td>
  `;

  return {
    subject: `Promemoria: call con ${otherName} domani alle ${timeStr}`,
    html: baseLayout(`<tr>${content}</tr>`, true),
  };
}

export function postCallQuestionnaireReminder(name: string): {
  subject: string;
  html: string;
} {
  const content = `
    <td style="padding: 40px 40px 36px;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #8B7EC8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Azione richiesta</p>
      <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #2D2B28; letter-spacing: -0.3px;">
        Come è andata la call, ${name}?
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7;">
        Hai effettuato una call conoscitiva su Synapsy. Ci piacerebbe sapere com'è andata: compila il breve questionario post-call per aiutarci a migliorare l'esperienza per tutti.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #F4F2FB; border-radius: 14px;">
        <tr>
          <td style="padding: 20px 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #8B7EC8;">Perché è importante</p>
            <p style="margin: 0; font-size: 14px; color: #6B6862; line-height: 1.7;">
              Il questionario richiede meno di 2 minuti e ci aiuta a verificare che tutto sia andato bene, a tutelare la qualità della piattaforma e a migliorare i match futuri.
            </p>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Compila il questionario", `${APP_URL}/questionario`)}
          </td>
        </tr>
      </table>

      <p style="margin: 20px 0 0; font-size: 13px; color: #9C9890; text-align: center;">
        Il questionario è disponibile per le prossime 48 ore.
      </p>
    </td>
  `;

  return {
    subject: "Compila il questionario post-call — ci vuole 2 minuti",
    html: baseLayout(`<tr>${content}</tr>`, false),
  };
}

export function paymentDue(
  psychologistName: string,
  amount: number,
  type: string
): { subject: string; html: string } {
  const amountFormatted = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);

  const content = `
    <td style="padding: 40px 40px 36px;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #C4645A; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Pagamento in scadenza</p>
      <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #2D2B28; letter-spacing: -0.3px;">
        Hai un pagamento da completare, ${psychologistName}
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7;">
        Per continuare a utilizzare Synapsy senza interruzioni, completa il pagamento in sospeso.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #FAFAF8; border: 1px solid #E8E5DF; border-radius: 14px;">
        <tr>
          <td style="padding: 20px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <p style="margin: 0 0 4px; font-size: 13px; color: #9C9890;">Tipo di pagamento</p>
                  <p style="margin: 0; font-size: 15px; font-weight: 600; color: #2D2B28;">${type}</p>
                </td>
                <td style="text-align: right;">
                  <p style="margin: 0 0 4px; font-size: 13px; color: #9C9890;">Importo</p>
                  <p style="margin: 0; font-size: 24px; font-weight: 700; color: #C4645A;">${amountFormatted}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Effettua il pagamento", `${APP_URL}/psicologo/pagamenti`)}
          </td>
        </tr>
      </table>
    </td>
  `;

  return {
    subject: `Pagamento in scadenza: ${amountFormatted}`,
    html: baseLayout(`<tr>${content}</tr>`, false),
  };
}

export function creditEarned(psychologistName: string): {
  subject: string;
  html: string;
} {
  const content = `
    <td style="padding: 40px 40px 36px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 48px;">✨</span>
      </div>
      <h1 style="margin: 0 0 12px; font-size: 26px; font-weight: 700; color: #5B8A72; letter-spacing: -0.5px; text-align: center;">
        Hai guadagnato un credito!
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7; text-align: center;">
        Complimenti, ${psychologistName}! Un credito è stato aggiunto al tuo account Synapsy come riconoscimento per il tuo contributo alla piattaforma.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: #F0F7F3; border-radius: 14px;">
        <tr>
          <td style="padding: 20px 24px; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 14px; color: #6B6862;">Credito guadagnato</p>
            <p style="margin: 0; font-size: 36px; font-weight: 700; color: #5B8A72;">+1 credito</p>
            <p style="margin: 8px 0 0; font-size: 13px; color: #9C9890;">Puoi usarlo per sbloccare un nuovo caso sulla piattaforma</p>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Vedi i tuoi crediti", `${APP_URL}/psicologo/crediti`)}
          </td>
        </tr>
      </table>
    </td>
  `;

  return {
    subject: "Hai guadagnato un credito su Synapsy!",
    html: baseLayout(`<tr>${content}</tr>`, false),
  };
}

export function badgeAwarded(
  psychologistName: string,
  badgeName: string
): { subject: string; html: string } {
  const content = `
    <td style="padding: 40px 40px 36px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; background-color: #F4F2FB; border-radius: 50%; padding: 16px; font-size: 40px;">🏅</div>
      </div>
      <h1 style="margin: 0 0 12px; font-size: 26px; font-weight: 700; color: #8B7EC8; letter-spacing: -0.5px; text-align: center;">
        Nuovo badge conquistato!
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #6B6862; line-height: 1.7; text-align: center;">
        Bravissimo/a, ${psychologistName}! Hai appena sbloccato un nuovo riconoscimento sul tuo profilo Synapsy.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
        <tr>
          <td style="text-align: center; padding: 24px; background: linear-gradient(135deg, #F4F2FB 0%, #E8E4F6 100%); border-radius: 16px; border: 2px solid #D1C9ED;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #8B7EC8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Badge sbloccato</p>
            <p style="margin: 0; font-size: 22px; font-weight: 700; color: #554A8A;">${badgeName}</p>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 24px; font-size: 15px; color: #6B6862; line-height: 1.7; text-align: center;">
        Il badge è ora visibile sul tuo profilo pubblico e contribuisce al tuo ranking nella piattaforma.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            ${ctaButton("Vedi il tuo profilo", `${APP_URL}/psicologo/profilo`)}
          </td>
        </tr>
      </table>
    </td>
  `;

  return {
    subject: `Nuovo badge: "${badgeName}" — complimenti!`,
    html: baseLayout(`<tr>${content}</tr>`, false),
  };
}

// Re-export accentPill for potential future use
export { accentPill };
