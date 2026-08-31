// ========================================
// 🏍️ ALLAM MOTORS - SCRIPT.JS
// ========================================


// ========================================
// 🛒 PRODUCTS
// ========================================

const products = [

    {
        id: 1,
        name: "Yamaha R15 V4",
        price: 195000,
        category: "motorcycles",
        brand: "Yamaha",
        images: [
            "images/r15-1.jpg",
            "images/r15-2.jpg",
            "images/r15-3.jpg",
            "images/r15-4.jpg"
        ],
        description: "موتور رياضي 155cc مناسب للاستخدام اليومي والسفر.",
        specs: {
            model: "2026",
            engine: "155 CC",
            gearbox: "6 سرعات",
            color: "أزرق",
            condition: "جديد"
        }
    },

    {
        id: 2,
        name: "Honda CBR 250R",
        price: 210000,
        category: "motorcycles",
        brand: "Honda",
        images: [
            "images/cbr-1.jpg",
            "images/cbr-2.jpg",
            "images/cbr-3.jpg"
        ],
        description: "موتور رياضي قوي واقتصادي.",
        specs: {
            model: "2026",
            engine: "250 CC",
            gearbox: "6 سرعات",
            color: "أحمر",
            condition: "جديد"
        }
    }

];


// ========================================
// 📱 TELEGRAM WORKER
// ========================================

const TELEGRAM_WORKER_URL =
    "https://allam-motors-bot.seifalallam.workers.dev";


// ========================================
// 📤 SEND ORDER TO TELEGRAM
// ========================================

async function sendOrderToTelegram(order) {

    try {

        const response = await fetch(TELEGRAM_WORKER_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: order.name || "غير محدد",

                phone: order.phone || "غير محدد",

                address: order.address || "غير محدد",

                products: order.products || "لا توجد منتجات",

                total: order.total || 0

            })

        });


        if (!response.ok) {

            throw new Error("Telegram Worker Error");

        }


        return true;

    } catch (error) {

        console.error("Telegram Error:", error);

        return false;

    }

}



// ========================================
// 🔎 SEARCH
// ========================================

function normalizeText(text) {

    return String(text || "")
        .toLowerCase()
        .replace(/أ/g, "ا")
        .replace(/إ/g, "ا")
        .replace(/آ/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/[ًٌٍَُِّْـ]/g, "")
        .replace(/[٠-٩]/g, function (d) {
            return "٠١٢٣٤٥٦٧٨٩".indexOf(d);
        })
        .trim();

}


function searchProducts(searchText) {

    const search = normalizeText(searchText);

    if (!search) {

        return products;

    }


    return products.filter(product => {

        const data = [

            product.name,

            product.brand,

            product.category,

            product.description,

            product.specs?.model,

            product.specs?.engine,

            product.specs?.gearbox,

            product.specs?.color,

            product.specs?.condition

        ]
            .filter(Boolean)
            .map(normalizeText)
            .join(" ");


        return data.includes(search);

    });

}



// ========================================
// 🛒 CART
// ========================================

let cart = JSON.parse(localStorage.getItem("allamCart")) || [];



function saveCart() {

    localStorage.setItem(
        "allamCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}



function addToCart(productId) {

    const product = products.find(
        p => p.id === Number(productId)
    );

    if (!product) return;


    const existing = cart.find(
        item => item.id === product.id
    );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.images[0],

            quantity: 1

        });

    }


    saveCart();

    alert("✅ تمت إضافة المنتج للسلة");

}



function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== Number(productId)
    );

    saveCart();

    renderCart();

}



function changeQuantity(productId, change) {

    const item = cart.find(
        item => item.id === Number(productId)
    );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveCart();

    renderCart();

}



function getCartTotal() {

    return cart.reduce(

        (total, item) =>
            total + (item.price * item.quantity),

        0

    );

}



