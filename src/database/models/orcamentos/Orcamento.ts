import { Association, Model, NonAttribute, Optional } from 'sequelize';
import { AtributosFuncionario, Funcionario } from '../funcionarios/Funcionario';
import { ClienteAttributes } from '../clientes/Cliente';
import { ItemOrcamento, ItemOrcamentoAttributes } from '../itensOrcamento/ItemOrcamento';

// Interface para as propriedades do modelo
export interface OrcamentoAttributes {
  id: number;
  dataEmissao?: Date | null;
  vlrBruto?: number | null;
  vlrDesconto?: number | null;
  vlrAcrescimo?: number | null;
  vlrLiquido?: number | null;
  idClientes?: number | null;
  idNFe?: number | null;
  idVenda?: number | null;
  tipoOrcamento?: string | null;
  idOperador?: number | null;
  cancelado?: number | null;
  obs?: string | null;
  clienteNome?: string | null;
  clienteEndereco?: string | null;
  clienteNumero?: string | null;
  clienteBairro?: string | null;
  clienteComplemento?: string | null;
  clienteCidade?: string | null;
  clienteUF?: string | null;
  clienteCep?: string | null;
  clienteFone?: string | null;
  clienteEmail?: string | null;
  dtAlteracao?: Date | null;
  idUsuarioAlteracao?: number | null;
  DtValidade?: Date | null;
  idUsuarioCancelamento?: number | null;
  justificativa?: string | null;
  dtCancelamento?: Date | null;
  vlrFrete?: number | null;
  ac?: string | null;

  custoOrcamento?: number | null;
  margemLucro?: number | null;

  operador?: AtributosFuncionario;
  cliente?: ClienteAttributes;
  itensOrcamento?: Array<ItemOrcamentoAttributes>;
}

// Interface para criação (campos opcionais excluídos do construtor)
interface OrcamentosCreationAttributes extends Optional<OrcamentoAttributes, 'id'> { }

// Modelo Sequelize
export class Orcamento extends Model<OrcamentoAttributes, OrcamentosCreationAttributes>
  implements OrcamentoAttributes {
  public id!: number;
  public dataEmissao!: Date | null;
  public vlrBruto!: number | null;
  public vlrDesconto!: number | null;
  public vlrAcrescimo!: number | null;
  public vlrLiquido!: number | null;
  public idClientes!: number | null;
  public idNFe!: number | null;
  public idVenda!: number | null;
  public tipoOrcamento!: string | null;
  public idOperador!: number | null;
  public cancelado!: number | null;
  public obs!: string | null;
  public clienteNome!: string | null;
  public clienteEndereco!: string | null;
  public clienteNumero!: string | null;
  public clienteBairro!: string | null;
  public clienteComplemento!: string | null;
  public clienteCidade!: string | null;
  public clienteUF!: string | null;
  public clienteCep!: string | null;
  public clienteFone!: string | null;
  public clienteEmail!: string | null;
  public dtAlteracao!: Date | null;
  public idUsuarioAlteracao!: number | null;
  public DtValidade!: Date | null;
  public idUsuarioCancelamento!: number | null;
  public justificativa!: string | null;
  public dtCancelamento!: Date | null;
  public vlrFrete!: number | null;
  public ac!: string | null;

  declare itensOrcamento?: NonAttribute<Array<ItemOrcamentoAttributes>>;
  declare operador?: AtributosFuncionario

  declare static associations: {
    itensOrcamento: Association<Orcamento, ItemOrcamento>,
    operador: Association<Orcamento, Funcionario>
  }
}
