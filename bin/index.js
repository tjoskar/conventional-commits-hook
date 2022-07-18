#!/usr/bin/env node
import process from 'node:process';
import {conventionalCommitsHook} from './lib.js';

conventionalCommitsHook(`${process.env.PWD}/.git/hooks`, process.argv[2]);
