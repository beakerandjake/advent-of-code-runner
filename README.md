# :santa: advent-of-code-runner :christmas_tree:

## Please note this is a WIP repo and is not ready to be used

A Node.Js CLI solution generator and runner for [advent of code](https://adventofcode.com/).

## :mrs_claus: Features
- Quickly and easily scaffolds an empty directory, creating all required solution files (similar to create-react-app). 
- Runs your solutions (both sync and async) and measures performance. 
- Downloads and caches puzzle input files.
- Submits answers to advent of code.
- Tracks submitted answers and prevents duplicate submissions.
- Stores and outputs statistics to the CLI or your README file.
- Rate limits submissions to prevent timeout penalties.
- Tracks your progress and knows which puzzle to run.
- Uses modern ECMAScript modules (ESM).

## :deer: Table of Contents
- [Installation](#milk_glass-installation)
  - [Authentication Token](#authentication-token)
- [Usage](#star2-usage)
  - [solve](#solve-day-level)
  - [submit](#submit-day-level)
  - [stats](#stats---save)
  - [auth](#auth)
- [Solution Files](#snowman-solution-files)
- [Caching](#cloud_with_snow-caching)
- [Misc File Information](#gift-misc-file-information)
- [Example](#snowflake-example)
- [Automation Compliance](#bell-automation-compliance)


## :milk_glass: Installation
In an empty directory or a freshly created github repository run the following command
```
npx advent-of-code-runner init 
```
You will be asked a few questions, then the following contents will be generated: 
```
your-repository-folder/
├── aocr-data.json
├── inputs/
├── node_modules/
├── package.json
├── package.lock.json
├── README.md
├── src/
│   ├── day_01.js
│   ├── day_02.js
│   ├── ...
│   └── day_25.js
├── .env
└── .gitignore
```

### Authentication Token
advent of code generates puzzle inputs unique to your account. In order to download inputs and submit answers this CLI needs to store your advent of code authentication token. The token will be stored in a .env file in your project directory. This .env file ***should not*** be committed to source control. When you run the `init` command a .gitignore file is generated which ignores .env files, so *your token is safe by default*. 

#### Finding your Authentication Token
The authentication token is stored in a advent of code cookie. Navigate to [advent of code](https://adventofcode.com/), and sign in to your account. Once signed in open up your browsers development tools, find the cookies for adventofcode.com and copy the value of the "session" cookie. 
- [Firefox help](https://firefox-source-docs.mozilla.org/devtools-user/storage_inspector/index.html)
- [Chrome help](https://developer.chrome.com/docs/devtools/storage/cookies/)

### Post Installation 
Once you run the `init` command you are ready to start solving the puzzles. Navigate to `src/` folder and open up `day_01.js`. Navigate to the `levelOne` function and add your code. Run the `solve` command to see what answer your code returns, if you're happy with the answer run the `submit` command to see if you got the right answer. From there you can move on to level 2 of day 1 or solve the puzzles in any order you wish. Good luck and have fun! 

## :star2: Usage

Run the following commands from the root of your repository.

*Note: If a command which executes your code (`solve` or `submit`) is taking a long time to complete, you can cancel it any any time by pressing `Ctrl + c` in your terminal.*

### `solve [day] [level]`
Runs your code for a specific puzzle, downloads the input file (if not already cached), measures how long your code takes to run, and outputs your answer. *This does not submit the answer to advent of code.*

This command has different behavior based on which arguments you pass:

##### No Arguments

```
npm run solve
```

If the command is run without any arguments, the CLI will find and solve the next puzzle you have not submitted a correct answer for. This is very useful if you solve puzzles in the order of the advent calendar. 

Example: 
- If you've correctly answered days 1-4, then day 5 level 1 will be solved.  
- If you've correctly answered days 1-7 and day 8 level 1, then day 8 level 2 will be solved.

##### One Argument

```
npm run solve [day]
```
If you run the command with just the day argument, then the level one of the days puzzle will be solved.

Example:
- To solve day 16 level 1: `npm run solve 16`
- To solve day 4 level 1: `npm run solve 4`

##### Two Arguments

```
npm run solve [day] [level]
```
If you run the command with the day and the level argument, then the specified puzzle will be solved.

Example:
- To solve day 23 level 2: `npm run solve 24 2`
- To solve day 15 level 1: `npm run solve 15 1`

### `submit [day] [level]`
The same behavior as the `solve` command, however your answer will be submitted to advent of code. Additionally the progress table in your README file will be updated.

This command has different behavior based on which arguments you pass:

##### No Arguments

```
npm run submit
```
If the command is run without any arguments, the CLI will find and submit the next puzzle you have not yet submitted a correct answer for. This is very useful if you solve puzzles in the order of the advent calendar.

##### One Argument

```
npm run submit [day]
```
If you run the command with just the day argument, then the level one of the days puzzle will be submitted.

Example:
- To submit day 12 level 1: `npm run submit 12`
- To submit day 20 level 1: `npm run submit 20`

##### Two Arguments

```
npm run submit [day] [level]
```
If you run the command with the day and the level argument, then the specified puzzle will be submitted.

Example:
- To submit day 3 level 2: `npm run submit 3 2`
- To submit day 14 level 1: `npm run submit 14 1`

### `stats [--save]`
Generates a table showing your current statistics for the year. Shows you which puzzles you have completed, how many attempts you made for each puzzle, and the fastest recorded runtime for that puzzle. The table additionally displays your completion percentage for the year, the average number of attempts, and the average runtime.

If you run the command without the `--save` argument then the table will be printed to the console
```
npm run stats
```

If you run the command with the `--save` argument then the table will be saved to your README file.
```
npm run stats -- --save
```
Note you must add `--` seperator between the command name and the `--save` argument. See this [stackoverflow question](https://stackoverflow.com/q/11580961) for more info.

### `auth`
Creates or updates the `.env` file with your advent of code authentication token. This is a useful command if you checkout your repository on a new machine, since the `.env` file is not commited to source control and wont be present on the new machine.

```
npm run auth
```

### `help`
Outputs the help text for the cli
```
npm run help
```

## :snowman: Solution Files

The `init` command generates a solution file for each day of advent of code. This is where you will add your code to compute the answer to each puzzle.

Each solution file is expected to export two functions: 
- `levelOne({ input: string, lines: string[] }) -> string|number|Promise<string>|Promise<number>`
- `levelTwo({ input: string, lines: string[] }) -> string|number|Promise<string>|Promise<number>`

These functions: 
- Must return a `string` or a `number`.
- Can be `sync` or `async`

### Arguments
Solution functions are invoked with a single argument, an object containing the following fields:
- `input: string`: A string containing the raw, unprocessed puzzle input. Provided for flexibility and custom parsing.
- `lines: string[]`:  An array of strings containing the each line of the puzzle input. Provided for convience and speed. 

Depending on the puzzle and its input you might need to [parse string values into integers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt). 

## :cloud_with_snow: Caching

This CLI downloads puzzles inputs only once and saves them to the `inputs/` folder. If your input file becomes corrupted you can force a re-download by deleting the file and running the `solve` or `submit` command. Additionally the CLI tracks the answers you submit to ensure you don't attempt to re-submit a duplicate answer to a question.  

## :gift: Misc File Information

#### `aocr-data.json`
This file stores your progress. Every time you submit an answer, it is stored in this file to prevent duplicate submissions and track statistics. Additionally it stores the fastest recorded runtime for each puzzle. You should not edit this file manually. This file should be commited to source control. 

#### `.ratelimits.json`
This file stores rate limit information used when querying the advent of code website. The creator of the website has requested automated tools such as this CLI are conservative in the number of requests made to the website. This file tracks when the last request was made and the CLI uses this data to prevent requests from occuring too frequently. This file is ignored in source control.

#### `.env`
This file stores your authentication token, it ***should not be committed to source control***. See the [Authentication Token](https://github.com/beakerandjake/advent-of-code-runner#authentication-token) section for more information.

#### `README.md`
If you view the plain text markdown, you might notice a section that looks like: 
```
<!--Please do not delete the following comments, they are required to save your stats to this file.-->
<!--START_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->
<!--END_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->
```
The CLI requires this section so it can continually update your readme with your progress table (if using the `submit` or the `stats` command).

## Advanced Configuration

You can customize the behavior of this CLI by using the following options in your `.env` file. Please keep in mind this is where your authentication token is stored and this file **should not be committed to source control**. 

Each option accepts values specified in the [yn package](https://www.npmjs.com/package/yn).

| Option Name  | Default | Effect |
| --- | --- | --- |
| `AOC_DISABLE_README_AUTO_SAVE_PROGRESS` | `false` | If enabled, the README file will not be updated with the progress table automatically during the `solve` or `submit` commands. You can still update the table manually with the `stats` command. |
| `AOC_SUPPRESS_FESTIVE` | `false` | If enabled, the CLI will not add emojis to the console output. |

#### Example .env file
This example modifies the default `.env` file created by the `init` command. It disables the auto readme update feature and disables festive emojis.

```Shell
# This is an authentication token to advent of code.
# It is a SECRET and should be treated like a password.
# That means this .env file should NOT be committed to source control!
#
# If you created this project using advent-of-code-runner init, 
# then your .gitignore already includes this file, your secret is safe.
AOC_AUTHENTICATION_TOKEN=asdfasdfasdfasdf
AOC_DISABLE_README_AUTO_SAVE_PROGRESS=true
AOC_SUPPRESS_FESTIVE=true
```

## :snowflake: Example
I am using this CLI for my own advent of code solutions. You can refer to this project as a real world example of how to use this CLI. 

*Spoiler Warning*: [This project](https://github.com/beakerandjake/aoc-2022) contains my solutions to advent of code 2022.

## :bell: Automation Compliance
This CLI does follow the automation guidelines on the /r/adventofcode [community wiki](https://www.reddit.com/r/adventofcode/wiki/faqs/automation/). Specifically: 
- Outbound calls are throttled to every five minutes in [rateLimitDecorator.js](https://github.com/beakerandjake/advent-of-code-runner/blob/main/src/api/rateLimitDecorator.js)
- Once inputs are downloaded, they are cached locally in [getPuzzleInput.js](https://github.com/beakerandjake/advent-of-code-runner/blob/main/src/actions/getPuzzleInput.js). If you suspect your input is corrupted, you can manually request a fresh copy by deleting the downloaded file.
- The User-Agent header in [api.js](https://github.com/beakerandjake/advent-of-code-runner/blob/main/src/api/api.js) is set to `https://github.com/beakerandjake/advent-of-code-runner by beakerandjake`
- Submitted answers are tracked per puzzle and duplicate submissions are prevented in [assertAnswerNotPreviouslySubmitted.js](https://github.com/beakerandjake/advent-of-code-runner/blob/main/src/actions/assertAnswerNotPreviouslySubmitted.js).
