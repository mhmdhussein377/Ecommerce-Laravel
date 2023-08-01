const logoutButton = document.getElementById("logout")
const categoriesElement = document.querySelector(".categories");


// direct the user to the login if he is not an admin
const user_role_id = JSON.parse(localStorage.getItem("user")).user_role_id

if(user_role_id !== 2) {
    window.location.href = "./../index.html"
}


// direct the user to the login page if the token is expired
const token = localStorage.getItem("token");

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

parseJwt(token);


// logout functionality
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
            .data.reverse()
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
          return `<a href="/Client/pages/Product.html?id=${product.id}"><div class="card">
            <div class="card-img">
              <img src="${product.image}" alt="">
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





