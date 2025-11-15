import type { IConfigService } from "./config.interface.js";
import "dotenv/config";
export class ConfigService implements IConfigService {
  get(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Cannot find ${key} in environment variables`);
    }
    return value;
  }
}
