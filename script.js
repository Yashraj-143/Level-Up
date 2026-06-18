document.addEventListener("DOMContentLoaded", () => {
    const courseCards = document.querySelectorAll(".course-card");
    const modal = document.getElementById("formModal");
    const closeBtn = document.querySelector(".close-btn");
    const courseSelect = document.getElementById("course");
    const form = document.getElementById("subscriptionForm");
    const successMessage = document.getElementById("successMessage");
    const submitBtn = document.querySelector(".submit-btn");

    // 1. Open modal when a course card is clicked
    courseCards.forEach(card => {
        card.addEventListener("click", () => {
            // Get the course ID from the data attribute
            const courseId = card.getAttribute("data-course");
            
            // Auto-select that course in the dropdown
            courseSelect.value = courseId;
            
            // Reset form visibility in case it was previously submitted
            form.style.display = "block";
            successMessage.classList.add("hidden");
            form.reset();
            courseSelect.value = courseId; // Re-apply after reset

            // Show the modal
            modal.classList.remove("hidden");
        });
    });

    // 2. Close modal when 'X' is clicked
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // 3. Close modal if user clicks outside the white form box
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });


// 4. Handle Form Submission
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    const formData = new FormData();

    formData.append(
        "fullName",
        document.getElementById("fullName").value
    );

    formData.append(
        "email",
        document.getElementById("email").value
    );

    formData.append(
        "course",
        document.getElementById("course").value
    );

    formData.append(
        "level",
        document.getElementById("level").value
    );

    formData.append(
        "goal",
        document.getElementById("goal").value
    );

    try {

        await fetch(
            "https://script.google.com/macros/s/AKfycbzBr5AtNxhjbTMMzLJIUcCKFSSCp_dciJbSzxhl-WWwlafd0tWTkmx4FrLeLHFSYTg/exec",
            {
                method: "POST",
                body: formData,
                mode: "no-cors"
            }
        );

        form.style.display = "none";
        successMessage.classList.remove("hidden");

        form.reset();

        setTimeout(() => {
            modal.classList.add("hidden");

            form.style.display = "block";
            successMessage.classList.add("hidden");
        }, 3000);

    } catch (error) {

        console.error("Submission Error:", error);

        alert(
            "Something went wrong. Please try again."
        );

    }

    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
});

        // UI Feedback
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Hide form and show success message inside the modal
            form.style.display = "none";
            successMessage.classList.remove("hidden");
            
            // Reset button
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            
            // Optional: Auto-close modal after 3 seconds
            setTimeout(() => {
                modal.classList.add("hidden");
            }, 3000);

        }, 800); 
    });