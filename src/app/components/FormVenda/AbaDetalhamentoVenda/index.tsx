import { IVenda } from "@/app/interfaces";
import styles from "./index.module.css";
import moment from "moment";
import { GroupBox } from "../../GroupBox";

interface AbaDadosVendaProps {
  dadosVenda: IVenda;
  exibirCustosMargem: boolean;
}

function AbaDetalhamentoVenda({ dadosVenda, exibirCustosMargem }: AbaDadosVendaProps) {

  const percentualAcrescimo = (() => {
    if (!dadosVenda) return 0

    return (Number(dadosVenda.vlrAcrescimo) * 100) / Number(dadosVenda.vlrBruto)
  })()

  const percentualDesconto = (() => {
    if (!dadosVenda) return 0

    return (Number(dadosVenda.vlrDesconto) * 100) / Number(dadosVenda.vlrBruto)
  })()

  // Se não houver dados da venda, retorne null
  if (!dadosVenda) return null

  return (
    <div className={styles.container}>

      <GroupBox title="Detalhes da venda">
        <table className={styles.table_endereco}>
          <thead>
            <th>Tipo de venda</th>
            <th>Data da venda</th>
            <th>Vendedor</th>
          </thead>

          <tbody>
            <td>{!dadosVenda.tipoVenda ? "" : (dadosVenda.tipoVenda == "p") ? "À prazo" : "À vista"}</td>
            <td>{!dadosVenda.dataEmissao ? "" : moment(dadosVenda.dataEmissao!).add(3, "hours").toDate().toLocaleString()}</td>
            <td>{!dadosVenda.operador ? "" : dadosVenda.operador.nomeOperador}</td>
          </tbody>
        </table>
      </GroupBox>

      <GroupBox title="Dados do cliente" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <table className={styles.table_endereco}>
          <thead>
            <th>Cód cliente</th>
            <th>Nome</th>
          </thead>

          <tbody>
            <td>{!dadosVenda.idClientes ? "" : dadosVenda.idClientes}</td>
            <td>{!dadosVenda.nome ? "" : dadosVenda.nome}</td>
          </tbody>
        </table>

        <table className={styles.table_endereco}>
          <thead>
            <th>Endereço</th>
            <th>Número</th>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>CEP</th>
            <th>UF</th>
            <th>Telefone</th>
          </thead>

          <tbody>
            <td>{!dadosVenda.endereco ? "" : dadosVenda.endereco}</td>
            <td>{!dadosVenda.numero ? "" : dadosVenda.numero}</td>
            <td>{!dadosVenda.bairro ? "" : dadosVenda.bairro}</td>
            <td>{!dadosVenda.cidade ? "" : dadosVenda.cidade}</td>
            <td>{!dadosVenda.cep ? "" : dadosVenda.cep}</td>
            <td>{!dadosVenda.uf ? "" : dadosVenda.uf}</td>
            <td>{!dadosVenda.telefone ? "" : dadosVenda.telefone}</td>
          </tbody>
        </table>
      </GroupBox>

      <GroupBox title="Dados do pagamento">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Frete R$</th>
              <th>Subtotal R$</th>
              <th>Desconto R$</th>
              <th>Acréscimo R$</th>
              <th>Total R$</th>
              <th>Vlr recebido R$</th>
              <th>Vlr troco R$</th>
              {(exibirCustosMargem) && <th className={styles.coluna_margem}>Margem %</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>R$ {Number(dadosVenda.vlrFrete).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>R$ {Number(dadosVenda.vlrBruto).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>R$ {Number(dadosVenda.vlrDesconto).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentualDesconto.toFixed(2)}%)</td>
              <td>R$ {Number(dadosVenda.vlrAcrescimo).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentualAcrescimo.toFixed(2)}%)</td>
              <td>R$ {Number(dadosVenda.vlrLiquido).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>R$ {Number(dadosVenda.vlrRecebido).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>R$ {Number(dadosVenda.vlrTroco).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              {(exibirCustosMargem) && <td className={styles.coluna_margem}>{Number(dadosVenda.margemLucro).toFixed(0)}%</td>}
            </tr>
          </tbody>
        </table>
      </GroupBox>

    </div>
  );
};

export { AbaDetalhamentoVenda };
