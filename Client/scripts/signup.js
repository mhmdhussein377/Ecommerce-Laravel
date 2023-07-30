const form = document.querySelector("form")
const nameInput = document.getElementById("name-input")
const emailInput = document.getElementById("email-input")
const passwordInput = document.getElementById("password-input")
const emailError = document.getElementById("email-error")

form.addEventListener('submit', async(e) => {
    e.preventDefault()

    const name = nameInput.value
    const email = emailInput.value
    const password = passwordInput.value

    const data = {
        name,
        email,
        password
    }

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/register", data);
        if (response.data.status === "success") {
            localStorage.setItem("user", JSON.stringify(response.data.user))
            localStorage.setItem("token", response.data.authorisation.token)
            return;
        }

    } catch (error) {
        console.log(emailError);
        emailError
            .classList
            .remove("hide");
        setTimeout(() => {
            emailError
                .classList
                .add("hide");
        }, 3000);
        console.log(error)
    }
})