import { config } from 'dotenv';

config();

export interface IMongoDBConfig {
  url: string;
  database: string;
}

export const MongoDBConfig: IMongoDBConfig = {
  url: process.env.MONGODB_URL ?? 'that will not work',
  database: process.env.MONGODB_DB ?? 'that will not work'
};
