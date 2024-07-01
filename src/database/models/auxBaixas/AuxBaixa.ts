import { Model, Optional } from "sequelize";

type AtributosAuxBaixa = {
    id: number;
	idBaixa: number;
	idOrigem: number;
	vlrBruto: number;
	vlrDesconto: number;
	vlrAcrescimo: number;
	vlrJuros: number;
	vlrLiquido: number;
	vlrAbater: number;
	vlrRestante: number;
	complemento: string;
}

type AtributosNovoAuxBaixa = Optional<AtributosAuxBaixa, "id">

export class AuxBaixa extends Model<AtributosAuxBaixa, AtributosNovoAuxBaixa> {
    declare id: number;
	declare idBaixa: number;
	declare idOrigem: number;
	declare vlrBruto: number;
	declare vlrDesconto: number;
	declare vlrAcrescimo: number;
	declare vlrJuros: number;
	declare vlrLiquido: number;
	declare vlrAbater: number;
	declare vlrRestante: number;
	declare complemento: string;
}