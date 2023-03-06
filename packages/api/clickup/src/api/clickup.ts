import { jsonResponse } from '../helpers';
import type { CreateTask, Task } from '../types/clickup';

export interface ClickUpConfig {
  apiKey: string;
}

export class ClickUpAPI {
  private apiKey: string;
  constructor(config: ClickUpConfig) {
    this.apiKey = config.apiKey;
  }

  async getTask(taskId: string): Promise<Task> {
    if (!this.apiKey) throw new Error('No API key provided for ClickUp');

    const query = new URLSearchParams({
      include_subtasks: 'true',
    }).toString();

    const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.apiKey,
      },
    });

    if (!response.ok) throw new Error(`Error fetching task: ${taskId} - ${response.statusText}`);

    const task = (await response.json()) as Task;

    return task;
  }

  async createTask(task: CreateTask, listId: string) {
    if (!this.apiKey) throw new Error('No API key provided for ClickUp');

    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.apiKey,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error(`Error creating task: ${response.statusText}`);

    return jsonResponse({ success: true }, 200);
  }
}
