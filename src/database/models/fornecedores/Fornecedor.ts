import { Model, Optional } from "sequelize"

export type AtributosFornecedor = {
    id: number;
    razao: string;
    fantasia: string;
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
    contato: string;
    cnpj: string;
    inscr: string;
    obs: string;
    status: number;
    dtAlteracao: Date;
    idUsuario: number;
    dtCadastro: Date;
    cpf: string;
}

type AtributosNovoFornecedor = Optional<AtributosFornecedor, "id">

export class Fornecedor extends Model<AtributosFornecedor, AtributosNovoFornecedor> {
    declare id: number;
    declare razao: string;
    declare fantasia: string;
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
    declare contato: string;
    declare cnpj: string;
    declare inscr: string;
    declare obs: string;
    declare status: number;
    declare dtAlteracao: Date;
    declare idUsuario: number;
    declare dtCadastro: Date;
    declare cpf: string;
}