


import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

dotenv.config()

export const isDev = (configService:ConfigService)=>
    configService.getOrThrow('ENVIRONMENT')==='dev'

export const IS_DEV_ENV = process.env.ENVIRONMENT==='dev'