import { sql } from '@/lib/db'
import { RegisterInput } from '@/validators/auth.validator'

export class UserRepository {
  async findByEmail(email: string) {
    const results = await sql`SELECT * FROM "User" WHERE email = ${email}`;
    return results[0];
  }

  async findById(id: string) {
    const results = await sql`SELECT * FROM "User" WHERE id = ${id}`;
    return results[0];
  }

  async create(data: RegisterInput) {
    const id = 'user_' + Math.random().toString(36).substr(2, 9);
    const results = await sql`
      INSERT INTO "User" (id, name, email, password, "updatedAt")
      VALUES (${id}, ${data.name}, ${data.email}, ${data.password}, NOW())
      RETURNING id, name, email, role, "createdAt"
    `;
    return results[0];
  }
}


export const userRepository = new UserRepository()
