import projects from "../data/projects";
import ProjectCard from "../components/ProjectCard";


function Projects() {
  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">TURN IDEAS INTO REALITY</p>
        <h1>Explore Projects</h1>
        <p>Discover student projects and opportunities across colleges.</p>
      </div>

      <div className="card-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
