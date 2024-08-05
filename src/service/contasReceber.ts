import { receberClientes } from "../database/models/_associations"
import { receber, auxBaixas } from "@/database/models"
import moment from "moment"

export interface IClienteDevedor {
    nome: string;
    valor: number;
}

export interface IContasReceber {
    receberTotal: {
        total: number;
        clientes: Array<IClienteDevedor>
    };
    receberExcetoPerdidos: {
        total: number;
        clientes: Array<IClienteDevedor>
    };
    receberVencidos30d: {
        total: number;
        clientes: Array<IClienteDevedor>
    };
    receberPerdidos: {
        total: number;
        clientes: Array<IClienteDevedor>
    };
    clientesHaver: {
        total: number;
        clientes: Array<IClienteDevedor>
    };
}

export async function listaClientesComDebito() {
    const listaContasReceber: IContasReceber = {
        receberTotal: { total: 0, clientes: [] },
        receberExcetoPerdidos: { total: 0, clientes: [] },
        receberVencidos30d: { total: 0, clientes: [] },
        receberPerdidos: { total: 0, clientes: [] },
        clientesHaver: { total: 0, clientes: [] }
    }

    const listaClientes = await receberClientes.findAll({
        include: {
            model: receber,
            attributes: ["vlrParcela", "dataEmissao", "dataVencimento"],
            as: "listaDebito",
            where: {
                quitado: 0,
                cancelada: 0
            },
            include: [{
                model: auxBaixas,
                attributes: ["vlrLiquido"],
                as: "baixasParciais"
            }]
        },
        order: [["nome", "ASC"]]
    })

    for (const cliente of listaClientes) {
        let totalCliente = 0
        let totalClienteVencidas30d = 0

        for (const contaReceber of cliente.listaDebito!) {
            const recebivelVencido = moment(Date.now()).diff(moment(contaReceber.dataVencimento), "days") > 30
            
            totalCliente += contaReceber.vlrParcela
            totalClienteVencidas30d += (recebivelVencido) ? contaReceber.vlrParcela : 0
            
            for (const payment of contaReceber.baixasParciais!) {
                totalCliente -= payment.vlrLiquido
                totalClienteVencidas30d -= (recebivelVencido) ? payment.vlrLiquido : 0
            }
        }

        if (totalCliente > 0) {
            listaContasReceber.receberTotal.clientes.push({
                nome: cliente.nome,
                valor: totalCliente
            })

            listaContasReceber.receberTotal.total += totalCliente

            // Inclui na relação que não constam débitos perdidos
            if (!cliente.obs?.includes("#PERDIDOS")) {
                listaContasReceber.receberExcetoPerdidos.clientes.push({
                    nome: cliente.nome,
                    valor: totalCliente
                })

                listaContasReceber.receberExcetoPerdidos.total += totalCliente
            }

        } else if (totalCliente < 0) {
            listaContasReceber.clientesHaver.clientes.push({
                nome: cliente.nome,
                valor: totalCliente
            })

            listaContasReceber.clientesHaver.total += totalCliente
        }

        // Ignora clientes com "#IGNORA_RELATORIO_30D" no campo observações
        if (totalClienteVencidas30d > 0 && !cliente.obs?.includes("#PERDIDOS")) {
            listaContasReceber.receberVencidos30d.clientes.push({
                nome: cliente.nome,
                valor: totalClienteVencidas30d
            })

            listaContasReceber.receberVencidos30d.total += totalClienteVencidas30d
        }

        if (cliente.obs?.includes("#PERDIDOS")) {
            listaContasReceber.receberPerdidos.clientes.push({
                nome: cliente.nome,
                valor: totalCliente
            })

            listaContasReceber.receberPerdidos.total += totalCliente
        }
    }

    return listaContasReceber
}