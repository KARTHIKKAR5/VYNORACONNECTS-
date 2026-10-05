function ProjectCard({ name, team, category, status, description }) {
    return (
        <div className="card">
            <h2>{name}</h2>

            <p>
                <strong>Team:</strong> {team}
            </p>

            <p>
                <strong>Category:</strong> {category}
            </p>

            <p>
                <strong>Status:</strong> {status}
            </p>

            <p>{description}</p>

            <button>View Project</button>
        </div>
    );
}

export default ProjectCard;