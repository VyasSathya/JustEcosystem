import { Command } from './types';

export class CommandManager {
  private commands: Map<string, Command> = new Map();

  register(command: Command): void {
    this.commands.set(command.name, command);
  }

  async execute(commandName: string, args: any[] = []): Promise<any> {
    const command = this.commands.get(commandName);
    if (!command) {
      throw new Error(`Command '${commandName}' not found`);
    }

    try {
      return await command.execute(...args);
    } catch (error) {
      throw new Error(`Failed to execute command '${commandName}': ${error.message}`);
    }
  }

  getCommand(commandName: string): Command | undefined {
    return this.commands.get(commandName);
  }

  listCommands(): string[] {
    return Array.from(this.commands.keys());
  }
} 