
import MemberBadge from "./MemberBadge";

function ProjectCard({ project }) {
  return (
    <article className="item-card">
      <div className="card-heading">
        <span className="category">{project.category}</span>

        <span
          className={
            project.recruitingStatus === "Open"
              ? "status-badge open"
              : "status-badge"
          }
        >
          {project.recruitingStatus}
        </span>
      </div>

      <h3>{project.title}</h3>
      <p className="muted">{project.college}</p>
      <p>{project.description}</p>

      <div className="tag-list">
        {project.technologies.map((technology) => (
          <span className="tag" key={technology}>
            {technology}
          </span>
        ))}
      </div>

      <div className="badge-row">
        <MemberBadge count={project.members} />
        <span className="project-team">{project.teamName}</span>
      </div>

      <div className="card-footer">
        <span>Visibility: {project.visibility}</span>
        <span>{project.category}</span>
      </div>
    </article>
  );
}

export default ProjectCard;
