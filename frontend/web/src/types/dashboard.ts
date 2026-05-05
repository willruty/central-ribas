export interface User {
  name: string;
  role: string;
  phone: string;
  location: string;
  avatar?: string;
  initials: string;
}

export interface Contract {
  client: string;
  code: string;
  status: string;
  days: string;
  action: string;
  date?: string;
  extraDate?: string;
}

export interface Meeting {
  company: string;
  desc: string;
  time: string;
  icon: string;
}

export interface PendingDoc {
  type: string;
  client: string;
  time: string;
  status: "success" | "warning";
}

export interface RecentFile {
  name: string;
  author: string;
  time: string;
  extra: string;
  color: string;
}

export interface UrgentDoc {
  code: string;
  desc: string;
  detail: string;
  time: string;
  priority: number;
}

export interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  footer: string;
  bg: string;
  icon?: any;
  footerIcon?: any;
  textDark?: boolean;
  delay?: number;
}
