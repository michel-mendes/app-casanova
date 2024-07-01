import { Association, CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { ItemVenda } from "../itensVenda/ItemVenda";

export class Venda extends Model<InferAttributes<Venda, {omit: "itensVenda"}>, InferCreationAttributes<Venda, {omit: "itensVenda"}>> {
    declare id: CreationOptional<number>;
	declare dataEmissao: Date;
	declare vlrBruto: number;
	declare vlrDesconto: number;
	declare vlrLiquido: number;
	declare vlrRecebido: number;
	declare vlrTroco: number;
	declare idClientes: number;
	declare idCfe: number;
	declare idCupomFiscal: number;
	declare tipoVenda: string;
	declare idCaixa: number;
	declare idOperador: number;
	declare cancelado: number;
	declare obs: string;
	declare idFormaPagamentos: number;
	declare vlrAcrescimo: number;
	declare idNFe: number;
	declare justificativa: string;
	declare dtCancelamento: Date;
	declare idUsuarioCancelamento: number;
	declare idAbertura: number;
	declare cpf: string;
	declare nome: string;
	declare endereco: string;
	declare numero: string;
	declare bairro: string;
	declare complemento: string;
	declare cidade: string;
	declare uf: string;
	declare cep: string;
	declare telefone: string;
	declare faturada: number;
	declare entregaFutura: number;
	declare marcaModelo: string;
	declare placa: string;
	declare km: string;
	declare vlrFrete: number;
	declare idMontador: number;
	declare marcaModelo2: string;
	declare marcaModelo3: string;
	declare placa2: string;
	declare placa3: string;
	declare km2: string;
	declare km3: string;
	declare dtAlteracao: Date;
	declare idUsuarioAlteracao: number;
	declare condicoesPagto: string;
	declare retirado: string;
	declare situacao: string;
	declare entregaApp: number;
	declare levarApp: number;
	declare acompanhamentoApp: number;
	declare margemLucro?: number;

	declare itensVenda?: NonAttribute<ItemVenda[]>

	declare static associations: {
		itensVenda: Association<Venda, ItemVenda>
	}

    // static associate(models: any) {
    // 	Pagar.belongsTo(models.Fornecedor, {foreignKey: "idFornecedor"})
    // }
}