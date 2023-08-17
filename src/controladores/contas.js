let { contas, depositos, saques, transferencias } = require(`../dados/contas`);
let identificadorDaConta = 1;

// Listar contas bancárias
const listarContasBancarias = (req, res) => {
    return res.status(200).json(contas);
}

// Criar conta bancária
const criarContaBancaria = (req, res) => {
    console.log(req.body);

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = {
        numero: identificadorDaConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(conta);
    return res.status(201).send(conta);
}

//Atualizar usuário da conta bancária
const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = contas.find(conta => conta.numero === Number(numeroConta));

    conta.usuario.nome = nome || conta.usuario.nome;
    conta.usuario.cpf = cpf || conta.usuario.cpf;
    conta.usuario.data_nascimento = data_nascimento || conta.usuario.data_nascimento;
    conta.usuario.telefone = telefone || conta.usuario.telefone;
    conta.usuario.email = email || conta.usuario.email;
    conta.usuario.senha = senha || conta.usuario.senha;

    return res.status(204).send();
}

//Excluir uma conta bancária
const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find(conta => conta.numero === Number(numeroConta));

    if (conta.saldo === 0) {
        contas = contas.filter(conta => conta.numero !== Number(numeroConta));
        return res.status(200).json();
    }

    if (conta.saldo !== 0) {
        return res.status(403).json({ mensagem: `A conta só pode ser removida se o saldo for zero!` });
    }

}

//Depósitar em uma conta bancária
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    let date = (new Date());

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
    const formatarData = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = String(date.getFullYear());
        const hora = String(date.getHours()).padStart(2, '0');
        const minuto = String(date.getMinutes()).padStart(2, '0');
        const segundo = String(date.getSeconds()).padStart(2, '0');

        return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
    }

    const dataDeposito = formatarData(date)

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
    let date = (new Date());

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

    //Data do depósito
    const formatarData = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = String(date.getFullYear());
        const hora = String(date.getHours()).padStart(2, '0');
        const minuto = String(date.getMinutes()).padStart(2, '0');
        const segundo = String(date.getSeconds()).padStart(2, '0');

        return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
    }

    const dataSaque = formatarData(date)

    //Realizando o saque
    if (valor <= 0 || valor > conta.saldo) {
        return res.status(400).json({ mensagem: "Não é possível realizar esse saque!" });
    }

    conta.saldo -= valor;

    //Comprovante de depósito
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
    let date = (new Date());

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

    //Data do depósito
    const formatarData = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = String(date.getFullYear());
        const hora = String(date.getHours()).padStart(2, '0');
        const minuto = String(date.getMinutes()).padStart(2, '0');
        const segundo = String(date.getSeconds()).padStart(2, '0');

        return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
    }

    const dataTransferencia = formatarData(date)

    //Realizando a transferencia
    if (valor <= 0 || valor > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: "Não é possível realizar essa transferencia!" });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    //Comprovante de depósito
    const transferencia = {
        data: dataTransferencia,
        numero_conta_origem,
        numero_conta_destino,
        valor: valor
    }

    transferencias.push(transferencia);
    return res.status(201).send();
}

//Consultar saldo da conta bancária
const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    //Validando conta
    if (isNaN(Number(numero_conta))) {
        return res.status(400).json({ mensagem: `O número da conta deve ser um número válido.` });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: `Conta não encontrada.` });
    }

    //Validando senha
    if (!senha || senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: `A senha não foi informada ou está incorreta` });
    }

    const saldo = {
        saldo: conta.saldo
    }

    return res.status(200).json(saldo);
}

//Emitir extrato bancário
const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    //Validando conta
    if (isNaN(Number(numero_conta))) {
        return res.status(400).json({ mensagem: `O número da conta deve ser um número válido.` });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: `Conta não encontrada.` });
    }

    //Validando senha
    if (!senha || senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: `A senha não foi informada ou está incorreta` });
    }

    const depositosDaConta = depositos.filter((deposito) => deposito.numero_conta === numero_conta);
    const saquesDaConta = saques.filter((saque) => saque.numero_conta === numero_conta);
    const transferenciasEnviadas = transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta);
    const transferenciasRecebidas = transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta);

    const extrato = {
        depositos: depositosDaConta,
        saques: saquesDaConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    };

    return res.status(200).json(extrato);
}


module.exports = {
    listarContasBancarias,
    criarContaBancaria,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}