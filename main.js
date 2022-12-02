const API = "http://localhost:8000/product";

// let title = document.querySelector("#title");
// let price = document.querySelector("#price");
// let descr = document.querySelector("#descr");
// let image = document.querySelector("#image");

// let btnAdd = document.querySelector("#btn-add");
// console.log(title, price, descr, image, btnAdd);

//Инпут и переменная для поиска
let inpSearch = document.querySelector(".search-txt");
let searchValue = inpSearch.value;

//paginate
let prevBtn = document.querySelector("#prev-btn");
let nextBtn = document.querySelector("#next-btn");
let currentPage = 1;
let limit = 3;

//filter

let form = document.querySelector("form");
let category = "all";

// !=========== КОДОВОЕ СЛОВО ===========

//инпуты и кнокпи для создания новых данных
let section_add = document.querySelector(".section__add");
let clickAdmin = document.getElementById("open-admin");
let admin_panel_arr = document.getElementsByClassName("admin-panel");
let code = "";
// console.log(section_add, clickAdmin, admin_panel_arr);

let inpDetails = document.querySelector(".section__add_details");
let inpPrice = document.querySelector(".section__add_price");
let inpQuantity = document.querySelector(".section__add_quantity");
let inpSales = document.querySelector(".section__add_sales");
let inpCategory = document.querySelector(".section_add_category");
let inpUrl = document.querySelector(".section__add_url");
let btnAdd = document.querySelector(".section__add_btn-add");
let accordion = document.querySelector(".accordion__header");
let accordionBody = document.querySelector("#accordion__body");
let btnCloseModal = document.querySelector(".window__edit_close");
// console.log(btnCloseModal);
// console.log(
//   inpDetails,
//   inpPrice,
//   inpQuantity,
//   inpSales,
//   inpCategory,
//   inpUrl,
//   btnAdd,
//   accordion
// );

// тег для отображения данных в браузере
let sectionRead = document.getElementById("section__read");
// console.log(sectionRead);

let inpEditDetails = document.querySelector(".window__edit_details");
let inpEditPrice = document.querySelector(".window__edit_price");
let inpEditQuantity = document.querySelector(".window__edit_quantity");
let inpEditSales = document.querySelector(".window__edit_sales");
let inpEditCategory = document.querySelector(".window__edit_category");
let inpEditUrl = document.querySelector(".window__edit_url");
let btnEditAdd = document.querySelector(".window__edit_btn-save");
let mainModal = document.querySelector(".main-modal");
// console.log(mainModal);
// console.log(
//   inpEditDetails,
//   inpEditPrice,
//   inpEditQuantity,
//   inpEditSales,
//   inpEditCategory,
//   inpEditUrl,
//   btnEditAdd
// );

// console.log(inpSearch);

function adminReturn() {
  if (code != "1") {
    setTimeout(() => {
      for (let i of admin_panel_arr) {
        i.style.display = "none";
      }
    }, 50);
    section_add.style.display = "none";
  } else {
    setTimeout(() => {
      for (let i of admin_panel_arr) {
        i.style.display = "block";
      }
    }, 50);
    section_add.style.display = "block";
  }
}

clickAdmin.addEventListener("click", () => {
  code = prompt("Введите кодовое слово: ");
  adminReturn();
});

//! ===== ACCORDION START =======
// console.log(accordion);
accordion.addEventListener("click", () => {
  accordion.classList.toggle("active");
  let accordionBody = document.getElementById("accordion__body");
  if (accordion.classList.contains("active")) {
    accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
  } else {
    accordionBody.style.maxHeight = 0;
  }
});

//? ======= ACCORDION END =======

//!=========== CREATE START ===========

async function createProduct(obj) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(obj),
  }).then((res) => res.json());
  readProducts();
}

