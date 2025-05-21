export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = this.getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  getLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const unitPrice = Number(item.FinalPrice);
      return sum + (unitPrice * quantity);
    }, 0);
    this.displayItemSubTotal();
  }

  displayItemSubTotal() {
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    const items = document.querySelector(`${this.outputSelector} #items`);
    if (subtotal) subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (items) items.innerText = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const itemCount = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);
    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: item.quantity || 1
    }));
  }

  async checkout(form) {
    const formData = new FormData(form);
    const order = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'firstName') order.fname = value;
      else if (key === 'lastName') order.lname = value;
      else if (key === 'street') order.street = value;
      else if (key === 'city') order.city = value;
      else if (key === 'state') order.state = value;
      else if (key === 'zip') order.zip = value;
      else if (key === 'ccnum') order.cardNumber = value;
      else if (key === 'exp') order.expiration = value;
      else if (key === 'cvv') order.code = value;
    }
    order.orderDate = new Date().toISOString();
    order.items = this.packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    try {
      const module = await import('./ExternalServices.mjs');
      const services = new module.default();
      return await services.submitOrder(order);
    } catch (err) {
      throw err;
    }
  }
}
