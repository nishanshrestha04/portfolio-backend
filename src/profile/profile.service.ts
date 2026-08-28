import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { profile } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProfileService {
  constructor(private dbService: DbService) {}

  async getProfile() {
    const data = await this.dbService.db.select().from(profile).limit(1);
    if (!data.length) {
      throw new NotFoundException('Profile not found');
    }
    return data[0];
  }

  async upsertProfile(data: { email?: string; socials?: any; currentlyExploring?: any }) {
    const existing = await this.dbService.db.select().from(profile).limit(1);
    
    if (existing.length > 0) {
      const updateData: any = {};
      if (data.email !== undefined) updateData.email = data.email;
      if (data.socials !== undefined) updateData.socials = data.socials;
      if (data.currentlyExploring !== undefined) updateData.currentlyExploring = data.currentlyExploring;

      const [updated] = await this.dbService.db
        .update(profile)
        .set(updateData)
        .where(eq(profile.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [inserted] = await this.dbService.db
        .insert(profile)
        .values({
          email: data.email || 'admin@nishanshrestha.com',
          socials: data.socials,
          currentlyExploring: data.currentlyExploring,
        })
        .returning();
      return inserted;
    }
  }
}
