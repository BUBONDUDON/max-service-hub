import { Bot } from "@maxhub/max-bot-api";

export abstract class Command {
  constructor(public maxBot: Bot) {}
  abstract handle(): void;
  abstract actions?(): void;
}
