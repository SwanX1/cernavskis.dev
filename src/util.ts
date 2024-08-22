export function serveStatic(path: URL): (req: Request) => Promise<Response | null>;
export function serveStatic(path: URL, notFound: Response): (req: Request) => Promise<Response>;
export function serveStatic(path: URL, notFound?: Response): (req: Request) => Promise<Response | null> {
  return async req => {
    const url = new URL(req.url);
    
    let pathname = url.pathname;
    
    if (pathname.endsWith("/")) {
      pathname += "index.html";
    }

    pathname = pathname.replace(/^\//, "");

    const filePath = new URL(pathname, path).pathname;

    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    } else {
      return notFound ?? null;
    }
  };
}