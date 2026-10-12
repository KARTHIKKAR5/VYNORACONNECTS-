
function MemberBadge({ count }) {
  return (
    <span className="member-badge">
      {count} {count === 1 ? "member" : "members"}
    </span>
  );
}

export default MemberBadge;
