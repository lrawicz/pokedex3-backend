import { PrismaClient } from "@prisma/client"
//let roman = require('roman-numbers')
import {toArabic} from "typescript-roman-numbers-converter"
import { Request, Response } from 'express'

const prisma = new PrismaClient()
export default  class pokemonController{
    static async update(url:string= "https://pokeapi.co/api/v2/pokemon"):Promise <null> {
        // This is a placeholder for the actual implementation
        fetch(url).then(async(response) => response.json()).then((data) => {
            Promise.all(data.results.map(async(pokemon:any) => {
                fetch(pokemon.url).then(async(response) => response.json()).then(async(data) => {
                    console.log(data.id)
                    let specie:any = await fetch(data.species.url).then(async(response) => response.json())
                    let abilityPokemon = data.abilities.map((ability:any) => {
                        return {
                            abilityId: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/","")),
                            generation: 9999,
                            slot: ability.slot,
                            isHidden: ability.is_hidden 
                        }
                    })
                    data.past_abilities.map((meta_abilities:any) => {
                        let generation = meta_abilities.generation.name
                        meta_abilities.abilities.map((ability:any) => {
                            abilityPokemon.push({
                                abilityId: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/","")),
                                generation: toArabic(generation.split("-")[1])||0,
                                slot: ability.slot,
                                isHidden: ability.is_hidden 
                            })
                        })
                    })
                    let moveLearns:any[] = []
                    data.moves.map((item:any) => {
                        let moveId = item.move.url.match("/[0-9]+/")[0].replaceAll("/","")
                        item.version_group_details.map((version:any) => {
                            moveLearns.push({
                                moveId: Number(moveId),
                                method: version.move_learn_method.name,
                                versionGroupId: Number(version.version_group.url.match("/[0-9]+/")[0].replaceAll("/","")),
                                level: version.level_learned_at
                            })
                        })
                    })
                    let pokeInDb = await prisma.pokemon.findUnique({where: {id: data.id}})
                        let dataToCreate:any = {
                            id:data.id,
                            name: data.name,
                            height: data.height,
                            weight: data.weight,
                            hp: data.stats[0].base_stat,
                            attack: data.stats[1].base_stat,
                            defense: data.stats[2].base_stat,
                            specialAttack: data.stats[3].base_stat,
                            specialDefense: data.stats[4].base_stat,
                            speed: data.stats[5].base_stat,
                            pastHabilities: data.past_abilities,
                            isBaby: specie.is_baby,
                            isLegendary: specie.is_legendary,
                            isMythical: specie.is_mythical,
                            genderRate: specie.gender_rate,
                            captureRate: specie.capture_rate,
                            specie: specie.name,
                            color: specie.color.name,
                            growthRate:specie.growth_rate.name,
                            habitat:specie.habitat?specie.habitat.name:null,
                            type1: data.types[0].type.name,
                            type2: data.types[1] ? data.types[1].type.name : null,
                            generation: Number(toArabic(specie.generation.name.split("-")[1])||0),
                            hasGenderDifferences: specie.has_gender_differences,
                            abilities: {create: abilityPokemon},
                            movesLearns: {create: moveLearns}
                        }
                        let dataToUpload = { ...dataToCreate };
                        delete dataToUpload.generation
                        await prisma.pokemon.upsert({
                            where: { id: data.id },
                            update: dataToUpload,
                            create: dataToCreate,
                        });
                })
            }))
            return (data)
        })
        .then((data) => {
            if(data.next){
                return pokemonController.update(data.next)
            }
        })
        return null
    }

