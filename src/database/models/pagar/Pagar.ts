import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional } from "sequelize";
import { AtributosFornecedor, Fornecedor } from "../fornecedores/Fornecedor";
import { PlanoContasAttributes } from "../planoContas/PlanoContas";

// Interface para as propriedades do modelo
export interface PagarAttributes {
    id: number;
    idOrigem?: number | null;
    idFornecedor?: number | null;
    dtEmissao?: Date | null;
    dtVencimento?: Date | null;
    parcela?: string | null;
    vlrParcela?: number | null;
    historico?: string | null;
    documento?: string | null;
    idFormaPagamento?: number | null;
    quitado?: number | null;
    dtQuitacao?: Date | null;
    idUsuario?: number | null;
    dtAlteracao?: Date | null;
    idAbertura?: number | null;
    idPlanoContas?: number | null;
    vlrDesconto?: number | null;
    vlrJuros?: number | null;
    fornecedor?: AtributosFornecedor;
    planoContas?: PlanoContasAttributes;
}

// Modelo Sequelize
class Pagar
    extends Model<
        InferAttributes<Pagar, { omit: "fornecedor" }>,
        InferCreationAttributes<Pagar, { omit: "fornecedor" }>
    >
    implements PagarAttributes {
    public id!: CreationOptional<number>;
    public idOrigem!: number | null;
    public idFornecedor!: ForeignKey<Fornecedor["id"] | null>;
    public dtEmissao!: Date | null;
    public dtVencimento!: Date | null;
    public parcela!: string | null;
    public vlrParcela!: number | null;
    public historico!: string | null;
    public documento!: string | null;
    public idFormaPagamento!: number | null;
    public quitado!: number | null;
    public dtQuitacao!: Date | null;
    public idUsuario!: number | null;
    public dtAlteracao!: Date | null;
    public idAbertura!: number | null;
    public idPlanoContas!: number | null;
    public vlrDesconto!: number | null;
    public vlrJuros!: number | null;

    declare fornecedor?: NonAttribute<Fornecedor>

    declare static associations: {
        fornecedor: Association<Pagar, Fornecedor>
    }
}

export { Pagar };