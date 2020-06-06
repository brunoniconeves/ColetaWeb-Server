import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController {
  async index (request: Request, response: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item =>{
        return {
            id: item.id,
            name: item.name,
            img_url: `http://localhost:3333/uploads/${item.image}`,
        };
    });

    response.json(serializedItems);
  }
}

export default ItemsController