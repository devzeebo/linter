import { Rule } from "../../domain/src/Rule";
import parserTypescript from '@linter/parser-typescript';
import fs from 'fs';
import path from 'path';

const contents = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'example', 'simple.ts')).toString();

const lint = (
  rules: Rule[],
) => (text: string) => {
  const ast = parserTypescript(text, 'fake.txt');
}