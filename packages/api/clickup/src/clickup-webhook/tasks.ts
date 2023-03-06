import { ClickUpAPI } from '../api/clickup';
import { GoogleAPI } from '../api/google';
import { ZulipAPI } from '../api/zulip';
import { getMappedZulipStream, getPersonalEmail, jsonResponse } from '../helpers';
import {
  ClickUpWebhookBody,
  CreateTask,
  Task,
  TaskCommentPostedEvent,
  TaskCreatedEvent,
  TaskMovedEvent,
  TaskUpdatedEvent,
} from '../types/clickup';

export type CustomAssignee = Task['assignees'][0] & { personalEmail: string };

export async function handleTaskEvent(
  event: string,
  body: ClickUpWebhookBody,
  { request, env, ctx }: FetchPayload,
) {
  switch (event) {
    case 'Created':
      return await handleTaskCreated(body, { request, env, ctx });

    case 'Updated':
      return await handleTaskUpdated(body, { request, env, ctx });

    /* 
    case 'Deleted':
      return await handleTaskDeleted(body, { request, env, ctx });

    case 'PriorityUpdated':
      return await handleTaskPriorityUpdated(body, { request, env, ctx });

    case 'StatusUpdated':
      return await handleTaskStatusUpdated(body, { request, env, ctx });
    case 'AssigneeUpdated':
      return await handleTaskAssigneeUpdated(body, { request, env, ctx });

    case 'DueDateUpdated':
      return await handleTaskDueDateUpdated(body, { request, env, ctx });

    case 'TagUpdated':
      return await handleTaskTagUpdated(body, { request, env, ctx });
    */

    case 'Moved':
      return await handleTaskMoved(body, { request, env, ctx });

    case 'CommentPosted':
      return await handleTaskCommentPosted(body, { request, env, ctx });
    /*
    case 'CommentUpdated':
      return await handleTaskCommentUpdated(body, { request, env, ctx });

    case 'CommentDeleted':
      return await handleTaskCommentDeleted(body, { request, env, ctx });

    case 'TimeEstimateUpdated':
      return await handleTaskTimeEstimateUpdated(body, { request, env, ctx });

    case 'TimeTrackedUpdated':
      return await handleTaskTimeTrackedUpdated(body, { request, env, ctx }); */

    default:
      return jsonResponse({ error: 'Event not supported yet', event: event }, 404);
  }
}

export async function handleTaskCreated(
  body: ClickUpWebhookBody,
  { request, env, ctx }: FetchPayload,
) {
  const creationBody = body as TaskCreatedEvent;

  const clickUpAPI = new ClickUpAPI({ apiKey: env.CLICKUP_API_KEY });

  const task = await clickUpAPI.getTask(creationBody.task_id);

  const listName = task.list.name;

  if (listName === 'Team Meetings') return handleCreateTeamMeetingTask(task, env);
  const {
    id,
    name,
    description,
    status: { status },
    assignees,
    priority,
    due_date,
    time_estimate,
  } = task;

  const parsedDate = new Date(parseInt(due_date)).toDateString();

  const dateString =
    parsedDate === 'Invalid Date' ? 'No due date' : parsedDate.substring(0, parsedDate.length - 5);

  let message = '**Task created:**\n';
  message += '```quote\n';
  if (name) message += `**[${name}](https://app.clickup.com/t/${id})**\n`;
  if (priority) message += `**Priority:** ${priority}\n`;
  if (status) message += `**Status:** ${status.toUpperCase()}\n`;
  if (due_date) message += `**Due Date:** ${dateString}\n`;
  if (time_estimate)
    message += `**Time Estimate:** ${parseInt(time_estimate) / (3.6 * 10 ** 6)}h\n`;
  if (listName) message += `**List:** ${listName}\n`;
  if (assignees && assignees.length > 0) {
    message += `**Assignees:** ${assignees
      .map((assignee) => `@**${assignee.username}**`)
      .join(' ')}\n`;
  }
  if (description) message += `**Description:** ${description}\n`;
  message += '```';

  const messageResponse = await sendMessageToStream(message, listName, { request, env, ctx });
  return jsonResponse({ message: 'Task created' }, messageResponse.status);
}