    static async searchPokemon({options, generation}:{options:any, generation:any}){
        //TODO: implement searchPokemon
        let pokemons = await prisma.pokemon.findMany({select: {id: true, name: true}})
        

        return pokemons
    }
    static async findPokemonsByAbility({abilityId, generation}:{abilityId:number[], generation:number}){
        let query =`SELECT "pokemonId","slot","generation" FROM (
                        (SELECT * FROM "PokemonAbility" pa 
                            WHERE pa."slot"= '1' 
                            ${abilityId.length>0?'AND "abilityId" IN ('+abilityId.join(",")+')':''}
                            AND pa."generation" >= $1)
                        UNION
                        (SELECT * FROM "PokemonAbility" pa 

                            WHERE pa."slot"= '2' 
                            ${abilityId.length>0?'AND "abilityId" IN ('+abilityId.join(",")+')':''}
                            AND pa."generation" >= $1)
                        UNION
                        (SELECT * FROM "PokemonAbility" pa 
                            WHERE pa."slot"= '3' 
                            ${abilityId.length>0?'AND "abilityId" IN ('+abilityId.join(",")+')':''}
                            AND pa."generation" >= $1)
                    ) as t  GROUP BY "pokemonId", "slot", "generation"`
        let result:any =  await prisma.$queryRawUnsafe(query=query,generation)
        return result.map((data:any) => data.pokemonId)
    }
    static async getPokemonbyId(
        {pokemonRequest=0, generation=9999}:{pokemonRequest:number|string, generation:number}):Promise<any>{
        let pokemon:any;
        let where:any;
        where = isNaN(Number(pokemonRequest))? {name: String(pokemonRequest)}: {id: Number(pokemonRequest)};

        pokemon = await prisma.pokemon.findUnique({
            where: where, 
            include: {
                abilities: {select: {
                    ability: {select: {name: true,id: true}},
                    generation: true,
                    slot: true,
                    isHidden: true
                }}
            }
        })

        // TODO: implement this logic in a select query
        pokemon.abilities = {
            "slot1": pokemon.abilities
                .filter((ability:any) => ability.slot == 1)
                .sort((a:any,b:any) => {a.generation - b.generation})
                .reduce((acumulado:any, ability:any) => (generation <= ability.generation)?ability:acumulado,{}),
            "slot2": pokemon.abilities
                .filter((ability:any) => ability.slot == 2)
                .sort((a:any,b:any) => {a.generation - b.generation})
                .reduce((acumulado:any, ability:any) => (generation <= ability.generation)?ability:acumulado,{}),
            "slot3": pokemon.abilities
                .filter((ability:any) => ability.slot == 3)
                .sort((a:any,b:any) => {a.generation - b.generation})
                .reduce((acumulado:any, ability:any) => (generation <= ability.generation)?ability:acumulado,{}),
        }
        return pokemon
    }
    static async getMoves(pokemonRequest:number|string,generation:number=2){
        let pokemon:any;
        let where:any;
        where = isNaN(Number(pokemonRequest))? {name: String(pokemonRequest)}: {id: Number(pokemonRequest)};

        pokemon = await prisma.pokemon.findUnique({where: where, })
        let moves = await prisma.learnMove.findMany(
            {
                select: {
                    move: {select: {name:true, id:true, power:true,type:true,damageClass:true}},
                    method: true,
                    level: true,
                    versionGroup: {select: {generation:true, name:true}},
                },
                where: {pokemonId: pokemon.id, versionGroup: {generation: {lte: generation}}},
            }
        )
        return moves
    }
    static async getAllTypes(req: Request, res: Response){
        let types = await prisma.pokemon.findMany({select: {type1:true }, distinct: ["type1"]})
        types = types.map((type:any) => type.type1)
        res.json(types)
    }
    static async getAllPokemons(req: Request, res: Response){
        let where ={}
        let method = 1 // 1 is the fastest way to do it
        let Qfilter:any
        let limit: number = Number(req.query.limit)||20
        let offset:number = Number(req.query.offset)||0
        if(typeof req.query.filter =="string"){
            Qfilter = JSON.parse(req.query.filter)
        }
        if(Qfilter){
            //GENERATION
            where = {...where, generation:{
                lte: isNaN(Number(Qfilter.generation))?9999:Number(Qfilter.generation)
            }}
            //ABILITIES
            if(Qfilter.abilities){
                switch(method){
                    case 1:
                        let abilities:number[] = Qfilter.abilities.map((ability:any) => Number(ability))
                        where = {...where, abilities: {some: {abilityId: {in: abilities}}}}
                        break;
                    case 2:
                        let pokemonsWithAbilities = await pokemonController.findPokemonsByAbility({abilityId:Qfilter.abilities, generation:Qfilter.generation})
                        where = {...where, id:{in: pokemonsWithAbilities}}
                        break;
                }
            }

            //STATS
            if(Qfilter.STATS){
                let a = {STATS:{hp:{type:"value",value:[20,55]}}}
                Object.keys(Qfilter.STATS).map((key) => {
                    if(!Object.keys(prisma.pokemon.fields).includes(key)) return null
                    where = {...where, [key]:{
                        gte: Qfilter.STATS[key].value[0]?Qfilter.STATS[key].value[0]:0,
                        lte: Qfilter.STATS[key].value[1]?Qfilter.STATS[key].value[1]:255
                    }}
                })
            }
        }
            
            
        
        let pokemons:any = await prisma.pokemon.findMany(
            {select: {id:true, name:true}, where: where, orderBy: {id: "asc"}})
        pokemons = await Promise.all(pokemons.map(async(pokemon:any) => {
            return await pokemonController.getPokemonbyId({pokemonRequest:pokemon.id,generation: Qfilter.generation})
        }))
        if(method==1){
            if (Qfilter.abilities){
                pokemons = pokemons.filter((pokemon:any) => 
                ( Qfilter.abilities?.includes(pokemon.abilities.slot1?.ability?.id||-1)) ||
                ( Qfilter.abilities?.includes(pokemon.abilities.slot2?.ability?.id||-1)) ||
                ( Qfilter.abilities?.includes(pokemon.abilities.slot3?.ability?.id||-1)) 
                )
            }
        }
        //return only the first 10 items of array pokemon
        res.json({
            total: pokemons.length,
            result: pokemons.slice(offset,limit)
        })
    }
}
