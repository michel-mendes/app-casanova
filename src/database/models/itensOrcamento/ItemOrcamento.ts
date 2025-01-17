import { Model, Optional } from 'sequelize';
import { AtributosProduto } from '../produtos/Produto';

// Interface para as propriedades do modelo
export interface ItemOrcamentoAttributes {
  id: number;
  idOrcamento?: number | null;
  idProduto?: number | null;
  descricao?: string | null;
  unidade?: string | null;
  qtde?: number | null;
  vlrUnitario?: number | null;
  vlrTotal?: number | null;
  item?: number | null;
  descricaoGrade?: string | null;
  idAuxGrade?: number | null;

  produto?: AtributosProduto;
}

// Interface para criação (campos opcionais excluídos do construtor)
interface ItensOrcamentoCreationAttributes extends Optional<ItemOrcamentoAttributes, 'id'> {}

// Modelo Sequelize
export class ItemOrcamento extends Model<ItemOrcamentoAttributes, ItensOrcamentoCreationAttributes>
  implements ItemOrcamentoAttributes {
  public id!: number;
  public idOrcamento!: number | null;
  public idProduto!: number | null;
  public descricao!: string | null;
  public unidade!: string | null;
  public qtde!: number | null;
  public vlrUnitario!: number | null;
  public vlrTotal!: number | null;
  public item!: number | null;
  public descricaoGrade!: string | null;
  public idAuxGrade!: number | null;
}