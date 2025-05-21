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
    this.currentList = null;
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
    this.currentList = list;
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  sortAndRender(sortValue) {
    if (!this.currentList) return;
    let sorted = [...this.currentList];
    switch (sortValue) {
      case 'name-asc':
        sorted.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => Number(a.FinalPrice) - Number(b.FinalPrice));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Number(b.FinalPrice) - Number(a.FinalPrice));
        break;
    }
    renderListWithTemplate(productCardTemplate, this.listElement, sorted);
  }
}