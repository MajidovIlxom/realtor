import { ExecutionContext, ForbiddenException, createParamDecorator } from "@nestjs/common";
import { JwtPayload } from "../../auth/types";

export  const GetCurrentUserId = createParamDecorator(
    (_: undefined, context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest();
        const admin = request.user as JwtPayload;
        if (!admin) throw new ForbiddenException("Invalid Token");
        console.log("admin",admin);
                
        return admin.sub;
    },
    
)