// =====================================
// نظام البحث - يعمل في كل الصفحات
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");


    // لو الصفحة مفيهاش سيرش
    if (!searchInput) {
        return;
    }


    // =================================
    // تنفيذ البحث
    // =================================

    function searchProducts() {

        const text =
            searchInput.value.trim();


        // لو البحث فاضي
        if (text === "") {

            window.location.href =
                "products.html";

            return;

        }


        // فتح صفحة المنتجات بنتيجة البحث
        window.location.href =
            "products.html?search=" +
            encodeURIComponent(text);

    }


    // =================================
    // الضغط على زر البحث
    // =================================

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchProducts
        );

    }


    // =================================
    // الضغط على Enter
    // =================================

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchProducts();

            }

        }
    );


});
