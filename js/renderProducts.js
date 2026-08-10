const productsContainer =
    document.getElementById("productsContainer");

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


// =====================================
// قراءة البيانات من الرابط
// =====================================

const urlParams =
    new URLSearchParams(window.location.search);

const selectedCategory =
    urlParams.get("category");

const searchText =
    (urlParams.get("search") || "")
    .trim()
    .toLowerCase();


// =====================================
// فلترة المنتجات بالقسم
// =====================================

let displayedProducts = products;

if (selectedCategory) {

    displayedProducts =
        displayedProducts.filter(function(product) {

            return product.category === selectedCategory;

        });

}


// =====================================
// البحث
// =====================================

if (searchText) {

    displayedProducts =
        displayedProducts.filter(function(product) {

            const name =
                product.name.toLowerCase();

            const brand =
                (product.brand || "").toLowerCase();

            const category =
                (product.category || "").toLowerCase();

            const description =
                (product.description || "").toLowerCase();


            return (
                name.includes(searchText) ||
                brand.includes(searchText) ||
                category.includes(searchText) ||
                description.includes(searchText)
            );

        });

}


// =====================================
// عنوان الصفحة
// =====================================

const pageTitle =
    document.getElementById("pageTitle");

if (pageTitle) {

    if (searchText) {

        pageTitle.textContent =
            `نتائج البحث عن: ${searchText}`;

    }

    else if (selectedCategory === "motorcycles") {

        pageTitle.textContent =
            "موتوسكلات";

    }

    else if (selectedCategory === "scooters") {

        pageTitle.textContent =
            "سكوترات";

    }

    else if (selectedCategory === "parts") {

        pageTitle.textContent =
            "قطع الغيار";

    }

    else if (selectedCategory === "accessories") {

        pageTitle.textContent =
            "الإكسسوارات";

    }

    else if (selectedCategory === "helmets") {

        pageTitle.textContent =
            "خوذات";

    }

    else if (selectedCategory === "oil") {

        pageTitle.textContent =
            "زيوت";

    }

    else {

        pageTitle.textContent =
            "كل المنتجات";

    }

}


// =====================================
// المفضلة
// =====================================

function isFavorite(id) {

    return favorites.some(function(item) {

        return Number(item) === Number(id);

    });

}


function toggleFavorite(id, button) {

    id = Number(id);


    if (isFavorite(id)) {

        favorites =
            favorites.filter(function(item) {

                return Number(item) !== id;

            });

        button.innerHTML = "♡";

        button.style.color = "#555";

    }

    else {

        favorites.push(id);

        button.innerHTML = "♥";

        button.style.color = "red";

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


// =====================================
// عرض المنتجات
// =====================================

productsContainer.innerHTML = "";


if (displayedProducts.length === 0) {

    productsContainer.innerHTML = `

        <div
            class="empty-products"
            style="
                width:100%;
                text-align:center;
                padding:60px 20px;
            "
        >

            <h2>
                مفيش منتجات مطابقة للبحث 🔍
            </h2>

            <p>
                جرب تبحث باسم منتج تاني.
            </p>

            <a
                href="products.html"
                style="
                    display:inline-block;
                    margin-top:15px;
                    padding:12px 25px;
                    background:#111;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                "
            >
                عرض كل المنتجات
            </a>

        </div>

    `;

}


// =====================================
// إنشاء كروت المنتجات
// =====================================

displayedProducts.forEach(function(product) {

    const productElement =
        document.createElement("div");

    productElement.className =
        "product";


    const favorite =
        isFavorite(product.id);


    productElement.innerHTML = `

        <div
            class="product-image"
            style="position:relative;"
        >

            <img
                src="${product.images[0]}"
                alt="${product.name}"
            >


            <!-- القلب -->

            <button
                type="button"
                class="favorite-button"
                onclick="
                    toggleFavorite(
                        ${product.id},
                        this
                    )
                "

                style="
                    position:absolute;
                    top:10px;
                    left:10px;

                    width:42px;
                    height:42px;
                    min-width:42px;

                    padding:0;
                    margin:0;

                    border:0;
                    border-radius:50%;

                    background:white;

                    color:${favorite ? "red" : "#555"};

                    font-size:25px;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    cursor:pointer;

                    box-shadow:
                        0 2px 8px
                        rgba(0,0,0,.2);

                    z-index:20;
                "
            >

                ${favorite ? "♥" : "♡"}

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
        >

            <button type="button">
                عرض التفاصيل
            </button>

        </a>

    `;


    productsContainer.appendChild(
        productElement
    );

});
