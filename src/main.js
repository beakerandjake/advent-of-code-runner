// #!/usr/bin/env node
// import { Command } from 'commander';
// import { getConfigValue } from './config.js';
// import { printFestiveTitle } from './festive.js';
// import { handleError } from './errorHandler.js';
// import {
//   autoSolveCommand,
//   autoSubmitCommand,
//   initializeCommand,
//   solveCommand,
//   submitCommand,
//   exitOverride,
// } from './cli/index.js';

// const program = new Command();

// program
//   .name(getConfigValue('meta.name'))
//   .description(getConfigValue('meta.description'))
//   .version(getConfigValue('meta.version'))
//   .addHelpText('beforeAll', printFestiveTitle)
//   .hook('preAction', printFestiveTitle)
//   .exitOverride(exitOverride);

// program.addCommand(autoSolveCommand);
// program.addCommand(solveCommand);
// program.addCommand(autoSubmitCommand);
// program.addCommand(submitCommand);
// program.addCommand(initializeCommand);

// try {
//   await program.parseAsync();
// } catch (error) {
//   handleError(error);
// }
import { cwd } from 'node:process';
import { join } from 'node:path';
import { getElementByTagName, getTextContent } from './api/parseHtml.js';
import { loadFileContents } from './persistence/io.js';

// const input = `
// <p class="cats">
//   <main>
//     <span id="anchor1" class="purple">
//       <span onClick="myCoolFunction()">
//         <span style="color:blue">hello world</span>
//       </span>
//     </span>
//   </main>
// </p>`;

const input = await loadFileContents(join(cwd(), 'dev', 'response-wrongAnswer.html'));

// const input = '<main>Hello World</p>';
const result = getElementByTagName(input, 'main');
console.log(result);
const text = getTextContent(result);
console.log('RESULT', text);
