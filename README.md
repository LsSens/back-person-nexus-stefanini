# API de Cadastro de Pessoas

Esta é uma API REST desenvolvida em Node.js com NestJS e TypeScript para gerenciamento de cadastro de pessoas, com duas versões da API e todos os recursos extras implementados.

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js, NestJS, TypeScript
- **Banco de Dados**: SQLite
- **Autenticação**: JWT (JSON Web Token)
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest (unitários e e2e)
- **Validações**: class-validator, class-transformer
- **Deploy**: AWS Lambda

## 📋 Funcionalidades

### Recursos Principais
- ✅ **CRUD completo** de pessoas
- ✅ **Duas versões da API** (v1 e v2)
- ✅ **Autenticação JWT** com usuários pré-existentes
- ✅ **Validações** de CPF, email e data de nascimento
- ✅ **Documentação Swagger** para ambas as versões
- ✅ **Testes automatizados** com 80%+ de cobertura
- ✅ **Deploy em nuvem** configurado

### API v1
- Endereço é **opcional**
- Todos os outros campos conforme especificação

### API v2  
- Endereço é **obrigatório**
- Busca adicional por endereço
- Compatibilidade com v1 mantida

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd pessoa-cadastro-api

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run start:dev
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_TYPE=sqlite
DATABASE_NAME=database.db
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRATION=1d
PORT=3000
NODE_ENV=development
```

## 📚 Documentação da API

### Swagger
- **API**: http://localhost:3000/api/docs

### Autenticação
Todas as rotas (exceto login) requerem autenticação via Bearer Token.

#### Usuários Pré-cadastrados
```json
{
  "username": "admin",
  "password": "admin123"
}
```

```json
{
  "username": "teste", 
  "password": "teste123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Endpoints API v1

#### Pessoas
- `POST /api/v1/pessoas` - Criar pessoa
- `GET /api/v1/pessoas` - Listar pessoas (paginado)
- `GET /api/v1/pessoas/:id` - Buscar por ID
- `PATCH /api/v1/pessoas/:id` - Atualizar pessoa
- `DELETE /api/v1/pessoas/:id` - Remover pessoa
- `GET /api/v1/pessoas/cpf/:cpf` - Buscar por CPF

### Endpoints API v2

#### Pessoas (com endereço obrigatório)
- `POST /api/v2/pessoas` - Criar pessoa (endereço obrigatório)
- `PATCH /api/v2/pessoas/:id` - Atualizar pessoa
- `GET /api/v2/pessoas/endereco/:endereco` - Buscar por endereço

### Exemplo de Payload

#### API v1 (endereço opcional)
```json
{
  "nome": "João Silva Santos",
  "sexo": "masculino",
  "email": "joao@email.com",
  "dataDeNascimento": "1990-01-15",
  "naturalidade": "São Paulo",
  "nacionalidade": "Brasileira",
  "cpf": "11144477735",
  "endereco": "Rua das Flores, 123" // opcional
}
```

#### API v2 (endereço obrigatório)
```json
{
  "nome": "Maria Silva Santos",
  "sexo": "feminino", 
  "email": "maria@email.com",
  "dataDeNascimento": "1990-01-15",
  "naturalidade": "São Paulo",
  "nacionalidade": "Brasileira", 
  "cpf": "25447772840",
  "endereco": "Rua das Flores, 123, Centro, São Paulo - SP" // obrigatório
}
```

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e

# Testes em modo watch
npm run test:watch
```

### Cobertura
O projeto mantém **80%+ de cobertura** de código conforme especificado.

## ☁️ Deploy em Nuvem

### AWS Lambda

O projeto está configurado para deploy automático no AWS Lambda usando Serverless Framework.

#### Deploy Automático (GitHub Actions)
- O deploy acontece automaticamente quando há push para a branch `main`
- Configurado via `.github/workflows/deploy.yml`

#### Deploy Manual
```bash
# Instalar dependências
npm install

# Build da aplicação
npm run build

# Deploy para AWS Lambda
npx serverless deploy --stage dev
```

#### Configuração
- **Runtime**: Node.js 22.x
- **Memória**: 512MB
- **Timeout**: 30 segundos
- **Região**: us-east-1

#### Variáveis de Ambiente Necessárias
```bash
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=1d
AWS_ACCESS_KEY_ID=sua_aws_access_key
AWS_SECRET_ACCESS_KEY=sua_aws_secret_key
AWS_REGION=us-east-1
```

Para mais detalhes sobre o deploy, consulte o arquivo `DEPLOY.md`.

## 📝 Validações Implementadas

### Campos Obrigatórios
- **Nome**: string, máximo 200 caracteres
- **Data de Nascimento**: data válida, não futura, pessoa até 150 anos
- **CPF**: formato válido e único no sistema

### Campos Opcionais (v1) / Obrigatórios (v2)
- **Endereço**: string, máximo 300 caracteres

### Campos Sempre Opcionais
- **Sexo**: enum (masculino, feminino, outro)
- **Email**: formato válido quando preenchido
- **Naturalidade**: string, máximo 100 caracteres  
- **Nacionalidade**: string, máximo 100 caracteres

## 🔒 Segurança

- **JWT Authentication** em todas as rotas protegidas
- **Validação de entrada** com class-validator
- **Hash de senhas** com bcryptjs
- **Sanitização** de dados de entrada
- **CORS** habilitado

## 📊 Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── guards/          # Guards JWT
│   ├── strategies/      # Estratégias Passport
│   └── *.service.ts     # Serviços de auth e usuário
├── common/              # Utilitários compartilhados
│   └── validators/      # Validadores customizados
├── dto/                 # Data Transfer Objects
├── entities/            # Entidades TypeORM
├── person-v1/           # Módulo API v1
├── person-v2/           # Módulo API v2
└── main.ts              # Bootstrap da aplicação

test/                    # Testes e2e
├── *.e2e-spec.ts
└── jest-e2e.json
```