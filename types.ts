export interface Subject {
  id: string;
  name: string;
  code: string;
  professor: string;
  classesConducted: number;
  classesAttended: number;
  credits: number; 
  targetGrade: string; 
  room?: string; 
  color: string;
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string; // ISO Date string
  description?: string;
  priority: Priority; 
  estimatedTime?: string; 
  tags: string[]; 
  isCompleted: boolean;
  resourceLink?: string; // For "uploaded" file links
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface ScheduleItem {
  id: string;
  subjectId: string;
  day: DayOfWeek;
  startTime: string; // HH:mm 24h format
  endTime: string;
  location?: string;
}

export interface Settings {
  notificationsEnabled: boolean;
  themeMode: 'dark' | 'midnight';
}

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}

// Navigation types
export type View = 'dashboard' | 'subjects' | 'assignments' | 'timetable' | 'focus' | 'settings';

// Warm / Gold / Nature palette (User Friendly)
export const SUBJECT_COLORS = [
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F43F5E', // Rose
  '#EAB308', // Yellow
  '#6366F1', // Indigo
];