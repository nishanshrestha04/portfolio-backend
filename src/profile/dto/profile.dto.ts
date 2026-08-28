import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ example: 'hello@example.com', required: false })
  email?: string;

  @ApiProperty({ example: [{ name: 'GitHub', href: 'https://github.com' }], required: false })
  socials?: any;

  @ApiProperty({ example: ['Agentic Workflows', 'RAG Architectures'], required: false })
  currentlyExploring?: any;
}
