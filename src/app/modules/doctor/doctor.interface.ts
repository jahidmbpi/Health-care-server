import { Gender } from "@prisma/client";

export type ISpecialties = {
  specialtyId: string;
  isDeleted?: null;
};
export type IDoctorInput = {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;

  profilePhoto: string | null;
  experience: number;
  gender: Gender;
  appoinmentFee: number;
  isDeleted: boolean;
  specialties: ISpecialties[];
};
