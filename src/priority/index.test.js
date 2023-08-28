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
});
