const logoutButton = document.getElementById("logout")
const categoriesElement = document.querySelector(".categories");

logout.addEventListener("click", async() => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "./../index.html";
    } catch (error) {
        console.log(error);
    }
});

try {
    const token = localStorage.getItem("token");
    async function getProduts() {
        const categories = await axios.get("http://127.0.0.1:8000/api/categories", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        categories
            .data
            .map(async function (category) {
                let response = await axios.get(`http://127.0.0.1:8000/api/category/${category.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data;
                if (data.products.length > 0) {
                    categoriesElement.innerHTML += `<div class="category">
    <h3>${data.category_name}</h3>
    <div class="cards">
      ${data.products
        ?.map(function (product) {
          return `<a href="/Client/pages/Product.html?${product.id}"><div class="card">
            <div class="card-img">
              <img src="./../assets/product_01.jpg" alt="">
            </div>
            <div style="display: block;" class="card-name">${product.name}</div>
            <div style="display: block;" class="card-desc">${product.description}</div>
          </div>`;
        })
        .join("")}
    </div>
  </div></a>`;
                        }
                    });
            }
            getProduts();
        } catch (error) {
            console.log(error);
        }