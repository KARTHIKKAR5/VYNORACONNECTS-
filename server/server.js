
const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

// Temporary storage for projects
let projects = [];
let nextId = 1;


// 1. CREATE a project
app.post("/projects", (req, res) => {
    const {
        ownerId,
        title,
        description,
        technologies,
        visibility,
        recruitingStatus
    } = req.body;

    // Check required fields
    if (!ownerId || !title) {
        return res.status(400).json({
            message: "ownerId and title are required"
        });
    }

    const project = {
        id: String(nextId++),
        ownerId: ownerId,
        title: title,
        description: description || "",
        technologies: technologies || [],
        visibility: visibility || "Public",
        recruitingStatus: recruitingStatus || "Open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    projects.push(project);

    res.status(201).json({
        message: "Project created successfully",
        project: project
    });
});


// 2. READ all projects
app.get("/projects", (req, res) => {
    res.json(projects);
});


// 3. READ one project using its ID
app.get("/projects/:id", (req, res) => {
    const project = projects.find(
        p => p.id === req.params.id
    );

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    res.json(project);
});


// 4. UPDATE a project
app.patch("/projects/:id", (req, res) => {
    const project = projects.find(
        p => p.id === req.params.id
    );

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    // Fields that are allowed to be updated
    const allowedFields = [
        "title",
        "description",
        "technologies",
        "visibility",
        "recruitingStatus"
    ];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            project[field] = req.body[field];
        }
    }

    project.updatedAt = new Date().toISOString();

    res.json({
        message: "Project updated successfully",
        project: project
    });
});


// 5. DELETE a project
app.delete("/projects/:id", (req, res) => {
    const index = projects.findIndex(
        p => p.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    projects.splice(index, 1);

    res.status(204).end();
});


// 6. Home route
app.get("/", (req, res) => {
    res.send("Vynora Projects API is running!");
});


// Start the server
app.listen(PORT, () => {
    console.log("Vynora Projects API started on port " + PORT);
});
