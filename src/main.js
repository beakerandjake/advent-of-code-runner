import { downloadInput, parseSolutionResponseHtml, submitSolution } from './api.js';
import { inputFileExits, saveInputToFile, loadInputFile } from './io.js';
import { getConfigValue } from './config.js';
import { logger } from './logger.js';
import { solve } from './solve.js';
import { humanizeDuration } from './utils.js';

const year = getConfigValue('aoc.year');
const day = 1;
const part = 1;

// eslint-disable-next-line no-unused-vars
const main = async () => {
  let input;

  if (!await inputFileExits(year, day)) {
    // download and cache input when it doesn't exist.
    input = await downloadInput(year, day, getConfigValue('aoc.authenticationToken'));
    await saveInputToFile(year, day, input);
  } else {
    // load cached input instead of re-downloading.
    input = await loadInputFile(year, day);
  }

  const { solution, executionTimeNs } = await solve(year, day, input);

  logger.info('solution: %s solved in: %s', solution, humanizeDuration(executionTimeNs));

  const submissionResult = await submitSolution(year, day, part, solution, getConfigValue('aoc.authenticationToken'));

  logger.info('submission result: %s', submissionResult);
};

// await main();

const mockHtml = `
text <!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8"/>
<title>Day 1 - Advent of Code 2022</title>
<!--[if lt IE 9]><script src="/static/html5.js"></script><![endif]-->
<link href='//fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext' rel='stylesheet' type='text/css'/>
<link rel="stylesheet" type="text/css" href="/static/style.css?30"/>
<link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?0" title="High Contrast"/>
<link rel="shortcut icon" href="/favicon.png"/>
<script>window.addEventListener('click', function(e,s,r){if(e.target.nodeName==='CODE'&&e.detail===3){s=window.getSelection();s.removeAllRanges();r=document.createRange();r.selectNodeContents(e.target);s.addRange(r);}});</script>
</head><!--




Oh, hello!  Funny seeing you here.

I appreciate your enthusiasm, but you aren't going to find much down here.
There certainly aren't clues to any of the puzzles.  The best surprises don't
even appear in the source until you unlock them for real.

Please be careful with automated requests; I'm not a massive company, and I can
only take so much traffic.  Please be considerate so that everyone gets to play.

If you're curious about how Advent of Code works, it's running on some custom
Perl code. Other than a few integrations (auth, analytics, social media), I
built the whole thing myself, including the design, animations, prose, and all
of the puzzles.

The puzzles are most of the work; preparing a new calendar and a new set of
puzzles each year takes all of my free time for 4-5 months. A lot of effort
went into building this thing - I hope you're enjoying playing it as much as I
enjoyed making it for you!

If you'd like to hang out, I'm @ericwastl on Twitter.

- Eric Wastl


















































-->
<body>
<header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2022/about">[About]</a></li><li><a href="/2022/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2022/settings">[Settings]</a></li><li><a href="/2022/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user #XXXXXXX)</div></div><div><h1 class="title-event">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">y(</span><a href="/2022">2022</a><span class="title-event-wrap">)</span></h1><nav><ul><li><a href="/2022">[Calendar]</a></li><li><a href="/2022/support">[AoC++]</a></li><li><a href="/2022/sponsors">[Sponsors]</a></li><li><a href="/2022/leaderboard">[Leaderboard]</a></li><li><a href="/2022/stats">[Stats]</a></li></ul></nav></div></header>

<div id="sidebar">
<div id="sponsor"><div class="quiet">Our <a href="/2022/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://www.twilio.com/quest" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">TwilioQuest</a> - Discover your power to change the world with code with TwilioQuest, an educational RPG. Learn foundational programming skills, JavaScript and Python while you explore The Cloud alongside our community of developers.</div></div>
</div><!--/sidebar-->

<main>
<article><p>That's not the right answer; your answer is too high.  If you're stuck, make sure you're using the full input data; there are also some general tips on the <a href="/2022/about">about page</a>, or you can ask for hints on the <a href="https://www.reddit.com/r/adventofcode/" target="_blank">subreddit</a>.  Please wait one minute before trying again. (You guessed <span style="white-space:nowrap;"><code>1000000000</code>.)</span> <a href="/2022/day/1">[Return to Day 1]</a></p></article>
</main>

<!-- ga -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-69522494-1', 'auto');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>
<!-- /ga -->
</body>
</html>
`;

const result = parseSolutionResponseHtml(mockHtml);
logger.info('parsed result: %s', result);

// Submit Problem

// Store data on local machine,
// Hash the session token and store which problems have been solved
// prevent re-submissions
// store last submission time, don't allow submission if too soon
// provide way to clear local data.

// Allow ctrl+c to cancel a running solution

// validate day / year, don't allow days in the future
// validate day (don't select invalid day of month (1-25))
// validate year, set minimum year

// init command to scaffold solution files for an entire year
//  create a day_x.js file for each day of that month.
//  skip creation of files that already exist.

// swallow console logs for solutions and route to winston instead with custom
// log level and color.
