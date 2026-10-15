import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Grava o vídeo gerado pelo /design-slide-motion/record em renders/.
// Só existe em desenvolvimento: em produção isso seria escrita arbitrária de arquivo.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const requested = new URL(request.url).searchParams.get("name") ?? "render.webm";
  const name = path.basename(requested);
  if (!/^[\w.-]+\.(webm|mp4|gif)$/.test(name)) {
    return Response.json({ error: "nome inválido" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "renders");
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await request.arrayBuffer());
  await writeFile(path.join(dir, name), bytes);

  return Response.json({ ok: true, path: `renders/${name}`, bytes: bytes.length });
}
