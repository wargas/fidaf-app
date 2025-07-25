import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Api from "@/libs/api";
import { IPCA } from "../../..";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormIpca } from "@/components/form-ipca";

export default async function IpcaPage() {

    const { data } = await Api.get<IPCA[]>("ipca")



    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>IPCA</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col divide-y">
                    {data.map(item => (
                        <FormIpca key={item.id} item={item} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}