import todo from "./core.ts"; // módulo com funções da lista (get, add, update, remove)

const server = Bun.serve({
  port: 3000, // porta do servidor

  routes: {
    "/": new Response(Bun.file("./public/index.html")), // retorna HTML

    "/api/todo": {
      GET: async () => {
        const items = await todo.getItems(); // pega todos itens
        return Response.json(items);
      },

      POST: async (req) => {
        const data = await req.json();
        const item = data.item || null;
        if (!item) // valida item
          return Response.json('Forneça um item.', { status: 400 });
        await todo.addItem(item); // adiciona item
        return Response.json(data);
      },
    },

    "/api/todo/:index": {
      PUT: async (req) => {
        const index = parseInt(req.params.index); // pega índice
        if (isNaN(index))
          return Response.json('Índice inválido.', { status: 400 });

        const data = await req.json();
        const newItem = data.newItem || null;
        if (!newItem)
          return Response.json('Forneça novo item.', { status: 400 });

        try {
          await todo.updateItem(index, newItem); // atualiza item
          return Response.json(`Item ${index} atualizado.`);
        } catch (error: any) {
          return Response.json(error.message, { status: 400 });
        }
      },

      DELETE: async (req) => {
        const index = parseInt(req.params.index); // pega índice
        if (isNaN(index))
          return Response.json('Índice inválido.', { status: 400 });

        try {
          await todo.removeItem(index); // remove item
          return Response.json(`Item ${index} removido.`);
        } catch (error: any) {
          return Response.json(error.message, { status: 400 });
        }
      },
    },

    // rotas de exemplo

    "/api/exemplo": {
      GET: () => {
        return new Response(`Exemplo: ${Date.now()}`); // retorna timestamp
      },

      POST: async (req) => {
        const data = await req.json();
        data.recebidoEm = new Date().toLocaleDateString("pt-BR"); // adiciona data
        return Response.json(data);
      },
    },

    "/api/exemplo/:id": {
      PUT: async (req) => {
        const { id } = req.params;
        const data = await req.json();
        data.id = id; // define id
        data.recebidoEm = new Date().toLocaleDateString("pt-BR");
        return Response.json(data);
      },

      PATCH: async (req) => {
        const { id } = req.params;
        const data = await req.json();
        data.chavesAtualizadas = Object.keys(data); // mostra campos alterados
        data.id = id;
        data.atualizadoEm = new Date().toLocaleDateString("pt-BR");
        return Response.json(data);
      },

      DELETE: (req) => {
        const { id } = req.params;
        return new Response(`ID ${id} deletado`); // simula delete
      }
    }
  },

  async fetch(req) {
    return new Response(`Not Found`, { status: 404 }); // fallback 404
  },
});

console.log(`Server running at http://localhost:${server.port}`); // log servidor
