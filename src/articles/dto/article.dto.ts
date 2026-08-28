import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty({ example: 'My First Blog Post' })
  title!: string;

  @ApiProperty({ required: false, example: 'A brief description' })
  brief?: string;

  @ApiProperty({ required: false })
  contentUrl?: string;

  @ApiProperty({ required: false, example: '2023-10-01' })
  publishedDate?: string;

  @ApiProperty({ required: false, example: '5' })
  readTime?: string;

  @ApiProperty({ required: false, example: '["React", "Node.js"]' })
  tags?: string;

  @ApiProperty({ required: false, example: '0' })
  orderIndex?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
