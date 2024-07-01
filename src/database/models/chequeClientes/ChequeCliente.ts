import { Model, Optional } from "sequelize"

type AtributosChequeCliente = {
    id: number,
    idOrigem: number,
    idCliente: number,
    parcela: string,
    valor: number,
    banco: string,
    agencia: string,
    contaCorrente: string,
    Titular: string,
    devolvido: number,
    numero: string,
    dtEmissao: Date,
    dtVencimento: Date,
    idUsuario: number,
    dtAlteracao: Date,
    status: string,
    dtStatus: Date,
    obsStatus: string
}

type AtributosNovoChequeCliente = Optional<AtributosChequeCliente, "id">

export class ChequeCliente extends Model<AtributosChequeCliente, AtributosNovoChequeCliente> {
    declare id: number;
    declare idOrigem: number;
    declare idCliente: number;
    declare parcela: string;
    declare valor: number;
    declare banco: string;
    declare agencia: string;
    declare contaCorrente: string;
    declare Titular: string;
    declare devolvido: number;
    declare numero: string;
    declare dtEmissao: Date;
    declare dtVencimento: Date;
    declare idUsuario: number;
    declare dtAlteracao: Date;
    declare status: string;
    declare dtStatus: Date;
    declare obsStatus: string;
}