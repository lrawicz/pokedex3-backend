import { Router } from "express";
import { MechanicController } from "./Controller/mechanic";
import { MoveController } from "./Controller/move";
import { AbilityController } from "./Controller/ability";
import pokemonController from "./Controller/pokemon";

const router = Router();
router.get('/triggers', MechanicController.getTriggers);
router.get('/targets',  MechanicController.getTargets);
router.get('/effects', MechanicController.getEffects);

router.get('/moves', MoveController.getAll);
router.get('/moves/getDamageClass', MoveController.getDamageClass);
router.get('/moves/getTargetTypes', MoveController.getTargetTypes);
router.get('/moves/getAilments', MoveController.getAilments);
router.get('/moves/getCategories', MoveController.getCategories);


router.get('/abilities',AbilityController.getAbilities);
router.get('/pokemon/types',pokemonController.getAllTypes);
router.get('/pokemon/colors',pokemonController.getAllColors);
router.get('/pokemons',pokemonController.getAllPokemons);

export default router;