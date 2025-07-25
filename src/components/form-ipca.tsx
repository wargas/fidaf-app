'use client'
import { useEffect, useState } from "react";
import { IPCA } from "../..";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Api from "@/libs/api";
import axios from "axios";
import { useRouter } from "next/navigation";


export function FormIpca({ item }: { item: IPCA }) {


    const [data, setData] = useState<IPCA>(item)
    const router = useRouter()

    async function update() {
        await axios.post("https://api-fidaf.deltex.com.br/ipca", {
            mes: data.mes,
            indice: parseFloat(data.indice)
        })

        router.refresh()
    }

    return (
        <div className="flex py-2 px-4 gap-4">
            <div>{item.mes}</div>
            <div>
                <Input name="indice" onChange={(ev) => setData(d => ({ ...d, indice: ev.target.value }))} value={data.indice} />
            </div>
            <div>
                <Button onClick={update}>Salvar</Button>
            </div>
        </div>
    )
}