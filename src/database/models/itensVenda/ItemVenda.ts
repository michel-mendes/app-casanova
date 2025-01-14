import { CreationOptional, InferAttributes, InferCreationAttributes, Model, ForeignKey, Optional, NonAttribute, Association } from "sequelize";
import { Venda } from "../vendas/Venda";
import { AtributosProduto, Produto } from "../produtos/Produto";

// Interface para as propriedades do modelo
export interface ItemVendaAttributes {
    id: number;
    idVenda: number | null;
    idProduto?: number | null; // Sequelize não suporta diretamente o tipo `numeric(18, 0)`, mapeado para `number`
    unidade?: string | null;
    qtde?: number | null; // Sequelize usa `number` para valores monetários
    vlrUnitario?: number | null;
    vlrTotal?: number | null;
    vlrCustoDia?: number | null;
    idCaixa?: number | null;
    idOperador?: number | null;
    descricao?: string | null;
    item?: number | null;
    dataDevolucao?: Date | null;
    baixaEstoque?: number | null;
    particionado?: number | null;
    idProdutoParticionado1?: number | null;
    idProdutoParticionado2?: number | null;
    vlrCustoProdPart1?: number | null;
    vlrCustoProdPart2?: number | null;
    vlrVendaProdPart1?: number | null;
    vlrVendaProdPart2?: number | null;
    oferta?: number | null;
    descricaoGrade?: string | null;
    idAuxGrade?: number | null;
    numeroSerie?: string | null;

    margemLucro?: number | null;
    produto?: AtributosProduto | null;
}

// Interface para criação (campos opcionais excluídos do construtor)
interface ItensVendaCreationAttributes extends Optional<ItemVendaAttributes, 'id'> { }

export class ItemVenda extends Model<ItemVendaAttributes, ItensVendaCreationAttributes> implements ItemVendaAttributes {
    public id!: number;
    public idVenda!: number | null;
    public idProduto!: number | null;
    public unidade!: string | null;
    public qtde!: number | null;
    public vlrUnitario!: number | null;
    public vlrTotal!: number | null;
    public vlrCustoDia!: number | null;
    public idCaixa!: number | null;
    public idOperador!: number | null;
    public descricao!: string | null;
    public item!: number | null;
    public dataDevolucao!: Date | null;
    public baixaEstoque!: number | null;
    public particionado!: number | null;
    public idProdutoParticionado1!: number | null;
    public idProdutoParticionado2!: number | null;
    public vlrCustoProdPart1!: number | null;
    public vlrCustoProdPart2!: number | null;
    public vlrVendaProdPart1!: number | null;
    public vlrVendaProdPart2!: number | null;
    public oferta!: number | null;
    public descricaoGrade!: string | null;
    public idAuxGrade!: number | null;
    public numeroSerie!: string | null;

    declare produto?: NonAttribute<AtributosProduto>;

    declare static association: {
        produto: Association<ItemVenda, Produto>
    }
}