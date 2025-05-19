import { getLocalStorage } from "./utils.mjs";

function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  let count = 0;
  if (Array.isArray(cartItems)) {
    for (const item of cartItems) {
      count += item.quantity ? item.quantity : 1;
    }
  }
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

// Wait for the header to be present, then update the cart count, I need to do this for it to work properly in all cases
function runWhenHeaderReady() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    updateCartCount();
  } else {
    setTimeout(runWhenHeaderReady, 50);
  }
}
runWhenHeaderReady();

document.addEventListener("DOMContentLoaded", runWhenHeaderReady);

window.addEventListener("storage", (e) => {
  if (e.key === "so-cart") {
    updateCartCount();
  }
});

export { updateCartCount };
