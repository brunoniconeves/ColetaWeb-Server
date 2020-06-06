import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {


    // Show a specific collect point
    async show (request: Request, response: Response){
      const { id } = request.params;

      const point = await knex('points').where('id', id).first();

      if (!point) {
        return response.status(400).json({message: 'Point not found.'});
      }

      const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.id')
        .where('point_items.point_id', id)
        .select('items.title');

      return response.json({point, items});
    }

    // List collect points
    async index (request: Request, response: Response){
      //get filters from query params
      const { city, uf, items } = request.query;

      const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

      const points = await knex('points')
        .join('point_items', 'points.id', 'point_items.point_id')
        .orWhereIn('point_items.item_id', parsedItems)
        .orWhere('city', String(city))
        .orWhere('uf', String(uf))
        .distinct()
        .select('points.*');

      return response.json(points);
    }

    // Create colect points
    async create (request: Request, response: Response) {   

      const {
          name,
          email,
          whatsapp,
          lat, 
          long,
          city,
          uf,
          items
      } = request.body; 
  
      const trx = await knex.transaction();
  
      const point = {
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
        name,
        email,
        whatsapp,
        lat, 
        long,
        city,
        uf     
      }
      
      const insertedIds = await trx('points').insert(point);
  
      const point_id = insertedIds[0];
  
      const pointItems = items.map((item_id: number) => {
          return {
              item_id,
              point_id
          }
      });
  
      await trx('point_items').insert(pointItems);   
  
      await trx.commit();
  
      return response.json({ 
        id: point_id,
        ...point,
      });
    };
}

export default PointsController;