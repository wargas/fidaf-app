import Api from "@/libs/api"
import { sumBy } from "lodash"
import { Calculo, Resumo } from "../../.."
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FormCalculo } from "@/components/form-calculo"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { numberFormat, percentFormat } from "@/libs/intl"

// const { format } = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: "BRL" })

export default async function PageCalculo({ searchParams }: { searchParams: any }) {

    const inicio = searchParams.inicio || format(new Date("2025-01-01 03:00:01"), 'y-MM-dd')
    const fim = searchParams.fim || format(new Date(), 'y-MM-dd')

    const { data } = await Api.get<Calculo>(`calculo`, {
        params: {
            inicio, fim
        }
    })


    return (
        <Card className="mt-4">
            <CardHeader>
                <FormCalculo inicio={inicio} fim={fim} />
            </CardHeader>
            <CardContent>
                <Table className="w-full max-w-screen-md">
                    <TableBody>
                        <TableRow>
                            <TableHead>Receita 2025</TableHead>
                            <TableCell className="text-end font-bold">{numberFormat.format(data.curr.corrigida)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Receita 2024</TableHead>
                            <TableCell className="text-end font-bold">{numberFormat.format(data.prev.corrigida)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Incremento ({percentFormat.format(data.incremento.porcentagem)})</TableHead>
                            <TableCell className="text-end font-bold">{numberFormat.format(data.incremento.valor)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Prêmio ({percentFormat.format(data.premio.porcentagem)})</TableHead>
                            <TableCell className="text-end font-bold">{numberFormat.format(data.premio.valor)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Valor Auditor</TableHead>
                            <TableCell className="text-end font-bold">{numberFormat.format(data.distribuicao.auditor)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Valor Analista</TableHead>
                            <TableCell className="text-end font-bold">{numberFormat.format(data.distribuicao.analista)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
