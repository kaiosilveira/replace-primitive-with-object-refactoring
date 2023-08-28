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

  equals(other) {
    return this._value === other._value;
  }

  _index() {
    return Priority.legalValues().findIndex(s => s === this._value);
  }

  lowerThan(other) {
    return this._index() < other._index();
  }

  higherThan(other) {
    return this._index() > other._index();
  }

  static legalValues() {
    return ["low", "normal", "high", "rush"];
  }
}
