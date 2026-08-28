import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty({ example: 'My Project' })
  title!: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  overview?: string;

  @ApiProperty({ required: false })
  problem?: string;

  @ApiProperty({ required: false })
  approach?: string;

  @ApiProperty({ required: false, example: '["React", "NestJS"]' })
  architecture?: string;

  @ApiProperty({ required: false, example: '["TypeScript", "PostgreSQL"]' })
  technologies?: string;

  @ApiProperty({ required: false })
  liveUrl?: string;

  @ApiProperty({ required: false })
  githubUrl?: string;

  @ApiProperty({ required: false, example: 'true' })
  isFeatured?: string;

  @ApiProperty({ required: false, example: '0' })
  orderIndex?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
