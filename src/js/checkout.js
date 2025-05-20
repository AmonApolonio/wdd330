import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

document.addEventListener('DOMContentLoaded', () => {
  const checkout = new CheckoutProcess('so-cart', '.order-summary');
  checkout.init();

  const testBtn = document.querySelector('.test-checkout-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      const form = document.getElementById('checkout-form');
      if (!form) return;
      form.elements['firstName'].value = 'John';
      form.elements['lastName'].value = 'Doe';
      form.elements['street'].value = '123 Main';
      form.elements['city'].value = 'Rexburg';
      form.elements['state'].value = 'ID';
      form.elements['zip'].value = '83440';
      form.elements['ccnum'].value = '1234123412341234';
      const now = new Date();
      let month = now.getMonth() + 2;
      let year = now.getFullYear();
      if (month > 12) { month = 1; year++; }
      form.elements['exp'].value = `${year}-${month.toString().padStart(2, '0')}`;
      form.elements['cvv'].value = '123';
      checkout.calculateOrderTotal();
    });
  }

  const zipInput = document.querySelector('input[name="zip"]');
  if (zipInput) {
    zipInput.addEventListener('blur', () => {
      if (zipInput.value.trim() !== '') {
        checkout.calculateOrderTotal();
      }
    });
  }

  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      checkout.calculateOrderTotal();
      try {
        const response = await checkout.checkout(form);
        alert('Order submitted! Thank you for your purchase.');
        window.localStorage.removeItem('so-cart');
        window.location.href = '../index.html';
      } catch (err) {
        alert('Order failed: ' + err.message);
      }
    });
  }
});
