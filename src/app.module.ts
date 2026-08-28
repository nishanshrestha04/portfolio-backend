import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ArticlesModule } from './articles/articles.module';
import { ToolkitModule } from './toolkit/toolkit.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProfileModule } from './profile/profile.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [DbModule, S3Module, AuthModule, ProjectsModule, ExperiencesModule, ArticlesModule, ToolkitModule, ContactsModule, ProfileModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
