import { DataType, Model, Optional } from 'sequelize';

export interface ClienteAttributes {
    id: number;
    status?: number | null;
    nome: string;
    endereco?: string | null;
    numero?: string | null;
    bairro?: string | null;
    complemento?: string | null;
    cidade?: string | null;
    uf?: string | null;
    cep?: string | null;
    rg?: string | null;
    cpf?: string | null;
    fone1?: string | null;
    fone2?: string | null;
    fone3?: string | null;
    email?: string | null;
    dtCadastro?: Date | null;
    dtAlteracao?: Date | null;
    idUsuario?: number | null;
    limite?: number | null;
    obs?: string | null;
    dtNascimento?: Date | null;
    localTrabalho?: string | null;
    foneTrabalho?: string | null;
    contatoTrabalho?: string | null;
    salario?: number | null;
    estadoCivil?: string | null;
    pessoa?: string | null;
    fantasia?: string | null;
    tipoCliente?: string | null;
    produtorRural?: number | null;
    dtVencimento?: number | null;
    diasVenctoVendas?: number | null;
    mesa?: number | null;
    statusMesa?: string | null;
    mensalidade?: number | null;
    vlrMensalidade?: number | null;
    idRespAberturaMesa?: number | null;
    tipoRespAberturaMesa?: string | null;
    foneMesa?: string | null;
}

interface ClienteCreationAttributes extends Optional<ClienteAttributes, 'id'> { }

export class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes>
    implements ClienteAttributes {
    public id!: number;
    public status!: number | null;
    public nome!: string;
    public endereco!: string | null;
    public numero!: string | null;
    public bairro!: string | null;
    public complemento!: string | null;
    public cidade!: string | null;
    public uf!: string | null;
    public cep!: string | null;
    public rg!: string | null;
    public cpf!: string | null;
    public fone1!: string | null;
    public fone2!: string | null;
    public fone3!: string | null;
    public email!: string | null;
    public dtCadastro!: Date | null;
    public dtAlteracao!: Date | null;
    public idUsuario!: number | null;
    public limite!: number | null;
    public obs!: string | null;
    public dtNascimento!: Date | null;
    public localTrabalho!: string | null;
    public foneTrabalho!: string | null;
    public contatoTrabalho!: string | null;
    public salario!: number | null;
    public estadoCivil!: string | null;
    public pessoa!: string | null;
    public fantasia!: string | null;
    public tipoCliente!: string | null;
    public produtorRural!: number | null;
    public dtVencimento!: number | null;
    public diasVenctoVendas!: number | null;
    public mesa!: number | null;
    public statusMesa!: string | null;
    public mensalidade!: number | null;
    public vlrMensalidade!: number | null;
    public idRespAberturaMesa!: number | null;
    public tipoRespAberturaMesa!: string | null;
    public foneMesa!: string | null;
}
