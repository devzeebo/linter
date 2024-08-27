import { RuleViolation } from "./RuleViolation"

export type Rule = {
  statementType: string | string[],
  evaluate: (text: string) => boolean | RuleViolation | RuleViolation[],
  fix?: (text: string) => string
}