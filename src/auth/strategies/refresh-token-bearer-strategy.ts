import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";
import { Request } from "express";


@Injectable()
export class RefreshTokenFromBearerSrategy extends PassportStrategy(
    Strategy,
    'refresh-jwt',
){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.REFRESH_TOKEN_KEY,
            passReqToCallback: true,
        });
    }
    validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
        const authHeader = req.headers.authorization;
        const refreshToken = authHeader.split('')[1];
        if (!refreshToken) throw new ForbiddenException("Refresh token invalid");
        console.log("Hello ");
        
        return {
          ...payload,
            refreshToken,
        };
        
    }
}