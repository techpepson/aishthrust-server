import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@GetUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(userId, updateUserDto);
  }

  @Get('transactions')
  getTransactionHistory(@GetUser('id') userId: string) {
    return this.userService.getTransactionHistory(userId);
  }

  @Get('referrals')
  getReferralStats(@GetUser('id') userId: string) {
    return this.userService.getReferralStats(userId);
  }
}
