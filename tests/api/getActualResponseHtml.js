/* eslint-disable quotes */
/**
 * Module which returns actual html response from advent of code.
 * Used to mock actual api responses for testing.
 */

export const wrongAnswer = {
  html: `<!DOCTYPE html> <html lang="en-us"> <head> <meta charset="utf-8"> <title>Day 2 - Advent of Code 2022</title> <!--[if lt IE 9]><script src="/static/html5.js"></script><![endif]--> <link href="//fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext" rel="stylesheet" type="text/css"> <link rel="stylesheet" type="text/css" href="/static/style.css?30"> <link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?0" title="High Contrast"> <link rel="shortcut icon" href="/favicon.png"> <script>window.addEventListener('click', function(e,s,r){if(e.target.nodeName==='CODE'&&e.detail===3){s=window.getSelection();s.removeAllRanges();r=document.createRange();r.selectNodeContents(e.target);s.addRange(r);}});</script> </head><!--




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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  --> <body> <header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2022/about">[About]</a></li><li><a href="/2022/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2022/settings">[Settings]</a></li><li><a href="/2022/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user) <span class="star-count">2*</span></div></div><div><h1 class="title-event">&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">int y=</span><a href="/2022">2022</a><span class="title-event-wrap">;</span></h1><nav><ul><li><a href="/2022">[Calendar]</a></li><li><a href="/2022/support">[AoC++]</a></li><li><a href="/2022/sponsors">[Sponsors]</a></li><li><a href="/2022/leaderboard">[Leaderboard]</a></li><li><a href="/2022/stats">[Stats]</a></li></ul></nav></div></header> <div id="sidebar"> <div id="sponsor"><div class="quiet">Our <a href="/2022/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://www.accenture.com/us-en/industries/afs-index" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">Accenture Federal Services</a> - Technology &amp; ingenuity moving missions forward – come solve problems with us. Hiring software engineers, developers, and more now. Refer someone to earn up to $20K.</div></div> </div><!--/sidebar--> <main> <article><p>That's not the right answer. If you're stuck, make sure you're using the full input data; there are also some general tips on the <a href="/2022/about">about page</a>, or you can ask for hints on the <a href="https://www.reddit.com/r/adventofcode/" target="_blank">subreddit</a>. Please wait one minute before trying again. (You guessed <span style="white-space:nowrap;"><code>ASDF</code>.)</span> <a href="/2022/day/2">[Return to Day 2]</a></p></article> </main> <!-- ga --> <script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview'); </script> <!-- /ga --> </body> </html>`,
  mainTag: `<main> <article><p>That's not the right answer. If you're stuck, make sure you're using the full input data; there are also some general tips on the <a href="/2022/about">about page</a>, or you can ask for hints on the <a href="https://www.reddit.com/r/adventofcode/" target="_blank">subreddit</a>. Please wait one minute before trying again. (You guessed <span style="white-space:nowrap;"><code>ASDF</code>.)</span> <a href="/2022/day/2">[Return to Day 2]</a></p></article> </main>`,
};

