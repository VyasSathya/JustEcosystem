export interface Command {
  name: string;
  execute: (...args: any[]) => Promise<any>;
  description?: string;
  usage?: string;
  aliases?: string[];
} 