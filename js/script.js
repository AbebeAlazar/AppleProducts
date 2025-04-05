document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData); 
    console.log(data);
    
    try {
        const response = await fetch("http://localhost:1234/add-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        // redirecting in the backend
        window.location.href = "/welcome"; // Add this to handle redirect
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message);
    }
});