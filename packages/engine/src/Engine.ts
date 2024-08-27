import { Rule, StatementViolation } from "@linter/domain";
import { castArray, constant, flattenDeep, flow, invokeArgsMap, isArray, isEmpty, map, reject, tap } from "lodash/fp";

const createRuleMapBuilder = (rulesMap: Record<string, Rule[]>) => {
  const addRule = (statementType: string | string[], rule: Rule) => {
    if (isArray(statementType)) {
      for (let st of statementType) {
        addRule(st, rule);
      }
    }
    else {
      const rules = rulesMap[statementType] ?? [];
      rulesMap[statementType] = [...rules, rule];
    }
  }

  return addRule;
}

const buildTypeExecutor = (rules: Rule[]) => {
  return (text: string) => {
    return flow(
      invokeArgsMap('evaluate', [text]),
      map(castArray),
      flattenDeep,
      reject(x => x === true),
    )(rules);
  }
}

const loadRule = async (ruleName: string): Promise<Rule> => {
  const { semicolon } = await import(`@linter/rules-typescript`)

  return semicolon;
}

export default class Engine {
  private rulesByType: Record<string, Rule[]> = {};
  private typeExecutors: Record<string, ReturnType<typeof buildTypeExecutor>> = {};
  private rulesLoaded: boolean = false;

  constructor() { }

  public async setRules(ruleImports: string[]) {
    if (this.rulesLoaded) {
      return Promise.resolve();
    }
    this.rulesLoaded = true;

    const addRule = createRuleMapBuilder(this.rulesByType);

    const rules = await Promise.all(map(loadRule, ruleImports));
    for (let rule of rules) {
      addRule(rule.statementType, rule);
    }

    for (let type in this.rulesByType) {
      this.typeExecutors[type] = buildTypeExecutor(this.rulesByType[type]);
    }
  }

  public runRulesForType(statementType: string, text: string): true | StatementViolation {
    const specificViolations = this.typeExecutors[statementType]?.(text) ?? [];
    const allStatementsViolations = this.typeExecutors['*']?.(text) ?? [];

    const violations = [...specificViolations, ...allStatementsViolations];

    return isEmpty(violations)
      ? true
      : {
        statementType,
        text,
        violations,
      } satisfies StatementViolation;
  }
}