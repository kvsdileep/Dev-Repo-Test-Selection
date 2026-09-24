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

const PROMO_CODES = {
  TECH10: { rate: 0.1, category: 'Electronics', description: '10% off electronics' }
};

// Returns { discount, promo, message } for the given lines and code.
function applyPromo(lines, promoCode) {
  if (!promoCode) {
    return { discount: 0, promo: null, message: null };
  }

  const code = promoCode.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  if (!promo) {
    return { discount: 0, promo: null, message: `Invalid promo code: ${promoCode}` };
  }

  const eligibleCents = lines
    .filter(line => line.category === promo.category)
    .reduce((sum, line) => sum + toCents(line.lineTotal), 0);

  if (eligibleCents === 0) {
    return { discount: 0, promo: null, message: `${code} requires ${promo.category} items in your cart` };
  }

  const discount = fromCents(Math.round(eligibleCents * promo.rate));
  return { discount, promo: code, message: `${code} applied: ${promo.description}` };
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
