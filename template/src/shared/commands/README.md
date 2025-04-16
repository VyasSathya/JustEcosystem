# JustStuff Command System

The command system provides an extensible way to implement operations in the JustStuff platform. Commands follow a consistent interface and are managed through the CommandManager.

## Table of Contents
- [Overview](#overview)
- [Command Interface](#command-interface)
- [Command Manager](#command-manager)
- [Implementing Commands](#implementing-commands)
- [Executing Commands](#executing-commands)
- [Command Best Practices](#command-best-practices)

## Overview

The JustStuff command system is designed for flexibility and extensibility. It follows the Command pattern, allowing encapsulation of requests as objects, which enables:

- Parameterization of operations
- Queuing and logging of commands
- Undoable operations
- Extension points for the application

## Command Interface

Commands are defined using the `Command` interface in `types.ts`:

```typescript
export interface Command {
  name: string;
  execute: (...args: any[]) => Promise<any>;
  description?: string;
  usage?: string;
  aliases?: string[];
}
```

| Property | Description |
|----------|-------------|
| `name` | Unique command identifier |
| `execute` | Function implementing the command logic |
| `description` | Human-readable command description |
| `usage` | Format specifier for command usage |
| `aliases` | Alternative names for the command |

## Command Manager

The `CommandManager` class in `CommandManager.ts` provides a central registry for commands:

```typescript
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
```

## Implementing Commands

To create a new command:

1. Create a class that implements the `Command` interface
2. Define required properties: `name` and `execute` function
3. Add optional properties as needed
4. Register the command with CommandManager

Example implementation:

```typescript
import { Command } from '../types';

export class CreateCommand implements Command {
  name = 'create';
  description = 'Creates a new resource';
  usage = '@create <n> [description]';
  aliases = ['c'];

  async execute(name: string, description?: string): Promise<any> {
    // Implementation would go here
    return {
      success: true,
      message: `Created resource: ${name}`,
      data: {
        name,
        description: description || 'No description provided'
      }
    };
  }
}
```

## Executing Commands

Commands can be executed through:

1. **API Endpoints**: Using the `/api/execute` endpoint
2. **Direct Method Calls**: Using CommandManager's execute method
3. **CLI Tools**: Through task and document management scripts

Example API request:

```json
POST /api/execute
{
  "command": "create",
  "args": ["new-resource", "This is a resource description"]
}
```

Example direct execution:

```typescript
const commandManager = new CommandManager();
commandManager.register(new CreateCommand());

// Execute the command
const result = await commandManager.execute("create", ["new-resource", "Description"]);
console.log(result);
```

## Command Best Practices

1. **Keep Commands Focused**: Each command should do one thing well
2. **Validate Input**: Validate arguments before performing actions
3. **Consistent Return Format**: Return consistent object structures
4. **Error Handling**: Provide meaningful error messages
5. **Documentation**: Include clear description and usage instructions
6. **Idempotence**: When possible, make commands idempotent

---

**© JustStuff Team** 