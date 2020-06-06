import express from 'express';
import knex from './database/connection'

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const pointsControler = new PointsController();
const itemsController = new ItemsController();

// Ping if the API is online
routes.get('/ping', (request, response) => {    
    response.json({message: "Online"});
});

// Return all items
routes.get('/items', itemsController.index);
// Create colect points
routes.post('/points', pointsControler.create);
// Get a list of colect points
routes.get('/points', pointsControler.index);
// Get a specific colect point
routes.get('/points/:id', pointsControler.show);



export default routes;