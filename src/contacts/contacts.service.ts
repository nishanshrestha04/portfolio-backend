import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { contacts } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class ContactsService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async findOne(id: string) {
    const data = await this.dbService.db.select().from(contacts).where(eq(contacts.id, id));
    if (!data.length) throw new NotFoundException('Contact message not found');
    return data[0];
  }

  async create(data: any) {
    const [inserted] = await this.dbService.db.insert(contacts).values(data).returning();
    return inserted;
  }

  async remove(id: string) {
    const [deleted] = await this.dbService.db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Contact message not found');
    return deleted;
  }
}
