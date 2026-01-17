import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import db from '../db/index.js'

const roleRoutes = new Hono()

// 1. Get All Roles (Read)
roleRoutes.get('/', (c) => {
  const roles = db.prepare('SELECT * FROM roles').all()
  return c.json({ message: 'Get all roles success', data: roles })
})

// 2. Get Single Role by ID (Read)
roleRoutes.get('/:id', (c) => {
  const id = c.req.param('id')
  const role = db.prepare('SELECT * FROM roles WHERE id = ?').get(id)
  if (!role) return c.json({ message: 'Role not found' }, 404)
  return c.json({ data: role })
})

// 3. Create Role (Create)
roleRoutes.post('/', zValidator('json', z.object({
  name: z.string().min(1)
})), (c) => {
  const { name } = c.req.valid('json')
  const info = db.prepare('INSERT INTO roles (name) VALUES (?)').run(name)
  return c.json({ message: 'Role created', id: info.lastInsertRowid }, 201)
})

// 4. Update Role (Update)
roleRoutes.put('/:id', zValidator('json', z.object({
  name: z.string().min(1)
})), (c) => {
  const id = c.req.param('id')
  const { name } = c.req.valid('json')
  const info = db.prepare('UPDATE roles SET name = ? WHERE id = ?').run(name, id)
  
  if (info.changes === 0) return c.json({ message: 'Role not found' }, 404)
  return c.json({ message: 'Role updated' })
})

// 5. Delete Role (Delete)
roleRoutes.delete('/:id', (c) => {
  const id = c.req.param('id')
  const info = db.prepare('DELETE FROM roles WHERE id = ?').run(id)
  
  if (info.changes === 0) return c.json({ message: 'Role not found' }, 404)
  return c.json({ message: 'Role deleted' })
})

export default roleRoutes