import type { Result } from "@application/dto";
import {
    type ArgumentsHost,
    BadRequestException,
    Catch,
    type ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = exception.getStatus();
        let message: string | string[] =
            exception.message || "Internal server error";

        if (exception instanceof BadRequestException) {
            const responseBody = exception.getResponse();
            if (
                typeof responseBody === "object" &&
                responseBody !== null &&
                "message" in responseBody
            ) {
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = responseBody.message as string;
            }
        }

        const result: Result<null> = {
            success: false,
            error: message,
            code: status,
        };

        response.status(status).json(result);
    }
}
