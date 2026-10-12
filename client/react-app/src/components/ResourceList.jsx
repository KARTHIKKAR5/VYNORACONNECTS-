import ResourceCard from "./ResourceCard";

const resources = [
  {
    id: 1,
    title: "React Documentation",
    description:
      "Official documentation to learn React fundamentals and concepts.",
    category: "Development",
    link: "https://react.dev/",
  },
  {
    id: 2,
    title: "MDN Web Docs",
    description:
      "Learn HTML, CSS, JavaScript and modern web development.",
    category: "Web Development",
    link: "https://developer.mozilla.org/",
  },
  {
    id: 3,
    title: "GitHub Skills",
    description:
      "Interactive courses to learn GitHub and collaboration workflows.",
    category: "Git & GitHub",
    link: "https://skills.github.com/",
  },
];

function ResourceList() {
  return (
    <div className="resource-list">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          title={resource.title}
          description={resource.description}
          category={resource.category}
          link={resource.link}
        />
      ))}
    </div>
  );
}

export default ResourceList;