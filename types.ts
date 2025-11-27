export interface Wish {
  id?: number;
  name: string;
  message: string;
  created_at?: string;
}

export interface SongRequest {
  id?: number;
  song: string;
  created_at?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}