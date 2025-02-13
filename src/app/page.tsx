import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function Home() {

  redirect('/calculo')

  return (
    <div className="mt-4">

      
    </div>
  );
}
