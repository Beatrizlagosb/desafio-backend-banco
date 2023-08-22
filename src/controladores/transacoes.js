let { contas, depositos, saques, transferencias } = require(`../dados/contas`);
const { format } = require('date-fns');

//Depósitar em uma conta bancária
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (isNaN(Number(numero_conta))) {
        return res.status(400).json({ mensagem: `O número da conta deve ser um número válido.` });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: `Conta não encontrada.` });
    }

    if (!valor || valor <= 0) {
        return res.status(401).json({ mensagem: `O Valor do deposito inválido` });
    }

    //Data do depósito

    const dataDeposito = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    //Realizando o depósito
    conta.saldo += valor;

    //Comprovante de depósito
    const deposito = {
        data: dataDeposito,
        numero_conta,
        valor: valor
    }

    depositos.push(deposito);
    return res.status(201).send();
}


//Sacar de uma conta bancária
const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (isNaN(Number(numero_conta))) {
        return res.status(400).json({ mensagem: `O número da conta deve ser um número válido.` });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: `Conta não encontrada.` });
    }

    if (!valor || valor <= 0) {
        return res.status(401).json({ mensagem: `O Valor do deposito inválido` });
    }

    if (!senha || senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: `A senha não foi informada ou está incorreta` });
    }

    //Data do Saque

    const dataSaque = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    //Realizando o saque
    if (valor <= 0 || valor > conta.saldo) {
        return res.status(400).json({ mensagem: "Não é possível realizar esse saque!" });
    }

    conta.saldo -= valor;

    //Comprovante de saque
    const saque = {
        data: dataSaque,
        numero_conta,
        valor: valor
    }

    saques.push(saque);
    return res.status(201).send();
}

//Transferir valores entre contas bancárias
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    //Numero conta de origem
    if (isNaN(Number(numero_conta_origem))) {
        return res.status(400).json({ mensagem: `O número da conta deve ser um número válido.` });
    }
    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });

    //Numero conta de destino
    if (isNaN(Number(numero_conta_destino))) {
        return res.status(400).json({ mensagem: `O número da conta deve ser um número válido.` });
    }
    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: `Conta não encontrada.` });
    }

    if (!valor || valor <= 0) {
        return res.status(401).json({ mensagem: `O Valor do deposito inválido` });
    }

    if (!senha || senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: `A senha não foi informada ou está incorreta` });
    }

    //Data da transferencia

    const dataTransferencia = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    //Realizando a transferencia
    if (valor <= 0 || valor > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: "Não é possível realizar essa transferencia!" });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    //Comprovante de transferencia
    const transferencia = {
        data: dataTransferencia,
        numero_conta_origem,
        numero_conta_destino,
        valor: valor
    }

    transferencias.push(transferencia);
    return res.status(201).send();
}

module.exports = {
    depositar,
    sacar,
    transferir
}