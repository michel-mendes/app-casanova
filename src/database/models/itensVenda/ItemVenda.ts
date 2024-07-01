import { CreationOptional, InferAttributes, InferCreationAttributes, Model, ForeignKey, Association } from "sequelize";
import { Venda } from "../vendas/Venda";

export class ItemVenda extends Model<InferAttributes<ItemVenda>, InferCreationAttributes<ItemVenda>> {
    declare id: CreationOptional<number>;
    declare idVenda: ForeignKey<Venda["id"]>;
    declare idProduto: number;
    declare unidade: string;
    declare qtde: number;
    declare vlrUnitario: number;
    declare vlrTotal: number;
    declare vlrCustoDia: number;
    declare idCaixa: number;
    declare idOperador: number;
    declare descricao: string;
    declare item: number;
    declare dataDevolucao: Date;
    declare baixaEstoque: number;
    declare particionado: number;
    declare idProdutoParticionado1: number;
    declare idProdutoParticionado2: number;
    declare vlrcustoProdPart1: number;
    declare vlrcustoProdPart2: number;
    declare vlrVendaProdPart1: number;
    declare vlrVendaProdPart2: number;
    declare oferta: number;
    declare descricaoGrade: string;
    declare idAuxGrade: number;
    declare numeroSerie: string;
    declare margemLucro?: number;
}