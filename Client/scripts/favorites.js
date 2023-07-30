const favoritesElement = document.querySelector(".favorites")

try {
    const token = localStorage.getItem("token");
    const user_id = JSON
        .parse(localStorage.getItem("user"))
        .id
    async function getFavorites() {
        const response = await axios.post("http://127.0.0.1:8000/api/favorites", {
            user_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        async function getProduct(productID) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/products/${productID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const product = response.data
                favoritesElement.innerHTML += `<div class="card">
                            <div class="card-img"><img src="./../assets/product_01.jpg" alt=""></div>
                            <div class="card-name">${product.name}</div>
                            <div class="card-desc">${product.description}</div>
                            <div class="buttons">
                                <div><button class="add-favorite-button" onClick="addToFavorites(event, ${product.id})">Add to Favorites</button></div>
                                <div><button>Add to Cart</button></div>
                            </div>
                        </div>`;
            } catch (error) {
                console.log(error)
            }
        }
        async function fillProductsArray() {
            response
                .data
                .map(async function (product) {
                    await getProduct(product.product_id);
                });
        }
        fillProductsArray()
    }
    getFavorites();
} catch (error) {
    console.log(error);
}

// favoritesElement.innerHTML += `<div class="card"> <div class="card-img"><img
// src="./../assets/product_01.jpg" alt=""></div>                         <div
// class="card-name">${product.name}</div>                    <div
// class="card-desc">${product.description}</div>                      <div
// class="buttons"> <div><button class="add-favorite-button"
// onClick="addToFavorites(event, ${product.id})">Add to
// Favorites</button></div>   <div><button>Add to Cart</button></div>
//       </div>                        </div>`;