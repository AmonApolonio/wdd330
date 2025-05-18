import ShoppingCart from "./ShoppingCart.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const productListElement = document.querySelector(".product-list");
  const cart = new ShoppingCart(productListElement);
  cart.renderCartContents();
});
