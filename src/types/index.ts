// Shared TypeScript declarations for the HireTrack application

export interface RecruiterSessionUser {
  id: string;
  name: string;
  email: string;
}

export interface CandidateMetric {
  status: string;
  count: number;
}
