import { Response } from 'express'
import { AuthRequest } from '../types/auth-request'
import {urlShortenBodySchema } from '../validation/request.validation'
import {nanoid} from 'nanoid'

import db from '../db/db'
import { urlsTable } from '../models/url.model'
import { success } from 'zod'
import { eq } from 'drizzle-orm'

export const shortUrl = async (req:AuthRequest, res:Response)=>{
try {
    const userId = req?.user?.id

    if(!userId){
        return res.status(401).json({success:false, msg:"You must be login to access this resource"})
    }
      const validationResult = await urlShortenBodySchema.safeParseAsync(req.body)

      if(validationResult.error){
        return res.status(400).json({success : false, msg:validationResult.error.format() })
      }

      const { url,code } = validationResult.data;

      const [result] = await db.select().from(urlsTable).where((table)=> eq(table.shortCode, code))

      if(result){
        return res.status(400).json({success:false, msg:`This code ${code} is already taken please try another`})
      }

      const shortCode = code ?? nanoid(7);

      const [data] = await db.insert(urlsTable).values({
        shortCode,
        targetUrl : url,
        userId
      }).returning({id:urlsTable.id, shortCode:urlsTable.shortCode, targetUrl : urlsTable.targetUrl})

    return res.status(201).json({success:true, data:{id:data.id, targetUrl:data.targetUrl, shortCode:data.shortCode}})
} catch (error : any) {
    console.error(error.message);
}
} 

export const redirectUrl = async (req:AuthRequest, res:Response)=>{
    try {
        const {shortCode} = req.params;
        
        if(!shortCode){
            return res.status(400).json({success:false, msg:"SHort code is required"})
        }

        const [data] = await db.select().from(urlsTable).where((table)=> eq(table.shortCode,shortCode))

        if(!data){
            res.status(400).json({success:false, msg:"Invalid url"})
        }

        return res.redirect(data.targetUrl)

    } catch (error) {
        console.error(error)
    }
}