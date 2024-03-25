import { LearnMove, PrismaClient } from "@prisma/client"
//let roman = require('roman-numbers')
import {toArabic} from "typescript-roman-numbers-converter"
import { Request, Response } from 'express'

const prisma = new PrismaClient()
export default  class pokemonController{
    static async update(url:string= "https://pokeapi.co/api/v2/pokemon") {
        // This is a placeholder for the actual implementation
        await prisma.$connect()
        let dataAll = await (await fetch(url)).json()
        const fetcher = async(path:string) => {
            let response = await fetch(path);
            return await response.json()
        }
        let fetchPoke = []
        for (let pokemon of dataAll.results){
            fetchPoke.push( fetcher(pokemon.url))
        }
        let pokemons = await Promise.all(fetchPoke)
        let saveData = async(pokemon:any)=>{
            let specie:any = await fetch(pokemon.species.url).then(async(response) => response.json())
            let abilityPokemon = pokemon.abilities.map((ability:any) => {
                    return {
                        abilityId: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/","")),
                        generation: 9999,
                        slot: ability.slot,
                        isHidden: ability.is_hidden 
                    }
                })
            pokemon.past_abilities.map((meta_abilities:any) => {
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
            pokemon.moves.map((item:any) => {
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
            let dataToCreate:any = {
                id:pokemon.id,
                name: pokemon.name,
                height: pokemon.height,
                weight: pokemon.weight,
                hp: pokemon.stats[0].base_stat,
                attack: pokemon.stats[1].base_stat,
                defense: pokemon.stats[2].base_stat,
                specialAttack: pokemon.stats[3].base_stat,
                specialDefense: pokemon.stats[4].base_stat,
                speed: pokemon.stats[5].base_stat,
                pastHabilities: pokemon.past_abilities,
                order: pokemon.order,
                isBaby: specie.is_baby,
                isLegendary: specie.is_legendary,
                isMythical: specie.is_mythical,
                genderRate: specie.gender_rate,
                captureRate: specie.capture_rate,
                specie: specie.name,
                color: specie.color.name,
                growthRate:specie.growth_rate.name,
                habitat:specie.habitat?specie.habitat.name:null,
                type1: pokemon.types[0].type.name,
                type2: pokemon.types[1] ? pokemon.types[1].type.name : null,
                generation: Number(toArabic(specie.generation.name.split("-")[1])||0),
                hasGenderDifferences: specie.has_gender_differences,
                abilities: {create: abilityPokemon},
                movesLearns: {create: moveLearns}
            }
            let dataToUpload = { ...dataToCreate };
            delete dataToUpload.generation
            await prisma.pokemon.upsert({
                where: { id: pokemon.id },
                update: dataToUpload,
                create: dataToCreate,
            });
        }
        console.log(url)
        await Promise.all(pokemons.map(saveData))
        await prisma.$disconnect()
        if(dataAll.next){
            await pokemonController.update(dataAll.next)
        }
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
    static async getAllPokemons(req: Request, res: Response, next: any){
        try{
        let where ={}
        let method = 1 // 1 is the fastest way to do it
        let Qfilter:any
        let limit: number = Number(req.query.limit)||20
        let offset:number = Number(req.query.offset)||0
        if(typeof req.query.filter =="string"){
            Qfilter = JSON.parse(req.query.filter)
        }
        if(Qfilter){
            //GENERAL
                //TODO

            //GENERATION
            where = {...where, generation:{
                lte: isNaN(Number(Qfilter.generation))?9999:Number(Qfilter.generation)
            }}
            //ABILITIES
            if(Qfilter.abilities && Qfilter.abilities.length>0){
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
            //Moves
            if(Qfilter.moves ){
                let tmp:any = []
                for (const item of Object.entries(Qfilter.moves)) {
                    let moveList:any = item[1]
                    if(moveList.length>0){
                        let  pokeList:any =  await prisma.learnMove.findMany({select: {pokemonId: true}, where: {moveId: {in: moveList}}})
                        pokeList = pokeList.map((item:Partial<LearnMove>)=>item.pokemonId) 
                        tmp.push(new Set(pokeList))
                    }
                }
                if(tmp.length>0){
                    let pokemonsWithMoves = Array.from(tmp.reduce((a:any,b:any) => new Set([...a].filter(x => b.has(x)))))
                    where = {...where, id:{in: pokemonsWithMoves}}
                }   
            }

        }
            
            
        console.log(where)
        let pokemons:any = await prisma.pokemon.findMany(
            {select: {id:true, name:true}, where: where, orderBy: {id: "asc"}}
        )
        pokemons = await Promise.all(pokemons.map(async(pokemon:any) => {
            return await pokemonController.getPokemonbyId({pokemonRequest:pokemon.id,generation: Qfilter.generation})
        }))
        if(method==1){
            if (Qfilter.abilities && Qfilter.abilities.length>0){
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
    }catch(error){
        next(error)
    }
    }
    static async getAllColors(req: Request, res: Response){
        let colors = await prisma.pokemon.findMany({select: {color:true }, distinct: ["color"]})
        colors = colors.map((color:any) => color.color)
        res.json(colors)
    }
}
