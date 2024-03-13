import express, {Request, Response} from 'express';
import { MechanicController } from './Controller/mechanic';
import pokemonController from './Controller/pokemon';
import { MoveController } from './Controller/move';
import { AbilityController } from './Controller/ability';

let port = process.env.PORT || 3300;
const app = express();
var cors = require('cors')
app.use(cors());
// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
app.get('/triggers', MechanicController.getTriggers);
app.get('/targets',  MechanicController.getTargets);
app.get('/effects', MechanicController.getEffects);

app.get('/moves/getAllNames', MoveController.getAllNames);
app.get('/moves/getDamageClass', MoveController.getDamageClass);
app.get('/moves/getTargetTypes', MoveController.getTargetTypes);
app.get('/moves/getAilments', MoveController.getAilments);

app.get('/abilities',AbilityController.getAbilities);
app.get('/pokemon/types',pokemonController.getAllTypes);
app.get('/pokemons',pokemonController.getAllPokemons);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});