function TeamCard({ name, members, category, description }) {
    return (
        <div className="card">
            <h2>{name}</h2>

            <p>
                <strong>Members:</strong> {members}
            </p>

            <p>
                <strong>Category:</strong> {category}
            </p>

            <p>{description}</p>

            <button>View Team</button>
        </div>
    );
}

export default TeamCard;