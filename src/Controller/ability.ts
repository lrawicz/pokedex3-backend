import { Ability, PrismaClient } from '@prisma/client'
import { toArabic } from 'typescript-roman-numbers-converter'
const prisma = new PrismaClient()

type mechanic = {
    triggers?: String[],
    targets?: String[],
    effects?: String[]
}
type mechanicId = {
    triggers?: Number[],
    targets?: Number[],
    effects?: Number[]
}
export class AbilityController{
    
    static async findByMechanic({mechanic,generation,name,id}:
        {mechanic?:mechanicId,generation?:number,name?:string[],id?:number[]}):
        Promise <any[]> {
        await prisma.$connect()
            let where:any = {}
            if(mechanic){
                let allAbilities = `select id from "Ability" a`
                let trigger_query:string[]=[], target_query:string[]=[], effect_query:string[]=[]
                if(mechanic.triggers != undefined && mechanic.triggers.length > 0){
                    trigger_query = mechanic.triggers.map((trigger) => {
                        return `SELECT m."abilityId" as id from "MechanicsTriggers" me
                        INNER JOIN "Mechanic" m  ON m.id  = me."mechanicId" 
                        WHERE me."triggerId" = ${trigger} AND m."abilityId" is not null
                        GROUP BY m."abilityId"`
                    })
                }
                if(mechanic.targets != undefined && mechanic.targets.length > 0){
                    target_query = mechanic.targets.map((target) => {
                    return `SELECT m."abilityId" as id from "MechanicsTargets" me
                    INNER JOIN "Mechanic" m  ON m.id  = me."mechanicId" 
                    WHERE me."targetId"   = ${target} AND m."abilityId" is not null
                    GROUP BY m."abilityId"`
                })
                }
                if(mechanic.effects != undefined && mechanic.effects.length > 0){
                    effect_query = mechanic.effects.map((effect) => {
                    return `SELECT m."abilityId" as id  from "MechanicsEffects" me
                    INNER JOIN "Mechanic" m  ON m.id  = me."mechanicId" 
                    WHERE me."effectId"   = ${effect} AND m."abilityId" is not null
                    GROUP BY m."abilityId"`
                })
                }
                let query = [allAbilities,...trigger_query,...target_query,...effect_query].join(" INTERSECT ")
                const result2:any[] = await prisma.$queryRawUnsafe(query)
                const abilitiesIds = result2.map((item) => item.id)
                where = {id: {in: abilitiesIds}}
            }
        if(generation) where["generation"]= {lte: generation}
        if(name) where["name"] = {in: name}
        //if(id) where["id"] = {in: id}
        let result = await prisma.ability.findMany({
            where: where,
            include: {pokemonsAbilities: {select: {pokemon: true}},}
        })
            
        prisma.$disconnect
        return (result)
    }
    static async getAbilities(req: any, res: any) {
        let filter = req.query.filter 
        if(filter == undefined || filter == "{}"){
            prisma.$connect
            return res.json(await prisma.ability.findMany({where:{is_main_series: true},orderBy: {name: "asc"}}))
        }
        return res.json(await AbilityController.findByMechanic({mechanic:JSON.parse(filter)}))
    }
    static async update(url:string = "https://pokeapi.co/api/v2/ability"):Promise <null>{
        await prisma.$connect()
        let dataAll = await (await fetch(url)).json()
        const fetcher = async(path:string) => {
            let response = await fetch( path);
            return await response.json()
          }
        let fetchAbili = []
        for (let ability of dataAll.results){
            fetchAbili.push( fetcher(ability.url))
        }
        let abilities = await Promise.all(fetchAbili)
        let saveData = async (ability:any) => {
        
            let effect:string|null = null
            let short_effect:string|null = null
            let flavor_text:string|null = null
            if(ability.effect_entries){
                let tmp = ability.effect_entries.filter((item:any)=>item.language.name=="en")
                if (tmp.length > 0){
                    effect = tmp[0].effect.replaceAll("\n"," ")
                    short_effect =tmp[0].short_effect.replaceAll("\n"," ")
                }
            }
            if(ability.flavor_text_entries){
                let tmp = ability.flavor_text_entries.filter((item:any)=>item.language.name=="en")
                if (tmp.length > 0){
                    flavor_text = tmp[0].flavor_text.replaceAll("\n"," ")
                }
            }
            let dataToUpload:any = {
                id: ability.id,
                name: ability.name,
                new: true,
                is_main_series: ability.is_main_series,
                generation: toArabic(ability.generation.name.split("-")[1]),
            }
                            
            if(effect){
                dataToUpload["effect"] = effect
                dataToUpload["shortEffect"] = short_effect
            }
            if(flavor_text){
                dataToUpload["flavorText"] = flavor_text
            }

            await prisma.ability.upsert({
                where: {id: dataToUpload.id},
                update: dataToUpload,
                create: {...dataToUpload,new:true}
            })
        }
        console.log(url)
        Promise.all(abilities.map(saveData))
        await prisma.$disconnect()
        if(dataAll.next){
            await this.update(dataAll.next)
        }
        return null
    }
    static async abilitiesToFix():Promise <any> {
        await prisma.$connect()
        let data:any = await prisma.$queryRawUnsafe(`
            SELECT * FROM "Ability" a2
            WHERE 
                a2.is_main_series = true AND
                a2.id in (
                    SELECT a.id FROM "Ability" a 
                    EXCEPT 
                    SELECT m."abilityId"  FROM "Mechanic" m GROUP BY m."abilityId"
                ) 
            `)
        console.log(data)
        prisma.$disconnect
        return data
    }
    
