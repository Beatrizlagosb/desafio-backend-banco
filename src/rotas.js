const express = require('express');
const { listarContasBancarias, criarContaBancaria, atualizarUsuario, excluirConta, depositar, sacar, transferir, saldo, extrato } = require('./controladores/contas');
const { validarSenha, validarConta, validarID, atualizarConta } = require('./intermediarios');

const rotas = express();

rotas.get('/contas', validarSenha, listarContasBancarias);
rotas.post('/contas', validarConta, criarContaBancaria);
rotas.put('/contas/:numeroConta/usuarios', validarID, atualizarConta, atualizarUsuario);
rotas.delete('/contas/:numeroConta', validarID, excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);

module.exports = rotas;