import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import applyExtra from "./applyExtra";
dotenv.config({ path: `${__dirname}/../../.env` });

export const sequelize: Sequelize = new Sequelize(<string>process.env.DB_NAME, <string>process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: "postgres",
	logging: false,
	logQueryParameters: true,
	benchmark: true,
	pool: {
		max: 5, // max connections
		min: 0, // min connections
		idle: 30000, // The maximum time, in milliseconds, that a connection can be idle before being released.
		acquire: 60000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
	},
});

const models: any[] = [
	require("./models/AutoMod").default,
	require("./models/Guild").default,
	require("./models/GuildLogging").default,
	require("./models/GuildConfiguration").default,
	require("./models/GuildModerationRoles").default,
	require("./models/GuildOverrideCommands").default,
	require("./models/Infraction").default,
	require("./models/Tempban").default,
	require("./models/Tempmute").default,
];

for (const modelDefiner of models) modelDefiner(sequelize);
applyExtra(sequelize);
