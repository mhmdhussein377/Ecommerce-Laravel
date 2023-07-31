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
                return await response.data
            } catch (error) {
                console.log(error)
            }
        }

        const products = await response.data
        products.forEach(async(product) => {
            const productData = await getProduct(product.product_id)
            favoritesElement.innerHTML += `<div class="card">
                            <div class="card-img"><img src="./../assets/product_01.jpg" alt=""></div>
                            <div class="card-name">${productData.name}</div>
                            <div class="card-desc">${productData.description}</div>
                            <div class="buttons">
                                <div><button>Add to Cart</button></div>
                            </div>
                        </div>`;
        })
    }
    getFavorites();
} catch (error) {
    console.log(error);
}