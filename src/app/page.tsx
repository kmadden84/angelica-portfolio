import { getAllPageData } from "@/lib/contentful/queries";
import { ClientPage } from "@/components/ClientPage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageData = Awaited<ReturnType<typeof getAllPageData>>;

export default async function Home() {
  const data = await getAllPageData();

  return <ClientPage data={data} />;
}
