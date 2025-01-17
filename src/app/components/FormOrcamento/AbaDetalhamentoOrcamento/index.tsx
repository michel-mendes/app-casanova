import styles from "./index.module.css";
import moment from "moment";
import { GroupBox } from "../../GroupBox";
import { OrcamentoAttributes } from "@/database/models/orcamentos/Orcamento";

interface AbaDadosOrcamentoProps {
  dadosOrcamento: OrcamentoAttributes;
  exibirCustosMargem: boolean;
}

function AbaDetalhamentoOrcamento({ dadosOrcamento, exibirCustosMargem }: AbaDadosOrcamentoProps) {

  const percentualAcrescimo = (() => {
    if (!dadosOrcamento) return 0

    return (Number(dadosOrcamento.vlrAcrescimo) * 100) / Number(dadosOrcamento.vlrBruto)
  })()

  const percentualDesconto = (() => {
    if (!dadosOrcamento) return 0

    return (Number(dadosOrcamento.vlrDesconto) * 100) / Number(dadosOrcamento.vlrBruto)
  })()

  // Se não houver dados da venda, retorne null
  if (!dadosOrcamento) return null

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
            <td>{!dadosOrcamento.tipoOrcamento ? "" : (dadosOrcamento.tipoOrcamento == "p") ? "À prazo" : "À vista"}</td>
            <td>{!dadosOrcamento.dataEmissao ? "" : moment(dadosOrcamento.dataEmissao!).add(3, "hours").toDate().toLocaleString()}</td>
            <td>{!dadosOrcamento.operador ? "" : dadosOrcamento.operador.nomeOperador}</td>
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
            <td>{!dadosOrcamento.idClientes ? "" : dadosOrcamento.idClientes}</td>
            <td>{!dadosOrcamento.clienteNome ? "" : dadosOrcamento.clienteNome}</td>
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
            <td>{!dadosOrcamento.clienteEndereco ? "" : dadosOrcamento.clienteEndereco}</td>
            <td>{!dadosOrcamento.clienteNumero ? "" : dadosOrcamento.clienteNumero}</td>
            <td>{!dadosOrcamento.clienteBairro ? "" : dadosOrcamento.clienteBairro}</td>
            <td>{!dadosOrcamento.clienteCidade ? "" : dadosOrcamento.clienteCidade}</td>
            <td>{!dadosOrcamento.clienteCep ? "" : dadosOrcamento.clienteCep}</td>
            <td>{!dadosOrcamento.clienteUF ? "" : dadosOrcamento.clienteUF}</td>
            <td>{!dadosOrcamento.clienteFone ? "" : dadosOrcamento.clienteFone}</td>
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
              {
                (exibirCustosMargem) && (
                  <>
                    <th className={styles.coluna_margem}>Custo total</th>
                    <th className={styles.coluna_margem}>Margem %</th>
                  </>
                )
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>R$ {Number(dadosOrcamento.vlrFrete).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>R$ {Number(dadosOrcamento.vlrBruto).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>R$ {Number(dadosOrcamento.vlrDesconto).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentualDesconto.toFixed(2)}%)</td>
              <td>R$ {Number(dadosOrcamento.vlrAcrescimo).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentualAcrescimo.toFixed(2)}%)</td>
              <td>R$ {Number(dadosOrcamento.vlrLiquido).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              {
                (exibirCustosMargem) && (
                  <>
                    <td className={styles.coluna_margem}>{Number(dadosOrcamento.custoOrcamento).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className={styles.coluna_margem}>{Number(dadosOrcamento.margemLucro).toFixed(0)}%</td>
                  </>
                )
              }
            </tr>
          </tbody>
        </table>
      </GroupBox>

    </div>
  );
};

export { AbaDetalhamentoOrcamento };
