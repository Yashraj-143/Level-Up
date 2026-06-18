import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrZt1VQZBGuJxjicaf1wf6gYDxMgV8QZc",
  authDomain: "level-up-4d81f.firebaseapp.com",
  projectId: "level-up-4d81f",
  storageBucket: "level-up-4d81f.firebasestorage.app",
  messagingSenderId: "1081711086792",
  appId: "1:1081711086792:web:5cc2a5f2d8b17d58bce9fd",
  measurementId: "G-PQGSMLSWY6"
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