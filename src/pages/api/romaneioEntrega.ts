import { NextApiRequest, NextApiResponse } from "next";
import { novoRomaneioEntrega, listaTodosRomaneios, getRomaneio } from "@/service/romaneioEntrega";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { method, query, body } = req

        switch (method) {
            case "GET": {
                if (query.id) {
                    const idRomaneio = query.id
                    const romaneio = await getRomaneio(String(idRomaneio))

                    res.status(200).json(romaneio)
                    break
                } else {
                    const listaRomaneios = await listaTodosRomaneios()

                    res.status(200).send(listaRomaneios)
                    break;
                }
            }
            case "POST": {
                try {
                    const dadosRecebidos = JSON.parse(body)

                    console.log("Cheguei")
                    const novoRomaneio = await novoRomaneioEntrega(dadosRecebidos)
                    console.log("Passei")
                    console.log(novoRomaneio)

                    res.status(200).send(novoRomaneio)
                } catch (error) {
                    res.status(400).send(error)
                }
                break;
            }
        }
    } catch (error: any) {
        res.status(400).json({
            error_code: "api_romaneioEntrega",
            message: error.message || error
        })
    }
}

export default handler