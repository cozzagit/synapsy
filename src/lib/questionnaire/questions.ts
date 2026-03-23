export type QuestionType = "single" | "multiple" | "scale" | "preference";

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  icon?: string; // lucide icon name
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
  maxSelections?: number; // for "multiple" type
  required: boolean;
  section: string;
  adaptiveHint?: string; // shown based on previous answers
}

// ---------------------------------------------------------------------------
// Section: Il tuo bisogno
// ---------------------------------------------------------------------------

const primaryProblem: Question = {
  id: "primary_problem",
  type: "multiple",
  title: "Cosa ti porta a cercare supporto?",
  subtitle: "Seleziona fino a 3 aree che ti riguardano di più",
  maxSelections: 3,
  required: true,
  section: "Il tuo bisogno",
  options: [
    { value: "ansia", label: "Ansia", icon: "Wind" },
    { value: "depressione", label: "Depressione / umore basso", icon: "CloudRain" },
    { value: "stress", label: "Stress", icon: "Zap" },
    { value: "burnout", label: "Burnout", icon: "Battery" },
    { value: "relazionali", label: "Difficoltà relazionali", icon: "Users" },
    { value: "famiglia", label: "Problemi familiari", icon: "Home" },
    { value: "lutto", label: "Lutto", icon: "Heart" },
    { value: "trauma", label: "Trauma", icon: "Shield" },
    { value: "autostima", label: "Bassa autostima", icon: "Star" },
    { value: "alimentari", label: "Disturbi alimentari", icon: "Apple" },
    { value: "dipendenze", label: "Dipendenze", icon: "Link" },
    { value: "sonno", label: "Problemi di sonno", icon: "Moon" },
    { value: "rabbia", label: "Rabbia", icon: "Flame" },
    { value: "fobie", label: "Fobie", icon: "AlertTriangle" },
    { value: "doc", label: "DOC", icon: "RefreshCw" },
    { value: "sessualita", label: "Sessualità", icon: "Smile" },
    { value: "identita", label: "Identità", icon: "Fingerprint" },
    { value: "lavoro", label: "Problemi lavorativi", icon: "Briefcase" },
    { value: "scolastiche", label: "Difficoltà scolastiche", icon: "BookOpen" },
    { value: "genitorialita", label: "Genitorialità", icon: "Baby" },
    { value: "ansia_sociale", label: "Ansia sociale", icon: "Users" },
    { value: "panico", label: "Attacchi di panico", icon: "AlertCircle" },
    { value: "transizione", label: "Transizione di vita", icon: "Compass" },
    { value: "malattia", label: "Malattia cronica", icon: "Activity" },
    { value: "altro", label: "Altro", icon: "MoreHorizontal" },
  ],
};

const context: Question = {
  id: "context",
  type: "multiple",
  title: "In quale contesto si manifesta?",
  subtitle: "Seleziona fino a 2 contesti",
  maxSelections: 2,
  required: true,
  section: "Il tuo bisogno",
  options: [
    { value: "lavoro", label: "Lavoro", icon: "Briefcase" },
    { value: "famiglia", label: "Famiglia", icon: "Home" },
    { value: "coppia", label: "Coppia", icon: "Heart" },
    { value: "amicizie", label: "Amicizie", icon: "Users" },
    { value: "scuola", label: "Scuola / Università", icon: "BookOpen" },
    { value: "salute", label: "Salute", icon: "Activity" },
    { value: "economico", label: "Economico", icon: "TrendingDown" },
    { value: "legale", label: "Legale", icon: "Scale" },
    { value: "altro", label: "Altro", icon: "MoreHorizontal" },
  ],
};

const intensity: Question = {
  id: "intensity",
  type: "scale",
  title: "Quanto incide sulla tua vita quotidiana?",
  subtitle: "Prenditi un momento per riflettere",
  required: true,
  section: "Il tuo bisogno",
  adaptiveHint:
    "Non ci sono risposte giuste o sbagliate. Scegli ciò che senti più vicino a te.",
  options: [
    {
      value: "1",
      label: "Poco",
      description: "Lo noto a volte, ma non mi limita molto",
    },
    {
      value: "2",
      label: "Moderatamente",
      description: "Influisce su alcune aree della mia vita",
    },
    {
      value: "3",
      label: "Significativamente",
      description: "Pesa su molti aspetti del quotidiano",
    },
    {
      value: "4",
      label: "Molto",
      description: "Fatico a gestire le attività di tutti i giorni",
    },
    {
      value: "5",
      label: "In modo grave",
      description: "Mi sento sopraffatto/a e ho bisogno di aiuto urgente",
    },
  ],
};

// ---------------------------------------------------------------------------
// Section: Le tue preferenze
// ---------------------------------------------------------------------------

