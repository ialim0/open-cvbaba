import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

interface FAANGTemplate1Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const FAANGTemplate1: React.FC<FAANGTemplate1Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 8 : 12;
  const basePadding = compact ? 4 : 24; // 0.5in = 24px
  const baseMargin = compact ? 2 : 15;
  
  const scaledStyles = {
    width: `${(8.5 * 96) * scale}px`, // 8.5in = 816px
    margin: '0 auto',
    padding: `${basePadding * scale}px`,
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.3,
    fontFamily: "'Times New Roman', Times, serif",
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 24) * scale}px`,
    fontWeight: 'normal',
    textTransform: 'uppercase' as const,
    letterSpacing: `${(compact ? 1 : 3) * scale}px`,
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
  };

  const contactInfoStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: `${(compact ? 5 : 10) * scale}px`,
    gap: `${(compact ? 2 : 10) * scale}px`,
    flexWrap: 'wrap' as const,
  };

  const contactIconStyles = {
    marginRight: `${(compact ? 1 : 2) * scale}px`,
  };

  const contactLinkStyles = {
    textDecoration: 'none',
    color: 'black',
  };

  const sectionTitleStyles = {
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    margin: `${(compact ? 3 : 15) * scale}px 0 ${(compact ? 1 : 5) * scale}px 0`,
    fontSize: `${(compact ? 7 : 14) * scale}px`,
  };

  const sectionStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const itemStyles = {
    marginBottom: `${(compact ? 1.5 : 8) * scale}px`,
  };

  const itemHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  };

  const itemTitleStyles = {
    fontStyle: 'italic',
  };

  const itemContentStyles = {
    marginLeft: `${(compact ? 4 : 20) * scale}px`,
  };

  const itemContentListStyles = {
    listStyleType: 'none',
  };

  const itemContentListItemStyles = {
    marginBottom: `${(compact ? 0.5 : 2) * scale}px`,
    position: 'relative' as const,
    paddingLeft: `${(compact ? 2 : 10) * scale}px`,
  };

  const itemContentListItemBeforeStyles = {
    content: '"•"',
    position: 'absolute' as const,
    left: 0,
  };

  const courseworkGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: `${(compact ? 1 : 5) * scale}px`,
  };

  const skillsListStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: `${(compact ? 1 : 3) * scale}px`,
  };

  const skillsRowStyles = {
    display: 'flex',
  };

  const skillsCategoryStyles = {
    fontWeight: 'bold',
    minWidth: `${(compact ? 30 : 150) * scale}px`,
  };

  // Compact version for small previews
  if (compact) {
    return (
      <div
        className={`bg-white text-black font-serif ${className}`}
        style={scaledStyles}
      >
        {/* Header */}
        <div style={headerStyles}>
          <h1 style={nameStyles}>Alex Chen</h1>
          <div style={contactInfoStyles}>
            <span>123 Street Name, Town, State 12345</span>
            <span>|</span>
            <span><FontAwesomeIcon icon={faPhone} style={contactIconStyles} className="text-black" /> (123) 456-7890</span>
            <span>|</span>
            <span><FontAwesomeIcon icon={faEnvelope} style={contactIconStyles} className="text-black" /> <a href="mailto:alex.chen@email.com" style={contactLinkStyles}>alex.chen@email.com</a></span>
            <span>|</span>
            <span><FontAwesomeIcon icon={faLinkedin} style={contactIconStyles} className="text-black" /> <a href="https://linkedin.com/in/alexchen" style={contactLinkStyles}>linkedin.com/in/alexchen</a></span>
            <span>|</span>
            <span><FontAwesomeIcon icon={faGithub} style={contactIconStyles} className="text-black" /> <a href="https://github.com/alexchen" style={contactLinkStyles}>github.com/alexchen</a></span>
          </div>
        </div>

        {/* Education */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Education</div>
          <div style={itemStyles}>
            <div style={itemHeaderStyles}>
              <span>Stanford University</span>
              <span>Sep. 2017 - May 2021</span>
            </div>
            <div style={itemTitleStyles}>Bachelor of Science in Computer Science</div>
          </div>
        </div>

        {/* Relevant Coursework */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Relevant Coursework</div>
          <div style={courseworkGridStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Data Structures</li>
              <li style={itemContentListItemStyles}>Operating Systems</li>
            </ul>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Algorithms Analysis</li>
              <li style={itemContentListItemStyles}>Database Management</li>
            </ul>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Artificial Intelligence</li>
              <li style={itemContentListItemStyles}>Computer Technology</li>
            </ul>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Systems Programming</li>
              <li style={itemContentListItemStyles}>Software Engineering</li>
            </ul>
          </div>
        </div>

        {/* Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Experience</div>
          <div style={itemStyles}>
            <div style={itemHeaderStyles}>
              <span>Google</span>
              <span>May 2020 - August 2020</span>
            </div>
            <div style={itemTitleStyles}>Software Engineering Intern</div>
            <div style={itemContentStyles}>
              <ul style={itemContentListStyles}>
                <li style={itemContentListItemStyles}>Developed automated testing service using Python and bash scripts</li>
                <li style={itemContentListItemStyles}>Implemented daily testing program for hardware validation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Projects</div>
          <div style={itemStyles}>
            <div style={itemHeaderStyles}>
              <span>Gym Reservation Web Application</span>
              <span>September 2020 - January 2021</span>
            </div>
            <div style={itemContentStyles}>
              <ul style={itemContentListStyles}>
                <li style={itemContentListItemStyles}>Developed automated bot using Python and Google Cloud Console</li>
                <li style={itemContentListItemStyles}>Implemented MERN stack web platform</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Technical Skills</div>
          <div style={skillsListStyles}>
            <div style={skillsRowStyles}>
              <div style={skillsCategoryStyles}>Languages:</div>
              <div>Python, Java, C, HTML/CSS, JavaScript, SQL</div>
            </div>
            <div style={skillsRowStyles}>
              <div style={skillsCategoryStyles}>Technologies/Frameworks:</div>
              <div>React, Flutter, Node.js, Android Studio</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for detailed preview
  return (
    <div
      className={`bg-white text-black font-serif ${className}`}
      style={scaledStyles}
    >
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={nameStyles}>Alex Chen</h1>
        <div style={contactInfoStyles}>
          <span>123 Street Name, Town, State 12345</span>
          <span>|</span>
          <span><FontAwesomeIcon icon={faPhone} style={contactIconStyles} className="text-black" /> (123) 456-7890</span>
          <span>|</span>
          <span><FontAwesomeIcon icon={faEnvelope} style={contactIconStyles} className="text-black" /> <a href="mailto:alex.chen@email.com" style={contactLinkStyles}>alex.chen@email.com</a></span>
          <span>|</span>
          <span><FontAwesomeIcon icon={faLinkedin} style={contactIconStyles} className="text-black" /> <a href="https://linkedin.com/in/alexchen" style={contactLinkStyles}>linkedin.com/in/alexchen</a></span>
          <span>|</span>
          <span><FontAwesomeIcon icon={faGithub} style={contactIconStyles} className="text-black" /> <a href="https://github.com/alexchen" style={contactLinkStyles}>github.com/alexchen</a></span>
        </div>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Education</div>
        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Stanford University</span>
            <span>Sep. 2017 - May 2021</span>
          </div>
          <div style={itemTitleStyles}>Bachelor of Science in Computer Science</div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>GPA: 3.85/4.00 | Dean's List (6 semesters)</li>
              <li style={itemContentListItemStyles}>Relevant Coursework: Data Structures, Algorithms, Operating Systems, Database Systems, Machine Learning, Computer Networks</li>
              <li style={itemContentListItemStyles}>Activities: Computer Science Student Association, Hackathon Team Lead, Peer Tutor for CS 106A</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Relevant Coursework */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Relevant Coursework</div>
        <div style={courseworkGridStyles}>
          <ul style={itemContentListStyles}>
            <li style={itemContentListItemStyles}>Data Structures & Algorithms</li>
            <li style={itemContentListItemStyles}>Operating Systems</li>
            <li style={itemContentListItemStyles}>Computer Networks</li>
            <li style={itemContentListItemStyles}>Machine Learning</li>
          </ul>
          <ul style={itemContentListStyles}>
            <li style={itemContentListItemStyles}>Database Systems</li>
            <li style={itemContentListItemStyles}>Software Engineering</li>
            <li style={itemContentListItemStyles}>Computer Security</li>
            <li style={itemContentListItemStyles}>Distributed Systems</li>
          </ul>
          <ul style={itemContentListStyles}>
            <li style={itemContentListItemStyles}>Artificial Intelligence</li>
            <li style={itemContentListItemStyles}>Computer Graphics</li>
            <li style={itemContentListItemStyles}>Human-Computer Interaction</li>
            <li style={itemContentListItemStyles}>Compiler Design</li>
          </ul>
          <ul style={itemContentListStyles}>
            <li style={itemContentListItemStyles}>Systems Programming</li>
            <li style={itemContentListItemStyles}>Mobile App Development</li>
            <li style={itemContentListItemStyles}>Web Development</li>
            <li style={itemContentListItemStyles}>Cloud Computing</li>
          </ul>
        </div>
      </div>

      {/* Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Experience</div>
        
        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Google</span>
            <span>May 2020 - August 2020</span>
          </div>
          <div style={itemTitleStyles}>Software Engineering Intern</div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Developed a service to automatically perform a set of unit tests daily on a product in development in order to decrease debugging time and identify errors</li>
              <li style={itemContentListItemStyles}>Implemented a daily testing program which utilizes Python and a bash file to locate a file on an expected filepath and test the latest build code onto the hardware, so that daily testing can be performed</li>
              <li style={itemContentListItemStyles}>Created a repository accessible by all developers on the team to automate the entire process of testing the latest build, executing test cases, validating the latest build, and sending daily results per API</li>
              <li style={itemContentListItemStyles}>Used the team's version control and send a daily report of test results to team members using HTML, Javascript, and CSS</li>
              <li style={itemContentListItemStyles}>Reduced debugging time by 40% and improved code quality by implementing automated testing pipeline</li>
              <li style={itemContentListItemStyles}>Collaborated with 5+ engineers across different teams to integrate testing service with existing infrastructure</li>
            </ul>
          </div>
        </div>
        
        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Microsoft</span>
            <span>January 2019 - May 2019</span>
          </div>
          <div style={itemTitleStyles}>Software Engineering Intern</div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Assisted in development of the front end of a mobile application for iOS/Android using Dart and the Flutter Framework</li>
              <li style={itemContentListItemStyles}>Worked with frontend developer and designer to test weekly iterations of development building with other interns</li>
              <li style={itemContentListItemStyles}>Implemented a responsive design with designers to ensure app performed and appeared consistently across iOS and Android</li>
              <li style={itemContentListItemStyles}>Utilized Android Studio as a development environment in order to visualize the application in both iOS and Android</li>
              <li style={itemContentListItemStyles}>Developed 3+ key features for the mobile application, improving user engagement by 25%</li>
              <li style={itemContentListItemStyles}>Participated in code reviews and agile development processes with team of 8 developers</li>
            </ul>
          </div>
        </div>

        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Amazon</span>
            <span>June 2018 - August 2018</span>
          </div>
          <div style={itemTitleStyles}>Software Development Intern</div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Developed backend services using Java and Spring Boot to handle customer data processing</li>
              <li style={itemContentListItemStyles}>Implemented RESTful APIs and microservices architecture for scalable web applications</li>
              <li style={itemContentListItemStyles}>Worked with AWS services including S3, Lambda, and DynamoDB for cloud-based solutions</li>
              <li style={itemContentListItemStyles}>Participated in daily standups and sprint planning with cross-functional team of 12 members</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Projects</div>
        
        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Gym Reservation Web Application</span>
            <span>September 2020 - January 2021</span>
          </div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Developed an automated bot using Python and Google Cloud Console to register yourself for a channel at my school gym</li>
              <li style={itemContentListItemStyles}>Implemented functions to extract users' credentials and match them with the current day booking slots</li>
              <li style={itemContentListItemStyles}>Deployed a web-based platform using MERN stack such that the program is able to run everyday from a server instead</li>
              <li style={itemContentListItemStyles}>Used Cron to schedule the program to execute automatically so that I am always securing a reservation I made for me</li>
              <li style={itemContentListItemStyles}>Built responsive React frontend with real-time booking status updates and user authentication</li>
              <li style={itemContentListItemStyles}>Integrated MongoDB for data persistence and Express.js for API endpoints</li>
            </ul>
          </div>
        </div>
        
        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Price Calculator for Gym, Local, Enterprises</span>
            <span>September 2019 - December 2019</span>
          </div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Created an Android application using Java and Android Studio to calculate ticket prices for trips to numerous gyms</li>
              <li style={itemContentListItemStyles}>Featured user inputted information as the basis of trip cost and various conditions were based on the ticket source</li>
              <li style={itemContentListItemStyles}>Included factors such as adults, children, seniors, transit line, off-peak and peak hours, weekend vs weekday</li>
              <li style={itemContentListItemStyles}>Implemented complex pricing algorithms with 15+ different pricing rules and conditions</li>
              <li style={itemContentListItemStyles}>Designed intuitive UI/UX with Material Design principles and offline functionality</li>
            </ul>
          </div>
        </div>
        
        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Transaction Management GUI (Java, Eclipse, JavaFX)</span>
            <span>October 2019</span>
          </div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Designed a coupled banking/transaction system using Java to model the common functions of using a bank account</li>
              <li style={itemContentListItemStyles}>Created subclasses and implemented methods to represent different accounts, deposits, withdrawals, and transfers</li>
              <li style={itemContentListItemStyles}>Implemented object-oriented programming practices such as inheritance to model different account types and databases</li>
              <li style={itemContentListItemStyles}>Built comprehensive GUI with JavaFX featuring account management, transaction history, and reporting features</li>
              <li style={itemContentListItemStyles}>Implemented secure authentication system with password encryption and session management</li>
            </ul>
          </div>
        </div>

        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Machine Learning Stock Predictor</span>
            <span>February 2020 - May 2020</span>
          </div>
          <div style={itemContentStyles}>
            <ul style={itemContentListItemStyles}>
              <li style={itemContentListItemStyles}>Developed a machine learning model using Python, scikit-learn, and TensorFlow to predict stock prices</li>
              <li style={itemContentListItemStyles}>Implemented LSTM neural networks and random forest algorithms for time series analysis</li>
              <li style={itemContentListItemStyles}>Achieved 78% accuracy in predicting stock price movements using historical data and technical indicators</li>
              <li style={itemContentListItemStyles}>Created web dashboard using Flask and D3.js for data visualization and model performance metrics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Skills */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Technical Skills</div>
        <div style={skillsListStyles}>
          <div style={skillsRowStyles}>
            <div style={skillsCategoryStyles}>Languages:</div>
            <div>Python, Java, C++, JavaScript, TypeScript, SQL, HTML/CSS, Dart, Go, Rust</div>
          </div>
          <div style={skillsRowStyles}>
            <div style={skillsCategoryStyles}>Technologies/Frameworks:</div>
            <div>React, Angular, Vue.js, Node.js, Express.js, Spring Boot, Flutter, Android Studio, Django, Flask</div>
          </div>
          <div style={skillsRowStyles}>
            <div style={skillsCategoryStyles}>Cloud & Databases:</div>
            <div>AWS, Google Cloud Platform, Azure, MongoDB, PostgreSQL, MySQL, Redis, Docker, Kubernetes</div>
          </div>
          <div style={skillsRowStyles}>
            <div style={skillsCategoryStyles}>Developer/Professional Tools:</div>
            <div>Git, GitHub, GitLab, Linux, JetBrains IDEs, VS Code, Figma, Jira, Confluence, Jenkins, CI/CD</div>
          </div>
          <div style={skillsRowStyles}>
            <div style={skillsCategoryStyles}>Machine Learning:</div>
            <div>TensorFlow, PyTorch, scikit-learn, pandas, numpy, matplotlib, Jupyter Notebooks</div>
          </div>
        </div>
      </div>

      {/* Leadership / Extracurricular */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Leadership / Extracurricular</div>
        
        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Computer Science Student Association</span>
            <span>Spring 2020 - Present</span>
          </div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Achieved a 4 star fraternity ranking by the Office of Fraternity and Sorority Affairs (highest possible ranking)</li>
              <li style={itemContentListItemStyles}>Managed executive board of 5 members who weekly organize to ensure successful event planning as part of the chapter</li>
              <li style={itemContentListItemStyles}>Led chapter of 80+ members to work towards goals that improve and promote community service, academics, and unity</li>
              <li style={itemContentListItemStyles}>Organized 15+ technical workshops and hackathons, attracting 200+ participants from across the university</li>
              <li style={itemContentListItemStyles}>Established mentorship program connecting 50+ underclassmen with industry professionals</li>
            </ul>
          </div>
        </div>

        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Hackathon Team Lead</span>
            <span>Fall 2019 - Spring 2021</span>
          </div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Led team of 4 developers in 8+ hackathons, winning 3 first-place prizes and 2 second-place prizes</li>
              <li style={itemContentListItemStyles}>Developed innovative solutions using cutting-edge technologies including AI, blockchain, and IoT</li>
              <li style={itemContentListItemStyles}>Mentored 20+ junior developers in rapid prototyping and presentation skills</li>
            </ul>
          </div>
        </div>

        <div style={itemStyles}>
          <div style={itemHeaderStyles}>
            <span>Peer Tutor - CS 106A Programming Methodology</span>
            <span>Fall 2019 - Spring 2021</span>
          </div>
          <div style={itemContentStyles}>
            <ul style={itemContentListStyles}>
              <li style={itemContentListItemStyles}>Tutored 30+ students in introductory programming concepts using Java and Python</li>
              <li style={itemContentListItemStyles}>Conducted weekly office hours and review sessions, improving student performance by 25%</li>
              <li style={itemContentListItemStyles}>Developed supplementary learning materials and practice problems for course curriculum</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAANGTemplate1;