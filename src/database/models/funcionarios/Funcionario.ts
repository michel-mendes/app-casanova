import { Model, Optional } from "sequelize"

export type AtributosFuncionario = {	
    id: number;
	nome: string;
	senha: string;
	ativo: number;
	endereco: string;
	numero: string;
	bairro: string;
	complemento: string;
	cidade: string;
	uf: string;
	cep: string;
	fone1: string;
	fone2: string;
	fone3: string;
	email: string;
	salario: number;
	observacao: string;
	dtCadastro: Date;
	dtAlteracao: Date;
	idUsuario: number;
	nomeOperador: string;
	cpf: string;
	rg: string;
	percentual: number;
	tipo: string;
	hrInicio: string;
	hrFim: string;
	hrInicioSab: string;
	hrFimSab: string;
	almoco: string;
}

type AtributosNovoFuncionario = Optional<AtributosFuncionario, "id">

export class Funcionario extends Model<AtributosFuncionario, AtributosNovoFuncionario> {
    declare id: number;
	declare nome: string;
	declare senha: string;
	declare ativo: number;
	declare endereco: string;
	declare numero: string;
	declare bairro: string;
	declare complemento: string;
	declare cidade: string;
	declare uf: string;
	declare cep: string;
	declare fone1: string;
	declare fone2: string;
	declare fone3: string;
	declare email: string;
	declare salario: number;
	declare observacao: string;
	declare dtCadastro: Date;
	declare dtAlteracao: Date;
	declare idUsuario: number;
	declare nomeOperador: string;
	declare cpf: string;
	declare rg: string;
	declare percentual: number;
	declare tipo: string;
	declare hrInicio: string;
	declare hrFim: string;
	declare hrInicioSab: string;
	declare hrFimSab: string;
	declare almoco: string;
}