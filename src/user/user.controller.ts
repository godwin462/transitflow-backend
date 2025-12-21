import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { Public } from 'src/auth/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return {
      message: 'User fetched successfully',
      data: await this.userService.findUserById(id),
    };
  }

  @Get(':email')
  async findUserByEmail(@Param('email') email: string) {
    return {
      message: 'User fetched successfully',
      data: await this.userService.findUserByEmail(email),
    };
  }

  @Public()
  @Get()
  async findAllUsers() {
    return {
      message: 'Users fetched successfully',
      data: await this.userService.findAllUsers(),
    };
  }

  @Public()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return {
      message: 'User deleted successfully',
      data: await this.userService.deleteUser(id),
    };
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return {
      message: 'User updated successfully',
      data: await this.userService.updateUser(id, payload),
    };
  }
}
