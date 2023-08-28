/* This code is being adapted based on the original code snippet presented in the book
so it can be unit tested.
*/

export function countHighPriorityAndRushOrders(orders) {
  const highPriorityCount = orders.filter(
    (o) => "high" === o.priority || "rush" === o.priority
  ).length;

  return highPriorityCount;
}

