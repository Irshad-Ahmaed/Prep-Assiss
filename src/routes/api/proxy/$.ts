import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = process.env.UPSTREAM_API_URL;

async function forward({ request, params }: { request: Request; params: { _splat?: string } }) {
  const path = params._splat ?? "";
  if (!UPSTREAM) {
    throw new Error("UPSTREAM_API_URL is not defined in the environment.");
  }

  const url = new URL(request.url);
  const target = `${UPSTREAM}/${path}${url.search}`;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const ct = request.headers.get("content-type");
  if (auth) headers.set("authorization", auth);
  if (ct) headers.set("content-type", ct);
  headers.set("accept", request.headers.get("accept") ?? "application/json");

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  const upstream = await fetch(target, {
    method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });

  const resHeaders = new Headers();
  const upstreamCt = upstream.headers.get("content-type");
  if (upstreamCt) resHeaders.set("content-type", upstreamCt);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
}

export const Route = createFileRoute("/api/proxy/$")({
  server: {
    handlers: {
      GET: forward,
      POST: forward,
      PUT: forward,
      PATCH: forward,
      DELETE: forward,
      OPTIONS: forward,
    },
  },
});
