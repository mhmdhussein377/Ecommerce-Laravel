const cart = document.querySelector(".cart-icon")
const cartSidebar = document.querySelector(".cart-sidebar");
const closeSidebarButton = document.querySelector(".cart-sidebar .close-button");

cart.addEventListener("click", function () {
    cartSidebar
        .classList
        .remove('hide')
});

closeSidebarButton.addEventListener("click", function () {
    cartSidebar.classList.add('hide')
})

