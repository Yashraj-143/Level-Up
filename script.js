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

document.addEventListener("DOMContentLoaded", () => {
    const courseCards = document.querySelectorAll(".course-card");
    const modal = document.getElementById("formModal");
    const closeBtn = document.querySelector(".close-btn");
    const courseSelect = document.getElementById("course");
    const form = document.getElementById("subscriptionForm");
    const successMessage = document.getElementById("successMessage");
    const submitBtn = document.querySelector(".submit-btn");

    // 1. Open modal on card click
    courseCards.forEach(card => {
        card.addEventListener("click", () => {
            const courseId = card.getAttribute("data-course");
            
            // Reset form UI rules
            form.reset();
            form.style.display = "block"; 
            successMessage.classList.add("hidden");
            
            // Sync dropdown value
            if (courseSelect) {
                courseSelect.value = courseId; 
            }
            
            // Make layout visible
            modal.classList.remove("hidden");
            modal.style.display = "flex"; 
        });
    });

    // 2. Close modal triggers
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
            modal.style.display = "none";
        }
    });

    // Helper to send data over to your Google Sheets Apps Script
    async function sendToGoogleSheets(fullName, email, course, level, goal) {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("course", course);
        formData.append("level", level);
        formData.append("goal", goal);

        try {
            await fetch(
                "https://script.google.com/macros/s/AKfycbzBr5AtNxhjbTMMzLJIUcCKFSSCp_dciJbSzxhl-WWwlafd0tWTkmx4FrLeLHFSYTg/exec",
                { method: "POST", body: formData, mode: "no-cors" }
            );
        } catch (err) {
            console.error("Sheets sync failed:", err);
        }
    }

    // 3. Handle Email/Password Form Submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value; 
        const course = courseSelect.value;
        const level = document.getElementById("level").value;
        const goal = document.getElementById("goal").value;

        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            
            const sessionUser = { name: fullName, email: email, enrolledCourses: [course], level: level, goal: goal };
            localStorage.setItem("currentUser", JSON.stringify(sessionUser));

            await sendToGoogleSheets(fullName, email, course, level, goal);

            form.style.display = "none";
            successMessage.classList.remove("hidden");
            setTimeout(() => { window.location.href = "dashboard.html"; }, 2000);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            submitBtn.innerText = "Subscribe Now";
            submitBtn.disabled = false;
        }
    });

    // 4. Handle Google Quick Enrollment inside Modal
    const googleBtn = document.getElementById("googleSignUpBtn");
    if (googleBtn) {
        googleBtn.addEventListener("click", async () => {
            const course = courseSelect.value;
            const level = document.getElementById("level").value || "Not specified";
            const goal = document.getElementById("goal").value || "Enrolled quickly via Google authentication";

            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                const sessionUser = { name: user.displayName, email: user.email, enrolledCourses: [course], level: level, goal: goal };
                localStorage.setItem("currentUser", JSON.stringify(sessionUser));

                await sendToGoogleSheets(user.displayName, user.email, course, level, goal);

                form.style.display = "none";
                successMessage.classList.remove("hidden");
                setTimeout(() => { window.location.href = "dashboard.html"; }, 2000);
            } catch (error) {
                console.error("Google Enrollment Error:", error);
                alert("Google Sign-In Failed: " + error.message);
            }
        });
    }
});
