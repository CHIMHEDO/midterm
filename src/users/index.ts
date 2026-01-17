import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import db from '../db/index.js'

const userRoutes = new Hono()

type User = {
  id: number
  name: string
}



userRoutes.get('/:id', (c) => {
  const { id } = c.req.param()
  let sql = 'SELECT * FROM users WHERE id = @id'
  let stmt = db.prepare<{id:string},User>(sql)
  let user =  stmt.get({id:id})

  if(!user){
    return c.json({ message: `User with ID: ${id} not found` }, 404)
  }

  return c.json({ 
    message: `User details for ID: ${id}`,
    data : user
   })
})

export default userRoutes