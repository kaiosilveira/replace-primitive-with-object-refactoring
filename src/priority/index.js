export class Priority {
  constructor(value) {
    if (value instanceof Priority) return value;
    this._value = value;
  }

  toString() {
    return this._value;
  }
}
