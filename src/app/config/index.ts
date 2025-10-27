import dotenv from "dotenv";
dotenv.config();
interface ENVConfig {
  PORT: string;
  DATABASE_URL: string;
  CLOUDENARY: {
    CLOUDENARY_CLOUD_NAME: string;
    CLOUDENARY_API_KEY: string;
    CLOUDENARY_API_SECRET: string;
  };
}

const LoadEnvVariable = (): ENVConfig => {
  const requiredVariable: string[] = [
    "PORT",
    "DATABASE_URL",
    "CLOUDENARY_CLOUD_NAME",
    "CLOUDENARY_API_KEY",
    "CLOUDENARY_API_SECRET",
  ];
  requiredVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`missing environmet variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    CLOUDENARY: {
      CLOUDENARY_CLOUD_NAME: process.env.CLOUDENARY_CLOUD_NAME as string,
      CLOUDENARY_API_KEY: process.env.CLOUDENARY_API_KEY as string,
      CLOUDENARY_API_SECRET: process.env.CLOUDENARY_API_SECRET as string,
    },
  };
};

export const envVars = LoadEnvVariable();
console.log(envVars);
