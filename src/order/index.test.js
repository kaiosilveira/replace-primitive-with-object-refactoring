import { Order } from ".";
import { Priority } from "../priority";

describe('Order', () => {
  it('should have the priority string associated to the order', () => {
    const order = new Order({ priority: 'high' });
    expect(order.priorityString).toEqual('high');
  });

  it('should return an instance of the priority class', () => {
    const order = new Order({ priority: 'high' });
    expect(order.priority).toBeInstanceOf(Priority);
  });
});
