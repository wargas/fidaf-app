"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Api from "@/libs/api";
import { filter, get, groupBy, sortBy, sumBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Recolhimento } from "../..";

export const dynamic = 'force-dynamic'

export default function Home() {

  const [data, setData] = useState<any[]>([])
  const [key, setKey] = useState("total");

  // const data = Array.from({ length: 12 }).map((_, i) => ({ mes: i + 1, iss: Math.random() * 1000, iptu: 500 }))

  const config = {
    2025: {
      color: 'var(--chart-1)'
    },
    2026: {
      color: 'var(--chart-2)'
    }
  } satisfies ChartConfig

  async function updateData() {
    const request = await Api.get<Recolhimento>(`recolhimentos`, {
      params: {
        inicio: '2025-01-01',
        fim: '2026-12-31'
      }
    })



    setData(
      sortBy(
        Object.values(
          groupBy(
            request.data.map(item => {
              return { ...item, ano: item.data.substring(0, 4), mes: item.data.substring(5, 7) }
            }),
            "mes")
        )
          .map(itemsOfMonth => {
            return {
              mes: itemsOfMonth[0].mes,
              iss_corrente: sumBy(filter(itemsOfMonth, { "imposto": "ISS", ano: "2026" }), "corrigido"),
              iptu_corrente: sumBy(filter(itemsOfMonth, { "imposto": "IPTU", ano: "2026" }), "corrigido"),
              itbi_corrente: sumBy(filter(itemsOfMonth, { "imposto": "ITBI", ano: "2026" }), "corrigido"),
              acrescimos_corrente: sumBy(filter(itemsOfMonth, { "imposto": "JUROS MULTAS", ano: "2026" }), "corrigido"),
              total_corrente: sumBy(filter(itemsOfMonth, { ano: "2026" }), "corrigido"),
              iss_anterior: sumBy(filter(itemsOfMonth, { "imposto": "ISS", ano: "2025" }), "corrigido"),
              iptu_anterior: sumBy(filter(itemsOfMonth, { "imposto": "IPTU", ano: "2025" }), "corrigido"),
              itbi_anterior: sumBy(filter(itemsOfMonth, { "imposto": "ITBI", ano: "2025" }), "corrigido"),
              acrescimos_anterior: sumBy(filter(itemsOfMonth, { "imposto": "JUROS MULTAS", ano: "2025" }), "corrigido"),
              total_anterior: sumBy(filter(itemsOfMonth, { ano: "2025" }), "corrigido"),

            }
          }), "mes"
      )
    )
  }

  const selectedData = useMemo(() => {
    return data.map(item => {
      return {
        mes: item.mes,
        mesString: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][parseInt(item.mes) - 1],
        2026: get(item, `${key}_corrente`, 0),
        2025: get(item, `${key}_anterior`, 0),
      }
    })
  }, [data, key])

  useEffect(() => {
    updateData()
  }, [])

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">

            <div>

              <CardTitle>Arrecadação mensal</CardTitle>
              <CardDescription>Detalha a Arrecadação durante os 12 meses do ano</CardDescription>
            </div>

            <Select onValueChange={setKey} value={key}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="iss">ISS</SelectItem>
                <SelectItem value="iptu">IPTU</SelectItem>
                <SelectItem value="itbi">ITBI</SelectItem>
                <SelectItem value="acrescimos">Juros/Multas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={config} className="max-h-80 w-full" >
            <BarChart barGap={2} data={selectedData}>
              <Bar dataKey={`2025`} fill="var(--color-2025)" radius={4} />
              <Bar dataKey={`2026`} fill="var(--color-2026)" radius={4} />
              <XAxis dataKey={"mesString"} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={t => Number(t / 1000 / 1000).toFixed(1) + "M"} type="number" axisLine={false} tickLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend />

            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>



    </div>
  );
}
