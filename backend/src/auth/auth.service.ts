import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // website secure
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    // const user = await this.usersService.findOne({ email });
    // if (!user || !(await bcrypt.compare(pass, user.password))) {
    //   throw new UnauthorizedException();
    // }
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
