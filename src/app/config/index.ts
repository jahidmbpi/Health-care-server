import dotenv from "dotenv";
dotenv.config();
interface ENVConfig {
  port: string;
}

const LoadEnvVariable = () => {
  const requiredVariable: string[] = ["PORT"];
  requiredVariable.forEach((key) => {
    if (process.env[key]) {
      throw new Error(`missing environmet variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT,
  };
};

export const envVars = LoadEnvVariable();
