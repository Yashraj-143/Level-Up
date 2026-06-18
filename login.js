import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // Initialize Google Provider

// --- Traditional Email/Password Login ---
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const submitBtn = e.target.querySelector(".submit-btn");

    submitBtn.innerText = "Logging in...";
    submitBtn.disabled = true;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const sessionUser = {
            name: user.displayName || email.split('@')[0], 
            email: user.email,
            enrolledCourses: [], 
            level: "Returning Student",
            goal: "Continue your tracking from your dashboard panels."
        };

        localStorage.setItem("currentUser", JSON.stringify(sessionUser));
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Authentication failed: " + error.message);
    } finally {
        submitBtn.innerText = "Login";
        submitBtn.disabled = false;
    }
});

// --- Google Login Integration ---
document.getElementById("googleLoginBtn").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Save session state from Google Profile Data
        const sessionUser = {
            name: user.displayName,
            email: user.email,
            enrolledCourses: [], // Can be loaded from database later
            level: "Returning Student",
            goal: "Logged in via Google"
        };

        localStorage.setItem("currentUser", JSON.stringify(sessionUser));
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Google Auth Error:", error);
        alert("Google Sign-In Failed: " + error.message);
    }
});