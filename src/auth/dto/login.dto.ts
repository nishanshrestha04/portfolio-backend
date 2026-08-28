import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@nishanshrestha.com' })
  email!: string;

  @ApiProperty({ example: 'password123' })
  password!: string;
}
