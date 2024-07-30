import { Model, Optional, NonAttribute, Association, InferAttributes, InferCreationAttributes } from "sequelize"
import { Receber } from "../receber/Receber";

export class Cliente extends Model<InferAttributes<Cliente, { omit: "listaDebito" }>, InferCreationAttributes<Cliente, { omit: "listaDebito" }>> {
    // export class Cliente extends Model<AtributosCliente, AtributosNovoCliente> {
    declare id: number;
    declare status: number;
    declare nome: string;
    declare endereco: string;
    declare numero: string;
    declare bairro: string;
    declare complemento: string;
    declare cidade: string;
    declare uf: string;
    declare cep: string;
    declare rg: string;
    declare cpf: string;
    declare fone1: string;
    declare fone2: string;
    declare fone3: string;
    declare email: string;
    declare dtCadastro: Date;
    declare dtAlteracao: Date;
    declare idUsuario: number;
    declare limite: number;
    declare obs: string;
    declare dtNascimento: Date;
    declare localTrabalho: string;
    declare foneTrabalho: string;
    declare contatoTrabalho: string;
    declare salario: number;
    declare estadoCivil: string;
    declare pessoa: string;
    declare fantasia: string;
    declare tipoCliente: string;
    declare produtorRural: number;
    declare dtVencimento: number;
    declare diasVenctoVendas: number;
    declare mesa: number;
    declare statusMesa: string;
    declare mensalidade: number;
    declare vlrMensalidade: number;
    declare idRespAberturaMesa: number;
    declare tipoRespAberturaMesa: string;
    declare foneMesa: string;

    declare listaDebito?: NonAttribute<Array<Receber>>

    declare static associations: {
        listaDebito: Association<Cliente, Receber>
    }
}