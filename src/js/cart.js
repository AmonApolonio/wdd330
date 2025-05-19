import ShoppingCart from "./ShoppingCart.mjs";
import { updateCartCount } from "./cart-badge.js";

document.addEventListener("DOMContentLoaded", () => {
  const productListElement = document.querySelector(".cart-list");
  const cart = new ShoppingCart(productListElement, updateCartCount);
  cart.renderCartContents();
  updateCartCount();
});
