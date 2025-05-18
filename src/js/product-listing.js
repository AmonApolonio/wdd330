import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") || "tents";
}

const category = getCategoryFromUrl();
const categoryTitle = {
  tents: "Tents",
  backpacks: "Backpacks",
  "sleeping-bags": "Sleeping Bags",
  hammocks: "Hammocks"
}[category] || "Tents";

document.getElementById("category-title").textContent = categoryTitle;

const dataSource = new ProductData(category);
const element = document.querySelector(".product-list");
const productList = new ProductList(categoryTitle, dataSource, element);
productList.init();

loadHeaderFooter();
