import { StatementViolation } from "@linter/domain";
import chalk from "chalk";
import { padCharsStart, repeat } from "lodash/fp";

const reporter = (statement: StatementViolation, file: string) => {
  const lines = statement.text.split('\n');

  const violation = statement.violations[0];
  const length = violation.idxEnd - violation.idxStart;

  let lineIdx = 0;
  let idx = 0;
  while (true) {
    const line = lines[lineIdx];
    if (violation.idxStart > idx + line.length) {
      lineIdx += 1;
      idx += line.length + 1;
    }
    else {
      break;
    }
  }

  console.log(chalk.underline(file));
  console.log(`  ${lineIdx + 1}:${violation.idxStart - idx + 1}  ${chalk.red('error')}  ${violation.error}`);
  console.log(lines[lineIdx]);
  console.log(padCharsStart(' ', violation.idxStart - idx, repeat(length, '^')));
  console.log();
}
export default reporter;