btnAdd.addEventListener("click", () => {
  //Проверка на заполненость полей
  if (
    !inpDetails.value.trim() ||
    !inpQuantity.value.trim() ||
    !inpPrice.value.trim() ||
    !inpCategory.value.trim() ||
    !inpSales.value.trim() ||
    !inpUrl.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let obj = {
    details: inpDetails.value,
    price: inpPrice.value,
    quantity: inpQuantity.value,
    category: inpCategory.value,
    sale: inpSales.value,
    urlImg: inpUrl.value,
  };
  // console.log(obj);
  createProduct(obj);
  inpDetails.value = "";
  inpPrice.value = "";
  inpQuantity.value = "";
  inpCategory.value = "";
  inpSales.value = "";
  inpUrl.value = "";
});

//? ======== CREATE END ==================

//! ========== Read start ==============

async function readProducts() {
  let data = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=${limit}&${
      category === "all" ? "" : "category=" + category
    }`
  ).then((res) => res.json());
  // console.log(data);
  sectionRead.innerHTML = "";
  data.forEach((item) => {
    // let productCard = document.createElement("div")
    sectionRead.innerHTML += `
     <div class="card">
      <div class="card2">
        <div class="front2"
          style="background-image: url(${item.urlImg})"></div>
        <div class="back2">
          <div id="card-details2">
            <p> ${item.details}</p>
            <p> ${item.price} сом</p>
            <p> скидка ${item.sale} %</p>
            <p> ${item.quantity}</p>
          </div>
        </div
        <div class="text">
          <h2>${item.category}</h2>
          <span class="card_price">Цена:${item.price} Сом</span>
          <br />
          <span class="card_sale">Скидка:${item.sale} %</span>
        </div>
        <div class="userIcon" id="userPanel">
          <img src="https://cdn-icons-png.flaticon.com/512/2107/2107956.png" alt="" width="20px";/>
          <button class=""btnBuy>Выбрать</button>
        </div>
        <div class="admin-panel" id="admin">
          <img id=${item.id} onclick="deleteProduct(${item.id})" src ="https://cdn-icons-png.flaticon.com/512/1799/1799391.png" width="20px" />
          <img src ="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" width="20px" onclick="handleEditBtn(${item.id})"/>
        </div>
      </div>
    </div>
    `;
  });
  pageTotal();
  adminReturn();
}
readProducts();

//? ====== READ END ==========

//! =============== DELETE START ===========

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  readProducts();
}

//? ======== DELETE END ==============

//! ========== EDIT START ============

async function editProduct(id, editObj) {
  if (
    !inpEditDetails.value.trim() ||
    !inpEditQuantity.value.trim() ||
    !inpEditPrice.value.trim() ||
    !inpEditCategory.value.trim() ||
    !inpEditSales.value.trim() ||
    !inpEditUrl.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(editObj),
  });
  readProducts();
}

let editId = "";
async function handleEditBtn(id) {
  mainModal.style.display = "block";
  let data = await fetch(`${API}/${id}`).then((res) => res.json());
  // console.log(data);
  inpEditDetails.value = data.details;
  inpEditQuantity.value = data.quantity;
  inpEditPrice.value = data.price;
  inpEditCategory.value = data.category;
  inpEditSales.value = data.sale;
  inpEditUrl.value = data.urlImg;
  editId = data.id;
}

btnEditAdd.addEventListener("click", () => {
  let editedObj = {
    details: inpEditDetails.value,
    price: inpEditPrice.value,
    quantity: inpEditQuantity.value,
    category: inpEditCategory.value,
    urlImg: inpEditUrl.value,
    sale: inpEditSales.value,
  };
  // console.log(editedObj);
  editProduct(editId, editedObj);
  mainModal.style.display = "none";
});

//? ========== EDIT END ==============

//! ========== SEARCH START ===========

inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  readProducts();
});

//? ========== SEARCH END =============

//! ============= PAGINATION START ============

let countPage = 1;
async function pageTotal() {
  let data = await fetch(`${API}?q=${searchValue}`).then((res) => res.json());
  console.log(data.length);
  countPage = Math.ceil(data.length / limit);
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});

//? ============= PAGINATION END ==============

// ! ================= FILTER START

form.addEventListener("change", (e) => {
  // console.log(e.target.value)
  category = e.target.value;
  readProducts();
});

// ? =================== FILTER END