const modality: Question = {
  id: "modality",
  type: "single",
  title: "Come preferisci le sedute?",
  subtitle: "Puoi cambiare idea in seguito",
  required: true,
  section: "Le tue preferenze",
  options: [
    {
      value: "online",
      label: "Online",
      description: "Da dove vuoi, quando vuoi",
      icon: "Monitor",
    },
    {
      value: "studio",
      label: "In studio",
      description: "Di persona, nello spazio del professionista",
      icon: "MapPin",
    },
    {
      value: "nessuna",
      label: "Nessuna preferenza",
      description: "Sono aperto/a a entrambe le opzioni",
      icon: "Shuffle",
    },
  ],
};

const genderPreference: Question = {
  id: "gender_preference",
  type: "single",
  title: "Hai preferenze sul genere del professionista?",
  subtitle: "Questa informazione ci aiuta a trovare il match migliore per te",
  required: true,
  section: "Le tue preferenze",
  options: [
    {
      value: "uomo",
      label: "Uomo",
      icon: "User",
    },
    {
      value: "donna",
      label: "Donna",
      icon: "User",
    },
    {
      value: "nessuna",
      label: "Nessuna preferenza",
      description: "Il genere non è rilevante per me",
      icon: "Users",
    },
  ],
};

const approach: Question = {
  id: "approach",
  type: "multiple",
  title: "Ti interessa un approccio specifico?",
  subtitle: "Seleziona fino a 2 approcci (o scegli 'Non so')",
  maxSelections: 2,
  required: true,
  section: "Le tue preferenze",
  options: [
    {
      value: "cbt",
      label: "CBT",
      description: "Cognitivo-comportamentale: lavora su pensieri e comportamenti",
      icon: "Brain",
    },
    {
      value: "psicodinamico",
      label: "Psicodinamico",
      description: "Esplora le radici profonde delle difficoltà",
      icon: "Layers",
    },
    {
      value: "sistemico",
      label: "Sistemico",
      description: "Considera le relazioni e il contesto di vita",
      icon: "GitBranch",
    },
    {
      value: "umanistico",
      label: "Umanistico",
      description: "Centrato sulla persona e sul potenziale di crescita",
      icon: "Sprout",
    },
    {
      value: "emdr",
      label: "EMDR",
      description: "Indicato per trauma e stress post-traumatico",
      icon: "Eye",
    },
    {
      value: "mindfulness",
      label: "Mindfulness",
      description: "Consapevolezza e presenza nel momento presente",
      icon: "Flower2",
    },
    {
      value: "nessuna",
      label: "Non so / Nessuna preferenza",
      description: "Il professionista mi guiderà nella scelta",
      icon: "HelpCircle",
    },
  ],
};

// ---------------------------------------------------------------------------
// Section: Informazioni utili
// ---------------------------------------------------------------------------

const urgency: Question = {
  id: "urgency",
  type: "single",
  title: "Quanto è urgente per te iniziare?",
  subtitle: "Ci aiuta a trovare professionisti con disponibilità adeguata",
  required: true,
  section: "Informazioni utili",
  options: [
    {
      value: "immediato",
      label: "Immediato",
      description: "Ho bisogno di un appuntamento il prima possibile",
      icon: "Zap",
    },
    {
      value: "settimana",
      label: "Questa settimana",
      description: "Entro i prossimi giorni",
      icon: "Calendar",
    },
    {
      value: "mese",
      label: "Questo mese",
      description: "Entro le prossime settimane",
      icon: "CalendarDays",
    },
    {
      value: "esplorando",
      label: "Sto esplorando",
      description: "Per ora voglio solo capire le mie opzioni",
      icon: "Compass",
    },
  ],
};

const previousTherapy: Question = {
  id: "previous_therapy",
  type: "single",
  title: "Hai fatto percorsi psicologici in passato?",
  subtitle: "Non è necessario, ma ci aiuta a trovare il professionista giusto",
  required: true,
  section: "Informazioni utili",
  options: [
    {
      value: "si",
      label: "Sì",
      description: "Ho già avuto esperienze di terapia o supporto psicologico",
      icon: "CheckCircle",
    },
    {
      value: "no",
      label: "No",
      description: "Sarebbe la mia prima esperienza",
      icon: "Circle",
    },
  ],
};

const ageRange: Question = {
  id: "age_range",
  type: "single",
  title: "In quale fascia d'età ti trovi?",
  subtitle: "Alcuni professionisti sono specializzati per fasce d'età specifiche",
  required: true,
  section: "Informazioni utili",
  options: [
    { value: "18-25", label: "18–25 anni" },
    { value: "26-35", label: "26–35 anni" },
    { value: "36-45", label: "36–45 anni" },
    { value: "46-55", label: "46–55 anni" },
    { value: "56+", label: "56 anni e oltre" },
  ],
};

// ---------------------------------------------------------------------------
// Exported questions list (ordered)
// ---------------------------------------------------------------------------

export const questions: Question[] = [
  primaryProblem,
  context,
  intensity,
  modality,
  genderPreference,
  approach,
  urgency,
  previousTherapy,
  ageRange,
];

export const TOTAL_QUESTIONS = questions.length;

export const HIGH_INTENSITY_THRESHOLD = 4;
