import { countHighPriorityAndRushOrders } from ".";
import { Order } from "../order";

describe('countHighPriorityAndRushOrders', () => {
  it('should return the correct number of orders that are either high priority or rush', () => {
    const highPriorityOrder = new Order({ priority: 'high' });
    const rushOrder = new Order({ priority: 'rush' });
    const lowPriorityOrder = new Order({ priority: 'low' });
    const orders = [highPriorityOrder, rushOrder, lowPriorityOrder];

    const highPriorityAndRushOrderCount = countHighPriorityAndRushOrders(orders);

    expect(highPriorityAndRushOrderCount).toEqual(2);
  });
});
