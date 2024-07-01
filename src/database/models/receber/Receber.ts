import { Model, Optional } from "sequelize";

type AtributosReceber = {
    id: number;
    idVenda: number;
    idCliente: number;
    parcela: string;
    vlrParcela: number;
    dataEmissao: Date;
    quitado: number;
    dataQuitacao: Date;
    idOperador: number;
    dataVencimento: Date;
    selecionado: number;
    idDevolucao: number;
    entrada: number;
    cancelada: number;
    dtCancelamento: Date;
    idProcesso: number;
    obs: string;
    origem: string;
    faturaLocacao: number;
}

type AtributosNovoReceber = Optional<AtributosReceber, "id">

export class Receber extends Model<AtributosReceber, AtributosNovoReceber> {
    declare id: number;
    declare idVenda: number;
    declare idCliente: number;
    declare parcela: string;
    declare vlrParcela: number;
    declare dataEmissao: Date;
    declare quitado: number;
    declare dataQuitacao: Date;
    declare idOperador: number;
    declare dataVencimento: Date;
    declare selecionado: number;
    declare idDevolucao: number;
    declare entrada: number;
    declare cancelada: number;
    declare dtCancelamento: Date;
    declare idProcesso: number;
    declare obs: string;
    declare origem: string;
    declare faturaLocacao: number;
}