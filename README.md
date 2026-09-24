# Sweet Bakery — Sistema de gestão da confeitaria (Expo + Firebase)

App web e mobile (Expo / React Native Web) com menu principal e CRUD completo e separado
para cada collection do Firestore (projeto `sweet-bakery-2a724`):

| Menu          | Cadastrar            | Listar / Alterar / Excluir   |
|---------------|----------------------|------------------------------|
| Categorias    | `/categorias/novo`   | `/categorias`                |
| Produtos      | `/produtos/novo`     | `/produtos`                  |
| Clientes      | `/clientes/novo`     | `/clientes`                  |
| Pedidos       | `/pedidos/novo`      | `/pedidos`                   |
| Pagamentos    | `/pagamentos/novo`   | `/pagamentos`                |

Alterar abre em `/{collection}/editar/:id` (botão "Alterar" em cada card). Excluir pede confirmação.

## Como rodar

```bash
npm install
npx expo start -c      # pressione W (web), A (Android) ou I (iOS)
```

Comandos úteis: `npm run web`, `npm run typecheck`.

## Firebase: primeiro acesso

O cadastro e o login usam o Firebase Authentication com e-mail e senha. No Firebase
Console, abra **Authentication > Sign-in method** e ative **Email/Password**.

As telas internas exigem um usuário autenticado. Para que o listar, cadastrar, alterar
e excluir funcionem, publique as regras que estão em `firestore.rules`:

```bash
npx firebase login
npx firebase use sweet-bakery-2a724
npx firebase deploy --only firestore:rules
```

Se `firebase use` informar que o projeto não foi encontrado, confirme que a conta
usada em `firebase login` tem acesso ao projeto `sweet-bakery-2a724`. O arquivo
`firebase.json` já aponta para as regras corretas.

Depois de publicar as regras, reinicie o Expo com `npx expo start -c` e faça login
novamente para renovar a sessão.

## Estrutura

```
src/
  app/            rotas (expo-router): index + 3 rotas por collection
  collections/    definição de cada collection (campos, listagem, validações)
  components/     Shell (menu), CrudList, CrudForm, campos, feedback
  services/       firebase.ts e firestore.ts (operações de CRUD)
  hooks/          useCollection (tempo real), useLayout (responsivo)
  constants/      theme.ts (cores e fontes)
```

Para mudar campos de uma collection, edite só o arquivo dela em `src/collections/`
(nomes dos campos = nomes no Firestore). As telas de lista e formulário se adaptam sozinhas.

## Observações

- `Alert.alert` não funciona no navegador, por isso o app usa confirmação e avisos próprios.
- `pagamentos.status` usa `pending | paid | canceled | refunded`; valores antigos diferentes
  continuam aparecendo e são normalizados ao salvar.
- O `package.json` fixa `expo-router ~5.1.11` e declara `query-string` e `expo-asset`, necessários
  para o build web funcionar com as versões atuais do `@react-navigation`.
