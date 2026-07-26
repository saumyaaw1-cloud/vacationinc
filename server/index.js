const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function assetName(pathname) {
  if (pathname === "/" || pathname === "") return "index.html";
  return pathname.replace(/^\/+/, "");
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (env?.ASSETS?.fetch) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) return response;
    }

    const url = new URL(request.url);
    const name = assetName(url.pathname);

    if (name === "index.html") {
      return new Response(
        "<!doctype html><title>Saumya × Vacation</title><p>The application is warming up.</p>",
        { headers: { "content-type": contentTypes[".html"] } },
      );
    }

    const extension = name.slice(name.lastIndexOf("."));
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": contentTypes[extension] || "text/plain; charset=utf-8" },
    });
  },
};
