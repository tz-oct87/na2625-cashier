const API_URL = "https://script.google.com/macros/s/AKfycbxAtbUEleHEfdHSKkgKMRIhiSfzHJtFtx2Dw1I6w29AGf55kw1h5_mLivXEw2ZULKTj/exec"; // ganti dengan Web App Apps Script kamu

// --- Login ---
async function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message");
  if (!email) { msg.textContent = "Enter email"; return; }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "login", email }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (!data.success) { msg.textContent = data.message; return; }

    alert(`Welcome, ${data.user.name}`);
    window.location.href = "dashboard.html";
  } catch (err) { msg.textContent = "Error connecting"; console.error(err); }
}

// --- Navigation ---
function goToPage(page) { window.location.href = page; }

// --- Products / Admin ---
async function addProduct() {
  const name = document.getElementById("productName").value;
  const price = Number(document.getElementById("productPrice").value);
  const stock = Number(document.getElementById("productStock").value);
  const barcode = document.getElementById("productBarcode").value;

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "addProduct",
      product: { name, price, stock, barcode }
    }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  if (data.success) { alert("Product added"); location.reload(); }
  else alert(data.message);
}

// --- Cashier ---
let cart = [];
function addToCart(product) { cart.push(product); updateTotal(); }
function updateTotal() {
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  document.getElementById("total").textContent = total;
}
async function checkout() {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "sale", cart }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  if (data.success) { alert("Transaction completed"); cart=[]; updateTotal(); }
  else alert(data.message);
}

// --- Transactions History ---
async function loadTransactions() {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "getTransactions" }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  const listEl = document.getElementById("transactions-list");
  if (data.success) {
    listEl.innerHTML = data.transactions.map(t => `
      <div>
        ${new Date(t.date).toLocaleString()} | ${t.cashier_email} | Total: ${t.total}
      </div>
    `).join("");
  } else listEl.textContent = data.message;
}

if (document.getElementById("transactions-list")) loadTransactions();

