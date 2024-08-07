import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const config: IConfig = {
	PORT: parseInt(process.env.PORT as string) || 3000,
	WEATHER_API_KEY: process.env.WEATHER_API_KEY as string,
};

export default config;

interface IConfig {
	PORT: number;
	WEATHER_API_KEY: string;
}
