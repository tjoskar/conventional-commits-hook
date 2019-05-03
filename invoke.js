const { conventionalCommitsHook } = require('./bin/lib');

conventionalCommitsHook(`${process.env.PWD}/mock_hooks`, process.argv[2]);
