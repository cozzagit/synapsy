// ─── Italian label maps for Synapsy domain values ─────────────────────────────

export const problemCategories: Record<string, string> = {
  anxiety: "Ansia",
  depression: "Depressione",
  panic: "Attacchi di panico",
  stress: "Stress",
  trauma: "Trauma e PTSD",
  grief: "Lutto e perdita",
  relationships: "Relazioni",
  self_esteem: "Autostima",
  eating_disorders: "Disturbi alimentari",
  ocd: "Disturbo ossessivo-compulsivo",
  phobias: "Fobie",
  burnout: "Burnout",
  sleep: "Disturbi del sonno",
  anger: "Gestione della rabbia",
  adhd: "ADHD",
  couple: "Problemi di coppia",
  sexuality: "Sessualità e identità",
  work: "Problemi lavorativi",
  family: "Dinamiche familiari",
  loneliness: "Solitudine",
  addiction: "Dipendenze",
  life_transitions: "Transizioni di vita",
  personal_growth: "Crescita personale",
};

export const therapeuticApproaches: Record<string, string> = {
  cbt: "Cognitivo-Comportamentale (CBT)",
  psychodynamic: "Psicodinamica",
  systemic: "Sistemica",
  emdr: "EMDR",
  mindfulness: "Mindfulness-Based",
  act: "Acceptance and Commitment (ACT)",
  schema: "Schema Therapy",
  dbt: "Terapia Dialettico-Comportamentale (DBT)",
  humanistic: "Umanistica",
  gestalt: "Gestalt",
  narrative: "Narrativa",
  integrative: "Integrativa",
  existential: "Esistenziale",
  brief: "Terapia Breve",
  somatic: "Somatica",
};

export const modalities: Record<string, string> = {
  online: "Online",
  in_person: "In studio",
  both: "Online e in studio",
};

export const growthStages: Record<string, string> = {
  seed: "Seme",
  germoglio: "Germoglio",
  crescita: "In Crescita",
  fioritura: "In Fioritura",
  radici: "Radici Solide",
};

export const growthStageDescriptions: Record<string, string> = {
  seed: "Stai iniziando il tuo percorso su Synapsy",
  germoglio: "Stai costruendo la tua reputazione",
  crescita: "La tua presenza è in piena crescita",
  fioritura: "Eccellenza riconosciuta dalla piattaforma",
  radici: "Professionista di riferimento su Synapsy",
};

// Badge icon names map to Lucide icon names
export const badgeIcons: Record<string, string> = {
  first_match: "Star",
  continuity_champion: "Heart",
  fast_responder: "Zap",
  highly_rated: "Award",
  referral_master: "Share2",
  verified_professional: "BadgeCheck",
  top_ranked: "Trophy",
  empathic_listener: "Ear",
  long_term_care: "Clock",
  community_builder: "Users",
  reliability_badge: "Shield",
  innovation_badge: "Lightbulb",
};

export const badgeTiers: Record<string, string> = {
  foundation: "Fondazione",
  quality: "Qualità",
  network: "Rete",
};

export const badgeTierColors: Record<string, { bg: string; text: string; border: string }> = {
  foundation: { bg: "bg-secondary-100", text: "text-secondary-700", border: "border-secondary-200" },
  quality: { bg: "bg-primary-100", text: "text-primary-700", border: "border-primary-200" },
  network: { bg: "bg-accent-100", text: "text-accent-700", border: "border-accent-200" },
};

export const preferredGenders: Record<string, string> = {
  male: "Maschio",
  female: "Femmina",
  no_preference: "Nessuna preferenza",
};

export const targetPatients: Record<string, string> = {
  adults: "Adulti",
  adolescents: "Adolescenti",
  children: "Bambini",
  elderly: "Anziani",
  couples: "Coppie",
  families: "Famiglie",
  lgbtq: "LGBTQ+",
};
