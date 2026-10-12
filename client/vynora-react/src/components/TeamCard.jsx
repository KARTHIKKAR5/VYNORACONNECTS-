
import RoleBadge from "./RoleBadge";
import MemberBadge from "./MemberBadge";

function TeamCard({ team }) {
  return (
    <article className="item-card">
      <div className="card-heading">
        <div className="avatar">{team.name.charAt(0)}</div>
        <span className="status-badge">{team.status}</span>
      </div>

      <h3>{team.name}</h3>
      <p className="muted">{team.college}</p>
      <p>{team.description}</p>

      <div className="tag-list">
        {team.skills.map((skill) => (
          <span className="tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>

      <div className="badge-row">
        <RoleBadge role={team.roles.owner} />
        <MemberBadge count={team.members} />
      </div>

      <div className="card-footer">
        <span>{team.category}</span>
        <span>{team.visibility}</span>
      </div>
    </article>
  );
}

export default TeamCard;
