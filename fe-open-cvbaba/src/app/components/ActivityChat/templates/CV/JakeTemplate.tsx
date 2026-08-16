import React from 'react';

interface JakeTemplateProps {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const JakeTemplate: React.FC<JakeTemplateProps> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // For compact mode, use fixed small sizes - optimized for visibility
  const baseFontSize = compact ? 6 : 14;
  const basePadding = compact ? 2 : 10;
  const baseMargin = compact ? 1 : 10;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
      fontFamily: 'Times New Roman, serif',
    maxWidth: `${800 * scale}px`,
      margin: '0 auto',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 8 : 22) * scale}px`,
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    fontWeight: 'bold',
  };

  const contactInfoStyles = {
    fontSize: `${(compact ? 4 : 13) * scale}px`,
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
  };

  const linkStyles = {
      color: '#000',
    textDecoration: 'underline',
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 5 : 15) * scale}px`,
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #000',
    marginTop: `${(compact ? 2 : 12) * scale}px`,
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    paddingBottom: `${(compact ? 0.5 : 1) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 4 : 16) * scale}px`,
  };

  const jobTitleStyles = {
    fontWeight: 'bold',
    float: 'left' as const,
  };

  const institutionStyles = {
    fontWeight: 'bold',
    marginLeft: `${(compact ? 4 : 20) * scale}px`,
  };

  const dateStyles = {
    float: 'right' as const,
    fontStyle: 'italic',
  };

  const locationStyles = {
    textAlign: 'right' as const,
    fontStyle: 'italic',
  };

  const degreeStyles = {
    marginLeft: `${(compact ? 4 : 20) * scale}px`,
  };

  const degreeInfoStyles = {
    marginLeft: `${(compact ? 4 : 20) * scale}px`,
  };

  const listStyles = {
    marginTop: `${(compact ? 1 : 3) * scale}px`,
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
    paddingLeft: `${(compact ? 6 : 30) * scale}px`,
    listStyleType: 'disc',
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    display: 'list-item',
  };

  const clearfixStyles = {
    clear: 'both' as const,
    overflow: 'hidden',
  };

  const projectHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: `${(compact ? 1 : 2) * scale}px`,
  };

  const skillsSectionStyles = {
    marginTop: `${(compact ? 1 : 3) * scale}px`,
  };

  const skillsItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const skillsLabelStyles = {
    fontWeight: 'bold',
  };

  if (compact) {
    return (
      <div style={scaledStyles} className={className}>
        {/* Header */}
        <header style={headerStyles}>
          <h1 style={nameStyles}>Jake Ryan</h1>
          <div style={contactInfoStyles}>
            123-456-7890 | <a href="mailto:jake@test.edu" style={linkStyles}>jake@test.edu</a> | <a href="https://linkedin.com/in/jake" style={linkStyles}>linkedin.com/in/jake</a> | <a href="https://github.com/jake" style={linkStyles}>github.com/jake</a>
        </div>
      </header>

        {/* Education */}
        <div style={sectionTitleStyles}>Education</div>
        <div style={entryStyles}>
          <div style={clearfixStyles}>
            <div style={jobTitleStyles}>Southwestern University</div>
            <div style={dateStyles}>Georgetown, TX</div>
          </div>
          <div style={degreeStyles}>Bachelor of Arts in Computer Science, Minor in Business</div>
          <div style={clearfixStyles}>
            <div style={degreeInfoStyles}></div>
            <div style={dateStyles}>Aug. 2018 - May 2021</div>
          </div>
        </div>

        <div style={entryStyles}>
          <div style={clearfixStyles}>
            <div style={jobTitleStyles}>Blinn College</div>
            <div style={dateStyles}>Bryan, TX</div>
          </div>
          <div style={degreeStyles}>Associate of Liberal Arts</div>
          <div style={clearfixStyles}>
            <div style={degreeInfoStyles}></div>
            <div style={dateStyles}>Aug. 2014 - May 2018</div>
          </div>
        </div>

        {/* Experience */}
        <div style={sectionTitleStyles}>Experience</div>
        <div style={entryStyles}>
          <div style={clearfixStyles}>
            <div style={jobTitleStyles}>Undergraduate Research Assistant</div>
            <div style={dateStyles}>June 2020 - Present</div>
          </div>
          <div style={clearfixStyles}>
            <div style={institutionStyles}>Texas A&M University</div>
            <div style={locationStyles}>College Station, TX</div>
          </div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed a REST API using Flask, React, and PostgreSQL.</li>
            <li style={listItemStyles}>Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data.</li>
            <li style={listItemStyles}>Created visualizations of GitHub collaboration.</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={clearfixStyles}>
            <div style={jobTitleStyles}>Information Technology Support Specialist</div>
            <div style={dateStyles}>Sep. 2018 - Present</div>
          </div>
          <div style={clearfixStyles}>
            <div style={institutionStyles}>Southwestern University</div>
            <div style={locationStyles}>Georgetown, TX</div>
          </div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Set up campus computers and troubleshoot computer problems for students, faculty, and staff.</li>
            <li style={listItemStyles}>Maintained computers, classroom equipment, and printers across campus.</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={clearfixStyles}>
            <div style={jobTitleStyles}>Artificial Intelligence Research Assistant</div>
            <div style={dateStyles}>May 2019 - July 2019</div>
          </div>
          <div style={clearfixStyles}>
            <div style={institutionStyles}>Southwestern University</div>
            <div style={locationStyles}>Georgetown, TX</div>
          </div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed a genetic algorithm to produce procedural dungeons.</li>
            <li style={listItemStyles}>Presented virtually to the World Conference on Computational Intelligence.</li>
          </ul>
        </div>

        {/* Projects */}
        <div style={sectionTitleStyles}>Projects</div>
        <div style={entryStyles}>
          <div style={projectHeaderStyles}>
            <div style={jobTitleStyles}>GitViz</div>
            <div style={dateStyles}>June 2020 - Present</div>
          </div>
          <div style={degreeStyles}>Python, Flask, React, PostgreSQL, Docker</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed a full-stack web application with Flask serving a REST API with React as the frontend.</li>
            <li style={listItemStyles}>Implemented GitHub OAuth to pull data and visualize collaboration.</li>
            <li style={listItemStyles}>Used Flask and Redis for asynchronous tasks.</li>
          </ul>
      </div>
      
        <div style={entryStyles}>
          <div style={projectHeaderStyles}>
            <div style={jobTitleStyles}>Simple Paintball</div>
            <div style={dateStyles}>May 2018 - May 2020</div>
          </div>
          <div style={degreeStyles}>Spigot API, Java, Maven, Git</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed a Minecraft plugin; published with 25+ downloads and a 4.5/5-star review.</li>
            <li style={listItemStyles}>Implemented continuous delivery using Travis-CI.</li>
          </ul>
        </div>

        {/* Technical Skills */}
        <div style={sectionTitleStyles}>Technical Skills</div>
        <div style={skillsSectionStyles}>
          <div style={skillsItemStyles}><span style={skillsLabelStyles}>Languages:</span> Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R</div>
          <div style={skillsItemStyles}><span style={skillsLabelStyles}>Frameworks:</span> React, Node.js, Flask, Material UI</div>
          <div style={skillsItemStyles}><span style={skillsLabelStyles}>Developer Tools:</span> Git, Docker, Google Cloud Platform, VS Code</div>
          <div style={skillsItemStyles}><span style={skillsLabelStyles}>Libraries:</span> pandas, NumPy, Matplotlib</div>
        </div>
      </div>
    );
  }

  return (
    <div style={scaledStyles} className={className}>
      {/* Header */}
      <header style={headerStyles}>
        <h1 style={nameStyles}>Jake Ryan</h1>
        <div style={contactInfoStyles}>
          123-456-7890 | <a href="mailto:jake@test.edu" style={linkStyles}>jake@test.edu</a> | <a href="https://linkedin.com/in/jake" style={linkStyles}>linkedin.com/in/jake</a> | <a href="https://github.com/jake" style={linkStyles}>github.com/jake</a>
        </div>
      </header>

      {/* Education */}
      <div style={sectionTitleStyles}>Education</div>
      <div style={entryStyles}>
        <div style={clearfixStyles}>
          <div style={jobTitleStyles}>Southwestern University</div>
          <div style={dateStyles}>Georgetown, TX</div>
        </div>
        <div style={degreeStyles}>Bachelor of Arts in Computer Science, Minor in Business</div>
        <div style={clearfixStyles}>
          <div style={degreeInfoStyles}></div>
          <div style={dateStyles}>Aug. 2018 - May 2021</div>
        </div>
      </div>

      <div style={entryStyles}>
        <div style={clearfixStyles}>
          <div style={jobTitleStyles}>Blinn College</div>
          <div style={dateStyles}>Bryan, TX</div>
        </div>
        <div style={degreeStyles}>Associate of Liberal Arts</div>
        <div style={clearfixStyles}>
          <div style={degreeInfoStyles}></div>
          <div style={dateStyles}>Aug. 2014 - May 2018</div>
        </div>
      </div>
      
      {/* Experience */}
      <div style={sectionTitleStyles}>Experience</div>
      <div style={entryStyles}>
        <div style={clearfixStyles}>
          <div style={jobTitleStyles}>Undergraduate Research Assistant</div>
          <div style={dateStyles}>June 2020 - Present</div>
        </div>
        <div style={clearfixStyles}>
          <div style={institutionStyles}>Texas A&M University</div>
          <div style={locationStyles}>College Station, TX</div>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Developed a REST API using Flask, React, and PostgreSQL.</li>
          <li style={listItemStyles}>Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data.</li>
          <li style={listItemStyles}>Created visualizations of GitHub collaboration.</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={clearfixStyles}>
          <div style={jobTitleStyles}>Information Technology Support Specialist</div>
          <div style={dateStyles}>Sep. 2018 - Present</div>
        </div>
        <div style={clearfixStyles}>
          <div style={institutionStyles}>Southwestern University</div>
          <div style={locationStyles}>Georgetown, TX</div>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Set up campus computers and troubleshoot computer problems for students, faculty, and staff.</li>
          <li style={listItemStyles}>Maintained computers, classroom equipment, and printers across campus.</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={clearfixStyles}>
          <div style={jobTitleStyles}>Artificial Intelligence Research Assistant</div>
          <div style={dateStyles}>May 2019 - July 2019</div>
        </div>
        <div style={clearfixStyles}>
          <div style={institutionStyles}>Southwestern University</div>
          <div style={locationStyles}>Georgetown, TX</div>
        </div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Developed a genetic algorithm to produce procedural dungeons.</li>
          <li style={listItemStyles}>Presented virtually to the World Conference on Computational Intelligence.</li>
        </ul>
      </div>

      {/* Projects */}
      <div style={sectionTitleStyles}>Projects</div>
      <div style={entryStyles}>
        <div style={projectHeaderStyles}>
          <div style={jobTitleStyles}>GitViz</div>
          <div style={dateStyles}>June 2020 - Present</div>
        </div>
        <div style={degreeStyles}>Python, Flask, React, PostgreSQL, Docker</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Developed a full-stack web application with Flask serving a REST API with React as the frontend.</li>
          <li style={listItemStyles}>Implemented GitHub OAuth to pull data and visualize collaboration.</li>
          <li style={listItemStyles}>Used Flask and Redis for asynchronous tasks.</li>
        </ul>
      </div>

      <div style={entryStyles}>
        <div style={projectHeaderStyles}>
          <div style={jobTitleStyles}>Simple Paintball</div>
          <div style={dateStyles}>May 2018 - May 2020</div>
        </div>
        <div style={degreeStyles}>Spigot API, Java, Maven, Git</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Developed a Minecraft plugin; published with 25+ downloads and a 4.5/5-star review.</li>
          <li style={listItemStyles}>Implemented continuous delivery using Travis-CI.</li>
        </ul>
      </div>

      {/* Technical Skills */}
      <div style={sectionTitleStyles}>Technical Skills</div>
      <div style={skillsSectionStyles}>
        <div style={skillsItemStyles}><span style={skillsLabelStyles}>Languages:</span> Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R</div>
        <div style={skillsItemStyles}><span style={skillsLabelStyles}>Frameworks:</span> React, Node.js, Flask, Material UI</div>
        <div style={skillsItemStyles}><span style={skillsLabelStyles}>Developer Tools:</span> Git, Docker, Google Cloud Platform, VS Code</div>
        <div style={skillsItemStyles}><span style={skillsLabelStyles}>Libraries:</span> pandas, NumPy, Matplotlib</div>
      </div>
    </div>
  );
};

export default JakeTemplate;