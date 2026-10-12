
const teams = [
  {
    id: 1,
    name: "AI Innovators",
    college: "SR University",
    description: "Students exploring AI and machine learning projects.",
    skills: ["Python", "AI/ML"],
    members: 5,
    category: "Artificial Intelligence",
    status: "Active",
    visibility: "Public",
    roles: {
      owner: "Team Owner",
      admin: "Team Admin",
      member: "Team Member"
    }
  },
  {
    id: 2,
    name: "Web Builders",
    college: "ABC Engineering College",
    description: "Building useful web applications for students.",
    skills: ["React", "JavaScript"],
    members: 4,
    category: "Web Development",
    status: "Active",
    visibility: "College Only",
    roles: {
      owner: "Team Owner",
      admin: "Team Admin",
      member: "Team Member"
    }
  },
  {
    id: 3,
    name: "Data Explorers",
    college: "XYZ Institute",
    description: "Learning from data and building analytics projects.",
    skills: ["Python", "SQL"],
    members: 3,
    category: "Data Science",
    status: "Forming",
    visibility: "Private",
    roles: {
      owner: "Team Owner",
      admin: "Team Admin",
      member: "Team Member"
    }
  }
];

export default teams;
