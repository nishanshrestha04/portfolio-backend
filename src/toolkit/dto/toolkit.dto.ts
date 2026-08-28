import { ApiProperty } from '@nestjs/swagger';

export class ToolkitDto {
  @ApiProperty({ example: 'Frontend' })
  name!: string;

  @ApiProperty({ required: false })
  iconUrl?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false, example: '["React", "Next.js"]' })
  items?: any;

  @ApiProperty({ required: false, example: '0' })
  orderIndex?: string;
}
