import { useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { Box } from '@/src/components/inputs';
import { T } from '@/src/components/ui/Text';
import { colors, radius } from '@/src/constants/theme';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/services/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registered } = useLocalSearchParams<{ registered?: string }>();

  async function login() {
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/painel');
    } catch {
      setError('E-mail ou senha inválidos. Confira os dados cadastrados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.page}>
      <View style={s.form}>
        <Link href="/" asChild><Pressable accessibilityRole="button" accessibilityLabel="Voltar para início" style={s.back}><Icon name="arrow-back" size={21} color={colors.morango} /><T v="label" color={colors.morango}>Voltar</T></Pressable></Link>
        <View style={s.icon}><Icon name="lock-outline" size={30} color={colors.morango} /></View>
        <T v="title" style={s.title}>Área do funcionário</T>
        {registered === '1' ? <T v="small" color={colors.pistache}>Cadastro realizado com sucesso. Agora entre com seus dados.</T> : null}
        <View style={s.fields}>
          <View style={{ gap: 6 }}><T v="label">E-mail</T><Box value={email} onChangeText={setEmail} placeholder="funcionario@exemplo.com" keyboardType="email-address" /></View>
          <View style={{ gap: 6 }}><T v="label">Senha</T><Box value={password} onChangeText={setPassword} placeholder="Digite sua senha" secureTextEntry /></View>
        </View>
        {error ? <T v="small" color={colors.perigo}>{error}</T> : null}
        <Button label="Entrar" icon="login" loading={loading} onPress={login} style={s.button} />
        <Link href="/cadastro" asChild><Pressable accessibilityRole="link" style={s.register}><T v="label" color={colors.morango}>Ainda não tem cadastro? Criar conta</T></Pressable></Link>
        
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: colors.morangoSuave },
  form: { width: '100%', maxWidth: 470, padding: 30, backgroundColor: colors.superficie, borderRadius: radius.xl },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 28 },
  icon: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.morangoSuave, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { fontSize: 30, lineHeight: 38 },
  subtitle: { marginTop: 6 },
  fields: { gap: 14, marginTop: 28, marginBottom: 20 },
  button: { width: '100%' },
  note: { textAlign: 'center', marginTop: 22 },
  register: { alignSelf: 'center', marginTop: 18 },
});