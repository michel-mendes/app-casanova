import { ItemVenda } from "./ItemVenda";
import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";
import { db } from "@/database/dbConnect";
import produtos from "../produtos";

function initItensVenda(sequelizeInstance: Sequelize) {
    ItemVenda.init({
        id: { type: DataType.NUMBER, allowNull: false, primaryKey: true },
        idVenda: { type: DataType.NUMBER },
        idProduto: { type: DataType.NUMBER },
        unidade: { type: DataType.STRING },
        qtde: { type: DataType.NUMBER },
        vlrUnitario: { type: DataType.NUMBER },
        vlrTotal: { type: DataType.NUMBER },
        vlrCustoDia: { type: DataType.NUMBER },
        idCaixa: { type: DataType.NUMBER },
        idOperador: { type: DataType.NUMBER },
        descricao: { type: DataType.STRING },
        item: { type: DataType.NUMBER },
        dataDevolucao: { type: DataType.DATE },
        baixaEstoque: { type: DataType.NUMBER },
        particionado: { type: DataType.NUMBER },
        idProdutoParticionado1: { type: DataType.NUMBER },
        idProdutoParticionado2: { type: DataType.NUMBER },
        vlrCustoProdPart1: { type: DataType.NUMBER },
        vlrCustoProdPart2: { type: DataType.NUMBER },
        vlrVendaProdPart1: { type: DataType.NUMBER },
        vlrVendaProdPart2: { type: DataType.NUMBER },
        oferta: { type: DataType.NUMBER },
        descricaoGrade: { type: DataType.STRING },
        idAuxGrade: { type: DataType.NUMBER },
        numeroSerie: { type: DataType.STRING },

        margemLucro: {
            type: DataType.VIRTUAL,
            get() {
                return ((this.vlrUnitario! - this.vlrCustoDia!) / this.vlrCustoDia!) * 100;
            }
        }
    }, {
        freezeTableName: true,
        sequelize: sequelizeInstance,
        modelName: "ItemVenda",
        tableName: "itensVenda",
    })

    ItemVenda.belongsTo(produtos, {foreignKey: "idProduto", as: "produto"})

    return { ItemVenda }
}

export default initItensVenda(db).ItemVenda