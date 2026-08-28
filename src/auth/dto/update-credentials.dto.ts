import { ApiProperty } from '@nestjs/swagger';

export class UpdateCredentialsDto {
  @ApiProperty({ example: 'newemail@example.com', required: false })
  email?: string;

  @ApiProperty({ example: 'newpassword123', required: false })
  password?: string;
}
