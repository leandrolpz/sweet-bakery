import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { T } from '@/src/components/ui/Text';
import { colors, radius } from '@/src/constants/theme';
export default function Home() {
  return (
    <View style={s.page}>
      <View style={s.brandMark}><T style={s.mark}>S</T></View>
      <T v="title" color={colors.texto} style={s.title}>Sweet Bakery</T>
  
      <View style={s.line} />

      <T v="body" color={colors.textoSuave} style={s.copy}>Acesse o espaço da equipe para cuidar de produtos, pedidos, clientes e pagamentos.</T>
      <View style={s.actions}><Link href="/login" asChild><Button label="Entrar como funcionário" icon="arrow-forward" style={s.button} /></Link><Link href="/cadastro" asChild><Button label="Criar cadastro" icon="person" variant="secondary" style={s.button} /></Link></View>
      
    </View>
  );
}

const s = StyleSheet.create({
  page: { alignItems: 'center', justifyContent: 'center', minHeight: 600, padding: 28, backgroundColor: colors.chantilly, borderRadius: radius.xl },
  brandMark: { width: 84, height: 84, borderRadius: 28, backgroundColor: colors.morango, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  mark: { fontSize: 46, lineHeight: 58, color: '#fff', fontFamily: 'Fraunces_700Bold' },
  title: { fontSize: 42, lineHeight: 50, textAlign: 'center' },
  subtitle: { maxWidth: 440, textAlign: 'center', marginTop: 8 },
  line: { width: 56, height: 3, backgroundColor: colors.toldo, borderRadius: 3, marginVertical: 30 },
  welcome: { textAlign: 'center' },
  copy: { maxWidth: 430, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  button: { minWidth: 230 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  footer: { marginTop: 34 },
});
