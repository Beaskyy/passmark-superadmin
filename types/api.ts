export interface SummaryData {
  total_users: number;
  total_active_users: number;
  total_scripts_marked: number;
  total_scripts: number;
  total_courses: number;
  total_assessments: number;
  total_organisations: number;
}

export interface SummaryResponse {
  status: boolean;
  message: string;
  data: SummaryData;
}

export interface User {
  user_id: number;
  email: string;
  fullname: string;
  is_staff: boolean;
  is_superuser: boolean;
  verified: boolean;
  created_at: string;
  organisation_id: string | null;
  organisation_name: string | null;
}

export interface UsersListResponse {
  status: boolean;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  data: User[];
}

export interface ActiveUser extends User {
  scripts_marked_count: number;
}

export interface ActiveUsersListResponse {
  status: boolean;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  data: ActiveUser[];
}