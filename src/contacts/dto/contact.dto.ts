import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: 'Hello, I want to collaborate!' })
  message!: string;

  @ApiProperty({ required: false, example: 'unread' })
  status?: string;
}
