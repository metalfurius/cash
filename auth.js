import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkrSgPE_uqrWfv8LW9SqYLievNei3ubfI",
    authDomain: "cash-2475a.firebaseapp.com",
    projectId: "cash-2475a",
    storageBucket: "cash-2475a.firebasestorage.app",
    messagingSenderId: "869117564785",
    appId: "1:869117564785:web:a01af2b48bea154f0508d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginView.style.display = 'none';
    registerView.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerView.style.display = 'none';
    loginView.style.display = 'block';
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('login-error-message');

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            errorMessage.textContent = 'Correo o contraseña incorrectos.';
            console.error("Error signing in: ", error);
        });
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorMessage = document.getElementById('register-error-message');

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            errorMessage.textContent = 'Error al registrar. ' + error.message;
            console.error("Error signing up: ", error);
        });
});
