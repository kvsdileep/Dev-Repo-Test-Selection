// Checkout pricing. Quotes a cart against the product catalog without
// placing an order or touching stock.

const MAX_QTY = 10;

const toCents = (amount) => Math.round(amount * 100);
const fromCents = (cents) => cents / 100;

// Turns [{ productId, qty }] into priced lines. Throws on bad input.
function buildLines(items, products) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty');
  }

  return items.map(({ productId, qty }) => {
    const product = products.find(p => p.id === parseInt(productId, 10));
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }
    const quantity = parseInt(qty, 10);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      throw new Error(`Quantity for ${product.name} must be between 1 and ${MAX_QTY}`);
    }
    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      qty: quantity,
      lineTotal: fromCents(toCents(product.price) * quantity)
    };
  });
}

// Promo codes are not supported yet.
// Returns { discount, promo, message } for the given lines and code.
function applyPromo(lines, promoCode) {
  if (!promoCode) {
    return { discount: 0, promo: null, message: null };
  }
  return { discount: 0, promo: null, message: 'Promo codes are not supported yet' };
}

function quote(items, promoCode, products) {
  const lines = buildLines(items, products);
  const subtotal = fromCents(lines.reduce((sum, line) => sum + toCents(line.lineTotal), 0));
  const { discount, promo, message } = applyPromo(lines, promoCode);

  return {
    lines,
    subtotal,
    discount,
    promo,
    message,
    total: subtotal - discount
  };
}

module.exports = { quote, applyPromo, buildLines };
