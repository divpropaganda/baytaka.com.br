const port = 5174;
Bun.serve({
  port,
  fetch(req) {
    let path = new URL(req.url).pathname;
    if (path === "/" || path === "") path = "/index.html";
    const file = Bun.file("." + path);
    return new Response(file);
  },
});
console.log(`Baytaka rodando em http://localhost:${port} e http://baytaka.localhost:${port}`);
