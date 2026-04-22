const API_URL = 'http://127.0.0.1:8000/api/cart';

// Fetch and render the cart
async function loadCart() {
  const response = await fetch(`${API_URL}/`, {
    credentials: 'include',
  });
  const data = await response.json();
  renderCart(data.cart);
}

// Render cart items in the drawer
function renderCart(cart) {
  const panel = document.querySelector('.cart-drawer-panel');
  const header = panel.querySelector('.cart-drawer-header');

  // Remove everything after the header
  while (header.nextSibling) {
    header.nextSibling.remove();
  }

  if (cart.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'cart-empty';
    empty.textContent = 'Your cart is empty.';
    panel.appendChild(empty);
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const price = item.price * item.quantity;
    total += price;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${item.size} / ${item.frame === 'none' ? 'no' : item.frame} frame</span>
        <span>Qty: ${item.quantity} — $${price} USD</span>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    `;
    panel.appendChild(div);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.innerHTML = `<strong>Total: $${total} USD</strong>`;
  panel.appendChild(totalDiv);

  const checkoutButtonDiv = document.createElement('div');
  checkoutButtonDiv.className = 'checkout-button';
  checkoutButtonDiv.innerHTML = `<button>Checkout</button>`;
  panel.appendChild(checkoutButtonDiv);
}

// Add item to cart
async function addToCart(slug, size, frame) {
  const response = await fetch(`${API_URL}/add/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ slug, size, frame }),
  });
  const data = await response.json();
  renderCart(data.cart);
  openCart();
}

// Remove item from cart
async function removeFromCart(itemId) {
  const response = await fetch(`${API_URL}/remove/${itemId}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await response.json();
  renderCart(data.cart);
}

loadCart();