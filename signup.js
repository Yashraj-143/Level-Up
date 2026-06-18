import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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
        import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL,
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