import { StatementViolation } from "packages/domain/src/types/StatementViolation"

export type LintResponseMessage = {
  filename: string,
  violations: undefined | StatementViolation[]
}