export const badLevel = {
  html: `<!DOCTYPE html> <html lang="en-us"> <head> <meta charset="utf-8"> <title>Day 1 - Advent of Code 2022</title> <!--[if lt IE 9]><script src="/static/html5.js"></script><![endif]--> <link href="//fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext" rel="stylesheet" type="text/css"> <link rel="stylesheet" type="text/css" href="/static/style.css?30"> <link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?0" title="High Contrast"> <link rel="shortcut icon" href="/favicon.png"> <script>window.addEventListener('click', function(e,s,r){if(e.target.nodeName==='CODE'&&e.detail===3){s=window.getSelection();s.removeAllRanges();r=document.createRange();r.selectNodeContents(e.target);s.addRange(r);}});</script> </head><!--
  
  
  
  
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  --> <body> <header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2022/about">[About]</a></li><li><a href="/2022/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2022/settings">[Settings]</a></li><li><a href="/2022/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user) <span class="star-count">2*</span></div></div><div><h1 class="title-event">&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">int y=</span><a href="/2022">2022</a><span class="title-event-wrap">;</span></h1><nav><ul><li><a href="/2022">[Calendar]</a></li><li><a href="/2022/support">[AoC++]</a></li><li><a href="/2022/sponsors">[Sponsors]</a></li><li><a href="/2022/leaderboard">[Leaderboard]</a></li><li><a href="/2022/stats">[Stats]</a></li></ul></nav></div></header> <div id="sidebar"> <div id="sponsor"><div class="quiet">Our <a href="/2022/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://www.reaktor.com/advent-of-code" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">Reaktor</a> - You can do this &lt;3</div></div> </div><!--/sidebar--> <main> <article><p>You don't seem to be solving the right level. Did you already complete it? <a href="/2022/day/1">[Return to Day 1]</a></p></article> </main> <!-- ga --> <script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview'); </script> <!-- /ga --> </body> </html>`,
  mainTag: `<main> <article><p>You don't seem to be solving the right level. Did you already complete it? <a href="/2022/day/1">[Return to Day 1]</a></p></article> </main>`,
};

export const correctAnswerDayComplete = {
  html: `<!DOCTYPE html> <html lang="en-us"> <head> <meta charset="utf-8"> <title>Day 1 - Advent of Code 2022</title> <!--[if lt IE 9]><script src="/static/html5.js"></script><![endif]--> <link href="//fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext" rel="stylesheet" type="text/css"> <link rel="stylesheet" type="text/css" href="/static/style.css?30"> <link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?0" title="High Contrast"> <link rel="shortcut icon" href="/favicon.png"> <script>window.addEventListener('click', function (e, s, r) { if (e.target.nodeName === 'CODE' && e.detail === 3) { s = window.getSelection(); s.removeAllRanges(); r = document.createRange(); r.selectNodeContents(e.target); s.addRange(r); } });</script> </head><!--
  
  
  
  
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  --> <body> <header> <div> <h1 class="title-global"><a href="/">Advent of Code</a></h1> <nav> <ul> <li><a href="/2022/about">[About]</a></li> <li><a href="/2022/events">[Events]</a></li> <li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li> <li><a href="/2022/settings">[Settings]</a></li> <li><a href="/2022/auth/logout">[Log Out]</a></li> </ul> </nav> <div class="user">(anonymous user) <span class="star-count">2*</span></div> </div> <div> <h1 class="title-event">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">/^</span><a href="/2022">2022</a><span class="title-event-wrap">$/</span></h1> <nav> <ul> <li><a href="/2022">[Calendar]</a></li> <li><a href="/2022/support">[AoC++]</a></li> <li><a href="/2022/sponsors">[Sponsors]</a></li> <li><a href="/2022/leaderboard">[Leaderboard]</a></li> <li><a href="/2022/stats">[Stats]</a></li> </ul> </nav> </div> </header> <div id="sidebar"> <div id="sponsor"> <div class="quiet">Our <a href="/2022/sponsors">sponsors</a> help make Advent of Code possible:</div> <div class="sponsor"><a href="https://numer.ai" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">NUMERAI</a> - join the hardest data science tournament in the world</div> </div> </div><!--/sidebar--> <main> <article> <p>That's the right answer! You are <span class="day-success">one gold star</span> closer to collecting enough star fruit.</p> <p>You have completed Day 1! You can <span class="share">[Share<span class="share-content">on <a href="https://twitter.com/intent/tweet?text=I+just+completed+%22Calorie+Counting%22+%2D+Day+1+%2D+Advent+of+Code+2022&amp;url=https%3A%2F%2Fadventofcode%2Ecom%2F2022%2Fday%2F1&amp;related=ericwastl&amp;hashtags=AdventOfCode" target="_blank">Twitter</a> <a href="javascript:void(0);" onclick="var mastodon_instance=prompt('Mastodon Instance / Server Name?'); if(typeof mastodon_instance==='string' && mastodon_instance.length){this.href='https://'+mastodon_instance+'/share?text=I+just+completed+%22Calorie+Counting%22+%2D+Day+1+%2D+Advent+of+Code+2022+%23AdventOfCode+https%3A%2F%2Fadventofcode%2Ecom%2F2022%2Fday%2F1'}else{return false;}" target="_blank">Mastodon</a></span>]</span> this victory or <a href="/2022">[Return to Your Advent Calendar]</a>.</p> </article> </main> <!-- ga --> <script> (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
          m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
      ga('set', 'anonymizeIp', true);
      ga('send', 'pageview'); </script> <!-- /ga --> </body> </html>`,
  mainTag: `<main> <article> <p>That's the right answer! You are <span class="day-success">one gold star</span> closer to collecting enough star fruit.</p> <p>You have completed Day 1! You can <span class="share">[Share<span class="share-content">on <a href="https://twitter.com/intent/tweet?text=I+just+completed+%22Calorie+Counting%22+%2D+Day+1+%2D+Advent+of+Code+2022&amp;url=https%3A%2F%2Fadventofcode%2Ecom%2F2022%2Fday%2F1&amp;related=ericwastl&amp;hashtags=AdventOfCode" target="_blank">Twitter</a> <a href="javascript:void(0);" onclick="var mastodon_instance=prompt('Mastodon Instance / Server Name?'); if(typeof mastodon_instance==='string' && mastodon_instance.length){this.href='https://'+mastodon_instance+'/share?text=I+just+completed+%22Calorie+Counting%22+%2D+Day+1+%2D+Advent+of+Code+2022+%23AdventOfCode+https%3A%2F%2Fadventofcode%2Ecom%2F2022%2Fday%2F1'}else{return false;}" target="_blank">Mastodon</a></span>]</span> this victory or <a href="/2022">[Return to Your Advent Calendar]</a>.</p> </article> </main>`,
};

