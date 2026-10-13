import CategoryBadge from "./CategoryBadge";

function getDeadlineStatus(deadline) {
  if (!deadline || !deadline.trim()) {
    return "Not specified";
  }

  // Parse dates such as "20 October 2026"
  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return "Not specified";
  }

  // Remove the time portion so we compare calendar dates.
  deadlineDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deadlineDate.getTime() === today.getTime()) {
    return "Deadline Today";
  }

  if (deadlineDate > today) {
    return "Upcoming";
  }

  return "Expired";
}

function OpportunityCard({
  title,
  organization,
  description,
  deadline,
  type,
  link,
}) {
  const deadlineStatus = getDeadlineStatus(deadline);

  return (
    <article className="opportunity-card">
      <CategoryBadge category={type || "Opportunity"} />

      <h3>{title}</h3>

      <p className="opportunity-organization">
        {organization}
      </p>

      <p className="opportunity-description">
        {description}
      </p>

      <p className="opportunity-deadline">
        Deadline: {deadline || "Not specified"}
      </p>

      <span
        className={`deadline-status deadline-status-${deadlineStatus
          .toLowerCase()
          .replaceAll(" ", "-")}`}
      >
        {deadlineStatus}
      </span>

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