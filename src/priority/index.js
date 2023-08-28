export class Priority {
  constructor(value) {
    if (value instanceof Priority) return value;
    if (!Priority.legalValues().includes(value)) {
      throw new Error(`<${value}> is invalid for Priority`)
    } else {
      this._value = value;
    }
  }

  toString() {
    return this._value;
  }

  static legalValues() {
    return ["low", "normal", "high", "rush"];
  }
}