    static async updateMechanics(ability:(string|number),mechanics:mechanic[]):Promise <boolean> {
        await prisma.$connect()
        let abilityDB:Ability|null
        if(isNaN(Number(ability))){
            abilityDB = await prisma.ability.findUnique({where: {name: String(ability)}})
        }else{
            abilityDB = await prisma.ability.findUnique({where: {id: Number(ability)}})
        }
        if(!abilityDB ) {return false}
        await prisma.mechanic.deleteMany({where: {abilityId: abilityDB.id}})
        await Promise.all(
            mechanics.map(async(mechanic) => {
                if(mechanic.triggers){
                    await Promise.all(mechanic.triggers.map(async(trigger,index) => {
                        let triggerDB = await prisma.trigger.findUnique({where: {name: String(trigger)}})
                        if(triggerDB &&  mechanic.triggers){
                            mechanic.triggers[index] = String(triggerDB.id)
                        }
                    }));
                }
                if(mechanic.targets){
                    await Promise.all(mechanic.targets.map(async(target,index) => {
                        let targetDB = await prisma.target.findUnique({where: {name: String(target)}})
                        if(targetDB &&  mechanic.targets){
                            mechanic.targets[index] = String(targetDB.id)
                        }
                    }));
                }
                if(mechanic.effects){
                    await Promise.all(mechanic.effects.map(async (effect,index) => {
                        let effectDB = await prisma.effect.findUnique({where: {name: String(effect)}})
                        if(effectDB &&  mechanic.effects){
                            mechanic.effects[index] = String(effectDB.id)
                        }
                    }));
                }
            })
        )
        let abilityId = abilityDB.id==null?0:abilityDB.id
        await Promise.all(
            mechanics.map(async(mechanic) => {
                let data = {abilityId:abilityId,}
                if(mechanic.triggers){
                        let tmp =  {triggers:{create: mechanic.triggers.map((trigger) => ({trigger:{connect: {id: Number(trigger)}}}))}}
                        data = {...data, ...tmp}
                }
                if(mechanic.targets){
                    let tmp =  {targets:{create: mechanic.targets.map((target) => ({target:{connect: {id: Number(target)}}}))}}
                    data = {...data, ...tmp}
                }
                if(mechanic.effects){
                    let tmp =  {effects:{create: mechanic.effects.map((effect) => ({effect:{connect: {id: Number(effect)}}}))}}
                    data = {...data, ...tmp}
                }

                await prisma.mechanic.create({data:data})

            })
        )
        //TODO: add moves relations
        //TODO: add mechanics into the JSON backup
        prisma.$disconnect
        return true
    }
    static async getData(ability:number|string):Promise <any> {
        await prisma.$connect()

        let abilityDB:Ability|null
        if(isNaN(Number(ability))){
            abilityDB = await prisma.ability.findUnique({where: {name: String(ability)}})
        }else{
            abilityDB = await prisma.ability.findUnique({where: {id: Number(ability)}})
        }
        let tags = ["Trigger","Target","Effect"]
        let result:any = {}
        await Promise.all(tags.map(async (tag) => {
            if(!abilityDB ){return false}
            let data:any =  await prisma.$queryRawUnsafe(`
                SELECT tag."name", mt."mechanicId"  from "Mechanic" m 
                INNER JOIN "Mechanics${tag}s" mt ON m.id = mt."mechanicId" 
                INNER JOIN "${tag}" tag ON mt."${tag.toLowerCase()}Id" = tag.id
                WHERE m."abilityId" = $1`,
                abilityDB.id)
            data.map((item:any) =>{
                if(!result[String(item.mechanicId)]){
                    result[String(item.mechanicId)] ={trigger:[],target:[],effect:[]}
                }
                result[String(item.mechanicId)][tag.toLocaleLowerCase()].push(item.name)
                
            })
        }))
        if(!abilityDB ){return false}
        let ab_result = await prisma.ability.findUnique({where: {id: abilityDB.id},
            include:{pokemonsAbilities:
                {include:{pokemon:{ select:{name:true,id:true}}}}
            }})
            console.log(ab_result)
        if(ab_result !=null){
            console.log(ab_result.pokemonsAbilities.map((item:any) => `${item.pokemon.id}-${item.pokemon.name}`))
        }
        result = {...ab_result, mechanics:result}
        prisma.$disconnect
        return (result)
    }
}