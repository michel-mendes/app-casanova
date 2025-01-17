import { Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript";

import { ItemOrcamento } from "./ItemOrcamento";
import produtos from "../produtos";

import { db } from "@/database/dbConnect";


function initItemOrcamento(sequelizeInstance: Sequelize) {
    ItemOrcamento.init(
        {
            id: {
                type: DataType.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            idOrcamento: {
                type: DataType.INTEGER,
                allowNull: true,
                references: {
                    model: "orcamentos", // Nome do modelo relacionado
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            idProduto: {
                type: DataType.INTEGER,
                allowNull: true,
                references: {
                    model: "produtos",
                    key: "id",
                }
            },
            descricao: {
                type: DataType.STRING(600),
                allowNull: true,
            },
            unidade: {
                type: DataType.STRING(5),
                allowNull: true,
            },
            qtde: {
                type: DataType.DECIMAL(19, 4), // Mapeando `money` como `DECIMAL`
                allowNull: true,
            },
            vlrUnitario: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            vlrTotal: {
                type: DataType.DECIMAL(19, 4),
                allowNull: true,
            },
            item: {
                type: DataType.DECIMAL(18, 0),
                allowNull: true,
            },
            descricaoGrade: {
                type: DataType.STRING(250),
                allowNull: true,
            },
            idAuxGrade: {
                type: DataType.INTEGER,
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
            sequelize: sequelizeInstance,
            modelName: "ItensOrcamento",
            tableName: 'itensOrcamento',
        }
    );

    ItemOrcamento.belongsTo(produtos, {foreignKey: "idProduto", as: "produto"})
    // ItemOrcamento.belongsTo(Orcamento, { foreignKey: 'idOrcamento', as: 'orcamento', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

    return { ItemOrcamento }
}

export default initItemOrcamento(db).ItemOrcamento