const TTL_MS = 24 * 60 * 60 * 1000;

// curl -T usually sends no Content-Type, so infer one from the file name.
const MIME = {
  txt: "text/plain; charset=utf-8",
  log: "text/plain; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  json: "application/json",
  html: "text/html; charset=utf-8",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  zip: "application/zip",
  gz: "application/gzip",
  tar: "application/x-tar",
};

// Only these render in the browser; everything else is served as a download,
// so nobody can host a live HTML/SVG/JS page on dump.bihari.xyz.
const INLINE_OK = new Set([
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
]);

function inferType(key, provided) {
  if (provided && provided !== "application/octet-stream") return provided;
  const ext = key.includes(".") ? key.split(".").pop().toLowerCase() : "";
  return MIME[ext] || "application/octet-stream";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "PUT") {
      try {
        const fileName = path.split("/").pop() || "file";
        const contentType = inferType(fileName, request.headers.get("content-type"));
        await env.cumdump.put(fileName, request.body, { httpMetadata: { contentType } });
        const fileUrl = `${url.origin}/files/${fileName}`;

        return new Response(
          `   ∧,,,∧\n(  ̳• · • ̳)     wget ${fileUrl}\n/    づ♡`,
          { headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
      } catch (err) {
        return new Response("Upload failed", { status: 500 });
      }
    }

    if (path.startsWith("/files/")) {
      const key = path.split("/files/")[1];
      if (!key) return new Response("Not found", { status: 404 });

      const file = await env.cumdump.get(key);
      // Treat anything past its 24h as gone even if the hourly sweep hasn't run yet.
      if (!file || Date.now() - file.uploaded.getTime() > TTL_MS) {
        return new Response("Not found", { status: 404 });
      }

      const headers = new Headers();
      file.writeHttpMetadata(headers);
      if (!headers.has("Content-Type")) headers.set("Content-Type", inferType(key, null));
      headers.set("etag", file.httpEtag);
      headers.set("X-Content-Type-Options", "nosniff");

      const baseType = headers.get("Content-Type").split(";")[0].trim().toLowerCase();
      if (!INLINE_OK.has(baseType)) {
        headers.set("Content-Disposition", `attachment; filename="${key.replace(/["\\]/g, "_")}"`);
      }

      return new Response(file.body, { headers });
    }

    return new Response("Not found", { status: 404 });
  },

  // Hourly cron (see wrangler.jsonc): delete everything older than 24h, which
  // is what the README and landing page promise.
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(deleteExpired(env));
  },
};

async function deleteExpired(env) {
  const now = Date.now();
  const expired = [];
  let cursor;
  do {
    const page = await env.cumdump.list({ cursor, limit: 1000 });
    for (const obj of page.objects) {
      if (now - obj.uploaded.getTime() > TTL_MS) expired.push(obj.key);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  // R2 delete() takes at most 1000 keys per call.
  for (let i = 0; i < expired.length; i += 1000) {
    await env.cumdump.delete(expired.slice(i, i + 1000));
  }
  return expired.length;
}
