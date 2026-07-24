# RotaViva

O **RotaViva** é um aplicativo mobile desenvolvido com **React Native e Expo** para auxiliar no cadastro, acompanhamento e gerenciamento de entregas.

A aplicação utiliza o **Supabase** como infraestrutura em nuvem para armazenamento dos dados e registro das operações realizadas no sistema.

Este repositório é um fork individual do projeto original, utilizado em um trabalho acadêmico de Computação em Nuvem com autorização do professor responsável.

## Repositórios

- Projeto original: https://github.com/nicsilmatos/RotaViva
- Fork com os incrementos: https://github.com/sabrynavn/RotaViva

---

## Objetivo do incremento

O objetivo desta versão foi evoluir a aplicação original sem realizar uma reestruturação completa da arquitetura.

As melhorias foram concentradas em três áreas:

- Modernização da interface;
- Melhoria da consulta e visualização das entregas;
- Implementação de uma nova funcionalidade utilizando o Supabase Database.

---

## Incrementos implementados

### Dashboard de entregas

A tela principal apresenta indicadores calculados dinamicamente a partir dos registros armazenados no Supabase:

- Total de entregas;
- Entregas pendentes;
- Entregas concluídas com sucesso;
- Entregas finalizadas com falha.

Os valores são atualizados sempre que a tela recebe foco novamente.

### Pesquisa dinâmica

Foi adicionada uma barra de pesquisa que filtra as entregas em tempo real.

A pesquisa pode ser realizada por:

- Código do pacote;
- Nome do destinatário.

O filtro é aplicado às entregas pendentes e concluídas.

### Cadastro de entregas

Foi implementado um formulário funcional para o cadastro de novas entregas.

O formulário possui:

- Código do pacote;
- Nome do destinatário;
- Endereço;
- Validação de campos obrigatórios;
- Indicador de carregamento durante o cadastro;
- Mensagens de sucesso e erro;
- Integração com o Supabase Database.

Toda nova entrega é cadastrada inicialmente com o status `pendente`.

### Histórico de ações na nuvem

Foi criada a tabela `historico_acoes` no Supabase Database.

Sempre que uma nova entrega é cadastrada, o sistema registra automaticamente:

- Tipo da ação;
- Descrição da operação;
- Identificador da entrega;
- Identificador do entregador;
- Data e horário da ação.

Nesta versão, a ação registrada é:

```text
CADASTRO_ENTREGA
```

Essa funcionalidade adiciona rastreabilidade às operações do sistema e demonstra a aplicação de recursos de Computação em Nuvem além do armazenamento tradicional das entregas.

### Melhorias visuais

A interface foi atualizada com:

- Cards estatísticos;
- Cards de entregas mais organizados;
- Padronização de cores;
- Bordas arredondadas;
- Sombras;
- Melhorias de tipografia;
- Espaçamentos mais consistentes;
- Melhor hierarquia visual;
- Estados de carregamento;
- Mensagens de erro;
- Mensagens para listas vazias;
- Correção da organização entre entregas pendentes e concluídas.

---

## Funcionalidades da base original

A estrutura original do projeto possui recursos relacionados a:

- Cadastro de entregadores;
- Cadastro e gerenciamento de entregas;
- Atualização do status das entregas;
- Captura de localização com Expo Location;
- Captura de imagens com Expo Camera;
- Upload de comprovantes para o Supabase Storage;
- Visualização dos detalhes das entregas;
- Integração com banco de dados em nuvem.

Os incrementos desta versão preservam essa arquitetura principal.

---

## Tecnologias utilizadas

| Categoria | Tecnologia |
|---|---|
| Aplicativo mobile | React Native |
| Ambiente de desenvolvimento | Expo |
| Linguagem | JavaScript |
| Navegação | React Navigation |
| Backend em nuvem | Supabase |
| Banco de dados | PostgreSQL |
| Armazenamento de arquivos | Supabase Storage |
| Câmera | Expo Camera |
| Localização | Expo Location |
| Controle de versão | Git e GitHub |

---

## Estrutura do projeto

```text
RotaViva
├── src
│   ├── backend
│   │   ├── supabase.js
│   │   ├── entregas.js
│   │   ├── entregadores.js
│   │   ├── comprovantes.js
│   │   └── historico.js
│   │
│   ├── frontend
│   │   ├── assets
│   │   ├── components
│   │   ├── navigation
│   │   └── screens
│   │
│   └── services
│
├── App.js
├── app.json
├── package.json
└── README.md
```

---

## Banco de dados

### Tabela `entregas`

Armazena os dados das entregas cadastradas.

Principais campos:

```text
id
entregador_id
codigo_pacote
destinatario_nome
endereco
status
foto_url
latitude
longitude
criado_em
atualizado_em
registrado_em
```

