// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { kMaxLength } from 'buffer';

const markdownInlineCodeExp = /(?:(?<!\\)((?:\\{2})+)(?=`+)|(?<!\\)(`+)(.+?)(?<!`)\2(?!`))/;

class Settings {

}

async function exec(program: string, args: Array<string>): Promise<any> {
	return new Promise((resolve, reject) => {
		child_process.execFile(program, args, function (error, stdout, stderr) {
			if (error) {
				return reject(error);
			}
			resolve({ stdout: stdout, stderr: stderr });
		});
	});
}

async function qalc(expression: string) {
	const qalcPath = vscode.workspace.getConfiguration("qalc").get<string>("path") || "qalc";
	const settings = vscode.workspace.getConfiguration("qalc").get<Array<string>>("settings") || [];

	let settingsArgs = settings.flatMap((val) => ["-s", val]);

	try {
		let { stdout } = await exec(qalcPath, [...settingsArgs, expression]);
		return stdout.trim();
	} catch (e) {
		console.error("Error while executing qalc", e);
		vscode.window.showInformationMessage(
			"Could not run qalc. Make sure it's installed and set the qalc.path setting if needed.",
			"install", "configure"
		).then((selection) => {
			if(selection === "install") {
				vscode.env.openExternal(vscode.Uri.parse('http://qalculate.github.io/downloads.html'));
			} else {
				vscode.commands.executeCommand('workbench.action.openSettings', 'qalc.path');
			}
		});
		return expression;
	}
}

function getMarkdownInlineCode(editor: vscode.TextEditor) {
	if (editor.document.languageId !== "markdown") {
		return "";
	}

	const range = editor.document.getWordRangeAtPosition(editor.selection.start, markdownInlineCodeExp);

	if (!range || range.isEmpty) {
		return "";
	}

	/* Remove `/`` from front/back of range. */
	const fencedText = editor.document.getText(range);
	const [, , fence, unfencedText] = markdownInlineCodeExp.exec(fencedText) ?? [];

	if (!unfencedText || !fence) {
		return "";
	}

	const unfencedRange = new vscode.Range(
		range.start.translate(0, fence.length),
		range.end.translate(0, -fence.length)
	);

	editor.selection = new vscode.Selection(unfencedRange.start, unfencedRange.end);
	return editor.document.getText(unfencedRange);
}

function selectActiveLine(editor: vscode.TextEditor) {
	let line = editor.document.lineAt(editor.selection.active.line);

	if (line.isEmptyOrWhitespace) {
		return "";
	}

	editor.selection = new vscode.Selection(
		new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex),
		line.range.end
	);

	return editor.document.getText(editor.selection);
}

async function qalcSelection(editor: vscode.TextEditor, outputChannel: vscode.OutputChannel) {
	if (!editor) {
		return;
	}

	let input = editor.document.getText(editor.selection);

	/* If nothing is selected, try to be clever. */
	/*
		First, if this is markdown and the cursor is over an inline code expression,
		use that.
	*/
	if (!input) {
		input = getMarkdownInlineCode(editor);
	}

	/* If that doesn't work then try to use the line that the cursor is currently at. */
	if (!input) {
		input = selectActiveLine(editor);
	}

	/* Still empty? Nothing to do. */
	if (!input) {
		return;
	}

	/* Run calc for each line */
	let results = [];

	for (let line of input.split("\n")) {
		let result = await qalc(line);
		results.push(result);
		outputChannel.appendLine(result);
	}

	return results;
}

async function qalcAndReplaceSelection(editor: vscode.TextEditor, outputChannel: vscode.OutputChannel) {
	let results = await qalcSelection(editor, outputChannel);

	if (!results) {
		return;
	}

	/* Replace all of the input lines with the results. */
	let result = results.join("\n");
	await editor.edit((builder) => builder.replace(editor.selection, result));

	let end = editor.selection.end;
	editor.selection = new vscode.Selection(end, end);
}

export function activate(context: vscode.ExtensionContext) {

	const outputChannel = vscode.window.createOutputChannel("qalc");

	context.subscriptions.push(vscode.commands.registerCommand('qalc.eval', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		await qalcSelection(editor, outputChannel);
		outputChannel.show(true);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('qalc.evalAndReplace', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		await qalcAndReplaceSelection(editor, outputChannel);
	}));
}

export function deactivate() { }
