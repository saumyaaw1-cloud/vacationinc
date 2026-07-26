import { mkdir, readFile, writeFile } from "node:fs/promises";

const files = {
  "/": {
    body: await readFile("index.html", "utf8"),
    type: "text/html; charset=utf-8",
  },
  "/index.html": {
    body: await readFile("index.html", "utf8"),
    type: "text/html; charset=utf-8",
  },
  "/style.css": {
    body: await readFile("style.css", "utf8"),
    type: "text/css; charset=utf-8",
  },
  "/script.js": {
    body: await readFile("script.js", "utf8"),
    type: "text/javascript; charset=utf-8",
  },
  "/assets/poolside-orientation.jpg": {
    body: (await readFile("assets/poolside-orientation.jpg")).toString("base64"),
    type: "image/jpeg",
    base64: true,
  },
};

const worker = `
const files = ${JSON.stringify(files)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const pathname = new URL(request.url).pathname;
    const file = files[pathname];
    if (!file) return new Response("Not found", { status: 404 });

    const body = request.method === "HEAD"
      ? null
      : file.base64
        ? decodeBase64(file.body)
        : file.body;

    return new Response(body, {
      headers: {
        "content-type": file.type,
        "cache-control": pathname === "/" || pathname === "/index.html"
          ? "no-cache"
          : "public, max-age=86400",
      },
    });
  },
};
`;

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await writeFile("dist/server/index.js", worker);
await writeFile(
  "dist/.openai/hosting.json",
  await readFile(".openai/hosting.json", "utf8"),
);
