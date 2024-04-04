export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
  departmentID: number | null;
  institutionCode: string;
}

export interface Department {
  id: number;
  name: string;
  institutionCode: string;
}

export interface DepartmentData {
  departments: Department[];
}
