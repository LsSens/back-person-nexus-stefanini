import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class S3DatabaseService {
  private readonly logger = new Logger(S3DatabaseService.name);
  private s3: AWS.S3;
  private readonly bucketName: string;
  private readonly databaseKey: string;
  private readonly localDatabasePath: string;

  constructor() {
    this.s3 = new AWS.S3();
    this.bucketName = process.env.S3_BUCKET_NAME || 'pessoa-cadastro-db';
    this.databaseKey = process.env.DATABASE_KEY || 'h2db.db';
    this.localDatabasePath = '/tmp/h2db.db';
  }

  async downloadDatabase(): Promise<boolean> {
    try {
      this.logger.log('Tentando baixar banco de dados do S3...');
      
      const params = {
        Bucket: this.bucketName,
        Key: this.databaseKey,
      };

      const data = await this.s3.getObject(params).promise();
      
      if (data.Body) {
        const body = data.Body as Buffer;
        fs.writeFileSync(this.localDatabasePath, body);
        this.logger.log('Banco de dados baixado com sucesso do S3');
        return true;
      }
      
      return false;
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        this.logger.log('Banco de dados não encontrado no S3, será criado localmente');
        return false;
      }
      this.logger.error('Erro ao baixar banco de dados do S3:', error);
      return false;
    }
  }

  async uploadDatabase(): Promise<void> {
    try {
      if (!fs.existsSync(this.localDatabasePath)) {
        this.logger.warn('Arquivo de banco local não encontrado para upload');
        return;
      }

      this.logger.log('Fazendo upload do banco de dados para o S3...');
      
      const fileContent = fs.readFileSync(this.localDatabasePath);
      
      const params = {
        Bucket: this.bucketName,
        Key: this.databaseKey,
        Body: fileContent,
        ContentType: 'application/octet-stream',
      };

      await this.s3.putObject(params).promise();
      this.logger.log('Banco de dados enviado com sucesso para o S3');
    } catch (error) {
      this.logger.error('Erro ao fazer upload do banco de dados para o S3:', error);
    }
  }

  getLocalDatabasePath(): string {
    return this.localDatabasePath;
  }

  async ensureDatabaseExists(): Promise<void> {
    const exists = await this.downloadDatabase();
    if (!exists) {
      this.logger.log('Criando novo banco de dados local');
      // O TypeORM criará o banco automaticamente
    }
  }
}
