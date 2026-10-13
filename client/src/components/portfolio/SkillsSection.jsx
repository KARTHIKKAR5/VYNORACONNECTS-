import React from 'react';

export function SkillsSection({ skills }) {
  if (!skills) return null;

  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: '💻',
      items: skills.languages || []
    },
    {
      title: 'Frontend Technologies',
      icon: '🎨',
      items: skills.frontend || []
    },
    {
      title: 'Backend Technologies',
      icon: '⚙️',
      items: skills.backend || []
    },
    {
      title: 'Databases',
      icon: '🗄️',
      items: skills.databases || []
    },
    {
      title: 'Development Tools & DevOps',
      icon: '🛠️',
      items: skills.tools || []
    }
  ];

  return (
    <div className="card skills-section-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Technical Skills & Expertise</h3>
          <p className="card-subtitle">Verified technology proficiency across modern software development</p>
        </div>
      </div>

      <div className="skills-category-grid">
        {skillCategories.map((category) => (
          <div key={category.title} className="skill-category-box">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h4 className="category-title">{category.title}</h4>
            </div>

            <div className="category-pills-list">
              {category.items.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;