### Tabela `entregadores`

Armazena os dados dos entregadores vinculados às entregas.

Principais campos:

```text
id
nome
identificacao
role
```

A estrutura pode variar de acordo com a versão atual do banco de dados.

### Tabela `historico_acoes`

Criada como parte do incremento de Computação em Nuvem.

Campos:

```text
id
acao
descricao
entrega_id
entregador_id
criado_em
```

Exemplo de registro:

```text
Ação: CADASTRO_ENTREGA
Descrição: Entrega ROT_002 cadastrada para Mariana Pereira.
```

### Supabase Storage

O Supabase Storage é utilizado pela estrutura original para armazenamento dos comprovantes das entregas.

---

## Fluxo do cadastro de uma entrega

```text
Usuário abre o formulário
          |
          v
Preenche os dados da entrega
          |
          v
Aplicação valida os campos
          |
          v
Entrega é cadastrada no Supabase
          |
          v
Supabase retorna o registro criado
          |
          v
Ação é registrada em historico_acoes
          |
          v
Dashboard e listagem são atualizados
```

---

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js;
- npm;
- Git;
- Expo Go em um dispositivo móvel.

### Clonar o repositório

```bash
git clone https://github.com/sabrynavn/RotaViva.git
```

### Entrar na pasta

```bash
cd RotaViva
```

### Instalar as dependências

```bash
npm install
```

### Configurar as variáveis de ambiente

Crie ou configure o arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

Não envie chaves privadas ou administrativas para o GitHub.

### Iniciar a aplicação

```bash
npx expo start --clear
```

Depois, abra o aplicativo pelo Expo Go utilizando o QR Code apresentado no terminal.

---

## Segurança

O projeto utiliza **Row Level Security — RLS** nas tabelas do Supabase.

Durante o desenvolvimento e a demonstração acadêmica, foram configuradas políticas temporárias para permitir operações utilizando a chave pública `anon`.

Essas políticas devem ser revisadas antes do uso em produção. A versão futura deverá limitar o acesso de acordo com o usuário autenticado e o entregador responsável por cada registro.

---

## Limitações atuais

Esta versão possui algumas limitações conhecidas:

- A autenticação ainda precisa ser revisada;
- O aplicativo utiliza temporariamente um entregador de teste quando não recebe o identificador pela navegação;
- O histórico registra somente o cadastro de entregas;
- Os filtros rápidos por status ainda não foram implementados;
- A pesquisa atual considera código do pacote e destinatário;
- As políticas temporárias de RLS não são adequadas para produção;
- O fluxo completo de comprovante, câmera e GPS não fez parte do incremento final desta etapa.

---

## Próximas melhorias

Possibilidades de evolução:

- Restaurar e aprimorar a autenticação;
- Restringir as políticas RLS por usuário;
- Registrar atualizações e exclusões no histórico;
- Registrar uploads de comprovantes;
- Criar uma tela para consulta do histórico;
- Adicionar filtros rápidos por status;
- Pesquisar por endereço e entregador;
- Exibir entregadores cadastrados no dashboard;
- Adicionar uma lista de entregas recentes;
- Criar toasts personalizados;
- Adicionar modal de confirmação de exclusão;
- Melhorar os estados vazios;
- Organizar os arquivos no Supabase Storage;
- Gerar uma versão instalável do aplicativo.

---

## Documentação da decisão

O planejamento inicial do incremento foi registrado em um documento de decisão arquitetural.

Como esse documento representa as decisões tomadas antes da implementação, ele foi mantido sem alterações.

Uma nota de edição foi adicionada ao final da documentação para registrar:

- As funcionalidades efetivamente implementadas;
- As adaptações realizadas;
- As diferenças em relação ao planejamento inicial;
- As funcionalidades mantidas para versões futuras.

---

## Histórico dos principais incrementos

```text
feat: adiciona dashboard e melhorias na tela de entregas

feat: adiciona pesquisa de entregas por código e destinatário

feat: adiciona cadastro de entregas e histórico no Supabase

fix: ajusta posição da seção de entregas concluídas
```

---

## Equipe original

| Integrante | GitHub |
|---|---|
| Nicole Matos | https://github.com/nicsilmatos |
| Don Laranjo | https://github.com/laranjodupy |
| Sabryna Vasconcelos | https://github.com/sabrynavn |
| Leonardo Maia | https://github.com/leonardomaiaa |

---

## Incremento individual

As melhorias documentadas nesta versão foram desenvolvidas por:

**Sabryna Vasconcelos**

GitHub: https://github.com/sabrynavn

---

## Status do projeto

Versão acadêmica funcional, desenvolvida para o projeto final do módulo de Computação em Nuvem.

O sistema permanece em evolução e ainda requer ajustes antes de ser utilizado em um ambiente de produção.

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais.
