import { Rule } from '@linter/domain';

export const rule: Rule = {
  statementType: ['ImportDeclaration'],
  evaluate: (text: string) => {
    const trimmed = text.trimEnd();
    if (text.endsWith(';')) {
      return true;
    }

    return {
      error: 'missing semicolon',
      idxStart: trimmed.length,
      idxEnd: trimmed.length + 1,
    }
  }
}