import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import db from '../db/index.js' 

const DepartmentRoutes = new Hono()

const departmentSchema = z.object({
  DeptName: z.string(),
  FacultyName: z.string(),
  OfficeLocation: z.string(),
  HeadOfDept: z.string()
})

interface Department {
  DepartmentID: number;
  DeptName: string;
  FacultyName: string;
  OfficeLocation: string;
  HeadOfDept: string;
}

//CRUD 

//ดึงข้อมูลทั้งหมด
DepartmentRoutes.get('/', (c) => {
  try {
    const stmt = db.prepare('SELECT * FROM Department');
    const departments = stmt.all() as Department[];
    return c.json(departments);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
})

//ดึงข้อมูลตาม ID
DepartmentRoutes.get('/:id', (c) => {
  const id = c.req.param('id');
  try {
    const stmt = db.prepare('SELECT * FROM Department WHERE DepartmentID = ?');
    const department = stmt.get(id) as Department;

    if (!department) {
      return c.json({ message: 'Department not found' }, 404);
    }
    return c.json(department);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
})

//สร้างข้อมูลใหม่
DepartmentRoutes.post('/', zValidator('json', departmentSchema), (c) => {
  const data = c.req.valid('json'); 
  
  try {
    const stmt = db.prepare(`
      INSERT INTO Department (DeptName, FacultyName, OfficeLocation, HeadOfDept)
      VALUES (?, ?, ?, ?)
    `);
    
    const info = stmt.run(data.DeptName, data.FacultyName, data.OfficeLocation, data.HeadOfDept);
    
    return c.json({ 
      message: 'Created successfully', 
      id: info.lastInsertRowid,
      data: data
    }, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
})

//แก้ไขข้อมูล
DepartmentRoutes.put('/:id', zValidator('json', departmentSchema), (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    const stmt = db.prepare(`
      UPDATE Department 
      SET DeptName = ?, FacultyName = ?, OfficeLocation = ?, HeadOfDept = ?
      WHERE DepartmentID = ?
    `);

    const info = stmt.run(data.DeptName, data.FacultyName, data.OfficeLocation, data.HeadOfDept, id);

    if (info.changes === 0) {
      return c.json({ message: 'Department not found to update' }, 404);
    }

    return c.json({ message: 'Updated successfully' });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
})

//ลบข้อมูล
DepartmentRoutes.delete('/:id', (c) => {
  const id = c.req.param('id');
  try {
    const stmt = db.prepare('DELETE FROM Department WHERE DepartmentID = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return c.json({ message: 'Department not found to delete' }, 404);
    }

    return c.json({ message: 'Deleted successfully' });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
})

export default DepartmentRoutes