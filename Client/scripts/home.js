const cart = document.querySelector(".cart-icon")
const cartSidebar = document.querySelector(".cart-sidebar");
const closeSidebarButton = document.querySelector(".cart-sidebar .close-button");
const logout = document.querySelector(".logout")
const categoriesElement = document.querySelector(".categories");
const cartProducts = document.querySelector(".cart-sidebar .products");
const toggleButton = document.querySelector(".toggle-button");
const rightButtonsSM = document.querySelector(".right-buttons-sm");
const closeButton = document.querySelector(".right-buttons-sm .close");
const cartBadge = document.querySelector('.cart-badge')

const token = localStorage.getItem("token")

const parseJwt = (token) => {
    const decode = JSON.parse(atob(token.split(".")[1]));
    console.log(decode);
    if (decode.exp * 1000 < new Date().getTime()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "./../index.html";
        console.log("Time Expired");
    }
};

parseJwt(token)

if (!token) {
    window.location.href = "./../index.html"
}

cart
    .addEventListener("click", function () {
        cartSidebar
            .classList
            .remove('hide')
    });

closeSidebarButton.addEventListener("click", function () {
    cartSidebar
        .classList
        .add('hide')
})

toggleButton.addEventListener("click", () => {
    rightButtonsSM
        .classList
        .remove("hide");
});

closeButton.addEventListener("click", () => {
    rightButtonsSM
        .classList
        .add("hide");
});

logout.addEventListener("click", async() => {
    try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "./../index.html"
    } catch (error) {
        console.log(error)
    }
})

async function displayProducts() {
    console.log("why")
    try {
        const token = localStorage.getItem("token");
        async function getProduts() {
            const categories = await axios.get("http://127.0.0.1:8000/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            categoriesElement.innerHTML = "";

            categories
                .data
                .reverse()
                .map(async function (category) {
                    let response = await axios.get(`http://127.0.0.1:8000/api/category/${category.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = response.data;
                    if (data.products.length > 0) {
                        // check if the product is favorited by the user
                        function checkFavoritesForProducts(products) {
                            return products.map(async(product) => {
                                try {
                                    const data = {
                                        user_id: JSON
                                            .parse(localStorage.getItem("user"))
                                            .id,
                                        product_id: product.id
                                    };
                                    const isFavoritedResponse = await axios.post("http://127.0.0.1:8000/api/is_favorited", data);
                                    const isInCartResponse = await axios.post("http://127.0.0.1:8000/api/is_item_in_cart", data);
                                    let isFavoritedAndInCart = [
                                        isFavoritedResponse.data === "Yes"
                                            ? true
                                            : false,
                                        isInCartResponse.data === "Yes"
                                            ? true
                                            : false
                                    ];
                                    return isFavoritedAndInCart;
                                } catch (error) {
                                    console.log(error);
                                }
                            });
                        }
                        const favoritesAndInCart = await Promise.all(checkFavoritesForProducts(data.products));
                        
                        categoriesElement.innerHTML += `<div class="category">
    <h3 class="container">${data.category_name}</h3>
    <div class="line"></div>
    <div class="cards container">
      ${data.products
                            ?.map(function (product, index) {
                                console.log(favoritesAndInCart[index]);
                                return `<div class="card">
            <div class="card-img">
              <img src="${product.image}" alt="">
            </div>
            <div class="card-name">${product.name}</div>
            <div class="card-desc">${product.description}</div>
            <div class="buttons">
              <div>
                <button class="add-favorite-button" onClick="addToFavorites(event, ${
                                product.id})">
                  ${
                                favoritesAndInCart[index][0]
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"}
                </button>
              </div>
              <div>
                <button onClick="addToCart(event, ${product.id})">
                  ${
                                favoritesAndInCart[index][1]
                                    ? "Remove from Cart"
                                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>`;})
        .join("")}
    </div>
  </div>`;
                            }
                        });
                }
                getProduts();
            } catch (error) {
                console.log(error);
            }
    }

    // displaying the products
    displayProducts()

    function removeItem(event, productID) {
        addToCart(event, productID);
        console.log("in between")
        displayProducts();
    }

    // add to favorites / remove from favorites
    async function addToFavorites(event, product_id) {
        const user_id = JSON
            .parse(localStorage.getItem("user"))
            .id
        const token = localStorage.getItem('token')
        const data = {
            user_id,
            product_id
        }

        try {
            let response = await axios.post("http://127.0.0.1:8000/api/favorites/add", data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data == "Item has been added to favorites successfully") {
                event.target.innerText = "Remove from Favorites"
            } else {
                event.target.innerText = "Add to Favorites";
            }
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }

    // add to cart / remove from cart functionality
    async function addToCart(event, product_id) {
        const user_id = JSON
            .parse(localStorage.getItem("user"))
            .id;
        const token = localStorage.getItem("token");
        const data = {
            user_id,
            product_id
        };

        try {
            let response = await axios.post("http://127.0.0.1:8000/api/cart/add", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!event.target.classList.contains("fa-solid")) {
                if (response.data.message == "Item added to cart successfully") {
                    event.target.innerText = "Remove from Cart";
                } else {
                    event.target.innerText = "Add to Cart";
                }
            }
            cartProducts.innerHTML = ""
            displayCartItems()
        } catch (error) {
            console.log(error);
        }
    }

    // increment the quantity
    async function incrementQuantity(product_id) {
        try {
            const token = localStorage.getItem("token")
            const user_id = JSON
                .parse(localStorage.getItem("user"))
                .id

            const data = {
                user_id,
                product_id
            }

            const response = await axios.post("http://127.0.0.1:8000/api/cart/increment", data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            cartProducts.innerHTML = ""
            displayCartItems()
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    // decrement the quantity
    async function decrementQuantity(product_id, quantity) {
        try {
            if (quantity > 1) {
                console.log("hello")
                const token = localStorage.getItem("token");
                const user_id = JSON
                    .parse(localStorage.getItem("user"))
                    .id;

                const data = {
                    user_id,
                    product_id
                };

                const response = await axios.post("http://127.0.0.1:8000/api/cart/decrement", data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                cartProducts.innerHTML = "";
                displayCartItems();
            }

        } catch (error) {
            console.log(error)
        }
    }

    // displaying the cart items in the cart sidebar

    async function displayCartItems() {
        const user_id = JSON
            .parse(localStorage.getItem("user"))
            .id
        const token = localStorage.getItem("token")
        try {
            let response = await axios.post("http://127.0.0.1:8000/api/cart", {
                user_id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let quantity = 0;
            response
                .data
                .reverse()
                .map(async function (cartItem) {
                    quantity += cartItem.quantity
                    async function getProduct(id) {
                        const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const product = response.data
                        cartProducts.innerHTML += `<div class="product">
                <div class="product-left">
                    <div class="product-img">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="product-details">
                        <div class="product-name">${product.name}</div>
                        <div class="">
                            <div class="product-quantity">${cartItem.quantity}x</div>
                            <div class="product-counter">
                                <span onClick="decrementQuantity(${product.id},
                                ${cartItem.quantity})">-</span>
                                <span>${cartItem.quantity}</span>
                                <span onClick="incrementQuantity(${product.id})">+</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="delete-product" onClick="removeItem(event, ${product.id})"><i class="fa-solid fa-x"></i></div>
            </div>`;
                    }
                    getProduct(cartItem.product_id)
                })
            cartBadge.innerText = quantity
        } catch (error) {
            console.log(error)
        }
    }

    displayCartItems()
