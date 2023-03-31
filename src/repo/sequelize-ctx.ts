import { Sequelize, Options } from "sequelize";
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;
const isPool = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development';
const basicOption: Options = {
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  logging: false,
  // logging: console.debug,
  dialect: 'mysql' ,
  port: isNaN(Number(DB_PORT)) ? 3306 : Number(DB_PORT),
};

const sequelize: Sequelize = !isPool ? new Sequelize(basicOption) : new Sequelize({
  ...basicOption,
  pool: {
    max: 10,
    min: 5,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
