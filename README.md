# 🔐 AuthAPI — API de Autenticação e Autorização como Serviço

Uma API moderna, escalável e segura para **autenticação, autorização e gerenciamento de usuários**, baseada em princípios da **Clean Architecture** e suporte completo a **OAuth2, Login Social, SSO, JWT, RBAC** e mais.

---

## 🚀 Funcionalidades

- [X] ✅ Registro e login de usuários
- [ ] 🔐 Autenticação com e-mail/senha ou social login (Google, GitHub, etc)
- [ ] 🔄 Emissão e renovação de Access Tokens (`JWT`) e Refresh Tokens
- [ ] 🔁 SSO entre aplicações confiáveis
- [ ] 🔄 OAuth2 completo com suporte a PKCE
- [ ] 👥 Controle de acesso com RBAC (papéis)
- [ ] 📄 Integração fácil com qualquer frontend ou backend
- [ ] 🔧 Webhooks e logs de auditoria
- [ ] 🔒 Multi-factor authentication (MFA) opcional
- [ ] 📊 Pronto para produção e escalável via Redis

---

## 🧱 Arquitetura

Este projeto segue a estrutura da **Clean Architecture** com separação clara de responsabilidades:

```
├── domain/          # Entidades e regras de negócio puras
├── application/     # Casos de uso e contratos
├── infrastructure/  # Banco de dados, APIs externas, envio de e-mails
├── presentation/    # Controllers e rotas HTTP
├── config/          # Configurações de ambiente e inicialização
└── ...
```

---

## 📦 Endpoints principais

| Método | Endpoint                  | Descrição                        |
|--------|---------------------------|----------------------------------|
| POST   | `/signup`               | Cadastro de novo usuário         |
| POST   | `/login`                  | Login com e-mail e senha         |
| POST   | `/oauth/authorize`        | Início do fluxo OAuth2           |
| POST   | `/token`                  | Geração/renovação de tokens      |
| POST   | `/logout`                 | Revogação de tokens e sessão     |
| GET    | `/me`                     | Dados do usuário autenticado     |
| GET    | `/users/:id`              | Buscar usuário por ID (RBAC)     |

> 🔧 **Documentação completa disponível em `/docs` (Swagger/OpenAPI)**

---

## 🧪 Executando localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seuusuario/auth-api.git
cd auth-api
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn
```

### 3. Configure o ambiente

Crie um arquivo `.env` com base no `.env.example`:

```env
PORT=3000
JWT_SECRET=uma_chave_segura
DATABASE_URL=postgres://...
REDIS_URL=redis://...
```

### 4. Rode a aplicação

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

---

## 🔑 Autenticação com OAuth2

- Suporte aos fluxos:
  - Authorization Code (com PKCE)
  - Client Credentials
  - Implicit (depreciado)
- Geração e introspecção de tokens JWT
- Compatível com OpenID Connect (opcional)

---

## ☁️ SSO e Login Social

- Login federado com Google, Facebook, GitHub, etc.
- Suporte a Single Sign-On entre aplicações confiáveis
- Estratégias extensíveis via providers

---

## 🧠 Casos de uso incluídos

- Criação de usuário
- Login e logout
- Recuperação de senha
- Atualização de perfil
- Autorização baseada em papéis
- Auditoria de login/logout

---

## 🧰 Tecnologias utilizadas

- **Node.js** + **TypeScript**
- **Express.js** + `Zod` (validações)
- **PostgreSQL** + **Prisma ORM**
- **Redis** para cache e controle de sessão
- **JWT** para autenticação stateless
- **Swagger (OpenAPI)** para documentação

---

## 🧩 Futuras melhorias

- ✅ Admin Dashboard para gestão de usuários e tokens
- ✅ Suporte a WebAuthn
- ✅ Suporte multi-tenant
- ✅ Exportação como biblioteca npm para fácil consumo

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para contribuições maiores, abra uma issue para discutirmos as mudanças desejadas.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## ✨ Créditos

Criado com 💙 por [Miquéias Fernandes](https://github.com/MiqueiasGFernandes).  
Inspirado por Auth0, Clerk e Firebase Auth.