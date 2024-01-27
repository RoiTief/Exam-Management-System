
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");


let userController = new UserController();


loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;
    
    if (userController.register(username, password)) {
        alert("You have successfully signed in.");
        window.location.href = '../presentation/home-page.html';
    } else {
        loginErrorMsg.style.opacity = 1;
    }
    
})