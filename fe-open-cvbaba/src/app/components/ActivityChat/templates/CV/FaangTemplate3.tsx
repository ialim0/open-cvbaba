import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface FAANGTemplate3Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FAANGTemplate3: React.FC<FAANGTemplate3Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 12;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: `${800 * scale}px`,
    margin: '0 auto',
    padding: `${basePadding * scale}px`,
    lineHeight: 1.6,
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 24) * scale}px`,
    fontWeight: 'bold',
    marginBottom: `${(compact ? 2 : 5) * scale}px`,
  };

  const contactInfoStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const contactLinkStyles = {
    color: '#000',
    textDecoration: 'none',
  };

  const sectionStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const sectionTitleStyles = {
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const jobTitleStyles = {
    fontWeight: 'bold',
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const dateStyles = {
    float: 'right' as const,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const companyStyles = {
    fontSize: `${(compact ? 6 : 12) * scale}px`,
    fontStyle: 'italic',
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const listStyles = {
    marginTop: `${(compact ? 1 : 5) * scale}px`,
    paddingLeft: `${(compact ? 4 : 20) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const skillsListStyles = {
    margin: `${(compact ? 1 : 5) * scale}px 0`,
    fontSize: `${(compact ? 6 : 12) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 3 : 8) * scale}px`,
  };

  const detailsStyles = {
    fontSize: `${(compact ? 6 : 12) * scale}px`,
    marginTop: `${(compact ? 1 : 3) * scale}px`,
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div
        className={`bg-white text-black font-sans ${className}`}
        style={scaledStyles}
      >
        <div style={headerStyles}>
          <h1 style={nameStyles}>John Doe</h1>
        </div>

        <div style={contactInfoStyles}>
          <p>
            <FontAwesomeIcon icon={faEnvelope} className="text-black" /> <a href="mailto:johndoe@example.com" style={contactLinkStyles}>johndoe@example.com</a> | <FontAwesomeIcon icon={faPhone} className="text-black" /> XXX-XXX-XXXX<br />
            <FontAwesomeIcon icon={faGithub} className="text-black" /> <a href="https://github.com/johndoe" target="_blank" style={contactLinkStyles}>github.com/johndoe</a> | <FontAwesomeIcon icon={faLinkedin} className="text-black" /> <a href="https://linkedin.com/in/johndoe" target="_blank" style={contactLinkStyles}>linkedin.com/in/johndoe</a>
          </p>
        </div>

        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Skills</div>
          <div style={skillsListStyles}>
            <strong>Languages:</strong> C/C++, Java, Python, JavaScript, SQL<br />
            <strong>Technologies & Tools:</strong> AWS, Docker, Kubernetes, Spark, Hive, Elasticsearch, Spring Boot, Redis
          </div>
        </div>

        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Work Experience</div>
          <div style={entryStyles}>
            <div style={jobTitleStyles}>Lead Software Engineer</div>
            <div style={dateStyles}>Mar 2021 - Present</div>
            <div style={companyStyles}>TechCorp Solutions</div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Designed and implemented scalable cloud-based solutions, reducing system downtime by 30%.</li>
              <li style={listItemStyles}>Optimized database queries, leading to a 40% performance boost in core applications.</li>
            </ul>
          </div>
        </div>

        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Education</div>
          <div style={entryStyles}>
            <div style={jobTitleStyles}>B.S. in Computer Science</div>
            <div style={dateStyles}>Aug 2013 - Jun 2017</div>
            <div style={companyStyles}>Tech University</div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for detailed preview
  return (
    <div
      className={`bg-white text-black font-sans ${className}`}
      style={scaledStyles}
    >
      <div style={headerStyles}>
        <h1 style={nameStyles}>John Doe</h1>
      </div>

      <div style={contactInfoStyles}>
        <p>
          <FontAwesomeIcon icon={faEnvelope} className="text-black" /> <a href="mailto:johndoe@example.com" style={contactLinkStyles}>johndoe@example.com</a> | <FontAwesomeIcon icon={faPhone} className="text-black" /> XXX-XXX-XXXX<br />
          <FontAwesomeIcon icon={faGithub} className="text-black" /> <a href="https://github.com/johndoe" target="_blank" style={contactLinkStyles}>github.com/johndoe</a> | <FontAwesomeIcon icon={faLinkedin} className="text-black" /> <a href="https://linkedin.com/in/johndoe" target="_blank" style={contactLinkStyles}>linkedin.com/in/johndoe</a>
        </p>
      </div>

      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Skills</div>
        <div style={skillsListStyles}>
          <strong>Languages:</strong> C/C++, Java, Python, JavaScript, TypeScript, SQL, Go, Rust<br />
          <strong>Technologies & Tools:</strong> AWS, Docker, Kubernetes, Spark, Hive, Elasticsearch, Spring Boot, Redis, Kafka, MongoDB, PostgreSQL<br />
          <strong>Frameworks:</strong> React, Angular, Vue.js, Node.js, Express.js, Django, Flask, Spring Boot<br />
          <strong>Cloud Platforms:</strong> AWS (EC2, S3, Lambda, RDS, ECS), Google Cloud Platform, Azure<br />
          <strong>DevOps:</strong> Jenkins, GitLab CI/CD, Terraform, Ansible, Prometheus, Grafana
        </div>
      </div>

      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Work Experience</div>
        <div style={entryStyles}>
          <div style={jobTitleStyles}>Lead Software Engineer</div>
          <div style={dateStyles}>Mar 2021 - Present</div>
          <div style={companyStyles}>TechCorp Solutions</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Designed and implemented scalable cloud-based solutions, reducing system downtime by 30%.</li>
            <li style={listItemStyles}>Optimized database queries, leading to a 40% performance boost in core applications.</li>
            <li style={listItemStyles}>Led a cross-functional team to deliver projects on time, achieving 95% client satisfaction.</li>
            <li style={listItemStyles}>Technologies: AWS, Docker, Kubernetes, PostgreSQL, Python</li>
            <li style={listItemStyles}>Mentored 5 junior developers and established coding standards and best practices</li>
            <li style={listItemStyles}>Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={jobTitleStyles}>Software Developer</div>
          <div style={dateStyles}>Sept 2019 - Mar 2021</div>
          <div style={companyStyles}>Innovatech Inc.</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed automation scripts that saved 20+ hours per week for the QA team.</li>
            <li style={listItemStyles}>Created a custom API for internal tools, streamlining data exchange across systems.</li>
            <li style={listItemStyles}>Technologies: Java, Spring Boot, TypeScript, MySQL</li>
            <li style={listItemStyles}>Built microservices architecture handling 1M+ requests daily</li>
            <li style={listItemStyles}>Improved system performance by 25% through code optimization and caching</li>
          </ul>
        </div>

        <div style={entryStyles}>
          <div style={jobTitleStyles}>Junior Developer</div>
          <div style={dateStyles}>Aug 2017 - Aug 2019</div>
          <div style={companyStyles}>NextGen Technologies</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Built a data visualization tool using React and D3.js, improving decision-making processes.</li>
            <li style={listItemStyles}>Collaborated on a project to migrate legacy systems to a microservices architecture.</li>
            <li style={listItemStyles}>Technologies: Python, React, Redux, Kafka</li>
            <li style={listItemStyles}>Developed RESTful APIs serving 100K+ users with 99.9% uptime</li>
            <li style={listItemStyles}>Participated in agile development processes and code reviews</li>
          </ul>
        </div>
      </div>

      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Education</div>
        <div style={entryStyles}>
          <div style={jobTitleStyles}>B.S. in Computer Science</div>
          <div style={dateStyles}>Aug 2013 - Jun 2017</div>
          <div style={companyStyles}>Tech University</div>
          <div style={detailsStyles}>
            <strong>Relevant Coursework:</strong> Data Structures, Algorithms, Machine Learning, Database Systems, Computer Networks, Operating Systems, Software Engineering
          </div>
          <div style={detailsStyles}>
            <strong>GPA:</strong> 3.8/4.0 | <strong>Honors:</strong> Magna Cum Laude, Dean's List (6 semesters)
          </div>
        </div>
      </div>

      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Personal Projects</div>
        <ul style={listStyles}>
          <li style={listItemStyles}><strong>Task Manager App:</strong> Built a full-stack application for managing daily tasks using React and Node.js. Features include real-time collaboration, task prioritization, and progress tracking. Deployed on AWS with 1000+ active users.</li>
          <li style={listItemStyles}><strong>Traffic Optimizer:</strong> Developed a simulation to optimize traffic flow using Dijkstra's algorithm and C++. Reduced average commute time by 15% in simulated scenarios.</li>
          <li style={listItemStyles}><strong>Data Clustering Tool:</strong> Applied KMeans clustering to group datasets for market analysis. Built with Python and scikit-learn, processing 1M+ data points.</li>
          <li style={listItemStyles}><strong>Blockchain Voting System:</strong> Created a secure voting platform using Ethereum smart contracts and React frontend. Implemented cryptographic verification and transparency features.</li>
          <li style={listItemStyles}><strong>Machine Learning Model:</strong> Developed a recommendation system using collaborative filtering and matrix factorization. Achieved 85% accuracy on test dataset.</li>
        </ul>
      </div>

      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Certifications</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>AWS Certified Solutions Architect - Professional (2023)</li>
          <li style={listItemStyles}>Google Cloud Professional Data Engineer (2022)</li>
          <li style={listItemStyles}>Certified Kubernetes Administrator (CKA) (2022)</li>
          <li style={listItemStyles}>Oracle Certified Professional Java SE Developer (2021)</li>
        </ul>
      </div>

      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Awards & Recognition</div>
        <ul style={listStyles}>
          <li style={listItemStyles}>Employee of the Year - TechCorp Solutions (2023)</li>
          <li style={listItemStyles}>Best Innovation Award - Innovatech Inc. (2020)</li>
          <li style={listItemStyles}>Hackathon Winner - TechCrunch Disrupt (2019)</li>
          <li style={listItemStyles}>Dean's List - Tech University (2015-2017)</li>
        </ul>
      </div>
    </div>
  );
};

export default FAANGTemplate3;