import express, { Request, Response } from "express";
import config from "./config";
import axios from "axios";
import morgan from "morgan";
const app = express();

app.set("trust proxy", true);
app.use(morgan("dev"));

app.route("/api/hello").get(async (req: Request, res: Response) => {
	let { visitor_name } = req.query;

	if (!visitor_name) visitor_name = "World";
	console.log(visitor_name);

	let user_IP = req.ip;
	let location_weather;

	// Converting IPV6 TO IPV4
	if ((user_IP as any).startsWith("::ffff:")) {
		user_IP = (user_IP as any).split(":").pop();
	}

	try {
		const request = await axios.get(
			`http://api.weatherapi.com/v1/current.json`,
			{
				params: {
					key: config.WEATHER_API_KEY,
					q: user_IP,
				},
			}
		);

		location_weather = request.data;
	} catch (error: any) {
		return res.status(400).json({
			error: "Failed to get location weather data.",
		});
	}

	return res.status(200).json({
		client_ip: user_IP,
		location: location_weather.location.name,
		greeting: `Hello ${visitor_name}, the temperature is ${location_weather.current.temp_c} degrees Celcius in ${location_weather.location.name}`,
	});
});

try {
	app.listen(config.PORT, () => {
		console.log("Server started on port", config.PORT);
	});
} catch (error: any) {
	console.error("Error starting server:", error);
}
