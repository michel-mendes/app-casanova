import { pagar } from "@/database/models";
import { Fornecedor } from "@/database/models/fornecedores/Fornecedor";
import { PlanoContas } from "@/database/models/planoContas/PlanoContas";
import moment from "moment";
import { col, fn, Op, where } from "sequelize";
import { Where } from "sequelize/lib/utils";

export async function listaContasPagar(startDate: string, endDate: string, searchTerm: string) {
    try {
        const start = moment(startDate).startOf("day").subtract(3, "hour").toISOString();
        const end = moment(endDate).startOf("day").subtract(3, "hour").toISOString();

        const listaPagar = await pagar.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            ...geraListaTermosPesquisa("documento", searchTerm),
                            ...geraListaTermosPesquisa("$fornecedor.razao$", searchTerm),
                            ...geraListaTermosPesquisa("historico", searchTerm),
                        ],
                    },
                    {
                        quitado: 0,
                        dtVencimento: {
                            [Op.gte]: start,
                            [Op.lte]: end,
                        },
                    },
                ],
            },
            include: [
                {
                    model: PlanoContas,
                    as: "planoContas",
                },
                {
                    model: Fornecedor,
                    attributes: ["razao"],
                    as: "fornecedor",
                },
            ],
            order: [["dtVencimento", "ASC"]],
        });

        return listaPagar;
    } catch (error: any) {
        throw new Error(`Falha ao listar contas a pagar: ${error.message}`);
    }
}



// Helpers
function geraListaTermosPesquisa(campo: string, searchTerm: string) {
    const termos = searchTerm.split(" ");

    return termos.map((termo) => ({
        [campo]: { [Op.like]: `%${termo}%` },
    }));
}