export async function handleTaskUpdated(body: ClickUpWebhookBody, { env }: FetchPayload) {
  const updateBody = body as TaskUpdatedEvent;

  const clickUpAPI = new ClickUpAPI({ apiKey: env.CLICKUP_API_KEY });

  const task = await clickUpAPI.getTask(updateBody.task_id);

  const {
    id,
    name,
    description,
    status: { status },
    assignees,
    priority,
    due_date,
    time_estimate,
    list: { name: listName },
    date_created,
  } = task;

  if (listName === 'Team Meetings') return handleUpdateTeamMeetingTask(task, updateBody, env);

  const parsedDate = new Date(parseInt(due_date)).toDateString();

  const dateString =
    parsedDate === 'Invalid Date' ? 'No due date' : parsedDate.substring(0, parsedDate.length - 5);

  const creationDate = new Date(parseInt(date_created));

  const changedField = updateBody.history_items[0].field;

  if (changedField === 'comment' || changedField === 'section_moved') {
    return jsonResponse({ message: 'Task created' }, 200);
  }

  const before = updateBody.history_items[0].before;
  const after = updateBody.history_items[0].after;

  const value = () => {
    try {
      switch (changedField) {
        case 'content': {
          const field = 'Description';
          const old = JSON.parse(before).ops[0].insert ?? 'None';
          const updated = JSON.parse(after).ops[0].insert ?? 'None';
          return { field, old, updated };
        }

        case 'status': {
          const field = 'Status';
          const old = before.status ?? 'None';
          const updated = after.status ?? 'None';
          return { field, old, updated };
        }

        case 'priority': {
          const field = 'Priority';
          const old = before.priority.priority ?? 'None';
          const updated = after.priority.priority ?? 'None';
          return { field, old, updated };
        }

        case 'due_date': {
          const field = 'Due Date';
          const old = before.due_date ?? 'None';
          const updated = after.due_date ?? 'None';
          return { field, old, updated };
        }

        case 'time_spent': {
          const field = 'Time Spent';
          const old =
            before && before.time_spent?.time
              ? `${parseInt(before.time_spent.time) / (3.6 * 10 ** 6)}h`
              : 'None';
          const updated =
            after && after.time_spent?.time
              ? `${parseInt(after.time_spent.time) / (3.6 * 10 ** 6)}h`
              : 'None';
          return { field, old, updated };
        }

        case 'time_estimate': {
          const field = 'Time Estimate';
          const old = before ? `${parseInt(before) / (3.6 * 10 ** 6)}h` : 'None';
          const updated = after ? `${parseInt(after) / (3.6 * 10 ** 6)}h` : 'None';

          return { field, old, updated };
        }

        case 'assignee_add': {
          const field = 'Assignee Added';
          const old = before.username ?? '';
          const updated = after.username ?? '';

          return { field, old, updated };
        }

        case 'assignee_remove': {
          const field = 'Assignee Removed';
          const old = before.username ?? '';
          const updated = after.username ?? '';

          return { field, old, updated };
        }

        default:
          return { old: JSON.stringify(before), updated: JSON.stringify(after) };
      }
    } catch (error) {
      return { old: JSON.stringify(before), updated: JSON.stringify(after) };
    }
  };

  const { field, old, updated } = value();

  let message = `**Task updated:** **[${name}](https://app.clickup.com/t/${id})**\n`;
  message += '```quote\n';

  // If less than 5 minutes old, only send changes
  if (Date.now() - creationDate.getTime() < 5 * 60 * 1000) {
    if (changedField === 'assignee_add') {
      message += `**${field}:** ${updated}\n`;
    } else if (changedField === 'assignee_remove') {
      message += `**${field}:** ~~${old}~~\n`;
    } else if (
      changedField === 'status' ||
      changedField === 'priority' ||
      changedField === 'due_date' ||
      changedField === 'time_estimate' ||
      changedField === 'time_spent'
    ) {
      message += `**${field}:** ${old} -> ${updated}\n`;
    } else {
      message += `**${field}** changed from: ~~`;
      message += `${old}~~\n`;
      message += `to: `;
      message += `${updated}\n`;
    }
  } else {
    if (field) message += `**${field}** changed\n`;
    if (priority) message += `**Priority:** ${priority}\n`;
    if (status) message += `**Status:** ${status.toUpperCase()}\n`;
    if (due_date) message += `**Due Date:** ${dateString}\n`;
    if (time_estimate)
      message += `**Time Estimate:** ${parseInt(time_estimate) / (3.6 * 10 ** 6)}h\n`;
    if (listName) message += `**List:** ${listName}\n`;
    if (assignees && assignees.length > 0) {
      message += `**Assignees:** ${assignees
        .map((assignee) => `@**${assignee.username}**`)
        .join(' ')}\n`;
    }
    if (description) message += `**Description:** ${description}\n`;
  }
  message += '```';

  const messageResponse = await sendMessageToStream(message, listName, env);
  return jsonResponse({ message: 'Task created' }, messageResponse.status);
}

