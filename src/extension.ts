// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { dirname, basename } from 'path';
import { RailsHelper } from './rails_helper';
import { Model } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rails-nav" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('extension.rails-nav', () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}

		var relativeFileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName);
		var fileName = basename(relativeFileName);
		var filePath = dirname(relativeFileName);

		var rh = new RailsHelper(filePath, fileName);
		rh.showFileList();
	}));

	context.subscriptions.push(vscode.commands.registerCommand("extension.generate-mailer", () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

		if (editor) {
			const model = new Model(vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName));
			const terminal = vscode.window.createTerminal("bean");
			terminal.show();
			terminal.sendText(`rails generate mailer ${model.modelName.element} --no-test-framework`);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("extension.generate-app-api", () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

		if (editor) {
			const model = new Model(vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName));
			const terminal = vscode.window.createTerminal("bean");
			terminal.show();
			terminal.sendText(`rails generate api app_api/v1/${model.modelName.collection}`);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("extension.generate-admin-api", () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

		if (editor) {
			const model = new Model(vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName));
			const terminal = vscode.window.createTerminal("bean");
			terminal.show();
			terminal.sendText(`rails generate api admin_api/v1/${model.modelName.collection}`);
		}
	}));

  context.subscriptions.push(vscode.commands.registerCommand("extension.generate-admin-template", () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;

		if (editor) {
			const model = new Model(vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName));
			const terminal = vscode.window.createTerminal("bean");
			terminal.show();
			terminal.sendText(`rails generate admin_template ${model.modelName.collection}`);
		}
	}));
}

// This method is called when your extension is deactivated
export function deactivate() { }
