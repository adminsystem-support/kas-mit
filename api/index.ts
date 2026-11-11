import appModule from "../dist/server.cjs";

const app = (appModule as any).default?.default || (appModule as any).default || appModule;

export default function handler(req: any, res: any) {
  return app(req, res);
}
