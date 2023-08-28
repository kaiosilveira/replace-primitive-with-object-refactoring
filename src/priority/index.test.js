import { Priority } from ".";

describe('Priority', () => {
  it('should have a value associated', () => {
    const priority = new Priority('high');
    expect(priority.toString()).toEqual('high');
  });
});
