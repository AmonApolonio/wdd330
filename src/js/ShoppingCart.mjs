import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#" class="cart-card__info">
      <h2 class="card__name">${item.Name}</h2>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    </a>
    <div class="cart-card__quantity-control">
      <button class="quantity-btn decrease-btn" data-id="${item.Id}">−</button>
      <p class="cart-card__quantity">${item.quantity || 1}</p>
      <button class="quantity-btn increase-btn" data-id="${item.Id}">+</button>
    </div>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <span class="cart-card__remove" data-id="${item.Id}">×</span>
  </li>`;
}

export default class ShoppingCart {
  constructor(listElement, onCartChange) {
    this.listElement = listElement;
    this.onCartChange = onCartChange;
  }

  renderCartContents() {
    const cartItems = getLocalStorage("so-cart");
    if (cartItems && cartItems.length > 0) {
      this.listElement.innerHTML = "";
      renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, "beforeend", false);
      this.addEventListeners();
    } else {
      this.listElement.innerHTML = `<li class="empty-cart">
        <span>Your cart is empty, start shopping now ;)</span>
      </li>`;
    }
    if (typeof this.onCartChange === "function") {
      this.onCartChange();
    }
  }

  addEventListeners() {
    this.listElement.querySelectorAll(".cart-card__remove").forEach(btn => {
      btn.addEventListener("click", this.removeFromCart.bind(this));
    });
    this.listElement.querySelectorAll(".increase-btn").forEach(btn => {
      btn.addEventListener("click", this.increaseQuantity.bind(this));
    });
    this.listElement.querySelectorAll(".decrease-btn").forEach(btn => {
      btn.addEventListener("click", this.decreaseQuantity.bind(this));
    });
  }

  removeFromCart(event) {
    const productId = event.target.dataset.id;
    let cartItems = getLocalStorage("so-cart");
    cartItems = cartItems.filter(item => item.Id !== productId);
    setLocalStorage("so-cart", cartItems);
    this.renderCartContents();
  }

  increaseQuantity(event) {
    const productId = event.target.dataset.id;
    let cartItems = getLocalStorage("so-cart");
    const productIndex = cartItems.findIndex(item => item.Id === productId);
    if (productIndex >= 0) {
      if (!cartItems[productIndex].quantity) {
        cartItems[productIndex].quantity = 1;
      }
      cartItems[productIndex].quantity += 1;
      setLocalStorage("so-cart", cartItems);
      this.renderCartContents();
    }
  }

  decreaseQuantity(event) {
    const productId = event.target.dataset.id;
    let cartItems = getLocalStorage("so-cart");
    const productIndex = cartItems.findIndex(item => item.Id === productId);
    if (productIndex >= 0) {
      if (!cartItems[productIndex].quantity) {
        cartItems[productIndex].quantity = 1;
      }
      if (cartItems[productIndex].quantity > 1) {
        cartItems[productIndex].quantity -= 1;
        setLocalStorage("so-cart", cartItems);
      } else {
        cartItems = cartItems.filter(item => item.Id !== productId);
        setLocalStorage("so-cart", cartItems);
      }
      this.renderCartContents();
    }
  }
}
