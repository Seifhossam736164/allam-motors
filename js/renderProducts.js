// ============================================
// ALLAM MOTORS - SMART PRODUCT SEARCH
// ============================================

const productsContainer =
    document.getElementById("productsContainer");


// ============================================
// المفضلة
// ============================================

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


// ============================================
// قراءة الرابط
// ============================================

const urlParams =
    new URLSearchParams(window.location.search);

const selectedCategory =
    urlParams.get("category");

const originalSearch =
    urlParams.get("search") || "";


// ============================================
// تطبيع النص
// ============================================

function normalizeText(text) {

    return String(text || "")
        .toLowerCase()

        // الأرقام العربية
        .replace(/٠/g, "0")
        .replace(/١/g, "1")
        .replace(/٢/g, "2")
        .replace(/٣/g, "3")
        .replace(/٤/g, "4")
        .replace(/٥/g, "5")
        .replace(/٦/g, "6")
        .replace(/٧/g, "7")
        .replace(/٨/g, "8")
        .replace(/٩/g, "9")

        // أشكال الألف
        .replace(/[أإآ]/g, "ا")

        // التاء المربوطة
        .replace(/ة/g, "ه")

        // الياء
        .replace(/ى/g, "ي")

        // إزالة الحركات
        .replace(/[\u064B-\u065F\u0670]/g, "")

        // توحيد المسافات
        .replace(/\s+/g, " ")

        .trim();
}


// ============================================
// قاموس البحث العربي
// ============================================

const searchAliases = {

    // ---------- BRANDS ----------

    "hogan": [
        "هوجان"
    ],

    "bajaj": [
        "باجاج"
    ],

    "haojiang": [
        "هاوجيانج",
        "هاوجيانغ",
        "هاو جيانج"
    ],

    "sym": [
        "سيم",
        "اس واي ام",
        "اس واى ام",
        "اس واي ام"
    ],

    "keeway": [
        "كيوي",
        "كيو واي"
    ],

    "fagory": [
        "فاجوري",
        "فاجوري"
    ],

    "dayun": [
        "دايون"
    ],

    "honda": [
        "هوندا"
    ],

    "vespa": [
        "فيسبا"
    ],

    "motul": [
        "موتول"
    ],


    // ---------- MODELS ----------

    "hogan 3": [
        "هوجان",
        "هوجان 3"
    ],

    "bajaj boxer": [
        "باجاج",
        "باجاج بوكسر",
        "بوكسر"
    ],

    "haojiang f250": [
        "هاوجيانج",
        "هاوجيانغ",
        "هاوجيانج اف 250",
        "هاوجيانج اف250"
    ],

    "sym vf185 / 26": [
        "في اف 185",
        "vf185",
        "في اف",
        "اس واي ام"
    ],

    "keeway superlight / rks": [
        "كيوي",
        "سوبر لايت",
        "سوبرلايت",
        "rks"
    ],

    "fagory 26": [
        "فاجوري 26",
        "فاجوري"
    ],

    "fagory ktx 250": [
        "فاجوري ktx",
        "فاجوري 250",
        "ktx 250"
    ],

    "dayun 4 express": [
        "دايون",
        "دايون 4",
        "اكسبريس",
        "express"
    ],


    // ---------- FIDDLE ----------

    "sym fiddle 3": [
        "فدل",
        "فديل",
        "فيدل",
        "فيديـل",
        "فيديـل 3",
        "فيدل 3",
        "فدل 3",
        "فديل 3",
        "فيسدل 3"
    ],

    "sym fiddle 4": [
        "فدل",
        "فديل",
        "فيدل",
        "فيديـل",
        "فيديـل 4",
        "فيدل 4",
        "فدل 4",
        "فديل 4"
    ],

    "honda today": [
        "هوندا توداي",
        "توداي",
        "تودي"
    ],

    "fagory smart electric": [
        "فاجوري",
        "فاجوري كهربا",
        "فاجوري كهربائي",
        "كهربائي",
        "كهربا"
    ],

    "sym symphony st": [
        "سيمفوني",
        "سيمفوني st",
        "سيمفوني اس تي",
        "symphony"
    ]

};


