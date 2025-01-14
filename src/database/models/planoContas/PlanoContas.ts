import { DataTypes, Model } from 'sequelize';

// Interface para as propriedades do modelo
export interface PlanoContasAttributes {
  id: number;
  descricao?: string | null;
  operacional?: number | null;
  investimento?: number | null;
  tipo?: string | null;
  dtAlteracao?: Date | null;
  idUsuario?: number | null;
  ativo?: number | null;
}

// Interface para criação (id não é auto-incrementado aqui)
interface PlanoContasCreationAttributes extends PlanoContasAttributes {}

// Modelo Sequelize
class PlanoContas extends Model<PlanoContasAttributes, PlanoContasCreationAttributes> implements PlanoContasAttributes {
  public id!: number;
  public descricao!: string | null;
  public operacional!: number | null;
  public investimento!: number | null;
  public tipo!: string | null;
  public dtAlteracao!: Date | null;
  public idUsuario!: number | null;
  public ativo!: number | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { PlanoContas }