export const correctAnswerDayIncomplete = {
  html: `<!DOCTYPE html> <html lang="en-us"> <head> <meta charset="utf-8"> <title>Day 2 - Advent of Code 2022</title> <!--[if lt IE 9]><script src="/static/html5.js"></script><![endif]--> <link href="//fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext" rel="stylesheet" type="text/css"> <link rel="stylesheet" type="text/css" href="/static/style.css?30"> <link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?0" title="High Contrast"> <link rel="shortcut icon" href="/favicon.png"> <script>window.addEventListener('click', function(e,s,r){if(e.target.nodeName==='CODE'&&e.detail===3){s=window.getSelection();s.removeAllRanges();r=document.createRange();r.selectNodeContents(e.target);s.addRange(r);}});</script> </head><!--




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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  --> <body> <header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2022/about">[About]</a></li><li><a href="/2022/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2022/settings">[Settings]</a></li><li><a href="/2022/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user) <span class="star-count">3*</span></div></div><div><h1 class="title-event">&nbsp;&nbsp;<span class="title-event-wrap">{:year </span><a href="/2022">2022</a><span class="title-event-wrap">}</span></h1><nav><ul><li><a href="/2022">[Calendar]</a></li><li><a href="/2022/support">[AoC++]</a></li><li><a href="/2022/sponsors">[Sponsors]</a></li><li><a href="/2022/leaderboard">[Leaderboard]</a></li><li><a href="/2022/stats">[Stats]</a></li></ul></nav></div></header> <div id="sidebar"> <div id="sponsor"><div class="quiet">Our <a href="/2022/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://careers.king.com/" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">King</a> - At King, we create unforgettable games (like Candy Crush) that are loved around the world. Join us to bring moments of magic to hundreds of millions of people every single day!</div></div> </div><!--/sidebar--> <main> <article><p>That's the right answer! You are <span class="day-success">one gold star</span> closer to collecting enough star fruit. <a href="/2022/day/2#part2">[Continue to Part Two]</a></p></article> </main> <!-- ga --> <script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview'); </script> <!-- /ga --> </body> </html>`,
  mainTag: `<main> <article><p>That's the right answer! You are <span class="day-success">one gold star</span> closer to collecting enough star fruit. <a href="/2022/day/2#part2">[Continue to Part Two]</a></p></article> </main>`,
};