// ============================================
// تجهيز قاموس سريع
// ============================================

const aliasList = [];

Object.keys(searchAliases).forEach(function (key) {

    const aliases =
        searchAliases[key];

    aliases.forEach(function (alias) {

        aliasList.push({
            original: key,
            alias: normalizeText(alias)
        });

    });

});


// ============================================
// الحصول على الكلمات البديلة
// ============================================

function getAliasesForProduct(product) {

    const result = [];

    const name =
        normalizeText(product.name);

    const brand =
        normalizeText(product.brand);


    // الاسم نفسه
    if (searchAliases[name]) {

        result.push(
            ...searchAliases[name]
        );

    }


    // البراند
    if (searchAliases[brand]) {

        result.push(
            ...searchAliases[brand]
        );

    }


    // البحث في كل المفاتيح
    Object.keys(searchAliases)
        .forEach(function (key) {

            if (
                name.includes(
                    normalizeText(key)
                )
            ) {

                result.push(
                    ...searchAliases[key]
                );

            }

        });


    return result;

}


// ============================================
// إنشاء بيانات البحث للمنتج
// ============================================

function getSearchableText(product) {

    let text = "";


    // الاسم
    text +=
        " " +
        (product.name || "");


    // البراند
    text +=
        " " +
        (product.brand || "");


    // القسم
    text +=
        " " +
        (product.category || "");


    // الوصف
    text +=
        " " +
        (product.description || "");


    // الصور
    if (product.images) {

        text +=
            " " +
            product.images.join(" ");

    }


    // المواصفات
    if (product.specs) {

        Object.entries(product.specs)
            .forEach(function ([key, value]) {

                text +=
                    " " +
                    key +
                    " " +
                    value;

            });

    }


    // الكلمات العربية البديلة
    const aliases =
        getAliasesForProduct(product);

    if (aliases.length) {

        text +=
            " " +
            aliases.join(" ");

    }


    return normalizeText(text);

}


// ============================================
// معرفة القسم من البحث
// ============================================

const categoryAliases = {

    motorcycles: [
        "موتوسيكل",
        "موتوسيكلات",
        "موتوسكل",
        "موتوسكلات",
        "موتسيكل",
        "موتسيكلات",
        "موتور",
        "مواتير",
        "motorcycle",
        "motorcycles"
    ],

    scooters: [
        "سكوتر",
        "سكوترات",
        "scooter",
        "scooters"
    ],

    parts: [
        "قطعه غيار",
        "قطع غيار",
        "قطع",
        "غيار",
        "spare",
        "parts"
    ],

    accessories: [
        "اكسسوار",
        "اكسسوارات",
        "إكسسوارات",
        "accessory",
        "accessories"
    ],

    helmets: [
        "خوذه",
        "خوذات",
        "خوذة",
        "helmet",
        "helmets"
    ],

    oil: [
        "زيت",
        "زيوت",
        "oil",
        "oils"
    ]

};


// ============================================
// البحث عن القسم
// ============================================

function detectCategory(search) {

    const normalized =
        normalizeText(search);


    for (
        const category in categoryAliases
    ) {

        const words =
            categoryAliases[category];


        for (
            const word of words
        ) {

            if (
                normalized ===
                normalizeText(word)
            ) {

                return category;

            }

        }

    }


    return null;
}


// ============================================
// المنتجات المعروضة
// ============================================

let displayedProducts =
    [...products];


// ============================================
// فلترة القسم
// ============================================

if (selectedCategory) {

    displayedProducts =
        displayedProducts.filter(
            function (product) {

                return (
                    product.category ===
                    selectedCategory
                );

            }
        );

}


// ============================================
// البحث
// ============================================

const searchText =
    normalizeText(originalSearch);


