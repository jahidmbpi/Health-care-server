import { Response } from "express";

interface ITocken {
  accessTocken: string;
  refreshTocken: string;
}
export const setCoockie = (res: Response, tockenInfo: ITocken) => {
  res.cookie("accessTocken", tockenInfo.accessTocken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.cookie("refreshTocken", tockenInfo.refreshTocken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
};
