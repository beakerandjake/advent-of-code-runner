# Contributing Guide
Hello! Thank you for showing interest in contributing to this project. 

Before submitting your contribution please be sure to read over this document.

## Issue Reporting

New issues are always welcome, feel free to submit questions, comments, suggestions or bug reports. 

There are issue templates for
- [bugs](https://github.com/beakerandjake/advent-of-code-runner/issues/new?assignees=&labels=bug&template=bug-report.md&title=)
- [feature requests](https://github.com/beakerandjake/advent-of-code-runner/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=)

Please fill out as much information as you can on the templates, especially for bugs.

Using the templates is encouraged, but if a template doesn't fit your need feel free to create a [blank issue](https://github.com/beakerandjake/advent-of-code-runner/issues/new) 

## Pull Request Guidelines

Pull requests with features or bug fixes are always welcome, provided they align with the guidelines in this document. 

If applicable please update the `[Unreleased]` section of the `CHANGELOG` following the [keep a changelog](https://keepachangelog.com/en/1.0.0/) format.

An issue should exist before hand that way work can be coordinated and discussed in the issue, it also allows you to follow a branch naming convention.

If adding a new feature:
  - Ensure an issue has been created with the `feature request` template.
  - Name your branch like following the pattern: `feature/(#issue number)-feature-description` (e.g. feature/1234-cool-new-feature)'

If fixing a bug:
  - Ensure an issue has been created with the `bug` template.
  - Name your branch like following the pattern: `feature/(#issue number)-fix-bug-description` (e.g. feature/1234-fix-divide-by-zero)'

There is no need to add a git tag or bump the `package.json` version, these are done by maintainers when creating a release.

Pull requests run a CI workflow, which must pass for the PR to be merged.

### Additional Pull Request Tips
- Try to focus on accomplishing one thing, be it a feature or a bug fix. 
- Try to do the least amount of change possible to accomplish the goal. 
- Skip the temptation to make unnecessary changes or refactors (this makes tracing changes easier in the future). 
- If possible try not to introduce new dependencies.  

## Development Setup
You will need [git](http://git-scm.com/) and [Node.js](https://nodejs.org) version >= 18; [nvm](https://github.com/nvm-sh/nvm) is a very helpful way to install node.

A high level overview of tools used:
- [Jest](https://github.com/facebook/jest) for unit testing
- [eslint](https://github.com/eslint/eslint) for code linting

**TLDR**
1. Checkout repo and install packages.
2. Run commands using `npm start` e.g. `npm start -- init` or `npm start -- solve 17 1`

### Checkout repo & install packages
```
git clone https://github.com/beakerandjake/advent-of-code-runner.git
cd advent-of-code-runner
npm install
```

### `npm start`
This is the command to run the program for development. It runs a the `scripts/start.js` file. 

This file contains some logic to ensure local development is easy:
- A working directory is created (if it does not exist) at the root of the repository called `development`. This folder acts as the cwd when running commands, it is ignored by git.
- A `.env` file is created (if it does not exist) at the root of the repository. This file will contain options which configure the CLI for local development.

You can pass arguments to the CLI by putting them after a `--` separator.

Examples:
- `npm start -- solve`
- `npm start -- submit 5 1`
- `npm start -- stats --save`
- `npm start -- init`

### `.env` Development Options
Use the `.env` file at the root of the project (created on first run of `npm start`) to customize how the CLI behaves. 

The following options are relevant to development:
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `AOC_AUTHENTICATION_TOKEN` | string | `null` | Your actual adventofcode.com token (if using real api) or a fake value. |
| `AOC_LOG_LEVEL` | string | `warn` | Controls [logging level](https://github.com/winstonjs/winston#logging-levels). One of `error`, `warn`, `info`, `verbose`, `debug`, `silly`. You will probably want a higher level while developing such as `debug`. |
| `AOC_MOCK_API_ENABLED` | boolean | `false` | Controls whether or not to to use the real advent of code api or the mock one. When developing you should almost certainly use the mock api. An additional benefit of using the mock is that the rate limiting feature is disabled. |
| `AOC_MOCK_API_ANSWER_CORRECT` | boolean | `false` | Controls how the mock api responds when submitting answers. If set to true the answer will be correct, if false the answer will be incorrect.

Additionally, all of the options specified in the [advanced configuration](https://github.com/beakerandjake/advent-of-code-runner#christmas_tree-advanced-configuration) are available.

## Project Structure
The project folder structure attempts to be as flat as possible to avoid deep nesting. The general rule is that folders are created per feature or area and are only created if that feature starts to have more than a few files. 

Each js file strives to have a single purpose, and if it starts to do too much it should be split into different files. This makes finding the implementation of a feature easy and makes the code more testable. Big multipurpose files are generally avoided save for some exceptions such as `util.js` or `formatting.js`. 

### Folders
- `scripts/` contains development scripts launched by the `package.json`
- `src/` contains all source code necessary to run the CLI.
- `templates/` template files used by the `init` command.
- `tests/` the unit tests, matches the structure of `src/`

## Code overview
The CLI is driven via [commander](https://github.com/tj/commander.js/) in `main.js`, here you can see all of the commands that are added. Each command corresponds to a file in the `src/cli` folder. 

### Action Chains
Commands are implemented using action chains. An action chain is a abstraction for combining small pieces of functionality together to accomplish complex logic. An action chain is composed of "links", each link in the chain is a small single purpose function. 

The action chain executes each link sequentially. It maintains an `args` object that is passed to each link in the chain, links can modify this args object by returning an object. When a link returns an object that value is spread onto the chains current args object. 

Links can halt the chain by explicitly returning `false`. When the chain is halted by a link, no further links in that chain are run. A chain is also halted if a link throws an exception.

Chains can be created using the `createChain` function which takes an array of links. This function returns a new function which executes the chain when invoked.

Here is an example chain: 
```js
const exampleChain = createChain([
  assertInitialized,
  getYear,
  getNextUnsolvedPuzzle,
  outputPuzzleLink
])

await exampleChain();
```
The chain runs these links in order: 
  1. `assertInitialized` - Halts the chain if the `cwd` does not contain a user data file. 
  2. `getYear` - Loads the year from the user data file and adds the year to the chains args. 
  3. `getNextUnsolvedPuzzle` - Searches the user data file for the first puzzle the user has not solved, the puzzle day and level are added to the chain args. 
  4. `outputPuzzleLink` - Prints a link to the puzzle in the terminal. 

The order of the links is very important. Some links expect certain args to be present and will fail if those ars are missing. For instance `outputPuzzleLink` requires an args object like `{ year, day, level }`. These fields are added to the args object by the earlier links `getYear` and `getNextUnsolvedPuzzle`.


## Tests

## Code Style Guide


Inspo while creating:
- https://github.com/facebook/create-react-app/blob/main/CONTRIBUTING.md
- https://github.com/tj/commander.js/blob/master/CONTRIBUTING.md
- https://github.com/axios/axios/blob/v1.x/CONTRIBUTING.md
- https://reactjs.org/docs/how-to-contribute.html
- https://github.com/vuejs/core/blob/main/.github/contributing.md
- https://github.com/moment/moment/blob/develop/CONTRIBUTING.md
