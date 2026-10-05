import TeamCard from "../components/TeamCard";

function Teams() {
    return (
        <div>
            <h1>Campus Teams</h1>

            <TeamCard
                name="AI Innovators"
                members="5"
                category="Artificial Intelligence"
                description="Students working on AI and machine learning projects."
            />

            <TeamCard
                name="Web Developers"
                members="6"
                category="Web Development"
                description="Students building websites and web applications."
            />
        </div>
    );
}

export default Teams;