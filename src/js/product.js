import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { getParam } from "./utils.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { updateCartCount } from "./cart-badge.js";
import "../css/alert.css";

const dataSource = new ExternalServices();
const productID = getParam("products");
const product = new ProductDetails(productID, dataSource);
product.init();

function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];
  const existingProductIndex = cartItems.findIndex(item => item.Id === product.Id);
  if (existingProductIndex >= 0) {
    if (!cartItems[existingProductIndex].quantity) {
      cartItems[existingProductIndex].quantity = 1;
    }
    cartItems[existingProductIndex].quantity += 1;
  } else {
    product.quantity = 1;
    product.Image = product.Images.PrimaryMedium;
    cartItems.push(product);
  }
  setLocalStorage("so-cart", cartItems);
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
  updateCartCount();
  alertMessage("Item added to cart!");
}

document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
