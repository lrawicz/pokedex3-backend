import express, {Request, Response,ErrorRequestHandler} from 'express';
import { MechanicController } from './Controller/mechanic';
import pokemonController from './Controller/pokemon';
import { MoveController } from './Controller/move';
import { AbilityController } from './Controller/ability';
import morgan from 'morgan'

const loggerMiddleware = morgan('dev'); 
let port = process.env.PORT || 3300;
const app = express();
var cors = require('cors')
app.use(cors());
app.use(loggerMiddleware);
// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
app.get('/triggers', MechanicController.getTriggers);
app.get('/targets',  MechanicController.getTargets);
app.get('/effects', MechanicController.getEffects);

app.get('/moves', MoveController.getAll);
app.get('/moves/getDamageClass', MoveController.getDamageClass);
app.get('/moves/getTargetTypes', MoveController.getTargetTypes);
app.get('/moves/getAilments', MoveController.getAilments);
app.get('/moves/getCategories', MoveController.getCategories);


app.get('/abilities',AbilityController.getAbilities);
app.get('/pokemon/types',pokemonController.getAllTypes);
app.get('/pokemons',pokemonController.getAllPokemons);

app.use((err:any, req:Request, res:Response, next:any) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});