function updateCartCount() {

    const count = cart.reduce(

        (total, item) =>
            total + item.quantity,

        0

    );


    const elements = document.querySelectorAll(
        ".cart-count, #cartCount"
    );


    elements.forEach(el => {

        el.textContent = count;

    });

}



// ========================================
// 🧾 RENDER CART
// ========================================

function renderCart() {

    const container =
        document.querySelector("#cartItems");


    if (!container) return;


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML =
            `<p class="empty-cart">السلة فارغة 🛒</p>`;

        updateCartTotal();

        return;

    }


    cart.forEach(item => {

        const div =
            document.createElement("div");


        div.className = "cart-item";


        div.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p>${item.price.toLocaleString()} جنيه</p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

                <button
                    class="remove-cart"
                    onclick="removeFromCart(${item.id})"
                >
                    حذف
                </button>

            </div>

        `;


        container.appendChild(div);

    });


    updateCartTotal();

}



function updateCartTotal() {

    const total =
        getCartTotal();


    const element =
        document.querySelector("#cartTotal");


    if (element) {

        element.textContent =
            total.toLocaleString() + " جنيه";

    }

}



// ========================================
// ❤️ FAVORITES
// ========================================

let favorites =
    JSON.parse(
        localStorage.getItem("allamFavorites")
    ) || [];



function toggleFavorite(productId) {

    productId = Number(productId);


    if (favorites.includes(productId)) {

        favorites =
            favorites.filter(
                id => id !== productId
            );

    } else {

        favorites.push(productId);

    }


    localStorage.setItem(
        "allamFavorites",
        JSON.stringify(favorites)
    );


    updateFavoriteButtons();

}



function isFavorite(productId) {

    return favorites.includes(
        Number(productId)
    );

}



function updateFavoriteButtons() {

    document
        .querySelectorAll("[data-favorite-id]")
        .forEach(button => {

            const id =
                Number(
                    button.dataset.favoriteId
                );


            button.classList.toggle(
                "active",
                isFavorite(id)
            );


            button.innerHTML =
                isFavorite(id)
                    ? "♥"
                    : "♡";

        });

}



// ========================================
// 🔍 SEARCH INPUT
// ========================================

function setupSearch() {

    const searchInputs =
        document.querySelectorAll(
            "#searchInput, .search-input"
        );


    searchInputs.forEach(input => {

        input.addEventListener(
            "input",
            function () {

                const results =
                    searchProducts(
                        this.value
                    );


                displaySearchResults(results);

            }
        );

    });

}



function displaySearchResults(results) {

    const container =
        document.querySelector(
            "#productsContainer"
        );


    if (!container) return;


    container.innerHTML = "";


    if (results.length === 0) {

        container.innerHTML = `

            <div class="no-results">

                <h3>مفيش منتجات مطابقة 🔎</h3>

                <p>
                    جرب تكتب اسم المكنة أو الماركة
                    أو السعة مثل 150
                </p>

            </div>

        `;

        return;

    }


    results.forEach(product => {

        container.innerHTML += createProductCard(product);

    });


    updateFavoriteButtons();

}



// ========================================
// 🏍️ PRODUCT CARD
// ========================================

function createProductCard(product) {

    return `

        <div class="product-card">

            <div class="product-image">

                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                >

                <button
                    class="favorite-btn"
                    data-favorite-id="${product.id}"
                    onclick="toggleFavorite(${product.id})"
                >
                    ${isFavorite(product.id) ? "♥" : "♡"}
                </button>

            </div>


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.price.toLocaleString()} جنيه
                </p>


                <div class="product-buttons">

                    <button
                        onclick="showProductDetails(${product.id})"
                    >
                        عرض التفاصيل
                    </button>


                    <button
                        onclick="addToCart(${product.id})"
                    >
                        أضف للسلة
                    </button>

                </div>

            </div>

        </div>

    `;

}



// ========================================
// 📋 PRODUCT DETAILS
// ========================================

function showProductDetails(productId) {

    const product =
        products.find(
            p => p.id === Number(productId)
        );


    if (!product) return;


    const container =
        document.querySelector(
            "#productDetails"
        );


    if (!container) {

        localStorage.setItem(
            "selectedProduct",
            product.id
        );

        window.location.href =
            "product.html";

        return;

    }


    container.innerHTML = `

        <div class="details-box">

            <button
                class="close-details"
                onclick="closeProductDetails()"
            >
                ×
            </button>


            <img
                src="${product.images[0]}"
                alt="${product.name}"
            >


            <h2>
                ${product.name}
            </h2>


            <h3>
                ${product.price.toLocaleString()} جنيه
            </h3>


            <p>
                ${product.description}
            </p>


            <div class="specs">

                ${Object.entries(product.specs)
                    .map(([key, value]) => `

                        <p>
                            <strong>${key}:</strong>
                            ${value}
                        </p>

                    `)
                    .join("")}

            </div>


            <button
                onclick="addToCart(${product.id})"
            >
                أضف للسلة
            </button>

        </div>

    `;


    container.style.display = "block";

}



function closeProductDetails() {

    const container =
        document.querySelector(
            "#productDetails"
        );


    if (container) {

        container.style.display =
            "none";

    }

}



// ========================================
// 🧾 CREATE ORDER TEXT
// ========================================

function getProductsText() {

    if (cart.length === 0) {

        return "السلة فارغة";

    }


    return cart.map(item => {

        const itemTotal =
            item.price * item.quantity;


        return `• ${item.name} × ${item.quantity} = ${itemTotal.toLocaleString()} جنيه`;

    }).join("\n");

}



// ========================================
// 📲 CONFIRM ORDER
// ========================================

async function confirmOrder() {

    if (cart.length === 0) {

        alert("🛒 السلة فاضية");

        return;

    }


    const nameInput =
        document.querySelector(
            "#customerName"
        );


    const phoneInput =
        document.querySelector(
            "#customerPhone"
        );


    const addressInput =
        document.querySelector(
            "#customerAddress"
        );


    if (!nameInput || !phoneInput || !addressInput) {

        alert(
            "⚠️ حقول بيانات العميل مش موجودة في الصفحة"
        );

        return;

    }


    const name =
        nameInput.value.trim();


    const phone =
        phoneInput.value.trim();


    const address =
        addressInput.value.trim();


    if (!name || !phone || !address) {

        alert(
            "⚠️ من فضلك اكتب الاسم ورقم الهاتف والعنوان"
        );

        return;

    }


    const total =
        getCartTotal();


    const productsText =
        getProductsText();


    const button =
        document.querySelector(
            "#confirmOrder"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "جاري إرسال الطلب...";

    }


    const success =
        await sendOrderToTelegram({

            name: name,

            phone: phone,

            address: address,

            products: productsText,

            total: total.toLocaleString()

        });


    if (button) {

        button.disabled = false;

        button.textContent =
            "تأكيد الطلب";

    }


    if (success) {

        alert(
            "✅ تم إرسال طلبك بنجاح!"
        );


        cart = [];

        saveCart();

        renderCart();


        nameInput.value = "";

        phoneInput.value = "";

        addressInput.value = "";

    } else {

        alert(
            "❌ حصلت مشكلة أثناء إرسال الطلب، حاول تاني."
        );

    }

}



// ========================================
// 🚀 INIT
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        renderCart();

        setupSearch();

        updateFavoriteButtons();

    }
);
document.getElementById("confirmOrder").addEventListener("click", async function () {

    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const address = document.getElementById("customerAddress").value;

    const response = await fetch(
        "https://allam-motors-bot.seifalallam.workers.dev",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                address: address,
                products: "طلب من موقع علام موتورز",
                total: "سيتم تحديده من الموقع"
            })
        }
    );

    if (response.ok) {
        alert("✅ تم إرسال الطلب");
    } else {
        alert("❌ حصلت مشكلة في إرسال الطلب");
    }

});
