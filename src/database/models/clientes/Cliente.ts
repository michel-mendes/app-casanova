import { Model, Optional } from "sequelize"

type AtributosCliente = {
    id: number;
    status: number;
    nome: string;
    endereco: string;
    numero: string;
    bairro: string;
    complemento: string;
    cidade: string;
    uf: string;
    cep: string;
    rg: string;
    cpf: string;
    fone1: string;
    fone2: string;
    fone3: string;
    email: string;
    dtCadastro: Date;
    dtAlteracao: Date;
    idUsuario: number;
    limite: number;
    obs: string;
    dtNascimento: Date;
    localTrabalho: string;
    foneTrabalho: string;
    contatoTrabalho: string;
    salario: number;
    estadoCivil: string;
    pessoa: string;
    fantasia: string;
    tipoCliente: string;
    produtorRural: number;
    dtVencimento: number;
    diasVenctoVendas: number;
    mesa: number;
    statusMesa: string;
    mensalidade: number;
    vlrMensalidade: number;
    idRespAberturaMesa: number;
    tipoRespAberturaMesa: string;
    foneMesa: string;
}

type AtributosNovoCliente = Optional<AtributosCliente, "id">

export class Cliente extends Model<AtributosCliente, AtributosNovoCliente> {
    declare id: number;
    declare status: number;
    declare nome: string;
    declare endereco: string;
    declare numero: string;
    declare bairro: string;
    declare complemento: string;
    declare cidade: string;
    declare uf: string;
    declare cep: string;
    declare rg: string;
    declare cpf: string;
    declare fone1: string;
    declare fone2: string;
    declare fone3: string;
    declare email: string;
    declare dtCadastro: Date;
    declare dtAlteracao: Date;
    declare idUsuario: number;
    declare limite: number;
    declare obs: string;
    declare dtNascimento: Date;
    declare localTrabalho: string;
    declare foneTrabalho: string;
    declare contatoTrabalho: string;
    declare salario: number;
    declare estadoCivil: string;
    declare pessoa: string;
    declare fantasia: string;
    declare tipoCliente: string;
    declare produtorRural: number;
    declare dtVencimento: number;
    declare diasVenctoVendas: number;
    declare mesa: number;
    declare statusMesa: string;
    declare mensalidade: number;
    declare vlrMensalidade: number;
    declare idRespAberturaMesa: number;
    declare tipoRespAberturaMesa: string;
    declare foneMesa: string;
}