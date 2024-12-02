#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { exec } from "node:child_process";

const server = new Server(
	{
		name: "local-command-server",
		version: "0.1.0",
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: "execute_command",
				description:
					"Executes a command based on the prompt content according to the operating system being used. `command` must include a string that is a valid command with arguments for the operating system.",
				inputSchema: {
					type: "object",
					properties: {
						command: {
							type: "string",
							description: "Command to execute with arguments",
						},
					},
					required: ["command"],
				},
			},
		],
	};
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	switch (request.params.name) {
		case "execute_command": {
			const command = String(request.params.arguments?.command);
			if (!command) {
				throw new Error("Command is required");
			}

			const executeCommand = (): Promise<string> => {
				return new Promise((resolve, reject) => {
					exec(
						command,
						(error: Error | null, stdout: string, stderr: string) => {
							if (error) {
								reject(`Error: ${error.message}`);
							} else if (stderr) {
								reject(`Stderr: ${stderr}`);
							} else {
								resolve(stdout);
							}
						},
					);
				});
			};

			let commandResult: string;
			try {
				commandResult = await executeCommand();
			} catch (error) {
				commandResult = error as string;
			}

			return {
				content: [
					{
						type: "text",
						text: commandResult,
					},
				],
			};
		}

		default:
			throw new Error("Unknown tool");
	}
});

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);
	process.exit(1);
});
