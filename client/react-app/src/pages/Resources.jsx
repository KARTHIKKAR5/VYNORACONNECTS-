import { useState } from "react";

import ResourceList from "../components/ResourceList";
import OpportunityCard from "../components/OpportunityCard";

const opportunities = [
  {
    id: 1,
    title: "Frontend Development Internship",
    organization: "Vynora",
    description:
      "Gain practical frontend development experience by building real-world projects.",
    deadline: "20 October 2026",
    type: "Internship",
    link: "https://internshala.com/",
  },
  {
    id: 2,
    title: "AI Hackathon",
    organization: "Student Innovation Hub",
    description:
      "Build an innovative AI solution and showcase your creativity and technical skills.",
    deadline: "25 October 2026",
    type: "Hackathon",
    link: "https://devpost.com/",
  },
  {
    id: 3,
    title: "Student Developer Scholarship",
    organization: "Tech Foundation",
    description:
      "Explore scholarship opportunities designed to support student developers.",
    deadline: "30 October 2026",
    type: "Scholarship",
    link: "https://scholarshipportal.com/",
  },
];

function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] =
    useState("All Opportunities");

  const filteredOpportunities = opportunities.filter(
    (opportunity) => {
      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        opportunity.title.toLowerCase().includes(searchText) ||
        opportunity.organization.toLowerCase().includes(searchText) ||
        opportunity.description.toLowerCase().includes(searchText) ||
        opportunity.type.toLowerCase().includes(searchText);

      const matchesType =
        selectedType === "All Opportunities" ||
        opportunity.type === selectedType;

      return matchesSearch && matchesType;
    }
  );

  function resetFilters() {
    setSearchTerm("");
    setSelectedType("All Opportunities");
  }

  return (
    <main className="resources-page">
      <header className="resources-header">
        <span className="resources-label">
          VYNORA CONNECT
        </span>

        <h1>
          Resources &amp;
          <br />
          Opportunities
        </h1>

        <p>
          Discover useful learning resources and opportunities
          to grow your skills and career.
        </p>
      </header>

      <section className="resources-section">
        <div className="section-heading">
          <h2>Learning Resources</h2>

          <p>
            Useful resources for your development journey.
          </p>
        </div>

        <ResourceList />
      </section>

      <section className="opportunities-section">
        <div className="section-heading">
          <h2>Student Opportunities</h2>

          <p>
            Explore internships, hackathons and scholarships.
          </p>
        </div>

        <div className="opportunity-filters">
          <input
            type="search"
            className="opportunity-search"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            aria-label="Search opportunities"
          />

          <select
            className="opportunity-filter"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value)
            }
            aria-label="Filter by opportunity type"
          >
            <option value="All Opportunities">
              All Opportunities
            </option>

            <option value="Internship">
              Internships
            </option>

            <option value="Hackathon">
              Hackathons
            </option>

            <option value="Scholarship">
              Scholarships
            </option>
          </select>

          <button
            type="button"
            className="reset-filters"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>

        <p className="opportunity-count">
          Showing {filteredOpportunities.length} of{" "}
          {opportunities.length} opportunities
        </p>

        {filteredOpportunities.length > 0 ? (
          <div className="opportunity-list">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                title={opportunity.title}
                organization={opportunity.organization}
                description={opportunity.description}
                deadline={opportunity.deadline}
                type={opportunity.type}
                link={opportunity.link}
              />
            ))}
          </div>
        ) : (
          <div className="no-opportunities">
            <h3>No opportunities found</h3>

            <p>
              Try another search term or change the category.
            </p>

            <button
              type="button"
              className="reset-filters"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Resources;