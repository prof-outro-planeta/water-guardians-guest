# Deploy sem expor variáveis de ambiente

O repositório no GitHub **não deve** conter o arquivo `.env` nem valores reais (API keys, etc.). Use sempre as variáveis na plataforma de deploy.

## 1. Nunca commitar o `.env`

- O `.env` já está no `.gitignore` — não remova.
- Use `.env.example` como referência (sem valores sensíveis).
- Nunca faça `git add .env` nem cole chaves no código.

## 2. Configurar variáveis na plataforma de deploy

No serviço onde o app é buildado e publicado (Vercel, Netlify, GitHub Actions, etc.), defina as **variáveis de ambiente** na interface da plataforma, não no código.

### Exemplo: Vercel

1. Repositório conectado ao projeto no [Vercel](https://vercel.com).
2. **Settings** → **Environment Variables**.
3. Adicione cada variável (nome e valor):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID` (opcional)
4. Marque para qual ambiente usar (Production, Preview, Development).
5. Faça um novo deploy — o build usará essas variáveis.

### Exemplo: Netlify

1. **Site settings** → **Environment variables** → **Add a variable** (ou **Import from .env** só para referência, sem subir o arquivo).
2. Adicione as mesmas `VITE_FIREBASE_*`.
3. Redeploy do site.

### Exemplo: GitHub Actions (build manual ou CI)

No workflow, defina as variáveis como **secrets** do repositório:

1. Repositório → **Settings** → **Secrets and variables** → **Actions**.
2. Crie um secret para cada valor (ex.: `FIREBASE_API_KEY`).
3. No workflow, exporte para o formato que o Vite usa:

```yaml
env:
  VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
  # ... demais VITE_FIREBASE_*
```

Assim o build usa as variáveis sem que os valores apareçam no código no GitHub.

## 3. Sobre o Firebase no front-end

As chaves do Firebase que começam com `VITE_` são injetadas no **bundle do cliente** no build. No Firebase, a “API key” do cliente é considerada pública; a proteção é feita com **Firebase Security Rules** (Firestore, Realtime Database, Storage) e **Authentication**. Ou seja: subir o código no GitHub sem o `.env` e configurar as variáveis na plataforma de deploy é a forma correta de deixar o app no ar sem expor o uso indevido das variáveis no repositório.

## Resumo

| Onde              | O que fazer |
|-------------------|-------------|
| GitHub / código   | Não ter `.env`; usar só `.env.example` (sem valores). |
| Deploy (Vercel, Netlify, etc.) | Cadastrar `VITE_FIREBASE_*` como variáveis de ambiente (ou secrets no GitHub Actions). |
| Local             | Copiar `.env.example` para `.env`, preencher só na sua máquina e não commitar. |
