import dotenv from "dotenv";
dotenv.config();
interface ENVConfig {
  PORT: string;
  DATABASE_URL: string;
}

const LoadEnvVariable = (): ENVConfig => {
  const requiredVariable: string[] = ["PORT", "DATABASE_URL"];
  requiredVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`missing environmet variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
  };
};

export const envVars = LoadEnvVariable();
console.log(envVars);