export const tooManyRequests = {
  html: `<!DOCTYPE html> <html lang="en-us"> <head> <meta charset="utf-8"> <title>Day 1 - Advent of Code 2022</title> <!--[if lt IE 9]><script src="/static/html5.js"></script><![endif]--> <link href="//fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext" rel="stylesheet" type="text/css"> <link rel="stylesheet" type="text/css" href="/static/style.css?30"> <link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?0" title="High Contrast"> <link rel="shortcut icon" href="/favicon.png"> <script>window.addEventListener('click', function(e,s,r){if(e.target.nodeName==='CODE'&&e.detail===3){s=window.getSelection();s.removeAllRanges();r=document.createRange();r.selectNodeContents(e.target);s.addRange(r);}});</script> </head><!--




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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  --> <body> <header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2022/about">[About]</a></li><li><a href="/2022/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2022/settings">[Settings]</a></li><li><a href="/2022/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous)</div></div><div><h1 class="title-event">&nbsp;<span class="title-event-wrap">{&apos;year&apos;:</span><a href="/2022">2022</a><span class="title-event-wrap">}</span></h1><nav><ul><li><a href="/2022">[Calendar]</a></li><li><a href="/2022/support">[AoC++]</a></li><li><a href="/2022/sponsors">[Sponsors]</a></li><li><a href="/2022/leaderboard">[Leaderboard]</a></li><li><a href="/2022/stats">[Stats]</a></li></ul></nav></div></header> <div id="sidebar"> <div id="sponsor"><div class="quiet">Our <a href="/2022/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://careers.bankofamerica.com/" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">Bank of America</a> - We use technology, models and data to make financial lives better for our clients and communities.</div></div> </div><!--/sidebar--> <main> <article><p>You gave an answer too recently; you have to wait after submitting an answer before trying again. You have 14m 6s left to wait. <a href="/2022/day/1">[Return to Day 1]</a></p></article> </main> <!-- ga --> <script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview'); </script> <!-- /ga --> </body> </html>`,
  mainTag: `<main> <article><p>You gave an answer too recently; you have to wait after submitting an answer before trying again. You have 14m 6s left to wait. <a href="/2022/day/1">[Return to Day 1]</a></p></article> </main>`,
};

export const gaveAnswerTooRecently = `<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8"/>
<title>Day 23 - Advent of Code 2020</title>
<link rel="stylesheet" type="text/css" href="/static/style.css?31"/>
<link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?1" title="High Contrast"/>
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

If you'd like to hang out, I'm @ericwastl@hachyderm.io on Mastodon and
@ericwastl on Twitter.

- Eric Wastl


















































-->
<body>
<header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2020/about">[About]</a></li><li><a href="/2020/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2020/settings">[Settings]</a></li><li><a href="/2020/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user) <span class="star-count">31*</span></div></div><div><h1 class="title-event">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">λy.</span><a href="/2020">2020</a><span class="title-event-wrap"></span></h1><nav><ul><li><a href="/2020">[Calendar]</a></li><li><a href="/2020/support">[AoC++]</a></li><li><a href="/2020/sponsors">[Sponsors]</a></li><li><a href="/2020/leaderboard">[Leaderboard]</a></li><li><a href="/2020/stats">[Stats]</a></li></ul></nav></div></header>

<div id="sidebar">
<div id="sponsor"><div class="quiet">Our <a href="/2020/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://github.com/" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">GitHub</a> - We&apos;re hiring engineers to make GitHub fast. Interested? Email fast@github.com with details of exceptional performance work you&apos;ve done in the past.</div></div>
</div><!--/sidebar-->

<main>
<article><p>You gave an answer too recently; you have to wait after submitting an answer before trying again.  You have 16s left to wait. <a href="/2020/day/23">[Return to Day 23]</a></p></article>
</main>

<!-- ga -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>
<!-- /ga -->
</body>
</html>`;

