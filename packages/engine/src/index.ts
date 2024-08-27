import fs from 'fs';
import path from 'path';
import lint from './linter';
import { Rule } from '@linter/domain';
import { exit } from 'process';

const root = path.join(__dirname, '..', '..', '..');

lint(['semicolon'], root)
  .finally(() => exit(0));