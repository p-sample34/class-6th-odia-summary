document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("https://class-6th-odia-summary.onrender.com/api/stories");
    const stories = await response.json();

    const storiesContainer = document.getElementById("stories-container");

    if (stories.length === 0) {
        storiesContainer.innerHTML += "<p>No stories available. Be the first to publish one!</p>";
        return;
    }

    stories.forEach(story => {
        const storyElement = document.createElement("div");
        storyElement.classList.add("news-item");

       storyElement.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.content}</p>
            <small>Posted on: ${new Date(story.createdAt).toLocaleDateString()}</small>
            <button class="like-button" data-id="${story._id}">Like (${story.likes || 0})</button>
        `;

        storiesContainer.appendChild(storyElement);
    });

    document.querySelectorAll(".like-button").forEach(button => {
        button.addEventListener("click", async (event) => {
            const storyId = event.target.getAttribute("data-id");
            const response = await fetch(`https://class-6th-odia-summary.onrender.com/api/stories/${storyId}/like`, { method: "POST" });
            const updatedStory = await response.json();
            event.target.textContent = `Like (${updatedStory.likes})`;
            event.target.disabled = true;
            event.target.classList.add("liked"); // Add animation class
        });
    });
});
