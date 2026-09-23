import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import { Button } from './ui/Button';
import { T } from './ui/Text';

/**
 * Toast e confirmação próprios.
 * `Alert.alert` NÃO funciona no navegador (react-native-web), então excluir/avisar ficava mudo na web.
 */
type Toast = { id: number; kind: 'success' | 'error'; text: string };
type ConfirmOptions = { title: string; message?: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean };

const ToastCtx = createContext({ success: (_t: string) => {}, error: (_t: string) => {} });
const ConfirmCtx = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);

export const useToast = () => useContext(ToastCtx);
export const useConfirm = () => useContext(ConfirmCtx);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dialog, setDialog] = useState<{ opts: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);
  const nextId = useRef(1);

  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const toast = useMemo(
    () => ({ success: (t: string) => push('success', t), error: (t: string) => push('error', t) }),
    [push],
  );

  const confirm = useCallback(
    (opts: ConfirmOptions) => new Promise<boolean>((resolve) => setDialog({ opts, resolve })),
    [],
  );

  const close = (result: boolean) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  return (
    <ToastCtx.Provider value={toast}>
      <ConfirmCtx.Provider value={confirm}>
        {children}

        <View style={[s.toastLayer, { pointerEvents: 'none' } as any]}>
          {toasts.map((t) => (
            <View
              key={t.id}
              accessibilityRole="alert"
              style={[s.toast, { backgroundColor: t.kind === 'success' ? colors.pistache : colors.perigo }]}
            >
              <T v="bodyStrong" color="#fff">{t.kind === 'success' ? '✓ ' : '⚠ '}{t.text}</T>
            </View>
          ))}
        </View>

        <Modal transparent visible={!!dialog} animationType="fade" onRequestClose={() => close(false)}>
          <View style={s.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => close(false)} accessibilityLabel="Fechar" />
            <View style={s.dialog} accessibilityViewIsModal>
              <T v="title">{dialog?.opts.title}</T>
              {dialog?.opts.message ? <T color={colors.textoSuave}>{dialog.opts.message}</T> : null}
              <View style={s.actions}>
                <Button
                  label={dialog?.opts.cancelLabel ?? 'Cancelar'}
                  variant="secondary"
                  onPress={() => close(false)}
                  style={{ flex: 1 }}
                />
                <Button
                  label={dialog?.opts.confirmLabel ?? 'Confirmar'}
                  variant={dialog?.opts.danger ? 'danger' : 'primary'}
                  onPress={() => close(true)}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

const s = StyleSheet.create({
  toastLayer: { position: 'absolute', left: 16, right: 16, bottom: 24, alignItems: 'center', gap: 8, zIndex: 100 },
  toast: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: radius.pill, maxWidth: 520 },
  overlay: { flex: 1, backgroundColor: 'rgba(58,31,36,0.55)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  dialog: {
    width: '100%', maxWidth: 440, backgroundColor: colors.superficie, borderRadius: radius.xl,
    padding: 24, gap: 12,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
