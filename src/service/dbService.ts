import { clientes } from "@/database/models";

export async function listaClientes() {
    const listaClientes = await clientes.findAll()
    return listaClientes
}