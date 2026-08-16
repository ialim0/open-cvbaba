import logging
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import User, Education, Interest, Skill, Experience, Project
from app.schemas import UserProfileUpdate, UserProfileResponse

logger = logging.getLogger(__name__)


class ProfileService:
    @staticmethod
    def _update_education(user: User, education_data: list[dict]) -> None:
        user.education = [
            Education(
                degree=edu["degree"],
                institution=edu["institution"],
                year=edu["year"]
            )
            for edu in education_data
        ]

    @staticmethod
    def _update_interests(user: User, interests_data: list[str]) -> None:
        user.interests = [Interest(name=interest) for interest in interests_data]

    @staticmethod
    def _update_skills(user: User, skills_data: list[str]) -> None:
        user.skills = [Skill(name=skill) for skill in skills_data]

    @staticmethod
    def _update_experience(user: User, experience_data: list[dict]) -> None:
        user.experience = [
            Experience(
                title=exp["title"],
                company=exp["company"],
                duration=exp["duration"],
                description=exp["description"]
            )
            for exp in experience_data
        ]

    @staticmethod
    def _update_projects(db: Session, user: User, projects_data: list[dict]) -> None:
        db.query(Project).filter(Project.user_id == user.id).delete()

        for proj in projects_data:
            new_project = Project(
                user_id=user.id,
                title=proj["title"],
                description=proj["description"],
                technologies=",".join(proj["technologies"]) if proj.get("technologies") else None,
                link=proj.get("link")
            )
            db.add(new_project)

    @staticmethod
    def update_user_profile(db: Session, user_id: int, profile_update: UserProfileUpdate) -> UserProfileResponse:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            logger.warning(f"User with ID {user_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        try:
            logger.info(f"Updating profile for user ID {user_id}")
            logger.debug(f"Profile update payload: {profile_update.model_dump(exclude_unset=True)}")

            for field, value in profile_update.model_dump(exclude_unset=True).items():
                if field == "full_name":
                    if value is not None and not value.strip():
                        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Full name cannot be empty")
                    user.full_name = value
                elif field == "education" and value is not None:
                    ProfileService._update_education(user, value)
                elif field == "interests" and value is not None:
                    ProfileService._update_interests(user, value)
                elif field == "skills" and value is not None:
                    ProfileService._update_skills(user, value)
                elif field == "experience" and value is not None:
                    ProfileService._update_experience(user, value)
                elif field == "projects" and value is not None:
                    ProfileService._update_projects(db, user, value)
                elif field == "preferred_language" and value is not None:
                    user.preferred_language = value
                elif field == "confidence_meter" and value is not None:
                    user.confidence_meter = float(value)
                else:
                    setattr(user, field, value)

            db.commit()
            db.refresh(user)

            return UserProfileResponse(
                full_name=user.full_name,
                email=user.email,
                cv_email=user.cv_email,
                phone_number=user.phone_number,
                website=user.website,
                github=user.github,
                address=user.address,
                profile_photo=user.profile_photo,
                motivation=user.motivation,
                preferred_language=user.preferred_language,
                confidence_meter=user.confidence_meter,
                education=[{"degree": edu.degree, "institution": edu.institution, "year": edu.year} for edu in user.education],
                interests=[interest.name for interest in user.interests],
                skills=[skill.name for skill in user.skills],
                experience=[{"title": exp.title, "company": exp.company, "duration": exp.duration, "description": exp.description}
                            for exp in user.experience],
                projects=[{ "title": proj.title, "description": proj.description,
                           "technologies": proj.technologies.split(",") if proj.technologies else [],
                           "link": proj.link} for proj in user.projects]
            )

        except SQLAlchemyError as sql_ex:
            db.rollback()
            logger.error(f"Database error occurred: {str(sql_ex)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="A database error occurred")

        except HTTPException as e:
            logger.warning(f"HTTPException during profile update: {e.detail}")
            raise e

        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error occurred: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")
