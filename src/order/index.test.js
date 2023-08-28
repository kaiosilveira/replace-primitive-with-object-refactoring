import { Order } from ".";

describe('Order', () => {
  it('should have the priority string associated to the order', () => {
    const order = new Order({ priority: 'high' });
    expect(order.priorityString).toEqual('high');
  });
});
