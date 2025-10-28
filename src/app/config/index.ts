import dotenv from "dotenv";
dotenv.config();
interface ENVConfig {
  PORT: string;
  DATABASE_URL: string;
  CLOUDENARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  JWT: {
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRE: string;
  };
}

const LoadEnvVariable = (): ENVConfig => {
  const requiredVariable: string[] = [
    "PORT",
    "DATABASE_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_SECRET",
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
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    JWT: {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
    },
  };
};

export const envVars = LoadEnvVariable();
