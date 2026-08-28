import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { articles } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ArticlesService {
  constructor(private dbService: DbService) {}

  async findAll() {
    return this.dbService.db.select().from(articles).orderBy(articles.orderIndex);
  }

  async findOne(id: string) {
    const data = await this.dbService.db.select().from(articles).where(eq(articles.id, id));
    if (!data.length) throw new NotFoundException('Article not found');
    return data[0];
  }

  async create(data: any) {
    const [inserted] = await this.dbService.db.insert(articles).values(data).returning();
    return inserted;
  }

  async update(id: string, data: any) {
    const [updated] = await this.dbService.db
      .update(articles)
      .set(data)
      .where(eq(articles.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Article not found');
    return updated;
  }

  async remove(id: string) {
    const [deleted] = await this.dbService.db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Article not found');
    return deleted;
  }
}
