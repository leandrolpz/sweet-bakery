import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS, SIDEBAR_WIDTH } from '@/src/constants/theme';

export function useLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINTS.desktop;
  const isTablet = width >= BREAKPOINTS.tablet;
  /** Largura útil da área de conteúdo (descontando o menu lateral no desktop). */
  const contentWidth = Math.min(1080, width - (isDesktop ? SIDEBAR_WIDTH : 0) - (isTablet ? 64 : 32));
  return { width, isDesktop, isTablet, isPhone: !isTablet, contentWidth };
}
