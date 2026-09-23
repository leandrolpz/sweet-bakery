/**
 * Identidade visual — Sweet Bakery
 * Cores nomeadas como ingredientes da confeitaria.
 */
export const colors = {
  // Chocolate (menu lateral, textos)
  cacau: '#3A1F24',
  cacauClaro: '#4E2C32',
  cacauLinha: '#65424A',
  noCacau: '#F7E3E9',
  noCacauSuave: '#C9A7B0',

  // Morango (cor principal, toldo)
  morango: '#C92F60',
  morangoEscuro: '#A3204A',
  morangoSuave: '#FFE3EB',
  toldo: '#FFD1DF',

  // Superfícies
  chantilly: '#FFF6F8',
  superficie: '#FFFFFF',
  linha: '#F1D9E0',
  campo: '#E2C4CE',

  // Texto
  texto: '#3A1F24',
  textoSuave: '#7A5A61',

  // Apoio
  pistache: '#2E7D5B',
  pistacheSuave: '#DDF3E5',
  caramelo: '#8F5E0F',
  carameloSuave: '#FFEBC7',
  lavanda: '#6B4FA3',
  lavandaSuave: '#ECE4FA',
  azul: '#2F6FB2',
  azulSuave: '#DCEBFA',
  perigo: '#C62F3E',
  perigoSuave: '#FDE1E4',
} as const;

/** Fraunces (títulos, com personalidade de confeitaria) + Nunito (interface, redonda e legível). */
export const fonts = {
  display: 'Fraunces_700Bold',
  displaySemi: 'Fraunces_600SemiBold',
  body: 'Nunito_400Regular',
  bodyMedium: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyHeavy: 'Nunito_800ExtraBold',
} as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const BREAKPOINTS = { tablet: 640, desktop: 960 } as const;
export const SIDEBAR_WIDTH = 292;