export const notTheRightAnswer = `<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8"/>
<title>Day 23 - Advent of Code 2020</title>
<link rel="stylesheet" type="text/css" href="/static/style.css?31"/>
<link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?1" title="High Contrast"/>
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

If you'd like to hang out, I'm @ericwastl@hachyderm.io on Mastodon and
@ericwastl on Twitter.

- Eric Wastl


















































-->
<body>
<header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2020/about">[About]</a></li><li><a href="/2020/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2020/settings">[Settings]</a></li><li><a href="/2020/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user) <span class="star-count">31*</span></div></div><div><h1 class="title-event">&nbsp;&nbsp;<span class="title-event-wrap">{:year </span><a href="/2020">2020</a><span class="title-event-wrap">}</span></h1><nav><ul><li><a href="/2020">[Calendar]</a></li><li><a href="/2020/support">[AoC++]</a></li><li><a href="/2020/sponsors">[Sponsors]</a></li><li><a href="/2020/leaderboard">[Leaderboard]</a></li><li><a href="/2020/stats">[Stats]</a></li></ul></nav></div></header>

<div id="sidebar">
<div id="sponsor"><div class="quiet">Our <a href="/2020/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://www.educative.io/adventofcode" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">Educative.io</a> - From CSS to System Design, gain in-demand tech skills at the speed you want. Text-based courses with live coding environments help you learn without the fluff</div></div>
</div><!--/sidebar-->

<main>
<article><p>That's not the right answer.  If you're stuck, make sure you're using the full input data; there are also some general tips on the <a href="/2020/about">about page</a>, or you can ask for hints on the <a href="https://www.reddit.com/r/adventofcode/" target="_blank">subreddit</a>.  Please wait one minute before trying again. <a href="/2020/day/23">[Return to Day 23]</a></p></article>
</main>

<!-- ga -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>
<!-- /ga -->
</body>
</html>`;

export const answerTooLow = `<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8"/>
<title>Day 4 - Advent of Code 2021</title>
<link rel="stylesheet" type="text/css" href="/static/style.css?31"/>
<link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?1" title="High Contrast"/>
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

If you'd like to hang out, I'm @ericwastl@hachyderm.io on Mastodon and
@ericwastl on Twitter.

- Eric Wastl


















































-->
<body>
<header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2021/about">[About]</a></li><li><a href="/2021/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2021/settings">[Settings]</a></li><li><a href="/2021/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user)</div></div><div><h1 class="title-event">&nbsp;&nbsp;<span class="title-event-wrap">{:year </span><a href="/2021">2021</a><span class="title-event-wrap">}</span></h1><nav><ul><li><a href="/2021">[Calendar]</a></li><li><a href="/2021/support">[AoC++]</a></li><li><a href="/2021/sponsors">[Sponsors]</a></li><li><a href="/2021/leaderboard">[Leaderboard]</a></li><li><a href="/2021/stats">[Stats]</a></li></ul></nav></div></header>

<div id="sidebar">
<div id="sponsor"><div class="quiet">Our <a href="/2021/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://www.smartystreets.com/advent-of-code" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">SmartyStreets</a> - Join our private leaderboard and solve our puzzles for BIG PRIZES!!! ----------------- Address Validation, Rooftop Geocoding, and more!</div></div>
</div><!--/sidebar-->

<main>
<article><p>That's not the right answer; your answer is too low.  If you're stuck, make sure you're using the full input data; there are also some general tips on the <a href="/2021/about">about page</a>, or you can ask for hints on the <a href="https://www.reddit.com/r/adventofcode/" target="_blank">subreddit</a>.  Please wait one minute before trying again. <a href="/2021/day/4">[Return to Day 4]</a></p></article>
</main>

<!-- ga -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>
<!-- /ga -->
</body>
</html>`;

