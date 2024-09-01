import { error } from 'console';
import * as dotenv from 'dotenv';

export interface IMongoConfig {
	mongodbUsername: string;
	mongodbPassword: string;
	mongodbHost: string;
	dbName: string;
}
export interface IRedisConfig {
	redisHost: string;
	redisPort: string;
}

const getMongoConfig = (): IMongoConfig => {
	return {
		mongodbUsername: process.env.MONGODB_USERNAME,
		mongodbPassword: process.env.MONGODB_PASSWORD,
		mongodbHost: process.env.MONGODB_HOST,
		dbName: process.env.MONGODB_DB_NAME,
	};
};
const getRedisConfig = (): IRedisConfig => {
	return {
		redisHost: process.env.REDIS_HOST,
		redisPort: process.env.REDIS_PORT,
	};
};

export interface IConfig {
	port: number;
	mongoURL: string;
	redisURL: string;
	redisHost: string;
	redisPort: number;
}

dotenv.config();

const config = (): IConfig => {
	const mongoConfig = getMongoConfig();
	const redisConfig = getRedisConfig();

	const { mongodbUsername, mongodbPassword, mongodbHost, dbName } = mongoConfig;
	const { redisHost, redisPort } = redisConfig;

	const mongoURL = `mongodb+srv://${mongodbUsername}:${mongodbPassword}@${mongodbHost}/${dbName}`;
	const redisURL = `redis://${redisHost}:${redisPort}`;

	if (!redisURL || redisURL === '') throw new error('Redis url is required');
	if (!mongoURL || mongoURL === '') throw new error('MongoDB url is required');

	return {
		port: parseInt(process.env.PORT, 10) || 3000,
		mongoURL,
		redisURL,
		redisHost,
		redisPort: parseInt(redisPort, 10),
	};
};

export class StartupError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'StartupError';
	}
}

export default config();
