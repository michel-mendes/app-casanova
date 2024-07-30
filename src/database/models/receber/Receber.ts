import { Model, CreationOptional, NonAttribute, Association, InferAttributes, InferCreationAttributes } from "sequelize";
import { AuxBaixa } from "../auxBaixas/AuxBaixa";

export class Receber extends Model< InferAttributes<Receber, { omit: "baixasParciais" }>, InferCreationAttributes<Receber, {omit: "baixasParciais"}>> {
    declare id: CreationOptional<number>;;
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

    declare baixasParciais?: NonAttribute<Array<AuxBaixa>>

    declare static associations: {
        baixasParciais: Association<Receber, AuxBaixa>
    }
}