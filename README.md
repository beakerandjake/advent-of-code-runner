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
Once you run the `init` command you are ready to start solving the puzzles. Navigate to `src/` folder and open up `day_01.js`. Navigate to the `levelOne` function and add your code. Run the `autosolve` or `solve` command to see what answer your code returns, if you're happy with the answer run the `submit` or `autosubmit` command to see if you got the right answer.

## :star2: Usage

Run the following commands from the root of your repository.

### `solve <day> <level>`
Runs your code for a specific puzzle, downloads the input file (if not already cached), measures how long your code takes to run, and outputs your answer. Use this when you want to solve a specific puzzle. *This does not submit the answer to advent of code.*

Example to solve the puzzle on day 16, level 2:
```
npm run solve 16 2
```

*Note: If your code is taking a long time to run you can cancel it any any time by pressing `Ctrl + c` in your terminal.*

### `autosolve`
Runs the code for the next puzzle which has not had a correct answer submitted. Performs the same behavior as the `solve` command, without requiring your to input the day or the level. This command is very useful if you solve puzzles in order.


```
npm run autosolve
```

Example: If you've submitted correct answers for days 1-4, when your run the `autosolve` command, it will run the code for Day 5 Level 1.  

### `submit <day> <level>`
The same as the `solve` command, however your answer will be submitted to advent of code. 

Example to submit the answer for the puzzle on day 21, level 1:
```
npm run submit 21 1
```

### `autosubmit`
Runs the code and submits the answer for the next puzzle which has not had a correct answer submitted. Performs the same behavior as the `submit` command without requiring you to input the day or the level. Additionally this command will update the progress table in your README file. This command is very useful if you solve puzzles in order.

```
npm run autosubmit
```
Example: If you've submitted correct answers for days 1-16 and day 17 level 1, when your run the `autosolve` command, it will submit the answer for Day 17 Level 2.  

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

This CLI downloads puzzles inputs only once and saves them to the `inputs/` folder. Additionally it tracks the answers you submit to ensure you don't attempt to re-submit an answer to the website.  

## :gift: Misc File Information

#### `aocr-data.json`
This file stores your progress. Every time you submit an answer, it is stored in this file to prevent duplicate submissions and track statistics. Additionally it stores the fastest recorded runtime for each puzzle. You should not edit this file manually. 

#### `.ratelimits.json`
This file stores rate limit information used when querying the advent of code website. The creator of the website has requested automated tools such as this CLI are conservative in the number of requests made to the website. This file tracks when the last request was made and the CLI uses this data to prevent requests from occuring too frequently. 

#### `.env`
This file stores your authentication token, it ***should not be committed to source control***. See the [Authentication Token](https://github.com/beakerandjake/advent-of-code-runner#authentication-token) section for more information.

#### `README.md`
If you view the plain text markdown, you might notice a section that looks like: 
```
<!--Please do not delete the following comments, they are required to save your stats to this file.-->
<!--START_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->
<!--END_AUTOGENERATED_COMPLETION_PROGRESS_SECTION-->
```
The CLI requires this section so it can continually update your readme with your progress table (if using the `autosubmit` or the `stats` command).

## :snowflake: Example
I am using this CLI for my own advent of code solutions. You can refer to this project as a real world example of how to use this CLI. 

*Spoiler Warning*: [This project](https://github.com/beakerandjake/aoc-2022) contains my solutions to advent of code 2022.

## :bell: Automation Compliance
This CLI does follow the automation guidelines on the /r/adventofcode [community wiki](https://www.reddit.com/r/adventofcode/wiki/faqs/automation/). Specifically: 
- Outbound calls are throttled to every five minutes in [rateLimitDecorator.js](https://github.com/beakerandjake/advent-of-code-runner/blob/main/src/api/rateLimitDecorator.js)
- Once inputs are downloaded, they are cached locally in [getPuzzleInput.js](https://github.com/beakerandjake/advent-of-code-runner/blob/main/src/actions/getPuzzleInput.js). If you suspect your input is corrupted, you can manually request a fresh copy by deleting the downloaded file.
- The User-Agent header in [api.js](https://github.com/beakerandjake/advent-of-code-runner/blob/main/src/api/api.js) is set to `https://github.com/beakerandjake/advent-of-code-runner by beakerandjake`
