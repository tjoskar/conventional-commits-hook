import fs from 'node:fs';
import process from 'node:process';
import {promisify} from 'node:util';
import prompts from 'prompts';
import {pathExists} from 'path-exists';
import fileExists from 'file-exists';
import chalk from 'chalk';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const chmod = promisify(fs.chmod);

const prepareCommitMessageFileName = 'prepare-commit-msg';

const gitmojiCommitHookComand = `#!/bin/sh
exec < /dev/tty
conventional-commits-hook $1
`;

const errorMessage = {
	notGit: 'The directory is not a git repository.',
	commitHookExist: `A prepare-commit hook already exists, please remove the hook (rm .git/hooks/${prepareCommitMessageFileName}) or install conventional-commits-hook manually by adding the following content info .git/hooks/\n\n${prepareCommitMessageFileName}:${gitmojiCommitHookComand}`,
	gitmojiParse: 'Could not find gitmojis at url',
};

function rejectIfNot(errorMessage_) {
	return value => value ? value : Promise.reject(new Error(errorMessage_));
}

function rejectIf(errorMessage_) {
	return value => value ? Promise.reject(new Error(errorMessage_)) : value;
}

function assertGitRepository() {
	return pathExists('.git')
		.then(rejectIfNot(errorMessage.notGit));
}

function assertNoPrepareCommitHook(gitHookPath) {
	return () => fileExists(`${gitHookPath}/${prepareCommitMessageFileName}`)
		.then(rejectIf(errorMessage.commitHookExist));
}

function initProject(gitHookPath) {
	return assertGitRepository()
		.then(assertNoPrepareCommitHook(gitHookPath))
		.then(() => writeFile(`${gitHookPath}/${prepareCommitMessageFileName}`, gitmojiCommitHookComand))
		.then(() => chmod(`${gitHookPath}/${prepareCommitMessageFileName}`, '755'));
}

function printInitSuccess() {
	console.log(`${chalk.green('🎉  SUCCESS 🎉')}  conventional-commits-hook initialized with success.`);
}

function prependMessage(getMessage, putMessage) {
	return filepath => message => getMessage(filepath)
		.then(fileContent => `${message || ''}${fileContent}`)
		.then(fileContent => putMessage(filepath, fileContent));
}

const prependMessageToFile = prependMessage(readFile, writeFile);

function errorHandler(error) {
	console.error(chalk.red(`🚨  ERROR: ${error}`));
	process.exit(1);
}

function askForType() {
	return prompts({
		type: 'autocomplete',
		name: 'value',
		message: 'Pick a type',
		choices: [
			{title: 'feat: A new feature', value: 'feat: '},
			{title: 'fix: A bug fix', value: 'fix: '},
			{title: 'style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)', value: 'style: '},
			{title: 'refactor: A code change that neither fixes a bug nor adds a feature', value: 'refactor: '},
			{title: 'docs: Documentation only changes', value: 'docs: '},
			{title: 'test: Adding missing tests or correcting existing tests', value: 'test: '},
			{title: 'chore: Updating build tasks etc; no production code change', value: 'chore: '},
			{title: 'ci: Changes to our CI configuration files and scripts', value: 'ci: '},
			{title: 'perf: A code change that improves performance', value: 'perf: '},
		],
		initial: 0,
	});
}

export function conventionalCommitsHook(gitHookPath, commitFile) {
	if (commitFile === '--init') {
		initProject(gitHookPath)
			.then(printInitSuccess)
			.catch(errorHandler);
	} else if (/COMMIT_EDITMSG/g.test(commitFile)) {
		askForType()
			.then(answer => answer.value)
			.then(prependMessageToFile(commitFile))
			.catch(errorHandler);
	}
}
