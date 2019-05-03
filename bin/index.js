#!/usr/bin/env node
'use strict';

const { conventionalCommitsHook } = require('./lib');

conventionalCommitsHook(`${process.env.PWD}/.git/hooks`, process.argv[2]);
