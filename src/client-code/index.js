import { Priority } from "../priority";

/* This code is being adapted based on the original code snippet presented in the book
  so it can be unit tested.
*/
export function countHighPriorityAndRushOrders(orders) {
  const highPriorityCount = orders
    .filter(o => o.priority.higherThan(new Priority('normal')))
    .length;

  return highPriorityCount;
}

