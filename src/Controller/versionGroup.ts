import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class VersionGroupController {
    static async update(url:string =`https://pokeapi.co/api/v2/version-group` ):Promise <null> {
        await prisma.$connect()
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.results.map((versionGroup:any) => {
                    fetch(versionGroup.url)
                        .then((response) => response.json())
                        .then((data_versionGroup) => {
                            console.log(data_versionGroup)
                            return prisma.versionGroup.create({data: {
                                id: data_versionGroup.id,
                                name: data_versionGroup.name,
                                generation: data_versionGroup.generation.name,
                                versions: data_versionGroup.versions.map((version:any) => version.name),
                                order: data_versionGroup.order
                            }})

                        })
                })
                
                return data
            }).then((data) => {
                if(data.next){
                    this.update(data.next)
                }
            })

        await prisma.$disconnect()
        return null
    }
    
}