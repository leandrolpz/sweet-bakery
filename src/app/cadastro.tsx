import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Box } from '@/src/components/inputs';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { T } from '@/src/components/ui/Text';
import { auth, db } from '@/src/services/firebase';
import { colors, radius } from '@/src/constants/theme';

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Preencha nome e e-mail. A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      try {
        await setDoc(doc(db, 'users', credential.user.uid), { name: name.trim(), email: email.trim(), role: 'employee' });
      } catch {
        // A conta criada no Auth continua válida mesmo se o documento de perfil falhar.
      }
      await signOut(auth);
      router.replace({ pathname: '/login', params: { registered: '1' } });
    } catch {
      setError('Não foi possível criar o cadastro. Esse e-mail pode já estar em uso.');
    } finally {
      setLoading(false);
    }
  }

  return <View style={s.page}><View style={s.form}><Link href="/login" asChild><Pressable accessibilityRole="button" style={s.back}><Icon name="arrow-back" size={21} /><T v="label" color={colors.morango}>Voltar para login</T></Pressable></Link><View style={s.icon}><Icon name="person" size={30} /></View><T v="title" style={s.title}>Criar acesso</T><T v="body" color={colors.textoSuave} style={s.subtitle}>Cadastre o funcionário que vai cuidar do sistema.</T><View style={s.fields}><View style={s.field}><T v="label">Nome</T><Box value={name} onChangeText={setName} placeholder="Nome completo" /></View><View style={s.field}><T v="label">E-mail</T><Box value={email} onChangeText={setEmail} placeholder="funcionario@exemplo.com" keyboardType="email-address" /></View><View style={s.field}><T v="label">Senha</T><Box value={password} onChangeText={setPassword} placeholder="Mínimo de 6 caracteres" secureTextEntry /></View></View>{error ? <T v="small" color={colors.perigo}>{error}</T> : null}<Button label="Criar cadastro" icon="add" loading={loading} onPress={register} style={s.button} /></View></View>;
}

const s = StyleSheet.create({ page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: colors.morangoSuave }, form: { width: '100%', maxWidth: 470, padding: 30, backgroundColor: colors.superficie, borderRadius: radius.xl }, back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 28 }, icon: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.morangoSuave, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, title: { fontSize: 30, lineHeight: 38 }, subtitle: { marginTop: 6 }, fields: { gap: 14, marginTop: 28, marginBottom: 20 }, field: { gap: 6 }, button: { width: '100%', marginTop: 20 } });