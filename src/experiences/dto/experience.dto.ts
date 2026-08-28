import { ApiProperty } from '@nestjs/swagger';

export class ExperienceDto {
  @ApiProperty({ example: 'Software Engineer' })
  role!: string;

  @ApiProperty({ example: 'Google' })
  company!: string;

  @ApiProperty({ required: false, example: '2023 - Present' })
  period?: string;

  @ApiProperty({ required: false, example: '["Developed X", "Improved Y"]' })
  description?: string;

  @ApiProperty({ required: false, example: '0' })
  orderIndex?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  logo?: any;
}
