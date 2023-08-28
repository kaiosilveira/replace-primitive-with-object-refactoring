import { Priority } from ".";

describe('Priority', () => {
  it('should have a value associated', () => {
    const priority = new Priority('high');
    expect(priority.toString()).toEqual('high');
  });

  it('should return the same value if constructor argument is an instance of the Priority class', () => {
    const existingPriority = new Priority('high');
    const priority = new Priority(existingPriority);
    expect(priority).toBe(existingPriority);
  });

  it('should throw an error if the provided value is not within the supported values', () => {
    expect(() => new Priority('wrong')).toThrow(new Error('<wrong> is invalid for Priority'));
  });

  describe('equality', () => {
    it('should be considered equal to another Priority instance with the same value', () => {
      const priority1 = new Priority('high');
      const priority2 = new Priority('high');

      expect(priority1.equals(priority2)).toBe(true);
    });

    describe('low < normal < high < rush', () => {
      it('should state priorities accordingly', () => {
        const lowPriority = new Priority('low');
        const normalPriority = new Priority('normal');
        const highPriority = new Priority('high');
        const rushPriority = new Priority('rush');

        expect(lowPriority.lowerThan(normalPriority)).toBe(true);
        expect(lowPriority.lowerThan(highPriority)).toBe(true);
        expect(lowPriority.lowerThan(rushPriority)).toBe(true);

        expect(normalPriority.higherThan(lowPriority)).toBe(true);
        expect(normalPriority.lowerThan(highPriority)).toBe(true);
        expect(normalPriority.lowerThan(rushPriority)).toBe(true);

        expect(highPriority.higherThan(lowPriority)).toBe(true);
        expect(highPriority.higherThan(normalPriority)).toBe(true);
        expect(highPriority.lowerThan(rushPriority)).toBe(true);

        expect(rushPriority.higherThan(lowPriority)).toBe(true);
        expect(rushPriority.higherThan(normalPriority)).toBe(true);
        expect(rushPriority.higherThan(highPriority)).toBe(true);
      });
    });
  });
});
