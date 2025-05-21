import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category') || 'tents';
const categoryTitle = {
  tents: 'Tents',
  backpacks: 'Backpacks',
  'sleeping-bags': 'Sleeping Bags',
  hammocks: 'Hammocks',
}[category] || 'Tents';

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');

const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const myList = new ProductList(category, dataSource, listElement);

function showLoading() {
  listElement.innerHTML = '<li class="loading-indicator">Loading products...</li>';
}

async function showProducts() {
  showLoading();
  let list;
  if (searchQuery) {
    const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
    let allProducts = [];
    for (const cat of categories) {
      const products = await dataSource.getData(cat);
      allProducts = allProducts.concat(products);
    }
    const filtered = allProducts.filter(product =>
      product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.Brand.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    document.getElementById('category-title').textContent = `Search Results for: "${searchQuery}"`;
    myList.renderList(filtered);
  } else {
    document.getElementById('category-title').textContent = categoryTitle;
    const list = await dataSource.getData(category);
    myList.renderList(list);
  }
}

showProducts();

const sortSelect = document.getElementById('sort-select');
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    myList.sortAndRender(e.target.value);
  });
}
