
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


// 1. Project database model
const projectSchema = new mongoose.Schema(
    {
        ownerId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        technologies: {
            type: [String],
            default: []
        },
        visibility: {
            type: String,
            enum: ["Public", "CollegeOnly", "Private"],
            default: "Public"
        },
        recruitingStatus: {
            type: String,
            enum: ["Open", "Paused", "Closed"],
            default: "Open"
        }
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model("Project", projectSchema);


// 2. CREATE a project
app.post("/projects", async (req, res) => {
    try {
        const project = await Project.create({
            ownerId: req.body.ownerId,
            title: req.body.title,
            description: req.body.description,
            technologies: req.body.technologies,
            visibility: req.body.visibility,
            recruitingStatus: req.body.recruitingStatus
        });

        res.status(201).json({
            message: "Project created successfully",
            project: project
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to create project"
        });
    }
});


// 3. READ all projects
app.get("/projects", async (req, res) => {
    try {
        const projects = await Project.find().sort({
            createdAt: -1
        });

        res.json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch projects"
        });
    }
});


// 4. READ one project
app.get("/projects/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid project ID"
        });
    }

    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch project"
        });
    }
});


// 5. UPDATE a project
app.patch("/projects/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid project ID"
        });
    }

    const allowedFields = [
        "title",
        "description",
        "technologies",
        "visibility",
        "recruitingStatus"
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project updated successfully",
            project: project
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to update project"
        });
    }
});


// 6. DELETE a project
app.delete("/projects/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid project ID"
        });
    }

    try {
        const project = await Project.findByIdAndDelete(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete project"
        });
    }
});


// 7. Home route
app.get("/", (req, res) => {
    res.send("Vynora Projects API is running!");
});


// 8. Connect to MongoDB and start server
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from the .env file");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(
                "Vynora Projects API started on port " + PORT
            );
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
