import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from './types';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async getToken(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRefreshToken,
      },
    });
  }

  async signup(authDto: AuthDto, res: Response): Promise<Tokens> {
    const candidate = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (candidate) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(authDto.password, 7);
    const newUser = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        hashedPassword: hashedPassword,
      },
    });
    const token = await this.getToken(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, token.refresh_token);
    res.cookie('refresh_token', token.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return token;
  }

  async signin(authDto: AuthDto, res: Response): Promise<Tokens> {
    const { email, password } = authDto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async signout(userId: number, res: Response): Promise<boolean> {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    res.clearCookie('refresh_token');
    return true;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || user.hashedRefreshToken) throw new ForbiddenException('Access Denied');
    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }

  


}