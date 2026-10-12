function ResourceCard({ title, description, category, link }) {
  return (
    <article className="resource-card">
      <div className="resource-card-content">
        <span className="resource-category">
          {category || "Resource"}
        </span>

        <h3>{title}</h3>

        <p>{description}</p>

        <a
          className="resource-link"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Resource ↗
        </a>
      </div>
    </article>
  );
}

export default ResourceCard;