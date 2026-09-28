'use strict';
// TechStore — code được bổ sung dần từ Lesson 6 đến Lesson 12.
const products = [
  // TODO Lesson 9: { id, name, category, price, stock, tags, image }
];
const cart = [];

function formatVnd(value) {
  // TODO Lesson 10.
  return value + 'đ';
}
function renderProducts(items) {
  // TODO Lesson 8–10: render cards bằng createElement + textContent.
}
function getFilteredProducts(query, category) {
  // TODO Lesson 11: filter không mutate products.
  return products;
}
function addToCart(productId) {
  // TODO Lesson 12: tìm product, cập nhật quantity và render cart.
}
function renderCart() {
  // TODO Lesson 12: count, items, total, empty state.
}

document.querySelector('#cart-button').addEventListener('click', function () {
  const drawer = document.querySelector('#cart-drawer');
  drawer.hidden = !drawer.hidden;
});
document.querySelector('#newsletter-form').addEventListener('submit', function (event) {
  event.preventDefault();
  document.querySelector('#form-status').textContent = 'TODO: validate và thông báo đăng ký.';
});
