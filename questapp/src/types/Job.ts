import { EmploymentType, JobCategory, JobHours } from "./JobEnums";

export interface Job {
  _id: string;
  title: string;
  category: JobCategory;
  hours: JobHours;
  employmentType: EmploymentType;
  company: string;
  description: string;
  location: string;
  createdAt: string;
  createdBy: string;
}
