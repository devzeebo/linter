import { RuleViolation } from "./RuleViolation"

export type StatementViolation = {
  statementType: string,
  text: string,
  violations: RuleViolation[]
}