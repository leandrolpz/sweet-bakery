/**
 * Identidade visual — Sweet Bakery
 * Cores nomeadas como ingredientes da confeitaria.
 */
export const colors = {
  // Chocolate (menu lateral, textos)
  cacau: '#684750',
  cacauClaro: '#805B65',
  cacauLinha: '#A37C87',
  noCacau: '#FFF7F8',
  noCacauSuave: '#E5C8D0',

  // Morango (cor principal, toldo)
  morango: '#D86687',
  morangoEscuro: '#B74C6B',
  morangoSuave: '#FBE5EC',
  toldo: '#F6C6D4',

  // Superfícies
  chantilly: '#FFFAF7',
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
