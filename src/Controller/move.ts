import { PrismaClient } from '@prisma/client'
import { resolve } from 'path'
const prisma = new PrismaClient()

export class MoveController {
    static async uploadDescriptions():Promise <null> {
        await prisma.$connect()

        prisma.move.findMany().then((moves) => {
            moves.map((move) => {
                //console.log(move)
                let url = `https://pokeapi.co/api/v2/move/${move.id}`
                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if(JSON.stringify(data.flavor_text_entries) === "[]"){
                            return null
                        }
                        let descriptions = data.flavor_text_entries.filter((item:any)=>item.language.name == "en")
                        descriptions.sort((a:any, b:any) => (
                            a.version_group.url.match('\/[0-9]+\/')[0].replaceAll("/","") > 
                            b.version_group.url.match('\/[0-9]+\/')[0].replaceAll("/","")) ? 1 : -1)
                        return prisma.move.update({where: {id: move.id}, data: {
                            flavor_text: descriptions[0].flavor_text.replaceAll("\n"," ")}})
                    }).then((data) => {
                        console.log(data)
                    })
            })
        })
        return null
    }
}