export const answerTooHigh = `<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8"/>
<title>Day 4 - Advent of Code 2021</title>
<link rel="stylesheet" type="text/css" href="/static/style.css?31"/>
<link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?1" title="High Contrast"/>
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

If you'd like to hang out, I'm @ericwastl@hachyderm.io on Mastodon and
@ericwastl on Twitter.

- Eric Wastl


















































-->
<body>
<header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2021/about">[About]</a></li><li><a href="/2021/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2021/settings">[Settings]</a></li><li><a href="/2021/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user)</div></div><div><h1 class="title-event">&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">$year=</span><a href="/2021">2021</a><span class="title-event-wrap">;</span></h1><nav><ul><li><a href="/2021">[Calendar]</a></li><li><a href="/2021/support">[AoC++]</a></li><li><a href="/2021/sponsors">[Sponsors]</a></li><li><a href="/2021/leaderboard">[Leaderboard]</a></li><li><a href="/2021/stats">[Stats]</a></li></ul></nav></div></header>

<div id="sidebar">
<div id="sponsor"><div class="quiet">Our <a href="/2021/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://boards.greenhouse.io/ramp?gh_src=2783e2862us" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">Ramp</a> - Have you ever sped up a real-world job 5x using software? Ramp does that for companies every day with financial automation. We&apos;re hiring ambitious engineers (Python, Elixir, Typescript) - join us if you like fast growth!</div></div>
</div><!--/sidebar-->

<main>
<article><p>That's not the right answer; your answer is too high.  If you're stuck, make sure you're using the full input data; there are also some general tips on the <a href="/2021/about">about page</a>, or you can ask for hints on the <a href="https://www.reddit.com/r/adventofcode/" target="_blank">subreddit</a>.  Please wait one minute before trying again. <a href="/2021/day/4">[Return to Day 4]</a></p></article>
</main>

<!-- ga -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>
<!-- /ga -->
</body>
</html>`;

export const doesNotMatch = `<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8"/>
<title>Day 4 - Advent of Code 2021</title>
<link rel="stylesheet" type="text/css" href="/static/style.css?31"/>
<link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?1" title="High Contrast"/>
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

If you'd like to hang out, I'm @ericwastl@hachyderm.io on Mastodon and
@ericwastl on Twitter.

- Eric Wastl


















































-->
<body>
<header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2021/about">[About]</a></li><li><a href="/2021/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2021/settings">[Settings]</a></li><li><a href="/2021/auth/logout">[Log Out]</a></li></ul></nav><div class="user">(anonymous user)</div></div><div><h1 class="title-event">&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">$year=</span><a href="/2021">2021</a><span class="title-event-wrap">;</span></h1><nav><ul><li><a href="/2021">[Calendar]</a></li><li><a href="/2021/support">[AoC++]</a></li><li><a href="/2021/sponsors">[Sponsors]</a></li><li><a href="/2021/leaderboard">[Leaderboard]</a></li><li><a href="/2021/stats">[Stats]</a></li></ul></nav></div></header>

<div id="sidebar">
<div id="sponsor"><div class="quiet">Our <a href="/2021/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://boards.greenhouse.io/ramp?gh_src=2783e2862us" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">Ramp</a> - Have you ever sped up a real-world job 5x using software? Ramp does that for companies every day with financial automation. We&apos;re hiring ambitious engineers (Python, Elixir, Typescript) - join us if you like fast growth!</div></div>
</div><!--/sidebar-->

<main>
<article><p>I bet you're wishing this matched a parser, but it doesn't pal!</p></article>
</main>

<!-- ga -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>
<!-- /ga -->
</body>
</html>`;
