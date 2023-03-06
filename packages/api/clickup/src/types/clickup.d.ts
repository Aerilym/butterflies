export interface ClickUpWebhookBody {
  event: string;
  history_items: any;
  task_id: string;
  webhook_id: string;
}

export interface TaskCreatedEvent {
  event: 'taskCreated';
  history_items: HistoryItem[];
  task_id: string;
  webhook_id: string;
}

export interface TaskUpdatedEvent {
  event: 'taskUpdated';
  history_items: HistoryItem[];
  task_id: string;
  webhook_id: string;
}

export interface TaskDeleteEvent {
  event: 'taskDeleted';
  task_id: string;
  webhook_id: string;
}

export interface TaskCommentPostedEvent {
  event: 'taskCommentPosted';
  history_items: HistoryItemComment[];
  task_id: string;
  webhook_id: string;
}

export interface TaskMovedEvent {
  event: 'taskMoved';
  history_items: HistoryItem[];
  task_id: string;
  webhook_id: string;
}

export interface HistoryItem {
  id: string;
  type: number;
  date: string;
  field: string;
  parent_id: string;
  data: HistoryItemData;
  source: string | null;
  user: User;
  before: any | null;
  after: any | null;
}

export interface HistoryItemComment extends HistoryItem {
  comment: any;
}

export interface HistoryItemData {
  via?: string;
  trace_id?: string;
  subcategory_id?: string;
  status_type?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  color: string;
  initials: string;
  profilePicture: string;
}

export interface Before {
  status: string | null;
  color: string;
  type: string;
  orderindex: number;
}

export interface After {
  status: string | null;
  color: string;
  type: string;
  orderindex: number;
}

export interface Task {
  id: string;
  custom_id: string;
  name: string;
  text_content: string;
  description: string;
  status: Status;
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string;
  creator: Creator;
  assignees: Assignee[];
  checklists: string[];
  tags: string[];
  parent: string;
  priority: string;
  due_date: string;
  start_date: string;
  time_estimate: string;
  time_spent: string;
  custom_fields: CustomField[];
  list: List;
  folder: Folder;
  space: Folder;
  url: string;
}

export interface CreateTask {
  name: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: string;
  due_date?: string;
  due_date_time?: boolean;
  time_estimate?: string;
  start_date?: string;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string;
  time_spent?: string;
  custom_fields?: CustomField[];
}

export interface Assignee {
  id: number;
  username: string;
  color: string;
  initials: string;
  email: string;
  profilePicture: string;
}

export interface Creator {
  id: number;
  username: string;
  color: string;
  profilePicture: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: string;
  type_config: TypeConfig;
  date_created: string;
  hide_from_guests: boolean;
  value: Value;
  required: boolean;
}

export interface Value {
  id: number;
  username: string;
  email: string;
  color: string;
  initials: string;
  profilePicture: null;
}

export interface List {
  id: string;
  name: string;
  access: boolean;
}

export interface Folder {
  id: string;
}

export interface Status {
  status: string;
  color: string;
  orderindex: number;
  type: string;
}
