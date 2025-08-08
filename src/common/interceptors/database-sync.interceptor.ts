import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { S3DatabaseService } from '../../config/s3-database.service';

@Injectable()
export class DatabaseSyncInterceptor implements NestInterceptor {
  constructor(private readonly s3DatabaseService: S3DatabaseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          try {
            await this.s3DatabaseService.uploadDatabase();
          } catch (error) {
            console.error('Erro ao sincronizar banco com S3:', error);
          }
        }
      })
    );
  }
}
