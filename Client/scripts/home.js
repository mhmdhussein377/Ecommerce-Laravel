const cart = document.querySelector(".cart-icon")
const cartSidebar = document.querySelector(".cart-sidebar");
const closeSidebarButton = document.querySelector(".cart-sidebar .close-button");
const logout = document.querySelector(".logout")

const token = localStorage.getItem("token")

if(!token) {
    window.location.href = "./../index.html"
}

cart.addEventListener("click", function () {
    cartSidebar
        .classList
        .remove('hide')
});

closeSidebarButton.addEventListener("click", function () {
    cartSidebar.classList.add('hide')
})

logout.addEventListener("click", async() => {
    try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "./../index.html"
    } catch (error) {
        console.log(error)
    }
})