import {
    type CallHandler,
    type ExecutionContext,
    HttpException,
    Injectable,
    type NestInterceptor,
} from "@nestjs/common";
import { map, type Observable } from "rxjs";

@Injectable()
export class ResultInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            map((result) => {
                if (result?.success === false) {
                    throw new HttpException(result.error, result.code);
                }

                return result;
            }),
        );
    }
}


export const RESPONSE_INTERCEPTOR = "RESPONSE_INTERCEPTOR"