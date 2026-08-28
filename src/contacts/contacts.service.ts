import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { contacts } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactsService {
  constructor(private dbService: DbService, private mailService: MailService) {}

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
    
    // Trigger emails in the background without blocking the response
    this.mailService.sendContactEmails(inserted).catch(err => console.error(err));
    
    return inserted;
  }

  async update(id: string, data: any) {
    const [updated] = await this.dbService.db
      .update(contacts)
      .set(data)
      .where(eq(contacts.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Contact message not found');
    return updated;
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
