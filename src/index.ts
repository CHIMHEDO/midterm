import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes  from './users/index.js'
import rolesRoutes from './roles/index.js'

import da from './db/index.js'
import DepartmentRoutes from './Department/index.js'


const app = new Hono()

app.route('/api/users',userRoutes)
app.route('/api/roles',rolesRoutes)
app.route('/api/Departments',DepartmentRoutes)



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})