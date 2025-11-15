import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { IConfigService } from "../config/config.interface.js";

export class SupabaseService {
  private client: SupabaseClient;

  constructor(config: IConfigService) {
    const url = config.get("SUPABASE_URL");
    const key = config.get("SUPABASE_ANON_ROLE_KEY");
    this.client = createClient(url, key);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
