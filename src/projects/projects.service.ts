import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { projects } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.db.select().from(projects).orderBy(projects.orderIndex);
  }

  async findOne(id: string) {
    const data = await this.dbService.db.select().from(projects).where(eq(projects.id, id));
    if (!data.length) throw new NotFoundException('Project not found');
    return data[0];
  }

  async create(data: any) {
    const [inserted] = await this.dbService.db.insert(projects).values(data).returning();
    return inserted;
  }

  async update(id: string, data: any) {
    const [updated] = await this.dbService.db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Project not found');
    return updated;
  }

  async remove(id: string) {
    const [deleted] = await this.dbService.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Project not found');
    return deleted;
  }
}
