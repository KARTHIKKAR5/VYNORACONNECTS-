import ProjectCard from "../components/ProjectCard";

function Projects() {
    return (
        <div className="page">
            <h1>Campus Projects</h1>

            <p>Explore projects created by students.</p>

            <div className="card-container">

                <ProjectCard
                    name="Smart Campus"
                    team="AI Innovators"
                    category="Artificial Intelligence"
                    status="In Progress"
                    description="A platform designed to improve campus services."
                />

                <ProjectCard
                    name="Student Connect"
                    team="Web Developers"
                    category="Web Development"
                    status="Completed"
                    description="A platform that helps students connect and collaborate."
                />

                <ProjectCard
                    name="Campus Analytics"
                    team="Tech Explorers"
                    category="Data Science"
                    status="Planning"
                    description="A project for analysing campus data and generating useful insights."
                />

            </div>
        </div>
    );
}

export default Projects;
