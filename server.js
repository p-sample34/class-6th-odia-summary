const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://psample34:iW10BLayo6EIPH0r@cluster0.awjytfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const storySchema = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] } // Track users who liked the story
});

const Story = mongoose.model("Story", storySchema);

app.post("/api/stories", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newStory = new Story({ title, content });
        await newStory.save();
        res.status(201).json(newStory);
    } catch (error) {
        res.status(500).json({ error: "Error saving story" });
    }
});

app.post("/api/stories/:id/like", async (req, res) => {
    try {
        const userId = req.body.userId; // Assume userId is sent in the request body
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }
        if (story.likedBy.includes(userId)) {
            return res.status(400).json({ error: "User has already liked this story" });
        }
        story.likes += 1;
        story.likedBy.push(userId);
        await story.save();
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: "Error liking story" });
    }
});

app.get("/api/stories", async (req, res) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: "Error fetching stories" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
