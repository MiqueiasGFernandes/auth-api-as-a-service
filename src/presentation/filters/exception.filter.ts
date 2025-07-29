import type { Result } from "@application/dto";
import {
    type ArgumentsHost,
    Catch,
    type ExceptionFilter,
    HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const status = exception.getStatus();
        const message = exception.message || "Internal server error";

        const result: Result<null> = {
            success: false,
            error: message,
            code: status,
        };

        response.status(status).json(result);
    }
}
