import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// Google Sheets Sync Logic
async function sendToGoogleSheets(fullName, email, interest, phone) {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("course", interest); // Maps interest to your sheet's course column
    formData.append("level", "New Registration");
    formData.append("goal", `Phone: ${phone}`);

    await fetch(
        "https://script.google.com/macros/s/AKfycbzBr5AtNxhjbTMMzLJIUcCKFSSCp_dciJbSzxhl-WWwlafd0tWTkmx4FrLeLHFSYTg/exec",
        { method: "POST", body: formData, mode: "no-cors" }
    );
}

// --- Email & Password Sign Up Process ---
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const phone = document.getElementById("signupPhone").value;
    const interest = document.getElementById("signupInterest").value;
    const submitBtn = e.target.querySelector(".submit-btn");

    submitBtn.innerText = "Creating Account...";
    submitBtn.disabled = true;

    try {
        // Create user authentication record inside Firebase
        await createUserWithEmailAndPassword(auth, email, password);

        // Build active session payload for dashboard mapping
        const sessionUser = {
            name: fullName,
            email: email,
            enrolledCourses: [interest], 
            level: "Beginner",
            goal: `Focusing on core domain tracks. Reachable at: ${phone}`
        };

        localStorage.setItem("currentUser", JSON.stringify(sessionUser));

        // Send details off to Google Sheet
        await sendToGoogleSheets(fullName, email, interest, phone);

        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Registration Error: " + error.message);
    } finally {
        submitBtn.innerText = "Sign Up Now";
        submitBtn.disabled = false;
    }
});

// --- Google Sign Up Process ---
document.getElementById("googleSignUpBtn").addEventListener("click", async () => {
    const interest = document.getElementById("signupInterest").value || "General Track";
    const phone = document.getElementById("signupPhone").value || "Not Provided";

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const sessionUser = {
            name: user.displayName,
            email: user.email,
            enrolledCourses: [interest],
            level: "Beginner",
            goal: `Signed up via Google. Phone: ${phone}`
        };

        localStorage.setItem("currentUser", JSON.stringify(sessionUser));
        await sendToGoogleSheets(user.displayName, user.email, interest, phone);

        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Google Sign-Up Failed: " + error.message);
    }
});