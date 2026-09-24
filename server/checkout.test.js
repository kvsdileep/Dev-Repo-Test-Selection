const test = require('node:test');
const assert = require('node:assert');
const { quote } = require('./checkout');

const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 50 },
  { id: 4, name: 'Coffee Maker', price: 89.99, category: 'Home', stock: 30 },
  { id: 5, name: 'Book', price: 14.99, category: 'Education', stock: 200 }
];

test('sums line totals to the cent', () => {
  const result = quote([{ productId: 1, qty: 1 }, { productId: 4, qty: 1 }], '', products);
  assert.strictEqual(result.subtotal, 1089.98);
  assert.strictEqual(result.discount, 0);
  assert.strictEqual(result.total, 1089.98);
});

test('multiplies line totals by quantity', () => {
  const result = quote([{ productId: 5, qty: 3 }], '', products);
  assert.strictEqual(result.lines[0].lineTotal, 44.97);
  assert.strictEqual(result.total, 44.97);
});

test('rejects an empty cart', () => {
  assert.throws(() => quote([], '', products), /Cart is empty/);
});

test('rejects an unknown product', () => {
  assert.throws(() => quote([{ productId: 99, qty: 1 }], '', products), /Product not found/);
});

test('rejects out-of-range quantities', () => {
  assert.throws(() => quote([{ productId: 5, qty: 0 }], '', products), /between 1 and 10/);
  assert.throws(() => quote([{ productId: 5, qty: 11 }], '', products), /between 1 and 10/);
});
