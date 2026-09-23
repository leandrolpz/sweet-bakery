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

> As regras do Firestore precisam permitir leitura e escrita nas 5 collections.

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
