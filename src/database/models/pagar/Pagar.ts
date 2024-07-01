import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from "sequelize";
import { Fornecedor } from "../fornecedores/Fornecedor";

export class Pagar extends Model<InferAttributes<Pagar, { omit: "dadosFornecedor" }>, InferCreationAttributes<Pagar, { omit: "dadosFornecedor" }>> {
    declare id: CreationOptional<number>;
    declare idOrigem: number;
    // declare idFornecedor: number;
    declare idFornecedor: ForeignKey<Fornecedor["id"]>
    declare dtEmissao: Date;
    declare dtVencimento: string;
    declare parcela: string;
    declare vlrParcela: number;
    declare historico: string;
    declare documento: string;
    declare idFormaPagamento: number;
    declare quitado: number;
    declare dtQuitacao: Date;
    declare idUsuario: number;
    declare dtAlteracao: Date;
    declare idAbertura: number;
    declare idPlanoContas: number;
    declare vlrDesconto: number;
    declare vlrJuros: number;

    declare dadosFornecedor?: NonAttribute<Fornecedor>

    declare static associations: {
        dadosFornecedor: Association<Pagar, Fornecedor>
    }
}