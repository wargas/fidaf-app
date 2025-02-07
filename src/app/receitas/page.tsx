import Api from "@/libs/api";
import { numberFormat } from "@/libs/intl";
import { Fragment } from "react";
import { Resumo } from "../../..";

export const dynamic = 'force-dynamic'

export default async function ReceitasPage() {

  const { data } = await Api.get<Resumo[]>('resumo')

  function getValor(mes: string, imposto: string = "") {
    if(imposto == "") {
      const valor = data.filter(r => r.mes == mes)
        .reduce((acc, m) => {
          return acc + parseFloat(m.corrigido)
        }, 0)

        return numberFormat.format(valor)
    }

    return numberFormat.format(parseFloat(data.find(i => i.mes == mes && i.imposto == imposto)?.corrigido || '0'))
  }

  return (
    <div className="m-4 py-4 rounded-box bg-white shadow overflow-x-auto">

      <table className="table z-0 table-zebra">
        <thead>
          <tr>
            <th rowSpan={2} className="border-r">MES</th>
            <th colSpan={5} className="border-r text-center">2024</th>
            <th colSpan={5} className="text-center">2025</th>
          </tr>
          <tr>
            <th>ISS</th>
            <th>IPTU</th>
            <th>ITBI</th>
            <th>Juros/Multas</th>
            <th className="border-r">Total</th>
            <th>ISS</th>
            <th>IPTU</th>
            <th>ITBI</th>
            <th>Juros/Multas</th>
            <th className="border-r">Total</th>
          </tr>
        </thead>
        <tbody className="text-xs" >
          {Array(12).fill("").map((_, i) => String(i + 1).padStart(2, '0')).map(mes => (
            <tr key={mes}>
              <td className="border-r">{mes}</td>
              {["2024", "2025"].map(ano => (
                <Fragment key={ano}>
                  <td>{ getValor(`${ano}-${mes}`, 'ISS') }</td>
                  <td>{ getValor(`${ano}-${mes}`, 'IPTU') }</td>
                  <td>{ getValor(`${ano}-${mes}`, 'ITBI') }</td>
                  <td>{ getValor(`${ano}-${mes}`, 'JUROS MULTAS') }</td>
                  <td className="border-r">{ getValor(`${ano}-${mes}`, '') }</td>
                </Fragment>
              ))}
            </tr>
          ))}
        </tbody>
        <caption className="caption-bottom text-end">* valores corrigidos pelo IPCA-E</caption>
      </table>

    </div>
  );
}
