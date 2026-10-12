function OpportunityCard({
  title,
  organization,
  description,
  deadline,
  type,
  link,
}) {
  return (
    <article className="opportunity-card">
      <span className="opportunity-type">{type}</span>

      <h3>{title}</h3>

      <p className="opportunity-organization">
        {organization}
      </p>

      <p className="opportunity-description">
        {description}
      </p>

      <p className="opportunity-deadline">
        Deadline: {deadline}
      </p>

      <a
        className="apply-button"
        href={link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => {
          if (!link) {
            event.preventDefault();
            window.alert(
              "The application link for this opportunity has not been added yet."
            );
          }
        }}
      >
        View Opportunity ↗
      </a>
    </article>
  );
}

export default OpportunityCard;