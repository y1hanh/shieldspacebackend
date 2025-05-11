import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // website secure
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    if (username != process.env.USERNAME || pass != process.env.PASSWORD) {
      throw new UnauthorizedException();
    }
    const payload = { username: username, password: pass };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
