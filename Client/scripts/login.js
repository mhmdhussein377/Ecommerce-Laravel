const emailInput = document.getElementById("email-input")
const passwordInput = document.getElementById("password-input")
const loginButton = document.getElementById("login-button")
const loginForm = document.querySelector("form")
const error = document.querySelector(".error")

loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const data = {
        email: emailInput.value,
        password: passwordInput.value
    }

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/login", data);
        if(response.data.status === "success") {
            console.log(response.data)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            localStorage.setItem("token", response.data.authorisation.token)
        }else {
            error.classList.remove("hide")
            setTimeout(() => {
                error.classList.add("hide")
            }, 3000)
        }
    } catch (error) {
        console.log(error)
    }
})