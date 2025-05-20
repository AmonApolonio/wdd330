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

document.getElementById('category-title').textContent = categoryTitle;

const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const myList = new ProductList(category, dataSource, listElement);
myList.init();
