import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Nome de usuário',
    example: 'admin'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    description: 'Senha do usuário',
    example: 'admin123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  access_token: string;

  @ApiProperty({ description: 'Tipo do token' })
  token_type: string;

  @ApiProperty({ description: 'Tempo de expiração em segundos' })
  expires_in: number;
}
