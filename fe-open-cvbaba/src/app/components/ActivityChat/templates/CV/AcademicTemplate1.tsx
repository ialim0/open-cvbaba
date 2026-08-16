import React from 'react';

interface AcademicTemplate1Props {
  scale?: number;
  className?: string;
  compact?: boolean;
  isModal?: boolean;
}

const AcademicTemplate1: React.FC<AcademicTemplate1Props> = ({ scale = 1, className = '', compact = false, isModal = false }) => {
  // Design exact du HTML avec amélioration de visibilité
  const baseFontSize = compact ? 10 : 14;
  const basePadding = compact ? 4 : 20;
  const baseMargin = compact ? 2 : 15;
  
  const scaledStyles = {
    fontSize: `${baseFontSize * scale}px`,
    lineHeight: 1.4,
    color: '#000',
    width: '100%',
    height: isModal ? 'auto' : '100%',
    overflow: isModal ? 'visible' : 'hidden',
    padding: `${basePadding * scale}px`,
    fontFamily: 'Times New Roman, serif',
    minHeight: isModal ? 'auto' : '100vh',
  };

  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: `${(compact ? 3 : 15) * scale}px`,
    borderBottom: '1px solid #000',
    paddingBottom: `${(compact ? 2 : 10) * scale}px`,
  };

  const nameStyles = {
    fontSize: `${(compact ? 12 : 20) * scale}px`,
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
    fontWeight: 'bold',
  };

  const titleStyles = {
    fontStyle: 'italic',
    marginBottom: `${(compact ? 1 : 5) * scale}px`,
    fontSize: `${(compact ? 9 : 16) * scale}px`,
  };

  const contactInfoStyles = {
    lineHeight: 1.2,
    fontSize: `${(compact ? 8 : 14) * scale}px`,
  };

  const sectionStyles = {
    margin: `${(compact ? 3 : 15) * scale}px 0`,
  };

  const sectionTitleStyles = {
    fontSize: `${(compact ? 9 : 16) * scale}px`,
    fontWeight: 'bold',
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #000',
    paddingBottom: `${(compact ? 1 : 3) * scale}px`,
  };

  const entryStyles = {
    marginBottom: `${(compact ? 2 : 12) * scale}px`,
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

  const entryDateStyles = {
    minWidth: `${(compact ? 45 : 90) * scale}px`,
    textAlign: 'right' as const,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const publicationStyles = {
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
    paddingLeft: `${(compact ? 10 : 20) * scale}px`,
    textIndent: `${-(compact ? 10 : 20) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const grantStyles = {
    marginBottom: `${(compact ? 2 : 8) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const awardStyles = {
    marginBottom: `${(compact ? 1 : 6) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const teachingEntryStyles = {
    marginBottom: `${(compact ? 2 : 10) * scale}px`,
    fontSize: `${(compact ? 7 : 13) * scale}px`,
  };

  const listStyles = {
    marginLeft: `${(compact ? 8 : 15) * scale}px`,
    marginTop: `${(compact ? 1 : 3) * scale}px`,
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
          <div style={nameStyles}>Dr. Sarah E. Anderson</div>
          <div style={titleStyles}>Associate Professor of Molecular Biology</div>
          <div style={contactInfoStyles}>
            Department of Biology, University of Example<br />
            123 Science Drive, Cambridge, MA 02138<br />
            Tel: (617) 555-0123 | Email: s.anderson@example.edu<br />
            ORCID: 0000-0002-1234-5678
          </div>
        </div>

        {/* Education */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Education</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Ph.D. in Molecular Biology</span>
              <span style={entryDateStyles}>2010-2015</span>
            </div>
            <div style={entryInstitutionStyles}>Stanford University</div>
            <div>Dissertation: "Regulatory Mechanisms in Cell Cycle Control"</div>
          </div>

          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>B.S. in Biochemistry, Summa Cum Laude</span>
              <span style={entryDateStyles}>2006-2010</span>
            </div>
            <div style={entryInstitutionStyles}>MIT</div>
          </div>
        </div>

        {/* Academic Appointments */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Academic Appointments</div>
          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Associate Professor</span>
              <span style={entryDateStyles}>2020-Present</span>
            </div>
            <div style={entryInstitutionStyles}>Department of Biology, University of Example</div>
          </div>

          <div style={entryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Assistant Professor</span>
              <span style={entryDateStyles}>2015-2020</span>
            </div>
            <div style={entryInstitutionStyles}>Department of Biology, University of Example</div>
          </div>
        </div>

        {/* Publications */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Publications (Selected)</div>
          <div style={publicationStyles}>
            Anderson, S.E., et al. (2023). "Novel Mechanisms of Cell Cycle Regulation." Cell, 184(5), 1234-1246.
          </div>
          <div style={publicationStyles}>
            Smith, J., Anderson, S.E. (2022). "Protein Interactions in Mitosis." Nature Cell Biology, 24(3), 567-579.
          </div>
        </div>

        {/* Research Grants */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Research Grants (Selected)</div>
          <div style={grantStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>NIH R01 Grant: "Cell Cycle Regulation in Cancer"</span>
              <span style={entryDateStyles}>2021-2026</span>
            </div>
            <div>Principal Investigator, $1.5M</div>
          </div>
        </div>

        {/* Teaching Experience */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Teaching Experience</div>
          <div style={teachingEntryStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Advanced Cell Biology (BIO401)</span>
              <span style={entryDateStyles}>2015-Present</span>
            </div>
            <ul style={listStyles}>
              <li style={listItemStyles}>Developed graduate-level curriculum.</li>
            </ul>
          </div>
        </div>

        {/* Honors and Awards */}
        <div style={sectionStyles}>
          <div style={sectionTitleStyles}>Honors and Awards (Selected)</div>
          <div style={awardStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Outstanding Research Award, University of Example</span>
              <span style={entryDateStyles}>2022</span>
            </div>
          </div>
          <div style={awardStyles}>
            <div style={entryHeaderStyles}>
              <span style={entryTitleStyles}>Young Investigator Award, American Society for Cell Biology</span>
              <span style={entryDateStyles}>2020</span>
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
        <div style={nameStyles}>Dr. Sarah E. Anderson</div>
        <div style={titleStyles}>Associate Professor of Molecular Biology</div>
        <div style={contactInfoStyles}>
          Department of Biology, University of Example<br />
          123 Science Drive, Cambridge, MA 02138<br />
          Tel: (617) 555-0123 | Email: s.anderson@example.edu<br />
          ORCID: 0000-0002-1234-5678
        </div>
      </div>

      {/* Education */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Education</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Ph.D. in Molecular Biology</span>
            <span style={entryDateStyles}>2010-2015</span>
          </div>
          <div style={entryInstitutionStyles}>Stanford University, Stanford, CA</div>
          <div>Dissertation: "Regulatory Mechanisms in Cell Cycle Control"</div>
          <div>Advisor: Dr. Michael Chen, Professor of Molecular Biology</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>B.S. in Biochemistry, Summa Cum Laude</span>
            <span style={entryDateStyles}>2006-2010</span>
          </div>
          <div style={entryInstitutionStyles}>Massachusetts Institute of Technology, Cambridge, MA</div>
          <div>GPA: 3.95/4.00; Phi Beta Kappa; Dean's List</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Postdoctoral Fellowship</span>
            <span style={entryDateStyles}>2015-2017</span>
          </div>
          <div style={entryInstitutionStyles}>Harvard Medical School, Boston, MA</div>
          <div>Research Focus: Cancer Biology and Cell Cycle Regulation</div>
        </div>
      </div>

      {/* Academic Appointments */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Academic Appointments</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Associate Professor</span>
            <span style={entryDateStyles}>2020-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Department of Biology, University of Example</div>
          <div>Research focus: Cell cycle regulation and cancer biology</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Assistant Professor</span>
            <span style={entryDateStyles}>2015-2020</span>
          </div>
          <div style={entryInstitutionStyles}>Department of Biology, University of Example</div>
          <div>Established independent research laboratory</div>
        </div>

        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Research Scientist</span>
            <span style={entryDateStyles}>2017-2018</span>
          </div>
          <div style={entryInstitutionStyles}>Broad Institute of MIT and Harvard, Cambridge, MA</div>
          <div>Cancer genomics and precision medicine research</div>
        </div>
      </div>

      {/* Research Interests */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Research Interests</div>
        <div style={entryStyles}>
          <div>Cell cycle regulation, cancer biology, protein-protein interactions, molecular mechanisms of cell division, therapeutic target identification, precision medicine approaches to cancer treatment</div>
        </div>
      </div>

      {/* Publications */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Publications (Selected)</div>
        <div style={publicationStyles}>
          Anderson, S.E., Chen, M., Rodriguez, A., & Thompson, K. (2023). "Novel Mechanisms of Cell Cycle Regulation in Cancer Cells." Cell, 184(5), 1234-1246. DOI: 10.1016/j.cell.2023.02.015
        </div>
        <div style={publicationStyles}>
          Smith, J., Anderson, S.E., & Wilson, R. (2022). "Protein Interactions in Mitosis: A Comprehensive Analysis." Nature Cell Biology, 24(3), 567-579. DOI: 10.1038/s41556-022-00845-2
        </div>
        <div style={publicationStyles}>
          Anderson, S.E., et al. (2022). "Targeting Cyclin-Dependent Kinases in Cancer Therapy." Cancer Research, 82(8), 1456-1467. DOI: 10.1158/0008-5472.CAN-21-2345
        </div>
        <div style={publicationStyles}>
          Brown, L., Anderson, S.E., & Davis, P. (2021). "Molecular Mechanisms of Checkpoint Control." Journal of Cell Biology, 220(4), e202012345. DOI: 10.1083/jcb.202012345
        </div>
        <div style={publicationStyles}>
          Anderson, S.E., & Garcia, M. (2020). "Cell Cycle Progression and Cancer Development." Annual Review of Cancer Biology, 4, 89-112. DOI: 10.1146/annurev-cancerbio-030419-033855
        </div>
      </div>

      {/* Research Grants */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Research Grants (Selected)</div>
        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>NIH R01 Grant: "Cell Cycle Regulation in Cancer"</span>
            <span style={entryDateStyles}>2021-2026</span>
          </div>
          <div>Principal Investigator, $1.5M</div>
        </div>
        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>NSF CAREER Award: "Molecular Mechanisms of Cell Division"</span>
            <span style={entryDateStyles}>2018-2023</span>
          </div>
          <div>Principal Investigator, $750,000</div>
        </div>
        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>American Cancer Society Research Scholar Grant</span>
            <span style={entryDateStyles}>2019-2024</span>
          </div>
          <div>Principal Investigator, $600,000</div>
        </div>
        <div style={grantStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>University of Example Faculty Research Grant</span>
            <span style={entryDateStyles}>2020-2022</span>
          </div>
          <div>Principal Investigator, $150,000</div>
        </div>
      </div>

      {/* Teaching Experience */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Teaching Experience</div>
        <div style={teachingEntryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Advanced Cell Biology (BIO401)</span>
            <span style={entryDateStyles}>2015-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Graduate Course, University of Example</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Developed comprehensive graduate-level curriculum covering cell cycle regulation, cancer biology, and molecular mechanisms</li>
            <li style={listItemStyles}>Incorporated latest research findings and cutting-edge laboratory techniques</li>
            <li style={listItemStyles}>Average enrollment: 25 students per semester</li>
          </ul>
        </div>

        <div style={teachingEntryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Introduction to Molecular Biology (BIO201)</span>
            <span style={entryDateStyles}>2016-2020</span>
          </div>
          <div style={entryInstitutionStyles}>Undergraduate Course, University of Example</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Taught fundamental concepts in molecular biology to 150+ students annually</li>
            <li style={listItemStyles}>Developed interactive laboratory exercises and case studies</li>
          </ul>
        </div>

        <div style={teachingEntryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Cancer Biology Seminar (BIO501)</span>
            <span style={entryDateStyles}>2018-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Graduate Seminar, University of Example</div>
          <ul style={listStyles}>
            <li style={listItemStyles}>Led weekly discussions on current cancer research literature</li>
            <li style={listItemStyles}>Mentored graduate students in research presentation skills</li>
          </ul>
        </div>
      </div>

      {/* Professional Service */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Professional Service</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Editorial Board Member</span>
            <span style={entryDateStyles}>2020-Present</span>
          </div>
          <div style={entryInstitutionStyles}>Journal of Cell Biology</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Grant Reviewer</span>
            <span style={entryDateStyles}>2018-Present</span>
          </div>
          <div style={entryInstitutionStyles}>National Institutes of Health, National Science Foundation</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Conference Organizer</span>
            <span style={entryDateStyles}>2022</span>
          </div>
          <div style={entryInstitutionStyles}>American Society for Cell Biology Annual Meeting</div>
        </div>
      </div>

      {/* Honors and Awards */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Honors and Awards (Selected)</div>
        <div style={awardStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Outstanding Research Award, University of Example</span>
            <span style={entryDateStyles}>2022</span>
          </div>
        </div>
        <div style={awardStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Young Investigator Award, American Society for Cell Biology</span>
            <span style={entryDateStyles}>2020</span>
          </div>
        </div>
        <div style={awardStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Excellence in Teaching Award, University of Example</span>
            <span style={entryDateStyles}>2019</span>
          </div>
        </div>
        <div style={awardStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>NIH Early Career Research Award</span>
            <span style={entryDateStyles}>2018</span>
          </div>
        </div>
        <div style={awardStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>Stanford University Graduate Fellowship</span>
            <span style={entryDateStyles}>2010-2015</span>
          </div>
        </div>
      </div>

      {/* Invited Talks */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Invited Talks (Selected)</div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Cell Cycle Regulation in Cancer: New Therapeutic Targets"</span>
            <span style={entryDateStyles}>2023</span>
          </div>
          <div style={entryInstitutionStyles}>Cold Spring Harbor Laboratory, Cold Spring Harbor, NY</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Molecular Mechanisms of Cell Division"</span>
            <span style={entryDateStyles}>2022</span>
          </div>
          <div style={entryInstitutionStyles}>Massachusetts Institute of Technology, Cambridge, MA</div>
        </div>
        <div style={entryStyles}>
          <div style={entryHeaderStyles}>
            <span style={entryTitleStyles}>"Precision Medicine Approaches to Cancer Treatment"</span>
            <span style={entryDateStyles}>2021</span>
          </div>
          <div style={entryInstitutionStyles}>Harvard Medical School, Boston, MA</div>
        </div>
      </div>

      {/* Mentoring */}
      <div style={sectionStyles}>
        <div style={sectionTitleStyles}>Mentoring</div>
        <div style={entryStyles}>
          <div>Graduate Students: 8 Ph.D. students (3 completed, 5 current)</div>
        </div>
        <div style={entryStyles}>
          <div>Postdoctoral Fellows: 4 postdocs (2 completed, 2 current)</div>
        </div>
        <div style={entryStyles}>
          <div>Undergraduate Researchers: 15 students (summer and academic year programs)</div>
        </div>
      </div>
    </div>
  );
};

export default AcademicTemplate1;