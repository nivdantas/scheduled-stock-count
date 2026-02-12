import ContagemPage from "@/app/components/ContagemPage";
import { Contagem } from "@/app/types/contagem";

const baseUrl =
  typeof window === "undefined"
    ? "http://backend:3000"
    : "http://localhost:3000";

async function getContagem(id: string): Promise<Contagem> {
  const res = await fetch(`${baseUrl}/contagens/${id}`, {
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function PaginaContagem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getContagem(id);

  return <ContagemPage data={data} />;
}
