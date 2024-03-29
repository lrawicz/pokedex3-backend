import express, {Request, Response,ErrorRequestHandler} from 'express';
import { MechanicController } from './Controller/mechanic';
import pokemonController from './Controller/pokemon';
import { MoveController } from './Controller/move';
import { AbilityController } from './Controller/ability';
import morgan from 'morgan'
import router from './router';

require('dotenv').config();

const loggerMiddleware = morgan('dev'); 
let port = process.env.API_PORT || 3000;


const app = express();
var cors = require('cors')
app.use(cors());
app.use(loggerMiddleware);

// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

app.use((err:any, req:Request, res:Response, next:any) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.use(router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});