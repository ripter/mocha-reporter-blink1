var Blink1 = require('node-blink1');

const blink1 = new Blink1();

module.exports = Base;

// On Success, show green.
function setSuccess(blink) {
  blink.fadeToRGB(500, 0, 100, 0); // millisec, r, g, b: 0 - 255
}

// On Fail, blink red.
function setFail(blink) {
  blink.setRGB(255, 0, 0);
  blink.fadeToRGB(500, 100, 0, 0); // millisec, r, g, b: 0 - 255
}

// Base was copied from the Mocha's own base reporter.
function Base(runner) {
  var stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 };
  var failures = this.failures = [];
  if (!runner) {
    return;
  }
  this.runner = runner;

  runner.stats = stats;

  // Before any test is run.
  runner.on('start', function() {
    stats.start = new Date();
  });

  // After all tests finished
  runner.on('end', function() {
    stats.end = new Date();
    stats.duration = new Date() - stats.start;

    const hasFailure = stats.failures > 0;

    if (hasFailure) {
      setFail(blink1);
      console.log(failures[0].err);
    } else {
      setSuccess(blink1);

      console.log(`${stats.tests} tests ran.`);
      console.log(`${stats.passes} tests passed.`);
    }

    blink1.close();
  });



  // `describe()` blocks
  runner.on('suite', function(suite) {
    stats.suites = stats.suites || 0;
    suite.root || stats.suites++;
  });

  // `it()` ran and ended
  runner.on('test end', function() {
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  // `it()` passed
  runner.on('pass', function(test) {
    stats.passes = stats.passes || 0;
    if (test.duration > test.slow()) {
      test.speed = 'slow';
    } else if (test.duration > test.slow() / 2) {
      test.speed = 'medium';
    } else {
      test.speed = 'fast';
    }
    stats.passes++;
  });

  runner.on('fail', function(test, err) {
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.on('pending', function() {
    stats.pending++;
  });
}
