// export interface Application {
//   _id: string;
//   applicant: string | undefined;
//   coverLetter: string;
//   status: string | undefined;
//   feedback?: string | undefined;
//   appliedAt: string;
//   job: string | { _id: string };
// }

export interface Application {
  _id: string;
  applicant: string | undefined;
  coverLetterFileUrl: string;
  coverLetterFileName?: string;
  coverLetterFileType?: string;
  status?: string;
  feedback?: string;
  appliedAt: string;
  job: string | { _id: string };
}
