const { banco, contas } = require('./dados/contas');

const validarSenha = (req, res, next) => {

    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).json({ mensagem: `A senha não foi informada` });
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: `A senha do banco está incorreta` });
    }

    next();
}



const validarConta = (req, res, next) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    //Verificando Nome
    if (!nome || nome.trim() === '') {
        return res.status(400).json({ mensagem: `O nome é obrigatório` });
    }

    //Verificando CPF
    if (!cpf || cpf.trim() === '' || cpf.length !== 11 || isNaN(Number(cpf))) {
        return res.status(400).json({ mensagem: `O CPF é obrigatório, com 11 dígitos e composto apenas por números` });
    }

    const verificarCpf = (cpf, contas) => {
        return contas.some((conta) => conta.usuario.cpf === cpf);
    };

    if (verificarCpf(cpf, contas)) {
        return res.status(400).json({ mensagem: "CPF já cadastrado!" })
    }

    //Verificando Data de Nacimento
    if (!data_nascimento || data_nascimento.trim() === '') {
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória" });
    }

    //Verificando Telefone
    if (!telefone || telefone.trim() === '' || telefone.length !== 11 || isNaN(Number(telefone))) {
        return res.status(400).json({ mensagem: `O telefone é obrigatório e com 11 dígitos, incluindo o DDD` });
    }

    const verificarTelefone = (telefone) => {
        return contas.some((conta) => conta.usuario.telefone === telefone);
    };

    if (verificarTelefone(telefone, contas)) {
        return res.status(400).json({ mensagem: "Telefone já cadastrado!" });
    }

    //Verificando E-mail
    if (!email || email.trim() === '') {
        return res.status(400).json({ mensagem: `O e-mail é obrigatório` });
    }

    const verificarEmail = (email) => {
        return contas.some((conta) => conta.usuario.email === email);
    };

    if (verificarEmail(email, contas)) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado!" });
    }

    //Verificando Senha
    if (!senha || senha.trim() === '') {
        return res.status(400).json({ mensagem: `A senha é obrigatória` });
    }

    next();
}



const validarID = (req, res, next) => {

    const { numeroConta } = req.params;

    if (isNaN(Number(numeroConta))) {
        return res.status(400).json({ mensagem: `O número da conta deve ser um número válido.` });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: `Conta não encontrada.` });
    }

    next();
}



const atualizarConta = (req, res, next) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: "Ao menos uma das propriedades deve ser preenchida para a alteração!" });
    }

    //Verificando Nome
    if (nome && nome.trim() === '') {
        return res.status(400).json({ mensagem: `O nome é inválido` });
    }

    //Verificando CPF
    if (cpf) {
        if (cpf.trim() === '' || cpf.length !== 11 || isNaN(Number(cpf))) {
            return res.status(400).json({ mensagem: `O CPF é inválido, deve conter 11 dígitos e composto apenas por números` });
        }

        const verificarCpf = (cpf, contas) => {
            return contas.some((conta) => conta.usuario.cpf === cpf);
        };

        if (verificarCpf(cpf, contas)) {
            return res.status(400).json({ mensagem: "CPF já existente!" })
        }
    }

    //Verificando Data de Nascimento
    if (data_nascimento && data_nascimento.trim() === '') {
        return res.status(400).json({ mensagem: "A data de nascimento é inválida" });
    }

    //Verificando Telefone
    if (telefone) {
        if (telefone.trim() === '' || telefone.length !== 11 || isNaN(Number(telefone))) {
            return res.status(400).json({ mensagem: `O telefone é inválido e deve possuir 11 dígitos, incluindo o DDD` });
        }

        const verificarTelefone = (telefone) => {
            return contas.some((conta) => conta.usuario.telefone === telefone);
        };

        if (verificarTelefone(telefone, contas)) {
            return res.status(400).json({ mensagem: "Telefone já existente!" });
        }
    }

    //Verificando E-mail
    if (email) {
        if (email.trim() === '') {
            return res.status(400).json({ mensagem: `O e-mail é inválido` });
        }

        const verificarEmail = (email) => {
            return contas.some((conta) => conta.usuario.email === email);
        };

        if (verificarEmail(email, contas)) {
            return res.status(400).json({ mensagem: "E-mail já existente!" });
        }
    }

    //Verificando Senha
    if (senha && senha.trim() === '') {
        return res.status(400).json({ mensagem: `A senha é inválida` });
    }

    next();
}

module.exports = {
    validarSenha,
    validarConta,
    validarID,
    atualizarConta
};