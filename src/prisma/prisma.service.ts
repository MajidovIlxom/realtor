import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService 
extends PrismaClient
implements OnModuleInit, OnModuleDestroy 
{
    constructor(){
        super({
            datasources: {
                db: {
                    url: "postgresql://postgres:root@localhost:5432/realtor?schema=public"    //url: process.env.DATABASE_URL
                }
            }
        })
    }

    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }    


}
