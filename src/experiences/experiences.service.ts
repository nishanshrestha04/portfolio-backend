import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { experiences } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ExperiencesService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.db.select().from(experiences).orderBy(experiences.orderIndex);
  }

  async findOne(id: string) {
    const data = await this.dbService.db.select().from(experiences).where(eq(experiences.id, id));
    if (!data.length) throw new NotFoundException('Experience not found');
    return data[0];
  }

  async create(data: any) {
    const [inserted] = await this.dbService.db.insert(experiences).values(data).returning();
    return inserted;
  }

  async update(id: string, data: any) {
    const [updated] = await this.dbService.db
      .update(experiences)
      .set(data)
      .where(eq(experiences.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Experience not found');
    return updated;
  }

  async remove(id: string) {
    const [deleted] = await this.dbService.db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Experience not found');
    return deleted;
  }
}
