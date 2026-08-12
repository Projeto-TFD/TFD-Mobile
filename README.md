# TFD Mobile

Aplicativo mobile para motoristas do sistema de **Transporte Fora do Domicílio (TFD)**, desenvolvido como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas do **IFPB — Campus Cajazeiras**.

## Sobre o projeto

O TFD é um serviço público que transporta pacientes do município para tratamentos de saúde em outras cidades, quando esse atendimento não está disponível localmente. O TFD Mobile é o aplicativo usado pelo **motorista** responsável por essas viagens, permitindo que ele:

- Faça login com CPF e senha
- Cadastre uma nova viagem, informando cidade de origem, cidade de destino, veículo utilizado e observações
- Adicione os passageiros da viagem (pacientes e, opcionalmente, seus acompanhantes)
- Inicie a viagem, com a data e hora de saída registradas automaticamente
- Acompanhe a viagem em andamento, com a navegação de volta bloqueada até a finalização
- Finalize a viagem, com a data e hora de chegada registradas automaticamente
- Visualize um resumo da viagem concluída, com duração total calculada

O app consome uma **API própria** (TFD API), construída em NestJS, que centraliza os dados de motoristas, veículos, cidades, pacientes/acompanhantes e viagens.

## Tecnologias utilizadas

- **React Native** com **Expo** (SDK 54) e **Expo Router** para navegação em arquivos
- **TypeScript**
- **NativeWind** (Tailwind CSS aplicado a componentes nativos)
- **Zustand** para gerenciamento de estado, com persistência local (viagem em andamento sobrevive ao fechamento do app)
- **TanStack Query (React Query)** para busca e cache de dados da API
- **Axios** como cliente HTTP
- **Expo SecureStore** para armazenamento seguro do token de autenticação

## Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

- **Node.js** versão 20 ou superior (recomenda-se o uso do [nvm](https://github.com/nvm-sh/nvm) para gerenciar versões)
- **npm** (instalado junto com o Node.js)
- **Expo Go**, disponível na App Store ou Google Play, para testar o app em um celular físico
- Uma conexão de rede local, caso o backend também esteja rodando localmente

## Como inicializar o projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd TFD-Mobile
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar a URL da API

O app consome a API hospedada em produção por padrão. A URL base está definida em `src/lib/api.ts`:

```ts
export const api = axios.create({
  baseURL: 'https://tfd-api-ywhv.onrender.com/api',
  timeout: 15000,
});
```

Caso queira apontar para uma instância local da API, troque essa URL pelo IP da máquina que está rodando o backend na rede local (por exemplo, `http://192.168.1.105:3000/api`), já que `localhost` não é acessível a partir de um celular físico.

### 4. Iniciar o servidor de desenvolvimento

```bash
npx expo start
```

Um QR code será exibido no terminal. Abra o aplicativo **Expo Go** no celular e escaneie o código para carregar o app.

### 5. Login

O app exige login com **CPF e senha** de um usuário do tipo operador (motorista), previamente cadastrado na API.

## Estrutura de pastas

```
src/
  app/                  Telas e rotas (Expo Router)
    (auth)/               Fluxo de autenticação (login)
    (app)/                Fluxo autenticado (cadastro, viagem em andamento, viagem finalizada)
  components/ui/        Componentes reutilizáveis (Input, Select, Accordion)
  hooks/                 Hooks de dados (React Query) e utilitários
  services/              Chamadas HTTP para cada recurso da API
  store/                 Estado global persistido (autenticação e viagem ativa)
  utils/                 Funções auxiliares (ex.: validação de CPF)
  lib/                   Configuração do cliente HTTP
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npx expo start` | Inicia o servidor de desenvolvimento |
| `npx expo start -c` | Inicia limpando o cache do Metro (recomendado após mudanças de configuração) |
| `npx expo-doctor` | Verifica problemas de configuração e dependências do projeto |

## Autoria

Projeto desenvolvido por estudantes do IFPB — Campus Cajazeiras, como parte de atividades acadêmicas do curso de Análise e Desenvolvimento de Sistemas.