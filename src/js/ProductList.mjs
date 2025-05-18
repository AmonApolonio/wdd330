import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?products=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h5>${product.Brand.Name}</h5>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    const categoryTitle = {
      tents: 'Tents',
      backpacks: 'Backpacks',
      'sleeping-bags': 'Sleeping Bags',
      hammocks: 'Hammocks',
    }[this.category] || 'Tents';
    const titleElement = document.querySelector('.products h2');
    if (titleElement) {
      titleElement.textContent = `Top Products: ${categoryTitle}`;
    }
    this.renderList(list);
  }

  renderList(list) {
    if (!Array.isArray(list) || list.length === 0) {
      this.listElement.innerHTML = '<li class="empty-category">No products found in this category.</li>';
      return;
    }
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

}