# Desafio Backend Conta Bancária

# API de Bancos

Esta é uma API simples para gerenciar contas bancárias, transações e saldos. Ela fornece endpoints para criar contas, realizar transações como depósitos, saques e transferências, e obter informações da conta.

# Nota
Esteja ciente de que este projeto pode não incluir verificações elaboradas de entrada e checagens de segurança devido aos requisitos específicos do exercício e como parte do processo de avaliação da Cubos Academy. Como este projeto pode ser parte de um exercício de aprendizado, o foco pode ter sido mais em demonstrar habilidades de codificação do que em implementar um aplicativo pronto para produção.

Além disso, o banco de dados usado neste projeto é uma representação fictícia e não é escrito com funções assíncronas. Essa escolha de design está alinhada com a intenção do desafio de excluir aspectos de persistência de dados e focar nas funcionalidades principais do aplicativo.

## Instalação

1. Clone este repositório para sua máquina local.
2. Navegue até o diretório do projeto.
3. Instale as dependências necessárias executando:

```sh
npm install
```

## Uso

1. Inicie o servidor:

```sh
npm run start
```

2. Acesse a API em `http://localhost:3000`.

## Endpoints

### Listar Contas

**GET** `/contas`

Recupera uma lista de todas as contas bancárias.

### Criar Conta

**POST** `/contas`

Cria uma nova conta bancária. Requer fornecer os detalhes da conta no corpo da solicitação.

### Atualizar Conta

**PUT** `/contas/:numeroConta/usuario`

Atualiza as informações da conta. Requer o número da conta no parâmetro URL e as informações atualizadas no corpo da solicitação.

### Excluir Conta

**DELETE** `/contas/:numeroConta`

Exclui uma conta. Requer o número da conta no parâmetro URL.

### Depósito

**POST** `/transacoes/depositar`

Realiza um depósito em uma conta. Requer o número da conta e o valor do depósito no corpo da solicitação.

### Saque

**POST** `/transacoes/sacar`

Realiza um saque em dinheiro de uma conta. Requer o número da conta, o valor do saque e a senha da conta no corpo da solicitação.

### Transferência

**POST** `/transacoes/transferir`

Transfere fundos de uma conta para outra. Requer os números das contas do remetente e do destinatário, o valor da transferência e a senha da conta do remetente no corpo da solicitação.

### Saldo

**GET** `/contas/saldo`

Recupera o saldo da conta. Requer o número da conta e a senha da conta como parâmetros de consulta.

### Histórico de Transações

**GET** `/contas/extrato`

Recupera o histórico de transações de uma conta. Requer o número da conta e a senha da conta como parâmetros de consulta.

## Middleware

Para garantir o acesso seguro a determinados endpoints, um middleware é implementado para verificar o acesso usando a senha do banco. Esta senha deve ser fornecida como um parâmetro de consulta.

## Contribuidores

- Beatriz Lago