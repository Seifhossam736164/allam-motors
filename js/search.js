const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


function searchProducts() {

    const searchText =
        searchInput.value.trim();

    if (searchText === "") {

        return;

    }

    window.location.href =
        "products.html?search=" +
        encodeURIComponent(searchText);

}


searchButton.addEventListener(
    "click",
    searchProducts
);


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchProducts();

        }

    }
);
