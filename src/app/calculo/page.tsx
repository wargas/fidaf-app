import Api from "@/libs/api"
import { sumBy } from "lodash"
import { Resumo } from "../../.."

const { format } = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: "BRL" })

export default async function PageCalculo({ searchParams }: { searchParams: any }) {

    const mes = parseInt(searchParams.mes || "1")

    const { data } = await Api.get<Resumo[]>('resumo')

    const receitas = data.map(r => ({ ...r, mesInt: parseInt(r.mes.substring(5)) }))
        .map(r => ({ ...r, nominal: parseFloat(r.nominal), corrigido: parseFloat(r.corrigido) }))
        .filter(r => r.mesInt <= mes)

    const anterior = receitas?.filter(r => r.mes.startsWith('2024'))
    const corrente = receitas?.filter(r => r.mes.startsWith('2025'))

    const anteriorNominal = sumBy(anterior, 'nominal')
    const correnteNominal = sumBy(corrente, 'nominal')
    const anteriorCorrigido = sumBy(anterior, 'corrigido')
    const correnteCorrigido = sumBy(corrente, 'corrigido')

    let incremento = correnteCorrigido - anteriorCorrigido

    if (incremento < 0) {
        incremento = 0
    }

    const incrementPercent = incremento / anteriorCorrigido;

    let percent = 0.1

    if(incrementPercent >= 0.1) {
        percent = 0.15
    }

    if(incrementPercent >= 0.06 && incrementPercent < 0.1) {
        percent = 0.125
    }

    const premioFidaf = incremento * percent * 0.8

    const pontos = 513.9

    const valorAuditor = premioFidaf / pontos * 3

    const valorAnalista = premioFidaf / pontos * 2.1

    return <div className="p-4">
        <form className="flex gap-2" action="">
            <select className="select select-bordered" defaultValue={mes} name="mes" >
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
            </select>
            <button className="btn" type="submit">Enviar</button>
        </form>

        <div className="shadow bg-white rounded-box flex py-4 mt-4">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th className="text-right">2024</th>
                        <th className="text-right">2025</th>
                    </tr>
                </thead>
                <tbody className="text-xs">
                    <tr>
                        <td>Receita nominal</td>
                        <td className="text-right">{format(anteriorNominal)}</td>
                        <td className="text-right">{format(correnteNominal)}</td>
                    </tr>
                    <tr>
                        <td>Receita corrigida</td>
                        <td className="text-right">{format(anteriorCorrigido)}</td>
                        <td className="text-right">{format(correnteCorrigido)}</td>
                    </tr>
                    <tr>
                        <td>Incremento</td>
                        <td className="text-right" colSpan={2}>{format(incremento)}</td>
                    </tr>
                    <tr>
                        <td>Incremento %</td>
                        <td className="text-right" colSpan={2}>{(incrementPercent*100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td>Porcentagem aplicada</td>
                        <td className="text-right" colSpan={2}>{(percent*100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td>Prêmio FIDAF</td>
                        <td className="text-right" colSpan={2}>{format(premioFidaf)}</td>
                    </tr>
                    <tr>
                        <td>Por auditor</td>
                        <td className="text-right" colSpan={2}>{format(valorAuditor)}</td>
                    </tr>
                    <tr>
                        <td>Por analista</td>
                        <td className="text-right" colSpan={2}>{format(valorAnalista)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}
