const cartItems = document.querySelector("#cart-items");
const cartDelete = document.querySelector("#obrisi");
const posaljiMejl = document.querySelector("#posaljiMejl");

posaljiMejl.addEventListener("click", finalizeOrder);
cartDelete.addEventListener("click", obrisi);

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length == 0) {
    cartItems.textContent = "Nema nista u korpi!!!!!!";
    total();
    cartDelete.style.display = "none";
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="imgCart">
        <h3>${item.title}</h3>
        <p>Cena: ${item.price}</p>
        <div>
        <button class="minus">-</button>
        ${item.quantity}
        <button class="plus">+</button>
        </div>
        <button class="deleteItem">Ukloni</button>
        `;
    cartItems.appendChild(div);

    div.querySelector(".plus").addEventListener("click", function () {
      changeQuantity(index, 1);
    });

    div.querySelector(".minus").addEventListener("click", function () {
      changeQuantity(index, -1);
    });

    div.querySelector(".deleteItem").addEventListener("click", function () {
      deleteItem(index);
    });
  });
  total();
}

document.addEventListener("DOMContentLoaded", function () {
  renderCart();
});

function changeQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart[index].quantity + change > 0) {
    cart[index].quantity += change;
  }
  //   } else {
  //     // cart.splice(index, 1);
  //   }

  localStorage.setItem("cart", JSON.stringify(cart));
  total();
  renderCart();
}

function deleteItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  total();
  renderCart();
}

function total() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  document.querySelector("#total-price").textContent = total.toFixed(2);
}

function obrisi() {
  localStorage.removeItem("cart");
  renderCart();
}

function sendMail() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const template = {
    to_email: "radovanbrajovic@gmail.com",
    message: "Uspesna kupovina u iznosu oid " + total + " dinara",
  };

  emailjs.send("service_ml3qw7r", "template_sp9bt3w", template).then(
    (response) => {
      alert("Poslat je mejl");
      obrisi();
    },
    (error) => {
      console.log("FAILED...", error);
    }
  );
}
function finalizeOrder() {
  if (confirm("Da li ste sigurni da zavrsavate kupovinu")) {
    sendMail();
  }
}
