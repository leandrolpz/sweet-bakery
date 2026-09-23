import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { FeedbackProvider } from '@/src/components/Feedback';
import { Shell } from '@/src/components/Shell';
import { colors } from '@/src/constants/theme';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fraunces_600SemiBold, Fraunces_700Bold,
    Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold,
  });

  // Se a fonte falhar (sem internet no 1º acesso), o app abre com a fonte do sistema.
  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.chantilly }}>
        <ActivityIndicator size="large" color={colors.morango} />
      </View>
    );
  }

  return (
    <FeedbackProvider>
      <Shell>
        <Slot />
      </Shell>
    </FeedbackProvider>
  );
}
