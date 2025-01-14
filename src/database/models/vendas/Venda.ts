import { Association, CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { ItemVenda } from "../itensVenda/ItemVenda";
import { AtributosFuncionario, Funcionario } from "../funcionarios/Funcionario";
import { ItemVendaAttributes } from "../itensVenda/ItemVenda";

export interface VendaAttributes {
	id?: number;
	dataEmissao?: Date | null;
	vlrBruto?: number | null;
	vlrDesconto?: number | null;
	vlrLiquido?: number | null;
	vlrRecebido?: number | null;
	vlrTroco?: number | null;
	idClientes?: number | null;
	idCfe?: number | null;
	idCupomFiscal?: number | null;
	tipoVenda?: string | null;
	idCaixa?: number | null;
	idOperador?: number | null;
	cancelado?: number | null;
	obs?: string | null;
	idFormaPagamentos?: number | null;
	vlrAcrescimo?: number | null;
	idNFe?: number | null;
	justificativa?: string | null;
	dtCancelamento?: Date | null;
	idUsuarioCancelamento?: number | null;
	idAbertura?: number | null;
	cpf?: string | null;
	nome?: string | null;
	endereco?: string | null;
	numero?: string | null;
	bairro?: string | null;
	complemento?: string | null;
	cidade?: string | null;
	uf?: string | null;
	cep?: string | null;
	telefone?: string | null;
	faturada?: number | null;
	entregaFutura?: number | null;
	marcaModelo?: string | null;
	placa?: string | null;
	km?: string | null;
	vlrFrete?: number | null;
	idMontador?: number | null;
	marcaModelo2?: string | null;
	marcaModelo3?: string | null;
	placa2?: string | null;
	placa3?: string | null;
	km2?: string | null;
	km3?: string | null;
	dtAlteracao?: Date | null;
	idUsuarioAlteracao?: number | null;
	condicoesPagto?: string | null;
	retirado?: string | null;
	situacao?: string | null;
	entregaApp?: number | null;
	levarApp?: number | null;
	acompanhamentoApp?: number | null;
	margemLucro?: number | null;

	itensVenda?: Array<ItemVendaAttributes>;
	operador?: AtributosFuncionario;
}	

class Venda
	extends Model<
		InferAttributes<Venda, {omit: "itensVenda"}>,
		InferCreationAttributes<Venda, {omit: "itensVenda"}>
	>
	implements VendaAttributes {
    public id!: CreationOptional<number>;
	public dataEmissao!: Date | null;
	public vlrBruto!: number | null;
	public vlrDesconto!: number | null;
	public vlrLiquido!: number | null;
	public vlrRecebido!: number | null;
	public vlrTroco!: number | null;
	public idClientes!: number | null;
	public idCfe!: number | null;
	public idCupomFiscal!: number | null;
	public tipoVenda!: string | null;
	public idCaixa!: number | null;
	public idOperador!: number | null;
	public cancelado!: number | null;
	public obs!: string | null;
	public idFormaPagamentos!: number | null;
	public vlrAcrescimo!: number | null;
	public idNFe!: number | null;
	public justificativa!: string | null;
	public dtCancelamento!: Date | null;
	public idUsuarioCancelamento!: number | null;
	public idAbertura!: number | null;
	public cpf!: string | null;
	public nome!: string | null;
	public endereco!: string | null;
	public numero!: string | null;
	public bairro!: string | null;
	public complemento!: string | null;
	public cidade!: string | null;
	public uf!: string | null;
	public cep!: string | null;
	public telefone!: string | null;
	public faturada!: number | null;
	public entregaFutura!: number | null;
	public marcaModelo!: string | null;
	public placa!: string | null;
	public km!: string | null;
	public vlrFrete!: number | null;
	public idMontador!: number | null;
	public marcaModelo2!: string | null;
	public marcaModelo3!: string | null;
	public placa2!: string | null;
	public placa3!: string | null;
	public km2!: string | null;
	public km3!: string | null;
	public dtAlteracao!: Date | null;
	public idUsuarioAlteracao!: number | null;
	public condicoesPagto!: string | null;
	public retirado!: string | null;
	public situacao!: string | null;
	public entregaApp!: number | null;
	public levarApp!: number | null;
	public acompanhamentoApp!: number | null;
	public margemLucro?: number | null;

	declare itensVenda?: NonAttribute<Array<ItemVendaAttributes>>;
	declare operador?: AtributosFuncionario

	declare static associations: {
		itensVenda: Association<Venda, ItemVenda>,
		operador: Association<Venda, Funcionario>
	}
}

export { Venda }