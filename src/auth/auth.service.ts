import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../db/db.service';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DbService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    const adminRows = await this.dbService.db.select().from(users).where(eq(users.email, email));
    
    if (adminRows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const admin = adminRows[0];
    const isMatch = await bcrypt.compare(pass, admin.passwordHash);
    
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateCredentials(userId: string, email?: string, password?: string) {
    const updateData: any = {};
    if (email) {
      updateData.email = email;
    }
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    
    if (Object.keys(updateData).length === 0) {
      return { message: 'No updates provided' };
    }

    await this.dbService.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));
      
    return { message: 'Credentials updated successfully' };
  }
}
