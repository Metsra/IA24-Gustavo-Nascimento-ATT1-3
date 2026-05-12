import { ToDo, Item } from './core.ts';

const file = process.argv[2];
const command = process.argv[3];

if (!file) {
  console.error("Por favor, forneça o caminho do arquivo (ex: data.temp.json).");
  process.exit(1);
}

const todo = new ToDo(file);

if (command === "add") {
  const itemDescription = process.argv[4];
  
  if (!itemDescription) {
    console.error("Por favor, forneça uma descrição para o item.");
    process.exit(1);
  }

  const item = new Item(itemDescription);
  await todo.addItem(item);
  console.log(`Item "${itemDescription}" adicionado com sucesso!`);
  process.exit(0);
}

if (command === "list") {
  const items = await todo.getItems();

  if (items.length === 0) {
    console.log("Nenhum item na lista.");
    process.exit(0);
  }

  console.log("Lista de itens:");
  items.forEach((item, index) => console.log(`- ${index}: ${item.toJSON().description}`));
  process.exit(0);
}

if (command === "update") {
  const indexString = process.argv[4];
  const newDescription = process.argv[5];

  const index = parseInt(indexString, 10);

  if (isNaN(index)) {
    console.error("Por favor, forneça um número de índice válido.");
    process.exit(1);
  }
  if (!newDescription) {
    console.error("Por favor, forneça a nova descrição do item.");
    process.exit(1);
  }

  try {
    const newItem = new Item(newDescription);
    await todo.updateItem(index, newItem);
    console.log(`Item na posição ${index} atualizado com sucesso!`);
    process.exit(0);
  } catch (error: any) {
    console.error(`Erro ao atualizar: ${error.message}`);
    process.exit(1);
  }
}

if (command === "remove") {
  const indexString = process.argv[4];
  const index = parseInt(indexString, 10);

  if (isNaN(index)) {
    console.error("Por favor, forneça o índice do item que deseja remover.");
    process.exit(1);
  }

  try {
    await todo.removeItem(index);
    console.log(`Item na posição ${index} removido com sucesso!`);
    process.exit(0);
  } catch (error: any) {
    console.error(`Erro ao remover: ${error.message}`);
    process.exit(1);
  }
}

console.error("Comando desconhecido. Use 'add', 'list', 'update' ou 'remove'.");
process.exit(1);