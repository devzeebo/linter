import tsc, { Node, ScriptTarget, SourceFile, SyntaxKind } from 'typescript';
import { Statement } from '@linter/engine/src/domain/Statement';
import fs from 'fs';
import path from 'path';

function* printRecursiveFrom(
  node: Node,
  indentLevel: number,
  sourceFile: SourceFile
): any {
  const indentation = "-".repeat(indentLevel);
  const syntaxKind = SyntaxKind[node.kind];
  const nodeText = node.getText(sourceFile);
  // console.log(`${indentation}${syntaxKind}: ${nodeText}`);

  yield { text: nodeText, type: syntaxKind } satisfies Statement

  yield* node.forEachChild(child =>
    printRecursiveFrom(child, indentLevel + 1, sourceFile)
  );
}

function* parse(text: string, filename: string) {
  const source = tsc.createSourceFile(filename, text, {
    languageVersion: ScriptTarget.Latest,
  });

  yield* printRecursiveFrom(source, 0, source);
}
export default parse;


// printRecursiveFrom(source, 0, source);