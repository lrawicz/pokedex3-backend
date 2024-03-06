import { Ability, PrismaClient } from '@prisma/client'
import { toArabic } from 'typescript-roman-numbers-converter'
const prisma = new PrismaClient()
export class MechanicController {
    

  async create(req: Request, res: Response) {
    // ...
  }
  public static async update() {
    await prisma.$connect()
    let ability_old = require("../../data_raw/abilities.json")
    //drop DB
    
    // import abilities.json
    for(let key in ability_old){
        let ability = await prisma.ability.findUnique({where: {id: ability_old[key].id}})
        if(!ability){
            ability = await prisma.ability.create({data: {
                id: ability_old[key].id,
                name: ability_old[key].name,
                //flavor_text: ability_old[key].flavor_text,
                generation: ability_old[key].generation,
            }})
        }
        for (let index = 0; index < ability_old[key]["mechanics"].length; index++) {
            let  mechanic_raw = ability_old[key]["mechanics"][index];
            let triggers = []
            for (let index = 0; index < mechanic_raw.trigger.length; index++) {
                let trigger = await prisma.trigger.findUnique({where: {name: mechanic_raw.trigger[index]}})
                if(!trigger){
                    trigger = await prisma.trigger.create({data: {name: mechanic_raw.trigger[index]}})
                }
                triggers.push(trigger)
            }
            let targets = []
            for (let index = 0; index < mechanic_raw.target.length; index++) {
                let target = await prisma.target.findUnique({where: {name: mechanic_raw.target[index]}})
                if(!target){
                    target = await prisma.target.create({data: {name: mechanic_raw.target[index]}})
                }
                targets.push(target)
            }

            let effects = []
            for (let index = 0; index < mechanic_raw.effect.length; index++) {
                let effect = await prisma.effect.findUnique({where: {name: mechanic_raw.effect[index]}})
                if(!effect){
                    effect = await prisma.effect.create({data: {name: mechanic_raw.effect[index]}})
                }
                effects.push(effect)
            }

            await prisma.mechanic.create({
                data:{
                    abilityId:ability.id,
                    triggers:{
                        create: triggers.map((trigger) => ({trigger:{connect: {id: trigger.id}}}))
                    },
                    targets:{
                        create: targets.map((target) => ({target:{connect: {id: target.id}}}))
                    },
                    effects:{
                        create: effects.map((effect) => ({effect:{connect: {id: effect.id}}}))
                    }
                }
            })
        }
    }
    prisma.$disconnect
}
}   