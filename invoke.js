import process from 'node:process';
import {conventionalCommitsHook} from './bin/lib.js';

conventionalCommitsHook(`${process.env.PWD}/mock_hooks`, process.argv[2]);
