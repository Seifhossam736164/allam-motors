const productsContainer =
    document.getElementById("productsContainer");

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


// ================================
// تحديد القسم من الرابط
// ================================

const urlParams =
    new URLSearchParams(window.location.search);

const selectedCategory =
    urlParams.get("category");


// ================================
// تحديد المنتجات
// ================================

let displayedProducts = products;

if (selectedCategory) {

    displayedProducts =
        products.filter(function(product) {

            return product.category === selectedCategory;

        });

}


// ================================
// عنوان الصفحة
// ================================

const pageTitle =
    document.getElementById("pageTitle");

if (pageTitle) {

    if (selectedCategory === "motorcycles") {

        pageTitle.textContent = "موتوسكلات";

    } else if (selectedCategory === "scooters") {

        pageTitle.textContent = "سكوترات";

    } else if (selectedCategory === "parts") {

        pageTitle.textContent = "قطع الغيار";

    } else if (selectedCategory === "accessories") {

        pageTitle.textContent = "الإكسسوارات";

    } else if (selectedCategory === "helmets") {

        pageTitle.textContent = "خوذات";

    } else if (selectedCategory === "oil") {

        pageTitle.textContent = "زيوت";

    } else {

        pageTitle.textContent = "كل المنتجات";

    }

}


// ================================
// هل المنتج في المفضلة؟
// ================================

function isFavorite(id) {

    return favorites.some(function(item) {

        return Number(item) === Number(id);

    });

}


// ================================
// إضافة / إزالة من المفضلة
// ================================

function toggleFavorite(id, button) {

    id = Number(id);

    if (isFavorite(id)) {

        favorites =
            favorites.filter(function(item) {

                return Number(item) !== id;

            });

        button.innerHTML = "♡";

        button.classList.remove("active");

    } else {

        favorites.push(id);

        button.innerHTML = "♥";

        button.classList.add("active");

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


// ================================
// تفريغ المنتجات القديمة
// ================================

productsContainer.innerHTML = "";


// ================================
// لو مفيش منتجات
// ================================

if (displayedProducts.length === 0) {

    productsContainer.innerHTML = `

        <div class="empty-products">

            <h2>
                مفيش منتجات في القسم ده حاليًا
            </h2>

            <a href="products.html">
                عرض كل المنتجات
            </a>

        </div>

    `;

}


// ================================
// عرض المنتجات
// ================================

displayedProducts.forEach(function(product) {

    const productElement =
        document.createElement("div");

    productElement.className =
        "product";


    const favoriteIcon =
        isFavorite(product.id)
        ? "♥"
        : "♡";


    const favoriteClass =
        isFavorite(product.id)
        ? "active"
        : "";


    productElement.innerHTML = `

        <div
            class="product-image"
            style="
                position:relative;
            "
        >

            <img
                src="${product.images[0]}"
                alt="${product.name}"
            >


            <!-- زر المفضلة -->

            <button
                class="favorite-button ${favoriteClass}"
                onclick="toggleFavorite(${product.id}, this)"
                type="button"

                style="
                    position:absolute;
                    top:10px;
                    left:10px;

                    width:42px;
                    height:42px;
                    min-width:42px;
                    max-width:42px;

                    padding:0;
                    margin:0;

                    border:0;
                    border-radius:50%;

                    background:white;

                    color:${
                        isFavorite(product.id)
                        ? "red"
                        : "#555"
                    };

                    font-size:25px;
                    line-height:42px;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    cursor:pointer;

                    box-shadow:
                        0 2px 8px rgba(0,0,0,.2);

                    z-index:20;
                "
            >

                ${favoriteIcon}

            </button>

        </div>


        <h3>
            ${product.name}
        </h3>


        <h4>
            ${product.price.toLocaleString("en-US")}
            جنيه
        </h4>


        <a
            href="details.html?id=${product.id}"
            class="details-link"
        >

            <button
                type="button"
            >
                عرض التفاصيل
            </button>

        </a>

    `;


    productsContainer.appendChild(
        productElement
    );

});
