# advent-of-code-runner

## Please note this is a WIP repo and is not ready to be used

A Node.Js CLI solution generator and runner for [advent of code](https://adventofcode.com/).

## Features
- Quickly and easily scaffolds an empty directory, creating all required solution files (similar to create-react-app). 
- Runs your solutions (both sync and async) and measures performance. 
- Downloads and caches puzzle input files.
- Submits answers to advent of code.
- Tracks submitted answers and prevents duplicate submissions.
- Stores and outputs statistics to the CLI or your README file.
- Rate limits submissions to prevent timeout penalties.
- Tracks your progress and knows which puzzle to run. 

## Installation
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
advent of code generates puzzle inputs unique to your account. In order to download inputs and submit answers this CLI needs to store your advent of code authentication token. The token will be stored in a .env file in your project directory. This .env file ***should not*** be committed to source control. When you run the `init` command a .gitignore file is generated which ignores .env files, so your token is safe by default. 

#### Finding your Authentication Token
The authentication token is stored in a advent of code cookie. Navigate to [advent of code](https://adventofcode.com/), and sign in to your account. Once signed in open up your browsers development tools, find the cookies for adventofcode.com and copy the value of the "session" cookie. 
- [Firefox help](https://firefox-source-docs.mozilla.org/devtools-user/storage_inspector/index.html)
- [Chrome help](https://developer.chrome.com/docs/devtools/storage/cookies/)

## Usage

Run the following commands from the root of your repository.

### `solve <day> <level>`
Runs your code for a specific puzzle, downloads the input file (if not already cached), measures how long your code takes to run, and outputs your answer. Use this when you want to solve a specific puzzle. *This does not submit the answer to advent of code.*

Example to solve the puzzle on day 16, level 2:
```
npm run solve 16 2
```

Note: If your code is taking a long time to run you can cancel it any any time by pressing `ctrl + c` in your terminal.

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
Creates or updates the `.env` file with your advent of code authentication token. This is a useful command if you checkout your repository on a new machine, since the `.env` file is not commited to source control.

```
npm run auth
```

### `help`
Outputs the help text for the cli
```
npm run help
```

## Solution Files
The `init` command generates a solution file for each day of advent of code. The solution files export two functions `levelOne` and `levelTwo`. You are expected to return a `string` or a `number` from the function. The functions can be sync or async. 
