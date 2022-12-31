export interface DashboardLink {
  label: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface DashboardLinkOptions {
  section: string;
  expanded?: boolean;
}

export type DashboardItem = DashboardLink & DashboardLinkOptions;
