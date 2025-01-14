import { DataTypes, Model, Optional } from 'sequelize';

// Interface para as propriedades do modelo
export interface RetiradaAttributes {
    id: number;
    idCaixa?: number | null;
    dataRetirada?: Date | null;
    valor?: number | null; // Sequelize interpreta "money" como um número
    idFuncionario?: number | null;
    obs?: string | null;
    idAbertura?: number | null;
}

// Interface para criação (id é opcional pois é auto-incrementado)
interface RetiradaCreationAttributes extends Optional<RetiradaAttributes, 'id'> { }

// Modelo Sequelize
class Retirada extends Model<RetiradaAttributes, RetiradaCreationAttributes> implements RetiradaAttributes {
    public id!: number;
    public idCaixa!: number | null;
    public dataRetirada!: Date | null;
    public valor!: number | null;
    public idFuncionario!: number | null;
    public obs!: string | null;
    public idAbertura!: number | null;
}

export { Retirada };
