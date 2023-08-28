[![Continuous Integration](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Replace Primitive with Object

**Formerly: Replace Data Value with Object**
<br />
**Formerly: Replace Type Code with Class**

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
orders.filter(o => 'high' === o.proprity || 'rush' === o.priority);
```

</td>

<td>

```javascript
orders.filter(o => o.priority.higherThan(new Priority('normal')));
```

</td>
</tr>
</tbody>
</table>

Often enough, we start modeling things as simple data records, such as strings and numbers, just to find out later that it wasn't really that "simple". This phenomenon often leads us to implement duplicated code throughout the codebase, especially to perform validations and comparisons. This refactoring helps refactoring in these embarrassing situations.

## Working example

Our working example consists of an `Order` class that has an underlying `priority` field. This field is used by a client code to reason about how many high-priority and rush orders are there. Our starting code looks like this:

```js
class Order {
  constructor(data) {
    this.priority = data.priority;
    // more initialization
  }
}

// client code
highPriorityCount = orders.filter(o => 'high' === o.proprity || 'rush' === o.priority);
```

### Test suite

Our initial test suite is pretty straightforward: it makes sure that the `Order` class has an underlying priority field and that the client code is working as expected.

```javascript
// Order class' tests
describe('Order', () => {
  it('should have a priority associated', () => {
    const order = new Order({ priority: 'high' });
    expect(order.priority).toEqual('high');
  });
});

// Client code tests
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
```

Throughout the refactoring steps, this test suite was expanded accordingly, preserving existing tests and introducing new ones as needed.

### Steps

We start by introducing a getter and a setter for priority. It will help protect any client code from breaking due to our internal changes:

```diff
diff --git a/src/order/index.js b/src/order/index.js
@@ -2,4 +2,12 @@
export class Order {
   constructor(data) {
     this.priority = data.priority;
   }
+
+  get priority() {
+    return this._priority;
+  }
+
+  set priority(aString) {
+    this._priority = aString;
+  }
 }
```

Then, we introduce a `Priority` class, initially to hold the priority value of an order:

```diff
diff --git a/src/priority/index.js b/src/priority/index.js
@@ -0,0 +1,9 @@
+export class Priority {
+  constructor(value) {
+    this._value = value;
+  }
+
+  toString() {
+    return this._value;
+  }
+}

diff --git a/src/priority/index.test.js b/src/priority/index.test.js
@@ -0,0 +1,8 @@
+import { Priority } from ".";
+
+describe('Priority', () => {
+  it('should have a value associated', () => {
+    const priority = new Priority('high');
+    expect(priority.toString()).toEqual('high');
+  });
+});
```

Moving on, we update both the `Order` class and the client code to introduce the new `Priority` class idea:

```diff
diff --git a/src/client-code/index.js b/src/client-code/index.js
@@ -4,7 +4,7 @@ so it can be unit tested.

 export function countHighPriorityAndRushOrders(orders) {
   const highPriorityCount = orders.filter(
-    (o) => "high" === o.priority || "rush" === o.priority
+    (o) => "high" === o.priorityString || "rush" === o.priorityString
   ).length;

   return highPriorityCount;

diff --git a/src/order/index.js b/src/order/index.js
@@ -1,13 +1,15 @@
+import { Priority } from "../priority";
+
 export class Order {
   constructor(data) {
     this.priority = data.priority;
   }

-  get priority() {
-    return this._priority;
+  get priorityString() {
+    return this._priority.toString();
   }

   set priority(aString) {
-    this._priority = aString;
+    this._priority = new Priority(aString);
   }
 }

diff --git a/src/order/index.test.js b/src/order/index.test.js
@@ -1,8 +1,8 @@
 import { Order } from ".";

 describe('Order', () => {
-  it('should have a priority associated', () => {
+  it('should have the priority string associated to the order', () => {
     const order = new Order({ priority: 'high' });
-    expect(order.priority).toEqual('high');
+    expect(order.priorityString).toEqual('high');
   });
 });
```

Then, we stop to introduce a priority getter at `Order` to return the raw instance of a `Priority`, because it can be handy sometimes:

```diff
diff --git a/src/order/index.js b/src/order/index.js
@@ -5,6 +5,10 @@
export class Order {
     this.priority = data.priority;
   }

+  get priority() {
+    return this._priority;
+  }
+
   get priorityString() {
     return this._priority.toString();
   }

diff --git a/src/order/index.test.js b/src/order/index.test.js
@@ -1,8 +1,14 @@
 import { Order } from ".";
+import { Priority } from "../priority";

 describe('Order', () => {
   it('should have the priority string associated to the order', () => {
     const order = new Order({ priority: 'high' });
     expect(order.priorityString).toEqual('high');
   });
+
+  it('should return an instance of the priority class', () => {
+    const order = new Order({ priority: 'high' });
+    expect(order.priority).toBeInstanceOf(Priority);
+  });
 });
```

And yet another stop, this time to make the `Priority` class constructor more flexible:

```diff
diff --git a/src/priority/index.js b/src/priority/index.js
@@ -1,5 +1,6 @@
 export class Priority {
   constructor(value) {
+    if (value instanceof Priority) return value;
     this._value = value;
   }

diff --git a/src/priority/index.test.js b/src/priority/index.test.js
@@ -5,4 +5,10 @@
  describe('Priority', () => {
     const priority = new Priority('high');
     expect(priority.toString()).toEqual('high');
   });
+
+  it('should return the same value if constructor argument is an instance of the Priority class', () => {
+    const existingPriority = new Priority('high');
+    const priority = new Priority(existingPriority);
+    expect(priority).toBe(existingPriority);
+  });
 });
```

Making effective use of our new encapsulation flexibility, we introduce some validation when initializing a new instance of `Priority`:

```diff
diff --git a/src/priority/index.js b/src/priority/index.js
@@ -1,10 +1,18 @@
 export class Priority {
   constructor(value) {
     if (value instanceof Priority) return value;
-    this._value = value;
+    if (!Priority.legalValues().includes(value)) {
+      throw new Error(`<${value}> is invalid for Priority`)
+    } else {
+      this._value = value;
+    }
   }

   toString() {
     return this._value;
   }
+
+  static legalValues() {
+    return ["low", "normal", "high", "rush"];
+  }
 }

diff --git a/src/priority/index.test.js b/src/priority/index.test.js
@@ -11,4 +11,8 @@ describe('Priority', () => {
     const priority = new Priority(existingPriority);
     expect(priority).toBe(existingPriority);
   });
+
+  it('should throw an error if the provided value is not within the supported values', () => {
+    expect(() => new Priority('wrong')).toThrow(new Error('<wrong> is invalid for Priority'));
+  });
 });
```

And we also add equality comparisons to it:

```diff
diff --git a/src/priority/index.js b/src/priority/index.js
@@ -12,6 +12,22 @@
export class Priority {
     return this._value;
   }

+  equals(other) {
+    return this._value === other._value;
+  }
+
+  _index() {
+    return Priority.legalValues().findIndex(s => s === this._value);
+  }
+
+  lowerThan(other) {
+    return this._index() < other._index();
+  }
+
+  higherThan(other) {
+    return this._index() > other._index();
+  }
+
   static legalValues() {
     return ["low", "normal", "high", "rush"];
   }

diff --git a/src/priority/index.test.js b/src/priority/index.test.js
@@ -15,4 +15,38 @@
describe('Priority', () => {
   it('should throw an error if the provided value is not within the supported values', () => {
     expect(() => new Priority('wrong')).toThrow(new Error('<wrong> is invalid for Priority'));
   });
+
+  describe('equality', () => {
+    it('should be considered equal to another Priority instance with the same value', () => {
+      const priority1 = new Priority('high');
+      const priority2 = new Priority('high');
+
+      expect(priority1.equals(priority2)).toBe(true);
+    });
+
+    describe('low < normal < high < rush', () => {
+      it('should state priorities accordingly', () => {
+        const lowPriority = new Priority('low');
+        const normalPriority = new Priority('normal');
+        const highPriority = new Priority('high');
+        const rushPriority = new Priority('rush');
+
+        expect(lowPriority.lowerThan(normalPriority)).toBe(true);
+        expect(lowPriority.lowerThan(highPriority)).toBe(true);
+        expect(lowPriority.lowerThan(rushPriority)).toBe(true);
+
+        expect(normalPriority.higherThan(lowPriority)).toBe(true);
+        expect(normalPriority.lowerThan(highPriority)).toBe(true);
+        expect(normalPriority.lowerThan(rushPriority)).toBe(true);
+
+        expect(highPriority.higherThan(lowPriority)).toBe(true);
+        expect(highPriority.higherThan(normalPriority)).toBe(true);
+        expect(highPriority.lowerThan(rushPriority)).toBe(true);
+
+        expect(rushPriority.higherThan(lowPriority)).toBe(true);
+        expect(rushPriority.higherThan(normalPriority)).toBe(true);
+        expect(rushPriority.higherThan(highPriority)).toBe(true);
+      });
+    });
+  });
 });
```

Finally, we can update the client code to be more expressive:

```diff
diff --git a/src/client-code/index.js b/src/client-code/index.js
@@ -1,11 +1,12 @@
+import { Priority } from "../priority";
+
 /* This code is being adapted based on the original code snippet presented in the book
-so it can be unit tested.
+  so it can be unit tested.
 */
-
 export function countHighPriorityAndRushOrders(orders) {
-  const highPriorityCount = orders.filter(
-    (o) => "high" === o.priorityString || "rush" === o.priorityString
-  ).length;
+  const highPriorityCount = orders
+    .filter(o => o.priority.higherThan(new Priority('normal')))
+    .length;

   return highPriorityCount;
 }
```

And that's it!

It might look more verbose and too much more code for a simple refactoring, but the expanded flexibility and new capabilities that we brought to the system by introducing a `Priority` class might pay off many times in a real-world scenario. Some of this flexibility is already shown as part of this refactoring: the equality comparisons implemented as part of the `Priority` class itself help in making the client more way more expressive and short.

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                           | Message                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| [ec544d5](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/ec544d536c0b2ffb02ee73e6098e05889659d133) | introduce a getter and a setter for priorty               |
| [b0d35a3](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/b0d35a3503c9c0fbbda9c75b227d030f5859d4f2) | introduce Priority class                                  |
| [7d492c7](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/7d492c77339e8eb54ff17aec66113af2652709a3) | update Order class to use Priority class                  |
| [b82dfac](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/b82dfac926faae6abd68808bdf171ae5ff896519) | introduce a priority getter at Order for the raw instance |
| [08fa083](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/08fa0836f76c9ce1a3ef8d4c5ae70cee6cf0a73f) | make Priority class ctor more flexible                    |
| [47eba69](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/47eba69b7d7f22ecb751ebeb09dd80ee6a54145f) | introduce validation for Priority values                  |
| [a345936](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/a34593626d8484190466112834173bb01140d0ae) | introduce equality rules for Priority                     |
| [39225b4](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commit/39225b4e9e85cec9f468d3567c6d20c262596d30) | update client code to be more expressive                  |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-primitive-with-object-refactoring/commits/main).
