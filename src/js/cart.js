import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productListElement = document.querySelector(".product-list");
  
  if (cartItems && cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");
    
    document.querySelectorAll(".cart-card__remove").forEach(btn => {
      btn.addEventListener("click", removeFromCart);
    });
    
    document.querySelectorAll(".increase-btn").forEach(btn => {
      btn.addEventListener("click", increaseQuantity);
    });
    
    document.querySelectorAll(".decrease-btn").forEach(btn => {
      btn.addEventListener("click", decreaseQuantity);
    });
  } else {
    productListElement.innerHTML = `<li class="empty-cart">
      <span>Your cart is empty, start shopping now ;)</span>
    </li>`;
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div class="cart-card__quantity-control">
    <button class="quantity-btn decrease-btn" data-id="${item.Id}">−</button>
    <p class="cart-card__quantity">${item.quantity || 1}</p>
    <button class="quantity-btn increase-btn" data-id="${item.Id}">+</button>
  </div>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span class="cart-card__remove" data-id="${item.Id}">×</span>
</li>`;

  return newItem;
}

function removeFromCart(event) {
  const productId = event.target.dataset.id;
  let cartItems = getLocalStorage("so-cart");
  cartItems = cartItems.filter(item => item.Id !== productId);
  
  if (cartItems.length === 0) {
    setLocalStorage("so-cart", []);
  } else {
    setLocalStorage("so-cart", cartItems);
  }

  renderCartContents();
}

function increaseQuantity(event) {
  const productId = event.target.dataset.id;
  let cartItems = getLocalStorage("so-cart");
  
  const productIndex = cartItems.findIndex(item => item.Id === productId);
  
  if (productIndex >= 0) {
    if (!cartItems[productIndex].quantity) {
      cartItems[productIndex].quantity = 1;
    }
    cartItems[productIndex].quantity += 1;
    
    setLocalStorage("so-cart", cartItems);
    
    renderCartContents();
  }
}

function decreaseQuantity(event) {
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
      if (cartItems.length === 0) {
        setLocalStorage("so-cart", []);
      } else {
        setLocalStorage("so-cart", cartItems);
      }
    }
    
    renderCartContents();
  }
}

renderCartContents();
