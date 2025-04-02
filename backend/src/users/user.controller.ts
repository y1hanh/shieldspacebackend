import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { User, Prisma } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  getUser(): Promise<User[]> {
    return this.userService.users({});
  }

  @Post('users')
  createUser(@Body() userData: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Delete('users/delete:id')
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
