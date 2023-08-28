import { Order } from ".";

describe('Order', () => {
  it('should have a priority associated', () => {
    const order = new Order({ priority: 'high' });
    expect(order.priority).toEqual('high');
  });
});
