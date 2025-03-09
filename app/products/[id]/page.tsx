export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default async function Page({params}: { params: Promise<{id: string}> }) {
  const {id} = await params;
  return (
      <div className="min-h-screen flex items-center justify-center text-center justify-center">
          Product id {id} shown.
      </div>
  )
}