export async function handleCreateTeamMeetingTask(
  task: Task,
  env: FetchPayload['env'],
): Promise<Response> {
  const { id, name, assignees, due_date, time_estimate, custom_fields } = task;

  const attendees = await createCustomAssignees(assignees, env);

  const dueDate = new Date(parseInt(due_date));
  const parsedDate = dueDate.toDateString();
  const dateString =
    parsedDate === 'Invalid Date' ? 'No due date' : parsedDate.substring(0, parsedDate.length - 5);

  const timeString = dueDate.toLocaleTimeString('en-US', {
    timeZone: 'Australia/Melbourne',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const link = custom_fields.find((field) => field.name === 'Meeting Link')?.value;
  const location = custom_fields.find((field) => field.name === 'Location')?.value;

  let message = `**Meeting Created: [${name}](https://app.clickup.com/t/${id})**\n`;
  message += '```quote\n';
  if (due_date)
    message += `**Date:** ${dateString} ${timeString !== '00:00am' ? timeString : ''} \n`;
  if (time_estimate)
    message += `**Time Estimate:** ${parseInt(time_estimate) / (3.6 * 10 ** 6)}h\n`;
  if (!link && location) message += `**Location:** ${location}\n`;
  if (link) message += `**Link:** ${link}\n`;
  if (assignees && assignees.length > 0) {
    message += `**Assignees:** ${assignees
      .map((assignee) => `@**${assignee.username}**`)
      .join(' ')}\n`;
  }
  message += '```';

  await sendPrivateMessagesToAssignees({ env, assignees: attendees }, message);

  const googleAPI = new GoogleAPI(env.GOOGLE_CAL_API_KEY);

  const startDate = new Date(parseInt(due_date));

  const meetingTime = time_estimate ? parseInt(time_estimate) : 30 * 60 * 1000;

  const endDate = new Date(parseInt(due_date) + meetingTime);

  await googleAPI.createCalendarEvent({
    summary: `Butterflies | ${name}`,
    description: `${link ? `Link: ${link} \n` : ''}`,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Australia/Melbourne',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Australia/Melbourne',
    },
    attendees: attendees.map((attendee) => ({
      email: attendee.personalEmail ?? attendee.email,
    })),
  });

  return jsonResponse({ message: 'Task created' }, 200);
}

async function createCustomAssignees(
  assignees: Task['assignees'],
  env: FetchPayload['env'],
): Promise<Array<CustomAssignee>> {
  const personalEmails = await Promise.all(
    assignees.map((assignee) => getPersonalEmail(assignee.email, env.BUTTERFLIES_EMAIL_MAP)),
  );

  const attendees = assignees.map((assignee, idx) => {
    const personalEmail = personalEmails[idx];
    return {
      ...assignee,
      personalEmail,
    } as CustomAssignee;
  });
  return attendees;
}

export async function handleUpdateTeamMeetingTask(
  task: Task,
  updateBody: TaskUpdatedEvent,
  env: FetchPayload['env'],
): Promise<Response> {
  const { id, name, assignees, due_date } = task;

  const changedField = updateBody.history_items[0].field;

  //const before = updateBody.history_items[0].before;
  const after = updateBody.history_items[0].after;

  let message = `**Meeting Updated: [${name}](https://app.clickup.com/t/${id})**\n`;
  message += '```quote\n';

  switch (changedField) {
    case 'status':
      if (
        after.status === 'post meeting action items' ||
        after.status === 'meeting completed' ||
        after.status === 'closed'
      ) {
        if (task.custom_fields.find((field) => field.name === 'Weekly')?.value) {
          const createTaskResult = await createTaskFromMeetingTask(task, env);
          return jsonResponse({ message: 'Meeting Task created' }, createTaskResult.status);
        }
      }
      break;

    case 'due_date':
      {
        const dueDate = new Date(parseInt(due_date));
        const parsedDate = dueDate.toDateString();
        const dateString =
          parsedDate === 'Invalid Date'
            ? 'No due date'
            : parsedDate.substring(0, parsedDate.length - 5);

        const timeString = dueDate.toLocaleTimeString('en-US', {
          timeZone: 'Australia/Melbourne',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
        message += `**New Time:** ${dateString} ${timeString !== '00:00am' ? timeString : ''} \n`;
      }
      break;
    default:
      break;
  }
  message += '```';

  await sendPrivateMessagesToAssignees(
    { env, assignees: await createCustomAssignees(assignees, env) },
    message,
  );

  return jsonResponse({ message: 'Meeting Task updated' }, 200);
}

export async function handleTaskMoved(
  body: ClickUpWebhookBody,
  { env }: FetchPayload,
): Promise<Response> {
  const movedBody = body as TaskMovedEvent;
  const previousList = movedBody.history_items[0].before.name;
  const newList = movedBody.history_items[0].after.name;

  const previousTarget = await getMappedZulipStream(previousList, env.CLICKUP_ZULIP_SPACE_MAP);
  const newTarget = await getMappedZulipStream(newList, env.CLICKUP_ZULIP_SPACE_MAP);

  const previousListName = previousTarget
    ? `#**${previousTarget.to}>${previousTarget.topic}**`
    : previousList;

  const newListName = newTarget ? `#**${newTarget.to}>${newTarget.topic}**` : newList;

  const clickUpAPI = new ClickUpAPI({ apiKey: env.CLICKUP_API_KEY });

  const { id, name } = await clickUpAPI.getTask(movedBody.task_id);

  const previousMessage = `**Task moved to ${newListName}: [${name}](https://app.clickup.com/t/${id})**\n`;
  const newMessage = `**Task moved from ${previousListName}: [${name}](https://app.clickup.com/t/${id})**\n`;

  const previousMessageResponse = await sendMessageToStream(previousMessage, previousList, env);
  const newMessageResponse = await sendMessageToStream(newMessage, newList, env);

  const responseCode = () => {
    if (previousMessageResponse.status === newMessageResponse.status)
      return previousMessageResponse.status;
    if (previousMessageResponse.status === 200) return newMessageResponse.status;
    if (newMessageResponse.status === 200) return previousMessageResponse.status;
    return 500;
  };

  return jsonResponse({ message: 'Task moved' }, responseCode());
}

export async function handleTaskCommentPosted(
  body: ClickUpWebhookBody,
  { env }: FetchPayload,
): Promise<Response> {
  const commentBody = body as TaskCommentPostedEvent;

  const commentInfo = commentBody.history_items[0].comment;

  const clickUpAPI = new ClickUpAPI({ apiKey: env.CLICKUP_API_KEY });

  const {
    id,
    name,
    list: { name: listName },
  } = await clickUpAPI.getTask(commentBody.task_id);

  let message = `**Comment posted by @_**${commentInfo.user.username}** on [${name}](https://app.clickup.com/t/${id})**\n`;

  message += '```quote\n';
  message += `${commentInfo.text_content ?? ''}\n`;
  message += '```';

  const messageResponse = await sendMessageToStream(message, listName, env);
  return jsonResponse({ message: 'Task comment posted' }, messageResponse.status);
}

export async function sendMessageToStream(
  message: string,
  listName: string,
  env: FetchPayload['env'],
): Promise<Response> {
  const target = await getMappedZulipStream(listName, env.CLICKUP_ZULIP_SPACE_MAP);

  const zulipAPI = new ZulipAPI(env);

  if (!target) {
    const messageResponse = await zulipAPI.sendPrivateMessage({
      messageSettings: {
        to: 'ryan.miller@butterflies.app',
        content: message,
      },
      sender: 'clickup',
    });
    return messageResponse;
  }

  const messageResponse = await zulipAPI.sendStreamMessage({
    messageSettings: {
      ...target,
      content: message,
    },
    sender: 'clickup',
  });
  return messageResponse;
}

async function sendPrivateMessagesToAssignees(
  { env, assignees }: { env: FetchPayload['env']; assignees: Array<CustomAssignee> },
  message: string,
) {
  const zulipAPI = new ZulipAPI(env);

  for (const attendee of assignees) {
    const target = {
      to: attendee.email,
      type: 'private',
    };

    const messageResponse = await zulipAPI.sendPrivateMessage({
      messageSettings: {
        ...target,
        content: message,
      },
      sender: 'clickup',
    });

    if (!messageResponse.ok) {
      if (!attendee.personalEmail) throw new Error("Couldn't find personal email");

      const target = {
        to: attendee.personalEmail,
        type: 'private',
      };

      await zulipAPI.sendPrivateMessage({
        messageSettings: {
          ...target,
          content: message,
        },
        sender: 'clickup',
      });
    }
  }
}

function createTaskFromMeetingTask(task: Task, env: FetchPayload['env']): Promise<Response> {
  const {
    name,
    //description,
    assignees,
    tags,
    //status,
    priority,
    due_date,
    time_estimate,
    start_date,
    parent,
    custom_fields,
    list: { id: listId },
  } = task;

  const dueDate = new Date(parseInt(due_date) + 7 * 24 * 60 * 60 * 1000);

  const startDate = new Date(parseInt(start_date) + 7 * 24 * 60 * 60 * 1000);

  const newTask = {
    name,
    description: '',
    assignees: assignees.map((assignee) => assignee.id),
    tags,
    status: 'scheduled',
    priority,
    due_date: due_date ? dueDate.getTime().toString() : undefined,
    due_date_time: due_date ? true : undefined,
    time_estimate,
    start_date: start_date ? startDate.getTime().toString() : undefined,
    start_date_time: start_date ? true : undefined,
    notify_all: true,
    parent,
    custom_fields,
  } as CreateTask;

  const clickUpAPI = new ClickUpAPI({ apiKey: env.CLICKUP_API_KEY });

  return clickUpAPI.createTask(newTask, listId);
}
