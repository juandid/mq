// Input-Validierung

export class AliasValidator {
  constructor(validationConfig) {
    this.pattern = validationConfig.aliasPattern;
  }

  validate(aliasValue) {
    return this.pattern.test(aliasValue);
  }
}
