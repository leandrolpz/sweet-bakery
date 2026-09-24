import { Image, ImageStyle, StyleProp } from 'react-native';

const assets = {
  cake: require('@/src/imgs/icons/cake_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  home: require('@/src/imgs/icons/family_home_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  category: require('@/src/imgs/icons/category_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  products: require('@/src/imgs/icons/bakery_dining_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  clients: require('@/src/imgs/icons/person_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  orders: require('@/src/imgs/icons/shopping_cart_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  payments: require('@/src/imgs/icons/paid_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  'folder-open': require('@/src/imgs/icons/category_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  'expand-more': require('@/src/imgs/icons/arrow_forward_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  'chevron-right': require('@/src/imgs/icons/arrow_forward_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  schedule: require('@/src/imgs/icons/cookie_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  search: require('@/src/imgs/icons/search_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  add: require('@/src/imgs/icons/cake_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  'view-list': require('@/src/imgs/icons/category_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  'arrow-forward': require('@/src/imgs/icons/arrow_forward_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  'arrow-back': require('@/src/imgs/icons/family_home_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  'lock-outline': require('@/src/imgs/icons/person_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  login: require('@/src/imgs/icons/person_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  person: require('@/src/imgs/icons/person_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  edit: require('@/src/imgs/icons/edit_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
  delete: require('@/src/imgs/icons/category_24dp_FFADD5_FILL0_wght400_GRAD0_opsz24.svg'),
} as const;

export type IconName = keyof typeof assets;

export function Icon({ name, size = 22, color: _color, style }: { name: IconName; size?: number; color?: string; style?: StyleProp<ImageStyle> }) {
  return <Image source={assets[name]} style={[{ width: size, height: size }, style]} resizeMode="contain" accessibilityIgnoresInvertColors />;
}
