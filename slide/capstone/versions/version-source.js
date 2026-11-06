(function(root){'use strict';
var cssLayers=[
{from:1,code:`/* Version 01 · HTML semantic, CSS chỉ giữ trang dễ đọc */
* { box-sizing: border-box; }
body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; }
.store-header { display: flex; justify-content: space-between; }
.product-card { margin: 12px 0; padding: 14px; border: 1px solid #bbb; }
.product-card img { max-width: 100%; }`},
{from:2,code:`/* Version 02 · Visual theme */
:root {
  --bg: #f5f7fb;
  --surface: #ffffff;
  --ink: #17203a;
  --brand: #ff6b35;
  --muted: #68748c;
  --radius: 18px;
}
body { background: var(--bg); color: var(--ink); }
.store-header { padding: 14px 18px; border-radius: 14px; background: #11172b; color: white; }
.hero { margin: 16px 0; padding: 32px; border-radius: var(--radius); background: #11172b; color: white; }
.product-card { padding: 18px; border: 0; border-radius: var(--radius); background: var(--surface); box-shadow: 0 12px 30px #17203a18; }
button { padding: 9px 13px; border: 0; border-radius: 999px; background: var(--brand); color: white; }`},
{from:3,code:`/* Version 03 · Badge và modal/giỏ hàng */
.cart, .product-card { position: relative; }
.cart-count { position: absolute; right: -9px; top: -9px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #ff667d; }
.sale { position: absolute; right: 12px; top: 12px; padding: 4px 8px; border-radius: 999px; background: #ff667d; color: white; }
.cart-drawer { position: fixed; right: 20px; top: 76px; z-index: 10; width: min(340px, calc(100% - 40px)); padding: 18px; border-radius: 16px; background: white; box-shadow: 0 20px 60px #0005; }`},
{from:4,code:`/* Version 04 · Flexbox và Grid */
.store-nav, .toolbar { display: flex; gap: 10px; }
.products { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.product-footer { display: flex; justify-content: space-between; align-items: end; gap: 10px; }`},
{from:5,code:`/* Version 05 · Mobile-first responsive */
img { max-width: 100%; height: auto; }
@media (max-width: 700px) {
  body { padding: 14px; }
  .store-nav { display: none; }
  .products { grid-template-columns: 1fr; }
  .hero { padding: 22px; }
}`},
{from:11,code:`/* Version 11 · Search/filter controls */
.toolbar { display: flex; flex-wrap: wrap; margin: 16px 0; }
.toolbar input, .toolbar select { padding: 10px; border: 1px solid #cad3e1; border-radius: 9px; }`},
{from:12,code:`/* Version 12 · Interactive cart */
.cart-item { display: flex; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid #ddd; }
.quantity { display: flex; align-items: center; gap: 7px; }
.cart-drawer[hidden] { display: none; }`}
];

function buildCss(version){return cssLayers.filter(function(layer){return version>=layer.from;}).map(function(layer){return layer.code;}).join('\n\n');}
function buildJs(version){var parts=[`'use strict';`];
if(version<3)parts.push(`// Version ${String(version).padStart(2,'0')}: chưa cần JavaScript cho tính năng chính.`);
if(version>=3)parts.push(`const cartButton = document.querySelector('#cart-button');
const cartDrawer = document.querySelector('#cart');
cartButton.addEventListener('click', function () {
  cartDrawer.hidden = !cartDrawer.hidden;
});`);
if(version>=6)parts.push(`const storeName = 'TechStore';
const basePrice = 1290000;
const discountRate = 0.15;
const salePrice = basePrice * (1 - discountRate);
console.log(storeName, salePrice);`);
if(version>=7)parts.push(`function stockLabel(stock) {
  if (stock === 0) return 'Hết hàng';
  if (stock < 5) return 'Sắp hết';
  return 'Còn hàng';
}`);
if(version===8)parts.push(`const products = ['Nova Keyboard', 'Pulse Headphones', 'Orbit Desk Light', 'Flow Mouse'];
for (const product of products) console.log(product);`);
if(version>=9)parts.push(`const products = [
  { id: 1, name: 'Nova Keyboard', category: 'Gear', price: 1290000, stock: 8 },
  { id: 2, name: 'Pulse Headphones', category: 'Audio', price: 890000, stock: 3 },
  { id: 3, name: 'Orbit Desk Light', category: 'Desk', price: 490000, stock: 0 },
  { id: 4, name: 'Flow Mouse', category: 'Gear', price: 650000, stock: 12 }
];`);
if(version>=10)parts.push(`function formatVnd(value) {
  return value.toLocaleString('vi-VN') + 'đ';
}
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  const title = document.createElement('h3');
  title.textContent = product.name;
  const price = document.createElement('strong');
  price.textContent = formatVnd(product.price);
  card.append(title, price);
  return card;
}
function renderProducts(items) {
  const root = document.querySelector('#products');
  root.textContent = '';
  items.forEach(product => root.appendChild(createProductCard(product)));
}`);
if(version>=11)parts.push(`function getVisibleProducts() {
  const query = document.querySelector('#search').value.trim().toLowerCase();
  const category = document.querySelector('#category').value;
  return products.filter(product =>
    product.name.toLowerCase().includes(query) &&
    (category === 'all' || product.category === category)
  );
}
document.querySelector('#search').addEventListener('input', () => renderProducts(getVisibleProducts()));
document.querySelector('#category').addEventListener('change', () => renderProducts(getVisibleProducts()));`);
if(version>=12)parts.push(`let cart = [];
function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  cart = [...cart, product];
  renderCart();
}
function renderCart() {
  const root = document.querySelector('#cart-items');
  root.textContent = '';
  cart.forEach(product => {
    const row = document.createElement('p');
    row.textContent = product.name + ' · ' + formatVnd(product.price);
    root.appendChild(row);
  });
  const total = cart.reduce((sum, product) => sum + product.price, 0);
  document.querySelector('#cart-total').textContent = 'Tổng: ' + formatVnd(total);
}
document.querySelector('#products').addEventListener('click', event => {
  const button = event.target.closest('[data-product-id]');
  if (button) addToCart(Number(button.dataset.productId));
});`);
if(version>=10)parts.push(`renderProducts(products);`);
if(version>=13)parts.push(`// Version 13: kiểm tra relative paths, commit và deploy GitHub Pages.`);
return parts.join('\n\n');}
function buildHtml(version,storeMarkup){return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TechStore · Version ${String(version).padStart(2,'0')}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${storeMarkup}
  <script src="script.js"><\/script>
</body>
</html>`;}
function getSources(version,storeMarkup){return{html:buildHtml(version,storeMarkup),css:buildCss(version),js:buildJs(version)};}
var api={buildHtml:buildHtml,buildCss:buildCss,buildJs:buildJs,getSources:getSources};root.VersionSource=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;})(typeof globalThis!=='undefined'?globalThis:this);
