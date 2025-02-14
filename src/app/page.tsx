import { InputDate } from "@/components/input-date";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function Home() {

  redirect('/calculo')

  return (
    <div className="mt-4">
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="w-52">
            <InputDate value={'2025-11-21'} />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
