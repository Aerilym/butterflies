export interface BotConfig {
  name: string;
  email: string;
  apiKey: string;
}

type ZulipPrivateMessage = {
  type: 'private';
  to: string;
  content: string;
};

type ZulipStreamMessage = {
  type: 'stream';
  to: string;
  topic: string;
  content: string;
};

type ZulipMessageSettings = ZulipPrivateMessage | ZulipStreamMessage;

export class ZulipAPI {
  private bots: Array<BotConfig>;
  constructor(env: FetchPayload['env']) {
    this.bots = [
      {
        name: 'eros',
        email: env.ZULIP_BOT_EMAIL_EROS,
        apiKey: env.ZULIP_BOT_API_KEY_EROS,
      },
      {
        name: 'clickup',
        email: env.ZULIP_BOT_EMAIL_CLICKUP,
        apiKey: env.ZULIP_BOT_API_KEY_CLICKUP,
      },
    ];
  }

  async sendStreamMessage({
    messageSettings,
    sender,
  }: {
    messageSettings: Omit<ZulipStreamMessage, 'type'>;
    sender?: string;
  }): Promise<Response> {
    return await this.sendMessageToZulip({
      messageSettings: { ...messageSettings, type: 'stream' },
      sender,
    });
  }

  async sendPrivateMessage({
    messageSettings,
    sender,
  }: {
    messageSettings: Omit<ZulipPrivateMessage, 'type'>;
    sender?: string;
  }): Promise<Response> {
    return await this.sendMessageToZulip({
      messageSettings: { ...messageSettings, type: 'private' },
      sender,
    });
  }

  async sendMessageToZulip({
    messageSettings,
    sender,
  }: {
    messageSettings: ZulipMessageSettings;
    sender?: string;
  }): Promise<Response> {
    const zulipDomain = 'https://butterflies.zulipchat.com';
    const messageData = new URLSearchParams({
      ...messageSettings,
    });

    const bot = this.parseSender(sender);

    const authHeader = `Basic ${btoa(`${bot.email}:${bot.apiKey}`)}`;
    const headers = {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
      const response = await fetch(`${zulipDomain}/api/v1/messages`, {
        method: 'POST',
        headers: headers,
        body: messageData,
      });

      if (!response.ok) {
        throw new Error(`Error sending message to Zulip: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      throw new Error(`Error sending message to Zulip`);
    }
  }

  parseSender(sender?: string): BotConfig {
    if (sender) {
      const bot = this.bots.find((bot) => bot.name === sender);
      if (bot) return bot;
    }
    const bot = this.bots.find((bot) => bot.name === 'eros');
    if (bot) return bot;

    throw new Error('No bot found');
  }
}
