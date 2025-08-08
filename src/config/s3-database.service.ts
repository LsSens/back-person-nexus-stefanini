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
    this.databaseKey = process.env.DATABASE_NAME || 'h2db.db';
    this.localDatabasePath = '/tmp/h2db.db';
  }

  async downloadDatabase(): Promise<boolean> {
    try {
      this.logger.log(`Tentando baixar banco de dados do S3: ${this.bucketName}/${this.databaseKey}`);
      
      const params = {
        Bucket: this.bucketName,
        Key: this.databaseKey,
      };

      const data = await this.s3.getObject(params).promise();
      
      if (data.Body) {
        const body = data.Body as Buffer;
        fs.writeFileSync(this.localDatabasePath, body);
        this.logger.log(`Banco de dados baixado com sucesso do S3 para: ${this.localDatabasePath}`);
        return true;
      }
      
      this.logger.warn('Resposta do S3 não contém dados do banco');
      return false;
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        this.logger.log('Banco de dados não encontrado no S3, será criado localmente');
        return false;
      }
      if (error.code === 'NoSuchBucket') {
        this.logger.error(`Bucket S3 não encontrado: ${this.bucketName}`);
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
    try {
      this.logger.log('Verificando se o banco de dados existe...');
      
      const downloaded = await this.downloadDatabase();
      
      if (!downloaded) {
        this.logger.log('Banco não encontrado no S3, criando arquivo vazio localmente');
        const fs = require('fs');
        fs.writeFileSync(this.localDatabasePath, '');
        this.logger.log('Arquivo de banco criado em:', this.localDatabasePath);
      }
      
      if (require('fs').existsSync(this.localDatabasePath)) {
        this.logger.log('Banco de dados local verificado com sucesso');
      } else {
        throw new Error('Não foi possível criar/verificar o arquivo do banco');
      }
    } catch (error) {
      this.logger.error('Erro ao garantir existência do banco:', error);
      throw error;
    }
  }
}
