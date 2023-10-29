import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { Response } from 'express';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
// import { UpdateAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() AuthDto: AuthDto, 
  @Res({passthrough: true}) res: Response
  ): Promise<Tokens> {
    return this.authService.signup(AuthDto, res);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(
    @Body() AuthDto: AuthDto,
    @Res({passthrough: true}) res: Response
  ): Promise<Tokens> {
    return this.authService.signin(AuthDto, res);
  }
  

  @Post('signout/:id')
  @HttpCode(HttpStatus.OK)
  signout(
    @GetCurrentUserId() userId: string,
    @Res({passthrough: true}) res: Response
  ): Promise<boolean> {
    return this.authService.signout(+userId, res);
  }

  // @Public()
  // @Post('refresh/:id')
  // @HttpCode(HttpStatus.OK)
  // refreshToken(@Param('id')id: string, 
  // @Res({passthrough: true}) res: Response
  // ): Promise<Tokens> {
  //   return this.authService.refreshToken(+id, res);
  // }
  
  
}
