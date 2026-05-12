import { ToDo, Item } from './core.ts';

const todo = new ToDo('data.temp.json');

const cache = new Map<string, Response>();

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (path === '/items' && method === 'GET') {
      const items = await todo.getItems();
      return new Response(JSON.stringify(items), { headers });
    }

    if (path === '/items' && method === 'POST') {
      const body = await req.json();
      const item = new Item(body.description);
      await todo.addItem(item);
      return new Response(JSON.stringify(item), { status: 201, headers });
    }

    if (path.startsWith('/items/')) {
      const index = parseInt(path.split('/')[2]);

      if (method === 'PUT') {
        const body = await req.json();
        const item = new Item(body.description);
        try {
          await todo.updateItem(index, item);
          return new Response(JSON.stringify(item), { headers });
        } catch (error: any) {
          return new Response(error.message, { status: 400, headers });
        }
      }

      if (method === 'DELETE') {
        try {
          await todo.removeItem(index);
          return new Response(null, { status: 204, headers });
        } catch (error: any) {
          return new Response(error.message, { status: 400, headers });
        }
      }
    }

    let filePath = path === '/' ? '/index.html' : path;
    
    if (cache.has(filePath)) {
      console.log(`[CACHE HIT] Servindo da memória: ${filePath}`);
      return cache.get(filePath)!.clone(); 
    }

    const file = Bun.file(`../Front${filePath}`); 
    
    if (await file.exists()) {
      const response = new Response(file);
      cache.set(filePath, response.clone()); 
      console.log(`[CACHE MISS] Arquivo lido do disco e salvo no cache: ${filePath}`);
      return response;
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Servidor rodando em http://localhost:${server.port}`);