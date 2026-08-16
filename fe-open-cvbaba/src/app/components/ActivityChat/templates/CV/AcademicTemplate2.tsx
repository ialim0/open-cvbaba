import React from 'react';

interface AcademicTemplate2Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const AcademicTemplate2: React.FC<AcademicTemplate2Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 10 : 15;
  const basePadding = compact ? 4 : 30;
  const baseMargin = compact ? 2 : 20;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: 'Georgia, serif',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    marginBottom: `${(compact ? 4 : 20) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 22) * scale}px`,
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    borderBottom: '2px double #000',
    paddingBottom: `${(compact ? 1 : 5) * scale}px`,
    fontWeight: 'bold',
  };

  const contactGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: `${(compact ? 2 : 8) * scale}px`,
    marginTop: `${(compact ? 2 : 10) * scale}px`,
  };

  const sectionStyles = {
    margin: `${(compact ? 4 : 20) * scale}px 0`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 9 : 16) * scale}px`,
    fontWeight: 'bold',
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
    display: 'flex',
    alignItems: 'center',
  };

  const sectionTitleAfterStyles = {
    content: '""',
    flexGrow: 1,
    height: '1px',
    backgroundColor: '#000',
    marginLeft: `${(compact ? 2 : 10) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
    paddingLeft: `${(compact ? 3 : 15) * scale}px`,
  };

  const entryHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const entryTitleStyles = {
    fontWeight: 'bold',
    fontSize: `${(compact ? 8 : 14) * scale}px`,
  };

  const entryInstitutionStyles = {
    fontStyle: 'italic',
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const publicationStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    paddingLeft: `${(compact ? 8 : 20) * scale}px`,
    textIndent: `${-(compact ? 8 : 20) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const courseStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const serviceItemStyles = {
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const listStyles = {
    marginLeft: `${(compact ? 3 : 15) * scale}px`,
    marginTop: `${(compact ? 1 : 6) * scale}px`,
  };

  const listItemStyles = {
    marginBottom: `${(compact ? 1 : 3) * scale}px`,
    display: 'list-item',
    fontSize: `${(compact ? 7 : 13) * scale}px`,
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
          <div style={nameStyles}>Professor Robert M. Wilson, Ph.D.</div>
          <div style={contactGridStyles}>
            <div>
              Department of History<br />
              University of Example<br />
              456 Scholar Hall
            </div>
            <div>
              wilson@example.edu<br />
              Tel: (617) 555-5678<br />
              Website: wilson.example.edu
            </div>
          </div>
        </div>

        {/* Education and Training */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Education and Training
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Ph.D. in Modern European History</span>
              <span>2005-2010</span>
            </div>
            <div style={entryInstitutionStyles}>Harvard University</div>
            <div>Dissertation: "The Social Impact of Industrialization in Victorian England"</div>
          </div>

          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>M.A. in History</span>
              <span>2003-2005</span>
            </div>
            <div style={entryInstitutionStyles}>Oxford University</div>
          </div>
        </div>

        {/* Books and Monographs */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Books and Monographs
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={publicationStyles}>
            Wilson, R.M. (2022). Victorian Industry and Social Change. Cambridge University Press.
          </div>
          <div style={publicationStyles}>
            Wilson, R.M. (2018). The Industrial Revolution Reconsidered. Oxford University Press.
          </div>
        </div>

        {/* Peer-Reviewed Articles */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Peer-Reviewed Articles
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={publicationStyles}>
            Wilson, R.M. (2023). "Social Mobility in Victorian Manchester." Journal of British Studies, 62(2), 234-256.
          </div>
          <div style={publicationStyles}>
            Wilson, R.M., & Smith, J. (2022). "Industrial Workers and Urban Culture." Victorian Studies, 65(1), 78-95.
          </div>
        </div>

        {/* Teaching Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Teaching Experience
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={courseStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Victorian Britain (HIST 301)</span>
              <span>2015-Present</span>
            </div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Upper-level undergraduate seminar focusing on social and economic history</li>
            </ul>
          </div>
        </div>

        {/* Research Grants and Fellowships */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Research Grants and Fellowships
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>National Endowment for the Humanities Fellowship</span>
              <span>2021-2022</span>
            </div>
            <div>"Industrial Cities and Social Reform in Victorian England"</div>
          </div>
        </div>

        {/* Professional Service */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Professional Service
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={serviceItemStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Editor, Journal of Victorian Studies</span>
              <span>2019-Present</span>
            </div>
          </div>
          <div style={serviceItemStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Chair, Department History Graduate Committee</span>
              <span>2018-2021</span>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>
            Languages
            <div style={sectionTitleAfterStyles}></div>
          </div>
          <div style={entryStyles}>
            French (Fluent), German (Research Proficiency)
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
        <div style={nameStyles}>Professor Robert M. Wilson, Ph.D.</div>
        <div style={contactGridStyles}>
          <div>
            Department of History<br />
            University of Example<br />
            456 Scholar Hall<br />
            Cambridge, MA 02138
          </div>
          <div>
            wilson@example.edu<br />
            Tel: (617) 555-5678<br />
            Website: wilson.example.edu<br />
            ORCID: 0000-0003-1234-5678
          </div>
        </div>
      </div>

      {/* Education and Training */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Education and Training
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Ph.D. in Modern European History</span>
            <span>2005-2010</span>
          </div>
          <div style={entryInstitutionStyles}>Harvard University, Cambridge, MA</div>
          <div>Dissertation: "The Social Impact of Industrialization in Victorian England"</div>
          <div>Advisor: Professor Margaret Thompson, Distinguished Professor of History</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>M.A. in History</span>
            <span>2003-2005</span>
          </div>
          <div style={entryInstitutionStyles}>Oxford University, Oxford, UK</div>
          <div>Distinction in Modern British History</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>B.A. in History, Magna Cum Laude</span>
            <span>1999-2003</span>
          </div>
          <div style={entryInstitutionStyles}>Yale University, New Haven, CT</div>
          <div>Phi Beta Kappa; Senior Thesis Prize</div>
        </div>
      </div>

      {/* Academic Appointments */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Academic Appointments
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Professor of History</span>
            <span>2018-Present</span>
          </div>
          <div style={entryInstitutionStyles}>University of Example, Cambridge, MA</div>
          <div>Research focus: Modern European social history and industrialization</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Associate Professor of History</span>
            <span>2012-2018</span>
          </div>
          <div style={entryInstitutionStyles}>University of Example, Cambridge, MA</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Assistant Professor of History</span>
            <span>2010-2012</span>
          </div>
          <div style={entryInstitutionStyles}>University of Example, Cambridge, MA</div>
        </div>
      </div>

      {/* Research Interests */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Research Interests
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div>Modern European social history, industrialization and urbanization, Victorian Britain, working-class culture, social reform movements, gender and class in industrial society, comparative European history</div>
        </div>
      </div>

      {/* Books and Monographs */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Books and Monographs
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2022). Victorian Industry and Social Change: A Comprehensive Study of Industrialization's Impact on British Society. Cambridge University Press. 320 pages. ISBN: 978-1-107-12345-6
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2018). The Industrial Revolution Reconsidered: New Perspectives on Economic and Social Transformation. Oxford University Press. 280 pages. ISBN: 978-0-19-876543-2
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2015). Working-Class Communities in Victorian Manchester: A Social History. Manchester University Press. 240 pages. ISBN: 978-0-7190-9876-5
        </div>
        <div style={publicationStyles}>
          Wilson, R.M., & Thompson, M. (2013). Industrial Cities and Social Reform: A Comparative Study of Britain and Germany, 1850-1914. Routledge. 300 pages. ISBN: 978-0-415-67890-1
        </div>
      </div>

      {/* Peer-Reviewed Articles */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Peer-Reviewed Articles
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2023). "Social Mobility in Victorian Manchester: A Quantitative Analysis of Working-Class Advancement." Journal of British Studies, 62(2), 234-256. DOI: 10.1017/jbr.2023.45
        </div>
        <div style={publicationStyles}>
          Wilson, R.M., & Smith, J. (2022). "Industrial Workers and Urban Culture: The Formation of Working-Class Identity in Nineteenth-Century Britain." Victorian Studies, 65(1), 78-95. DOI: 10.2979/victorianstudies.65.1.78
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2021). "Gender, Class, and Industrialization: Women Workers in Victorian Textile Mills." Gender & History, 33(3), 567-584. DOI: 10.1111/1468-0424.12567
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2020). "The Social Impact of Railway Construction in Industrial Britain." Economic History Review, 73(4), 1234-1256. DOI: 10.1111/ehr.12987
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2019). "Working-Class Housing and Urban Reform in Victorian England." Urban History, 46(2), 345-367. DOI: 10.1017/S0963926818000456
        </div>
        <div style={publicationStyles}>
          Wilson, R.M., & Brown, A. (2018). "Child Labor and Industrial Development: A Comparative Study of Britain and France." Comparative Studies in Society and History, 60(3), 678-701. DOI: 10.1017/S0010417518000123
        </div>
      </div>

      {/* Book Chapters */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Book Chapters
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2023). "Industrialization and Social Change in Victorian Britain." In M. Thompson (Ed.), The Oxford Handbook of Modern British History (pp. 234-256). Oxford University Press.
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2021). "Working-Class Culture and Identity in Industrial Manchester." In J. Smith & A. Brown (Eds.), Urban Cultures in Nineteenth-Century Europe (pp. 123-145). Routledge.
        </div>
        <div style={publicationStyles}>
          Wilson, R.M. (2019). "Gender and Industrial Work in Victorian Britain." In S. Davis (Ed.), Women and Work in Modern Europe (pp. 89-112). Palgrave Macmillan.
        </div>
      </div>

      {/* Teaching Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Teaching Experience
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={courseStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Victorian Britain (HIST 301)</span>
            <span>2015-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Upper-level undergraduate seminar</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Comprehensive examination of social and economic history of Victorian Britain</li>
            <li style={listItemStyles}>Focus on industrialization, urbanization, and social reform movements</li>
            <li style={listItemStyles}>Average enrollment: 25 students per semester</li>
          </ul>
        </div>

        <div style={courseStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Modern European History (HIST 201)</span>
            <span>2010-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Undergraduate survey course</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Survey of European history from 1789 to present</li>
            <li style={listItemStyles}>Emphasis on social, economic, and cultural developments</li>
            <li style={listItemStyles}>Average enrollment: 120 students per semester</li>
          </ul>
        </div>

        <div style={courseStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Industrialization and Social Change (HIST 501)</span>
            <span>2018-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Graduate seminar</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Advanced study of industrialization and its social consequences</li>
            <li style={listItemStyles}>Comparative approach to European industrialization</li>
            <li style={listItemStyles}>Average enrollment: 12 students per semester</li>
          </ul>
        </div>

        <div style={courseStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Historical Methods and Research (HIST 600)</span>
            <span>2015-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Graduate methods course</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Introduction to historical research methods and historiography</li>
            <li style={listItemStyles}>Focus on social history methodologies and sources</li>
            <li style={listItemStyles}>Average enrollment: 8 students per semester</li>
          </ul>
        </div>
      </div>

      {/* Research Grants and Fellowships */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Research Grants and Fellowships
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>National Endowment for the Humanities Fellowship</span>
            <span>2021-2022</span>
          </div>
          <div>"Industrial Cities and Social Reform in Victorian England" - $50,000</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>American Council of Learned Societies Fellowship</span>
            <span>2019-2020</span>
          </div>
          <div>"Working-Class Culture and Identity in Industrial Britain" - $45,000</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Fulbright Scholar Award</span>
            <span>2017-2018</span>
          </div>
          <div>Research in British archives and libraries - $25,000</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>University of Example Faculty Research Grant</span>
            <span>2020-2021</span>
          </div>
          <div>"Gender and Industrial Work in Victorian Britain" - $15,000</div>
        </div>
      </div>

      {/* Professional Service */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Professional Service
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={serviceItemStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Editor, Journal of Victorian Studies</span>
            <span>2019-Present</span>
          </div>
          <div>Leading peer-reviewed journal in Victorian studies</div>
        </div>
        <div style={serviceItemStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Chair, Department History Graduate Committee</span>
            <span>2018-2021</span>
          </div>
          <div>Oversaw graduate program development and student affairs</div>
        </div>
        <div style={serviceItemStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Member, Editorial Board, Social History</span>
            <span>2016-Present</span>
          </div>
          <div>International journal of social history</div>
        </div>
        <div style={serviceItemStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Program Chair, North American Conference on British Studies</span>
            <span>2022</span>
          </div>
          <div>Organized annual conference with 500+ participants</div>
        </div>
        <div style={serviceItemStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Grant Reviewer, National Endowment for the Humanities</span>
            <span>2018-Present</span>
          </div>
          <div>Review fellowship and research grant applications</div>
        </div>
      </div>

      {/* Invited Talks and Presentations */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Invited Talks and Presentations
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Industrialization and Social Change in Victorian Britain"</span>
            <span>2023</span>
          </div>
          <div style={entryInstitutionStyles}>Keynote Address, British History Conference, University of Cambridge</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Working-Class Culture and Identity in Industrial Manchester"</span>
            <span>2022</span>
          </div>
          <div style={entryInstitutionStyles}>Invited Lecture, Manchester University</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Gender and Industrial Work in Victorian Britain"</span>
            <span>2021</span>
          </div>
          <div style={entryInstitutionStyles}>Plenary Address, Women's History Conference, Yale University</div>
        </div>
      </div>

      {/* Awards and Honors */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Awards and Honors
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Outstanding Book Award, North American Conference on British Studies</span>
            <span>2023</span>
          </div>
          <div>For Victorian Industry and Social Change</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Excellence in Teaching Award, University of Example</span>
            <span>2021</span>
          </div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Best Article Award, Journal of British Studies</span>
            <span>2020</span>
          </div>
          <div>For "Social Mobility in Victorian Manchester"</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Young Scholar Award, American Historical Association</span>
            <span>2018</span>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Languages
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div>French (Fluent), German (Research Proficiency), Spanish (Reading Knowledge), Latin (Reading Knowledge)</div>
        </div>
      </div>

      {/* Professional Memberships */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>
          Professional Memberships
          <div style={sectionTitleAfterStyles}></div>
        </div>
        <div style={entryStyles}>
          <div>American Historical Association, North American Conference on British Studies, Social History Society (UK), Victorian Studies Association, Organization of American Historians</div>
        </div>
      </div>
    </div>
  );
};

export default AcademicTemplate2;