export interface DashboardLink {
  label: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface DashboardLinkOptions {
  section: DashboardSection;
  expanded?: boolean;
}

export type DashboardSection = 'general' | 'development' | 'design' | 'tool';

export type DashboardItem = DashboardLink & DashboardLinkOptions;
