let allProducts = [];

const productList = document.querySelector(".product-list");
const prev = document.querySelector("#prev-page");
const next = document.querySelector("#next-page");
const spinner = document.querySelector(".spinner");
const pageInfo = document.querySelector("#page-info");
const search = document.querySelector("#search");

let currentPage = 1;
const productPerPage = 18;
let filtered;
prev.addEventListener("click", function () {
  changePage(-1);
});

next.addEventListener("click", function () {
  changePage(1);
});


search.addEventListener("keyup", () => {
  filterProducts();
  renderProducts();
  changePage(0);
});

const korpa = document.querySelector("#cart-link");
korpa.addEventListener("drop", function (event) {
  drop(event);
});

korpa.addEventListener("dragover", function (event) {
  allowDrop(event);
});

function changePage(direction) {
  let test = currentPage + direction;
  const totalPG = Math.ceil(filtered.length / productPerPage); //preracunava se broj strana za datu pretragu

  if (test == 0) {
    test = 1;
  } else if (test >= totalPG) {
    test = totalPG;
  }
  next.style.display = "inline-block";
  prev.style.display = "inline-block";

  if (test == 1) {
    prev.style.display = "none";
  } else if (test == totalPG) {
    next.style.display = "none";
  }

  currentPage = test;

  pageInfo.textContent = `${currentPage} of ${totalPG}`; //uvek se menja ukupan broj strana u zavisnosti od searcha/da li smo samo ucitali stranu

  renderProducts();
}

function fetchProducts() {
  let xHr = new XMLHttpRequest();
  spinner.style.display = "block";
  xHr.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == 200) {
      let obj = JSON.parse(this.response);
      allProducts = obj.products;
      spinner.style.display = "none";
      filterProducts(); //filtriraj proizvode odmah nakon ucitavanja
      renderProducts();
      changePage(0);
    }
  });

  xHr.open("GET", "https://dummyjson.com/products?limit=100");
  xHr.send();
}


function renderProducts() {
  productList.innerHTML = "";

  const startIndex = (currentPage - 1) * productPerPage;

  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + productPerPage
  );

  paginatedProducts.forEach((elem) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.setAttribute("draggable", true);
    productDiv.addEventListener("dragstart", function (e) {
      drag(e, elem);
    });
    productDiv.innerHTML = `
       <img src="${elem.thumbnail}" alt="${elem.title}">
       <h3>${elem.title}</h3>
       <p>${elem.price}</p>
       <button class="btnDodaj">Dodaj u korpu</button>
       <button>❤</button>
        
        `;

    console.log(elem);
    productList.appendChild(productDiv);
    productDiv
      .querySelector(".btnDodaj")
      .addEventListener("click", function () {
        addToCart(elem);
      });
  });
}

function addToCart(data) {
  let id = data.id;
  let img = data.thumbnail;
  let title = data.title;
  let price = data.price;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((elem) => elem.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, title, price, img, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount();
  alert("Prozivod je dodat u korpu");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  fetchProducts();
});

function filterProducts() {
  const searchV = search.value.toLowerCase();

  filtered = allProducts.filter((product) => {
    return product.title.toLowerCase().includes(searchV);
  });
}

function updateCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector("#cart-count").textContent = totalItems;
}

function drag(event, product) {
  const productData = JSON.stringify(product);
  event.dataTransfer.setData("product", productData);
}
function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  let product = e.dataTransfer.getData("product");
  addToCart(JSON.parse(product));
}
