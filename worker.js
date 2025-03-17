export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "PUT") {
      try {
        const fileName = path.split("/").pop() || "file";
        await env.cumdump.put(fileName, request.body);
        const fileUrl = `${url.origin}/files/${fileName}`;
        
        return new Response(
          `   ∧,,,∧\n(  ̳• · • ̳)     wget ${fileUrl}\n/    づ♡`,
          { headers: { "Content-Type": "text/plain" } }
        );
        
      } catch (err) {
        return new Response("Upload failed", { status: 500 });
      }
    }

    if (path.startsWith("/files/")) {
      const file = await env.cumdump.get(path.split("/files/")[1]);
      return file ? new Response(file.body) : new Response("Not found", { status: 404 });
    }

    return new Response("Not found", { status: 404 });
  }
};
