import { Module } from '@nestjs/common';
import { S3DatabaseService } from './s3-database.service';

@Module({
  providers: [S3DatabaseService],
  exports: [S3DatabaseService],
})
export class ConfigModule {}
