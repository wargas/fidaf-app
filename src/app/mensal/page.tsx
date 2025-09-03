import { FunctionComponent } from "react";
import Api from "@/libs/api";
import { cn, getMeses } from "@/lib/utils";
import { Recolhimento } from "../../..";
import { filter, maxBy, sumBy } from "lodash";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { endOfMonth, formatDate, subDays } from "date-fns";

interface PageMensalProps {
    searchParams: Promise<{
        data_limite: string
    }>
}

const { format } = Intl.NumberFormat('pt-BR', { maximumFractionDigits:2, minimumFractionDigits: 2 })

const PageMensal: FunctionComponent<PageMensalProps> = async ({ searchParams }) => {


    const meses = getMeses()

    const request = await Api.get<Recolhimento>(`recolhimentos`, {
        params: {
            inicio: '2024-01-01',
            fim: '2025-12-31'
        }
    })

    const recolhimentos = request.data
        .filter(r => r.nominal != 0)
        .map(r => ({
            ...r,
            dia: parseInt(r.data.replace(/(\d+)-(\d+)-(\d+)/, "$3")),
            mes: parseInt(r.data.replace(/(\d+)-(\d+)-(\d+)/, "$2")),
            ano: parseInt(r.data.replace(/(\d+)-(\d+)-(\d+)/, "$1")),
            dia_ano: r.data.replace(/(\d+)-(\d+)-(\d+)/, "$2-$3"),
        }))

    const limites = {
        hoje: formatDate(subDays(new Date(), 1), "MM-dd"),
        ultimo: maxBy(filter(recolhimentos, { ano: 2025 }), 'dia_ano')?.dia_ano!,
        mes: formatDate(endOfMonth(new Date()), 'MM-dd'),
        ano: '12-31',
    }

    const { data_limite = limites.hoje } = await searchParams

    const recolhimentosFiltreds = recolhimentos.filter((r) => {
        return data_limite >= r.dia_ano
    })

    const data = meses.map(mes => {
        const valores = {
            anterior: {
                dias: 0,
                iss: 0,
                iptu: 0,
                itbi: 0,
                acrescimos: 0,
                total: 0
            },
            corrente: {
                dias: 0,
                iss: 0,
                iptu: 0,
                itbi: 0,
                acrescimos: 0,
                total: 0
            },
            incremento: 0
        }

        valores.anterior.dias = filter(recolhimentosFiltreds, { ano: 2024, imposto: 'ISS', mes: mes.codigo }).length
        valores.corrente.dias = filter(recolhimentosFiltreds, { ano: 2025, imposto: 'ISS', mes: mes.codigo }).length

        valores.anterior.iss = sumBy(filter(recolhimentosFiltreds, { ano: 2024, imposto: 'ISS', mes: mes.codigo }), 'corrigido')
        valores.corrente.iss = sumBy(filter(recolhimentosFiltreds, { ano: 2025, imposto: 'ISS', mes: mes.codigo }), 'corrigido')

        valores.anterior.iptu = sumBy(filter(recolhimentosFiltreds, { ano: 2024, imposto: 'IPTU', mes: mes.codigo }), 'corrigido')
        valores.corrente.iptu = sumBy(filter(recolhimentosFiltreds, { ano: 2025, imposto: 'IPTU', mes: mes.codigo }), 'corrigido')

        valores.anterior.itbi = sumBy(filter(recolhimentosFiltreds, { ano: 2024, imposto: 'ITBI', mes: mes.codigo }), 'corrigido')
        valores.corrente.itbi = sumBy(filter(recolhimentosFiltreds, { ano: 2025, imposto: 'ITBI', mes: mes.codigo }), 'corrigido')

        valores.anterior.acrescimos = sumBy(filter(recolhimentosFiltreds, { ano: 2024, imposto: 'JUROS MULTAS', mes: mes.codigo }), 'corrigido')
        valores.corrente.acrescimos = sumBy(filter(recolhimentosFiltreds, { ano: 2025, imposto: 'JUROS MULTAS', mes: mes.codigo }), 'corrigido')

        valores.anterior.total = sumBy(filter(recolhimentosFiltreds, { ano: 2024, mes: mes.codigo }), 'corrigido')
        valores.corrente.total = sumBy(filter(recolhimentosFiltreds, { ano: 2025, mes: mes.codigo }), 'corrigido')

        valores.incremento = valores.corrente.total - valores.anterior.total

        return {
            ...mes,
            valores
        }
    }).filter(m => m.valores.anterior.total > 0)


    return (
        <div>
            <Card className="mt-4 text-xs">
                <CardHeader>
                    <div className="text-stone-600 flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'outline'}>
                                    <FilterIcon />
                                    Filtro
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/mensal?data_limite=${limites.ultimo}`}>
                                        Até último recolhimento
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/mensal?data_limite=${limites.hoje}`}>
                                        Até hoje
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={`/mensal?data_limite=${limites.mes}`}>
                                        Até o fim do mês
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={`/mensal?data_limite=${limites.ano}`}>
                                        Até o fim do ano
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </CardHeader>
                <CardContent className="p-0">

                    <Table >
                        <TableCaption>

                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead rowSpan={2} className="text-center text-xs border">Mês</TableHead>
                                <TableHead colSpan={2} className="text-center text-xs border">ISS</TableHead>
                                <TableHead colSpan={2} className="text-center text-xs border">IPTU</TableHead>
                                <TableHead colSpan={2} className="text-center text-xs border">ITBI</TableHead>
                                <TableHead colSpan={2} className="text-center text-xs border">Juros/Multas</TableHead>
                                <TableHead colSpan={2} className="text-center text-xs border">Total</TableHead>
                                <TableHead rowSpan={2} className="text-center text-xs border">Incremento</TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className="border text-center text-xs">2024</TableHead>
                                <TableHead className="border text-center text-xs">2025</TableHead>
                                <TableHead className="border text-center text-xs">2024</TableHead>
                                <TableHead className="border text-center text-xs">2025</TableHead>
                                <TableHead className="border text-center text-xs">2024</TableHead>
                                <TableHead className="border text-center text-xs">2025</TableHead>
                                <TableHead className="border text-center text-xs">2024</TableHead>
                                <TableHead className="border text-center text-xs">2025</TableHead>
                                <TableHead className="border text-center text-xs">2024</TableHead>
                                <TableHead className="border text-center text-xs">2025</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map(d => (
                                <TableRow key={d.codigo}>
                                    <TableCell className="border text-right text-xs">{d.abrev.toUpperCase()}
                                        <span title="Dias Úteis no mês do ano anterior/corrente" className="text-gray-500"> ({d.valores.anterior.dias.toString().padStart(2, '0')}/{d.valores.corrente.dias.toString().padStart(2, '0')})</span>
                                    </TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.iss-d.valores.anterior.iss)} className="border text-right text-xs">{format(d.valores.anterior.iss)}</TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.iss-d.valores.anterior.iss)} className="border text-right text-xs">{format(d.valores.corrente.iss)}</TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.iptu-d.valores.anterior.iptu)} className="border text-right text-xs">{format(d.valores.anterior.iptu)}</TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.iptu-d.valores.anterior.iptu)} className="border text-right text-xs">{format(d.valores.corrente.iptu)}</TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.itbi-d.valores.anterior.itbi)} className="border text-right text-xs">{format(d.valores.anterior.itbi)}</TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.itbi-d.valores.anterior.itbi)} className="border text-right text-xs">{format(d.valores.corrente.itbi)}</TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.acrescimos-d.valores.anterior.acrescimos)} className="border text-right text-xs">{format(d.valores.anterior.acrescimos)}</TableCell>
                                    <TableCell title={"Diferença: "+format(d.valores.corrente.acrescimos-d.valores.anterior.acrescimos)} className="border text-right text-xs">{format(d.valores.corrente.acrescimos)}</TableCell>
                                    <TableCell className="border text-right text-xs">{format(d.valores.anterior.total)}</TableCell>
                                    <TableCell className="border text-right text-xs">{format(d.valores.corrente.total)}</TableCell>
                                    <TableCell className={cn("border text-right text-xs font-bold", {'text-red-600 ': d.valores.incremento < 0})}>
                                        {format(d.valores.incremento)}
                                        <span>{' '}({(d.valores.incremento / d.valores.anterior.total * 100).toFixed(1).replace('.', ',')}%)</span>
                                       
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableHead className="border border-t-2 text-right text-xs">Total</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.anterior.iss'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.corrente.iss'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.anterior.iptu'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.corrente.iptu'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.anterior.itbi'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.corrente.itbi'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.anterior.acrescimos'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.corrente.acrescimos'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.anterior.total'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">{format(sumBy(data, 'valores.corrente.total'))}</TableHead>
                                <TableHead className="border border-t-2 text-right text-xs">
                                    {format(sumBy(data, 'valores.incremento'))}{' '}
                                    <span>{' '}({(sumBy(data, 'valores.incremento') / sumBy(data, 'valores.anterior.total') * 100).toFixed(1).replace('.', ',')}%)</span>
                                    
                                </TableHead>
                            </TableRow>
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </div>
    );
}

export default PageMensal;
