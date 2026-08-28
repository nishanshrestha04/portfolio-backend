import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { toolkit } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ToolkitService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.db.select().from(toolkit).orderBy(toolkit.orderIndex);
  }

  async findOne(id: string) {
    const data = await this.dbService.db.select().from(toolkit).where(eq(toolkit.id, id));
    if (!data.length) throw new NotFoundException('Toolkit item not found');
    return data[0];
  }

  async create(data: any) {
    const [inserted] = await this.dbService.db.insert(toolkit).values(data).returning();
    return inserted;
  }

  async update(id: string, data: any) {
    const [updated] = await this.dbService.db
      .update(toolkit)
      .set(data)
      .where(eq(toolkit.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Toolkit item not found');
    return updated;
  }

  async remove(id: string) {
    const [deleted] = await this.dbService.db
      .delete(toolkit)
      .where(eq(toolkit.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Toolkit item not found');
    return deleted;
  }
}
