import { Ability, PrismaClient, Trigger, Target, Effect } from '@prisma/client'
import { toArabic } from 'typescript-roman-numbers-converter'
const prisma = new PrismaClient()
import { Request, Response } from 'express'
export class MechanicController {
    

  async create(req: Request, res: Response) {
    // ...
  }
  public static async update() {
    await prisma.$connect()
    let ability_old = require("../../backup/abilities.json")
    //drop DB
    
    // import abilities.json
    for(let key in ability_old){
        //"related_moves"
        //TODO: test 
        let dataToUpload: any = {}

        let ability = await prisma.ability.upsert({
            where: {id: ability_old[key].id},
            update: dataToUpload,
            create: dataToUpload
        })
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
 public static async getTriggers   (req: Request, res: Response)  {
        const result:Trigger[] = await prisma.trigger.findMany()
        return res.json(result)
    }
public static async getTargets   (req: Request, res: Response)  {
    const result:Target[] = await prisma.target.findMany()
    return res.json(result)
}
public static async getEffects   (req: Request, res: Response)  {
    const result:Effect[] = await prisma.effect.findMany()
    //return res.json(triggers)
    return res.json(result)
}
}   