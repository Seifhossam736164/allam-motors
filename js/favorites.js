const favoriteContainer =
    document.getElementById("favoriteContainer");

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


function renderFavorites() {

    favoriteContainer.innerHTML = "";

    if (favorites.length === 0) {

        favoriteContainer.innerHTML = `

            <div class="empty-favorites">

                <h2>
                    المفضلة فاضية ❤️
                </h2>

                <p>
                    لسه مفيش منتجات ضفتها للمفضلة.
                </p>

                <a href="products.html">
                    تصفح المنتجات
                </a>

            </div>

        `;

        return;
    }


    favorites.forEach(function(id) {

        const product =
            products.find(function(item) {

                return item.id == id;

            });


        if (!product) return;


        const card =
            document.createElement("div");

        card.className =
            "favorite-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h3>
                ${product.name}
            </h3>

            <p class="price">
                ${product.price.toLocaleString()}
                جنيه
            </p>

            <div class="favorite-actions">

                <a
                    class="details-btn"
                    href="details.html?id=${product.id}"
                >
                    التفاصيل
                </a>

                <button
                    class="remove-btn"
                    onclick="removeFavorite(${product.id})"
                >
                    إزالة ❤️
                </button>

            </div>

        `;


        favoriteContainer.appendChild(card);

    });

}


function removeFavorite(id) {

    favorites =
        favorites.filter(function(item) {

            return item != id;

        });


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    renderFavorites();

}


renderFavorites();
