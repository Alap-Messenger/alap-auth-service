import { error } from 'console';
import * as dotenv from 'dotenv';

export interface IMongoConfig {
	mongodbUsername: string;
	mongodbPassword: string;
	mongodbHost: string;
	dbName: string;
}

const getMongoConfig = (): IMongoConfig => {
	return {
		mongodbUsername: process.env.MONGODB_USERNAME,
		mongodbPassword: process.env.MONGODB_PASSWORD,
		mongodbHost: process.env.MONGODB_HOST,
		dbName: process.env.MONGODB_DB_NAME,
	};
};

export interface IConfig {
	port: number;
	mongoURL: string;
}

dotenv.config();

const config = (): IConfig => {
	const mongoConfig = getMongoConfig();
	const { mongodbUsername, mongodbPassword, mongodbHost, dbName } = mongoConfig;
	const mongoURL = `mongodb+srv://${mongodbUsername}:${mongodbPassword}@${mongodbHost}/${dbName}`;
	if (!mongoURL || mongoURL === '') throw new error('MongoDB url is required');
	return {
		port: parseInt(process.env.PORT, 10) || 3000,
		mongoURL,
	};
};

export class StartupError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'StartupError';
	}
}

export default config();
