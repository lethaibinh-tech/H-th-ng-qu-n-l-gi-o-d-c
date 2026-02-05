
export interface Score {
  subject: string;
  value: number;
}

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  password?: string; // Hidden in UI
  role: UserRole;
  fullName: string;
  avatar?: string;
  studentId?: string; // Links to Student record if role is student
}

export interface Student {
  id: string;
  name: string;
  dob: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  school: string;
  classId: string;
  disciplineRecord: string[];
  absenceCount: number;
  scores: Score[];
  teacherComment: string;
  accountId?: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  room?: string;
}

export type View = 'dashboard' | 'classes' | 'students' | 'rankings' | 'profile' | 'student-portal';
