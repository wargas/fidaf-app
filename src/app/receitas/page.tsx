import Api from "@/libs/api";
import { Recolhimento } from "../../..";
import { FormReceitas } from "@/components/form-receitas";
import { format, startOfMonth } from "date-fns";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { filter, groupBy, sumBy } from "lodash";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: {
    inicio: string,
    fim: string
  }
}

const currencyFormat = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default async function ReceitasPage({ searchParams }: Props) {

  const inicio = searchParams.inicio || format(startOfMonth(new Date()), 'Y-MM-dd')
  const fim = searchParams.fim || format(new Date(), 'Y-MM-dd')

  const { data } = await Api.get<Recolhimento[]>(`recolhimentos`, {
    params: {
      inicio,
      fim
    }
  })

  const dias = Object.keys(groupBy(data, 'data'))

  const result = dias.map(dia => {

    const issNominal = sumBy(filter(data, { data: dia, imposto: 'ISS' }), 'nominal')
    const issCorrigido = sumBy(filter(data, { data: dia, imposto: 'ISS' }), 'corrigido')

    const iptuNominal = sumBy(filter(data, { data: dia, imposto: 'IPTU' }), 'nominal')
    const iptuCorrigido = sumBy(filter(data, { data: dia, imposto: 'IPTU' }), 'corrigido')

    const itbiNominal = sumBy(filter(data, { data: dia, imposto: 'ITBI' }), 'nominal')
    const itbiCorrigido = sumBy(filter(data, { data: dia, imposto: 'ITBI' }), 'corrigido')

    const acrescimosNominal = sumBy(filter(data, { data: dia, imposto: 'JUROS MULTAS' }), 'nominal')
    const acrescimosCorrigido = sumBy(filter(data, { data: dia, imposto: 'JUROS MULTAS' }), 'corrigido')

    const totalNominal = sumBy(filter(data, { data: dia }), 'nominal')
    const totalCorrigido = sumBy(filter(data, { data: dia }), 'corrigido')

    return {
      data: dia,
      iss: {
        nominal: issNominal,
        corrigido: issCorrigido
      },
      iptu: {
        nominal: iptuNominal,
        corrigido: iptuCorrigido
      },
      itbi: {
        nominal: itbiNominal,
        corrigido: itbiCorrigido
      },
      acrescimos: {
        nominal: acrescimosNominal,
        corrigido: acrescimosCorrigido
      },
      total: {
        nominal: totalNominal,
        corrigido: totalCorrigido
      }
    }

  })

  const totais = {
    iss: {
      nominal: sumBy(filter(data, { imposto: 'ISS' }), 'nominal'),
      corrigido: sumBy(filter(data, { imposto: 'ISS' }), 'corrigido'),
    },
    iptu: {
      nominal: sumBy(filter(data, { imposto: 'IPTU' }), 'nominal'),
      corrigido: sumBy(filter(data, { imposto: 'IPTU' }), 'corrigido'),
    },
    itbi: {
      nominal: sumBy(filter(data, { imposto: 'ITBI' }), 'nominal'),
      corrigido: sumBy(filter(data, { imposto: 'ITBI' }), 'corrigido'),
    },
    acrescimos: {
      nominal: sumBy(filter(data, { imposto: 'JUROS MULTAS' }), 'nominal'),
      corrigido: sumBy(filter(data, { imposto: 'JUROS MULTAS' }), 'corrigido'),
    },
    total: {
      nominal: sumBy(filter(data), 'nominal'),
      corrigido: sumBy(filter(data), 'corrigido'),
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <FormReceitas inicio={inicio} fim={fim} />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border-r border-t" rowSpan={2}>Data</TableHead>
              <TableHead className="border-t border-r" colSpan={2}>ISS</TableHead>
              <TableHead className="border-t border-r" colSpan={2}>IPTU</TableHead>
              <TableHead className="border-t border-r" colSpan={2}>ITBI</TableHead>
              <TableHead className="border-t border-r" colSpan={2}>Juros/Multas</TableHead>
              <TableHead className="border-t border-r" colSpan={2}>Total</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="border-r border-b">Nominal</TableHead>
              <TableHead className="border-r border-b">Corrigido</TableHead>
              <TableHead className="border-r border-b">Nominal</TableHead>
              <TableHead className="border-r border-b">Corrigido</TableHead>
              <TableHead className="border-r border-b">Nominal</TableHead>
              <TableHead className="border-r border-b">Corrigido</TableHead>
              <TableHead className="border-r border-b">Nominal</TableHead>
              <TableHead className="border-r border-b">Corrigido</TableHead>
              <TableHead className="border-r border-b">Nominal</TableHead>
              <TableHead className="border-r border-b">Corrigido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.filter(d => d.total.nominal != 0).map(item => (
              <TableRow key={item.data}>
                <TableCell className="border-r">{item.data}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.iss.nominal)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.iss.corrigido)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.iptu.nominal)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.iptu.corrigido)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.itbi.nominal)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.itbi.corrigido)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.acrescimos.nominal)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.acrescimos.corrigido)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.total.nominal)}</TableCell>
                <TableCell className="border-r">{currencyFormat.format(item.total.corrigido)}</TableCell>

              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="border-r">TOTAL</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.iss.nominal)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.iss.corrigido)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.iptu.nominal)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.iptu.corrigido)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.itbi.nominal)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.itbi.corrigido)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.acrescimos.nominal)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.acrescimos.corrigido)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.total.nominal)}</TableCell>
              <TableCell className="font-bold border-r">{currencyFormat.format(totais.total.corrigido)}</TableCell>

            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
