import { useState } from 'react';
import { View } from 'react-native';
import { colors } from '@/src/constants/theme';

/**
 * Toldo listrado de vitrine de confeitaria — a assinatura visual do app.
 * O número de listras se adapta à largura da tela, sempre com arcos perfeitos.
 */
export function Awning() {
  const [w, setW] = useState(0);
  const count = Math.max(8, 2 * Math.round(w / 64));
  const stripe = w / count;
  const scallop = stripe / 2;
  const height = scallop + 8;

  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={{ width: '100%', height: w ? height : 22 }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {w > 0 && (
        <View style={{ flexDirection: 'row', height }}>
          {Array.from({ length: count }, (_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height,
                backgroundColor: i % 2 === 0 ? colors.morango : colors.toldo,
                borderBottomLeftRadius: scallop,
                borderBottomRightRadius: scallop,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