if (searchText) {

    const detectedCategory =
        detectCategory(searchText);


    // لو البحث عبارة عن قسم
    if (detectedCategory) {

        displayedProducts =
            displayedProducts.filter(
                function (product) {

                    return (
                        product.category ===
                        detectedCategory
                    );

                }
            );

    }


    // البحث الذكي
    else {

        const searchWords =
            searchText
                .split(" ")
                .filter(function (word) {

                    return word.length > 0;

                });


        displayedProducts =
            displayedProducts.filter(
                function (product) {

                    const searchableText =
                        getSearchableText(
                            product
                        );


                    // كل كلمة من البحث لازم تكون موجودة
                    return searchWords.every(
                        function (word) {

                            return searchableText
                                .includes(word);

                        }
                    );

                }
            );

    }

}


// ============================================
// عنوان الصفحة
// ============================================

const pageTitle =
    document.getElementById(
        "pageTitle"
    );


if (pageTitle) {

    if (originalSearch) {

        pageTitle.textContent =
            "نتائج البحث عن: " +
            originalSearch;

    }

    else if (
        selectedCategory ===
        "motorcycles"
    ) {

        pageTitle.textContent =
            "موتوسكلات";

    }

    else if (
        selectedCategory ===
        "scooters"
    ) {

        pageTitle.textContent =
            "سكوترات";

    }

    else if (
        selectedCategory ===
        "parts"
    ) {

        pageTitle.textContent =
            "قطع الغيار";

    }

    else if (
        selectedCategory ===
        "accessories"
    ) {

        pageTitle.textContent =
            "الإكسسوارات";

    }

    else if (
        selectedCategory ===
        "helmets"
    ) {

        pageTitle.textContent =
            "الخوذات";

    }

    else if (
        selectedCategory ===
        "oil"
    ) {

        pageTitle.textContent =
            "الزيوت";

    }

    else {

        pageTitle.textContent =
            "كل المنتجات";

    }

}


// ============================================
// التحقق من المفضلة
// ============================================

function isFavorite(id) {

    return favorites.some(
        function (item) {

            return Number(item) ===
                Number(id);

        }
    );

}


// ============================================
// تغيير المفضلة
// ============================================

function toggleFavorite(
    id,
    button
) {

    id = Number(id);


    if (isFavorite(id)) {

        favorites =
            favorites.filter(
                function (item) {

                    return (
                        Number(item) !==
                        id
                    );

                }
            );


        button.innerHTML =
            "♡";

        button.style.color =
            "#555";

    }

    else {

        favorites.push(id);


        button.innerHTML =
            "♥";

        button.style.color =
            "red";

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(
            favorites
        )
    );

}


// ============================================
// عرض المنتجات
// ============================================

if (productsContainer) {

    productsContainer.innerHTML =
        "";


    // لا توجد نتائج
    if (
        displayedProducts.length ===
        0
    ) {

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
                    مفيش منتجات مطابقة 🔍
                </h2>

                <p>
                    جرب اسم المنتج أو الماركة
                    أو الموتور أو المواصفات.
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


    // المنتجات
    displayedProducts.forEach(
        function (product) {

            const productElement =
                document.createElement(
                    "div"
                );


            productElement.className =
                "product";


            const favorite =
                isFavorite(
                    product.id
                );


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
                            position:absolute !important;
                            top:10px !important;
                            left:10px !important;

                            width:42px !important;
                            height:42px !important;

                            min-width:42px !important;
                            max-width:42px !important;

                            padding:0 !important;
                            margin:0 !important;

                            border:none !important;

                            border-radius:50% !important;

                            background:#fff !important;

                            color:${
                                favorite
                                ? "red"
                                : "#555"
                            } !important;

                            font-size:25px !important;

                            line-height:42px !important;

                            display:flex !important;

                            align-items:center !important;
                            justify-content:center !important;

                            cursor:pointer !important;

                            box-shadow:
                                0 2px 8px
                                rgba(0,0,0,.2) !important;

                            z-index:20 !important;
                        "
                    >

                        ${
                            favorite
                            ? "♥"
                            : "♡"
                        }

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
                    href="
                        details.html?id=${product.id}
                    "

                    style="
                        text-decoration:none;
                    "
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

        }
    );

}
