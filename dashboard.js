document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if a user session exists
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = "login.html";
        return;
    }

    // 2. Display user profile data
    document.getElementById("userGreeting").innerText = `Hey, ${currentUser.name}!`;
    document.getElementById("userEmail").innerText = currentUser.email;
    document.getElementById("userLevelDisplay").innerText = currentUser.level.toUpperCase();
    
    if (currentUser.goal) {
        document.getElementById("userGoalDisplay").innerText = `"${currentUser.goal}"`;
    }

    // 3. Render registered courses
    const coursesGrid = document.getElementById("enrolledCoursesGrid");
    if (currentUser.enrolledCourses && currentUser.enrolledCourses.length > 0) {
        coursesGrid.innerHTML = ""; // Clear the fallback text
        
        // Comprehensive map matching all 8 course values from index.html
        const courseNames = {
            cpp_dsa: "💻 C++ Data Structures & Algorithms",
            mern_stack: "🌐 Full-Stack MERN Development",
            python_ai: "🤖 Python Programming & AI Tools",
            iot_systems: "⚙️ IoT & Microcontroller Systems",
            data_science: "📊 Data Science Fundamentals",
            cyber_security: "🔒 Cybersecurity Basics",
            mobile_dev: "📱 Mobile App Development",
            cloud_computing: "☁️ Cloud Computing Essentials"
        };

        currentUser.enrolledCourses.forEach(courseKey => {
            const card = document.createElement("div");
            card.className = "course-card static-card";
            card.innerHTML = `
                <h3>${courseNames[courseKey] || courseKey}</h3>
                <p style="margin-top: 10px; color: #22c55e; font-weight: 600;">● In Progress</p>
            `;
            coursesGrid.appendChild(card);
        });
    }

    // 4. Logout Handler
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
});