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
You will be asked a few questions, and then your project files will be generated and the required dependencies will be installed.

### Authentication Token
advent of code generates puzzle inputs unique to your account. In order to download inputs and submit answers this CLI needs to store your advent of code authentication token. The token will be stored in a .env file in your project directory. This .env file ***should not*** be committed to source control. When you run the `init` command a .gitignore file is generated which ignores .env files, so your token is safe by default. 

#### Finding your Authentication Token
The authentication token is stored in a advent of code cookie. Navigate to [advent of code](https://adventofcode.com/), and sign in to your account. Once signed in open up your browsers development tools, find the cookies for adventofcode.com and copy the value of the "session" cookie. 
- [Firefox help](https://firefox-source-docs.mozilla.org/devtools-user/storage_inspector/index.html)
- [Chrome help](https://developer.chrome.com/docs/devtools/storage/cookies/)



