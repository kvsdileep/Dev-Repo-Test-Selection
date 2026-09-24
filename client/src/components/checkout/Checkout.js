import React, { useState, useEffect, useCallback } from 'react';
import API from '../../services/api';

function Checkout({ products }) {
  const [quantities, setQuantities] = useState({});
  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');

  const refreshQuote = useCallback(async (code) => {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => ({ productId: Number(productId), qty }));

    if (items.length === 0) {
      setQuote(null);
      return;
    }

    try {
      const data = await API.checkout.quote(items, code);
      setQuote(data);
      setError('');
    } catch (err) {
      setQuote(null);
      setError(err.message);
    }
  }, [quantities]);

  useEffect(() => {
    refreshQuote(appliedCode);
  }, [refreshQuote, appliedCode]);

  const handleApply = (e) => {
    e.preventDefault();
    const code = promoInput.trim();
    if (code === appliedCode) {
      refreshQuote(code);
    } else {
      setAppliedCode(code);
    }
  };

  return (
    <div className="tab-content">
      <div className="form-section checkout">
        <h2>Checkout</h2>

        <ul className="cart-lines" aria-label="Cart">
          {products.map(product => (
            <li key={product.id} className="cart-line" data-testid={`line-${product.id}`}>
              <label htmlFor={`qty-${product.id}`}>
                {product.name}
                <span className="cart-price">${product.price} · {product.category}</span>
              </label>
              <input
                id={`qty-${product.id}`}
                type="number"
                min="0"
                max="10"
                value={quantities[product.id] ?? 0}
                onChange={(e) => setQuantities({
                  ...quantities,
                  [product.id]: Math.max(0, parseInt(e.target.value, 10) || 0)
                })}
              />
            </li>
          ))}
        </ul>

        <form className="promo-form" onSubmit={handleApply}>
          <label htmlFor="promo-code">Promo code</label>
          <input
            id="promo-code"
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Apply</button>
        </form>

        <div role="status" aria-live="polite" className="checkout-message" data-testid="checkout-message">
          {error || quote?.message || (quote ? '' : 'Add items to see your total')}
        </div>

        {quote && (
          <dl className="checkout-summary">
            <div className="summary-row">
              <dt>Subtotal</dt>
              <dd data-testid="subtotal">${quote.subtotal}</dd>
            </div>
            {quote.discount > 0 && (
              <div className="summary-row summary-discount">
                <dt>Discount{quote.promo ? ` (${quote.promo})` : ''}</dt>
                <dd data-testid="discount">-${quote.discount}</dd>
              </div>
            )}
            <div className="summary-row summary-total">
              <dt>Total</dt>
              <dd data-testid="total">${quote.total}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}

export default Checkout;
