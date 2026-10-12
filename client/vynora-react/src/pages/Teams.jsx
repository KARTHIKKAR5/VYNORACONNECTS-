import teams from "../data/teams";
import TeamCard from "../components/TeamCard";


function Teams() {
  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">FIND YOUR PEOPLE</p>
        <h1>Discover Teams</h1>
        <p>Meet students, share skills, and build something together.</p>
      </div>

      <div className="card-grid">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </section>
  );
}

export default Teams;
