// BACKEND_URL = "http://127.0.0.1:8000"   
const BACKEND_URL = "https://taskly-f9fl.onrender.com"

function showLoader() {
    document.getElementById("apiLoader").style.display = "block";
    console.log("Loading....")
}

function hideLoader() {
    document.getElementById("apiLoader").style.display = "none";
    console.log("Done Loading....")
}



async function AuthRegister(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", document.getElementById("password").value);
    formData.append("passwordConfirm", document.getElementById("confirm_password").value);
    showLoader();
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/register-via-email/`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            document.getElementById("registerErrorMessage").innerText = data.detail || "Registration failed";
            document.getElementById("registerErrorMessage").style.display = "block";
        } else {
            window.location.href = "login.html";
        }
    } catch (err) {
        console.error(err);
    }finally {
        hideLoader(); // 👈 always hide
    }
}

async function AuthRegisterAdmin(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", document.getElementById("password").value);
    formData.append("passwordConfirm", document.getElementById("confirm_password").value);
    showLoader();
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/register-admin/`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            document.getElementById("registerErrorMessage").innerText = data.detail || "Registration failed";
            document.getElementById("registerErrorMessage").style.display = "block";
        } else {
            window.location.href = "login.html";
        }
    } catch (err) {
        console.error(err);
    }finally {
        hideLoader(); // 👈 always hide
    }
}

async function AuthLogin(event){
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", document.getElementById("loginEmail").value);
    formData.append("password", document.getElementById("loginPassword").value);
    showLoader();
    try{
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/login/`, {
            method: "POST",
            body: formData
        });

        const data = await response.json()
        if (response.ok && data.access_token) {
            localStorage.setItem("access_token", data.access_token)
            localStorage.setItem("username", data.username)
            localStorage.setItem("id", data.id)

            window.location.href="/"
            
        } else {
            console.log(data.message)
            document.getElementById("loginErrorMessage").innerText = data.message || "Login failed";
            document.getElementById("loginErrorMessage").style.display = "block";
        }
    } catch (err) {
        console.error(err);
    }finally {
            hideLoader(); // 👈 always hide
        }

    
}
