export type Rule = {
  statementType: string,
  evaluate: (text: string) => boolean | [{ error: string, idxStart: number, idxEnd: number }],
  fix?: (text: string) => string
}