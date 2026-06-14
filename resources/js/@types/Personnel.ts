import type { Department } from "./Department";
import { Rank } from "./Rank";

export type Personnel = {
  personnelId?: number | null;
  profile?: string | null;
  serialNumber?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  rankId?: number | null;
  rank?: Rank | null;
  employmentStatus?: string | null;
  dateEnlisted?: string | null;
  dateEnteredService?: string | null;
  email?: string | null;
  hasAccount?: boolean | null;
  dateOfLastPromotion?: string | null;
  departmentId?: number | null;
  department?: Department | null
  otherDepartmentIds?: number[]
  personnelDepartments?: Department[],


  //other to include in e-monitoring-system
  birthday: string;
  religion: string;
  contactNo: string;
  status: string;
  address: string;
  emergencyContactPerson: string;
  emergencyContactNo: string;
  bloodType: string;
  height: string;
  weight: string;
  identifyingMarks: string;
  eyeColor: string;
  hairColor: string;
};
