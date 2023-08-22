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
    saldo,
    extrato
}