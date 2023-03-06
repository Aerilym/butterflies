import * as GOOGLE from '@googleapis/calendar/v3';
import { jsonResponse } from '../helpers';

export interface GoogleConfig {
  apiKey: string;
}

export class GoogleAPI {
  private apiKey: string;
  constructor(config: GoogleConfig) {
    this.apiKey = config.apiKey;
  }

  async createCalendarEvent(
    event: GOOGLE.calendar_v3.Params$Resource$Events$Insert['requestBody'],
  ) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) throw new Error(`Error creating event: ${response.statusText}`);

    return jsonResponse({ success: true }, 200);
  }
  // Todo: implement access token getting
  getAccessToken() {
    return '';
  }
}
