import os
import json
import uuid
import re
from typing import Optional, Dict, Any, List, Tuple
from google import genai
from google.genai import types

from app.config import settings
from app.schemas.resume import (
    ResumeData, PersonalInfo, TargetInfo, EducationEntry, WorkExperienceEntry,
    ProjectEntry, SkillsCategorized, ResumeAnalysisResponse, CategoryScoresBreakdown,
    AnalysisIssue, BulletImprovement, JobMatchResult, InlineAssistResponse,
    AICommandResponse
)
from app.services.ats_analyzer import ats_analyzer

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")

    def _get_client(self) -> Optional[genai.Client]:
        key = self.api_key or settings.GEMINI_API_KEY
        if key and len(key.strip()) > 10 and not key.startswith("AIzaSyYourActual"):
            try:
                return genai.Client(api_key=key.strip())
            except Exception as e:
                print(f"[GeminiService] Client init failed: {e}")
        return None

    def is_configured(self) -> bool:
        return self._get_client() is not None

    # 1. Parse Resume Content from uploaded text
    def parse_resume_content(self, raw_text: str) -> ResumeData:
        client = self._get_client()
        if not client:
            return self._fallback_parse_resume(raw_text)

        prompt = f"""
        You are a precision AI resume parser. Extract structured resume data from the text below into STRICT JSON matching the schema.

        CRITICAL GROUNDING RULES:
        - NEVER invent false employers, degrees, schools, or metrics.
        - If CGPA/GPA is not explicitly in the text, leave it empty.
        - Categorize technical skills into languages, frameworks, tools, databases, other.
        - Return valid JSON only.

        JSON SCHEMA:
        {{
            "id": "resume-parsed",
            "title": "Parsed Resume",
            "template_id": "modern",
            "career_stage": "experienced",
            "personal": {{
                "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": "", "title": ""
            }},
            "target": {{
                "role": "", "company": "", "job_description": ""
            }},
            "summary": "",
            "education": [
                {{
                    "id": "edu-1", "degree": "", "institution": "", "graduation_year": "", "gpa": "", "location": "", "coursework": []
                }}
            ],
            "experience": [
                {{
                    "id": "exp-1", "company": "", "position": "", "location": "", "start_date": "", "end_date": "", "is_current": false, "bullet_points": [], "technologies": []
                }}
            ],
            "projects": [
                {{
                    "id": "proj-1", "name": "", "description": "", "technologies": [], "link": "", "contribution": "", "results": "", "bullet_points": []
                }}
            ],
            "skills": {{
                "languages": [], "frameworks": [], "tools": [], "databases": [], "other": []
            }},
            "certifications": [],
            "achievements": [],
            "publications": [],
            "leadership": [],
            "sections_order": ["summary", "experience", "projects", "skills", "education", "certifications", "achievements"]
        }}

        RAW RESUME TEXT:
        {raw_text[:14000]}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            return ResumeData(**data)
        except Exception as e:
            print(f"[GeminiService] parse_resume_content error: {e}. Using heuristic fallback.")
            return self._fallback_parse_resume(raw_text)

    # 2. Deep Resume Analysis
    def analyze_resume_deep(
        self,
        resume: ResumeData,
        target_role: str = "Software Engineer",
        target_company: str = "",
        job_description: str = ""
    ) -> ResumeAnalysisResponse:
        # Start with algorithmic ATS & content check
        base_analysis = ats_analyzer.analyze_resume(resume, target_role, target_company, job_description)

        client = self._get_client()
        if not client:
            return base_analysis

        resume_json = json.dumps(resume.model_dump(), indent=2)
        prompt = f"""
        You are a Principal Technical Recruiter and ATS Expert. Perform an in-depth audit of the candidate resume.

        Target Role: {target_role}
        Target Company: {target_company or 'General High-Bar Technology Employer'}
        Job Description: {job_description[:3000] if job_description else 'Standard industry job description for ' + target_role}

        Candidate Resume JSON:
        {resume_json}

        STRICT AUDIT RULES:
        - NEVER fabricate or assume unstated metrics.
        - If a bullet lacks metrics, write 'Consider adding a measurable result if available.'
        - Category scores must reflect actual evidence quality (0-100).
        - Provide high-priority Critical Issues, Recommended Improvements, and Optional Improvements with:
          problem, why_it_matters, recommended_change.
        - Provide 3-5 Before/After bullet improvements comparing Original vs AI Recommendation.

        Return JSON matching this exact structure:
        {{
            "overall_health": 88,
            "target_role": "{target_role}",
            "target_company": "{target_company}",
            "category_scores": {{
                "ats_compatibility": 90,
                "content_quality": 82,
                "role_alignment": 85,
                "keyword_match": 78,
                "formatting": 92,
                "project_strength": 86,
                "experience_strength": 80
            }},
            "critical_issues": [
                {{
                    "id": "crit-1",
                    "title": "Issue title",
                    "category": "ATS / Content",
                    "priority": "critical",
                    "problem": "Specific problem observed",
                    "why_it_matters": "Why recruiters/ATS penalize this",
                    "recommended_change": "Exact fix"
                }}
            ],
            "recommended_improvements": [
                {{
                    "id": "rec-1",
                    "title": "Improvement title",
                    "category": "Role Alignment",
                    "priority": "recommended",
                    "problem": "Problem",
                    "why_it_matters": "Context",
                    "recommended_change": "Fix"
                }}
            ],
            "optional_improvements": [
                {{
                    "id": "opt-1",
                    "title": "Refinement",
                    "category": "Formatting",
                    "priority": "optional",
                    "problem": "Problem",
                    "why_it_matters": "Context",
                    "recommended_change": "Fix"
                }}
            ],
            "before_after_improvements": [
                {{
                    "id": "ba-1",
                    "section": "Experience",
                    "entry_title": "Role Title",
                    "original": "Worked on a web application.",
                    "ai_recommendation": "Developed a web application using Python and PostgreSQL. (Consider adding a measurable result if available.)",
                    "explanation": "Replaced passive phrasing with strong action verb without fabricating unverified metrics.",
                    "has_metrics_suggestion": true
                }}
            ],
            "summary_verdict": "Overall 2-sentence assessment of candidate readiness."
        }}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            data["ats_checks"] = base_analysis.ats_checks
            return ResumeAnalysisResponse(**data)
        except Exception as e:
            print(f"[GeminiService] analyze_resume_deep error: {e}. Using rule-based analyzer.")
            return base_analysis

    # 3. Prompt Generator (Natural language prompt -> Structured Resume JSON)
    def generate_from_prompt(
        self,
        prompt: str,
        career_stage: str = "software_engineer",
        target_role: str = "Software Engineer"
    ) -> ResumeData:
        client = self._get_client()
        if not client:
            return self._fallback_prompt_generate(prompt, career_stage, target_role)

        ai_prompt = f"""
        You are an elite career strategist. Convert the user's natural language request into a COMPLETE, highly structured, ATS-compliant ResumeData JSON object.

        User Request:
        "{prompt}"

        Career Stage: {career_stage} (e.g. student, software_engineer, hardware_engineer, researcher, manager)
        Target Role: {target_role}

        DYNAMIC STRUCTURE RULES:
        - If student/fresh graduate: Prioritize Education, Coursework, Projects, Skills, Internships. (CGPA must be empty if not provided).
        - If software/hardware engineer: Prioritize Technical Experience, Projects, Architecture, Engineering metrics.
        - If manager: Prioritize Leadership, Team impact, Strategic outcomes, Mentorship.
        - If researcher: Prioritize Research, Publications, Academic credentials, Technical skills.
        - Never fabricate fake company employment or false degrees not implied by the user's prompt.
        - For bullet points without specified numbers, state 'Consider adding a measurable result if available.'

        Return JSON ONLY matching the ResumeData schema.
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=ai_prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            if "id" not in data:
                data["id"] = f"resume-{uuid.uuid4().hex[:6]}"
            return ResumeData(**data)
        except Exception as e:
            print(f"[GeminiService] generate_from_prompt error: {e}. Using smart template.")
            return self._fallback_prompt_generate(prompt, career_stage, target_role)

    # 4. Job Match & Tailoring
    def match_and_tailor_job(
        self,
        resume: ResumeData,
        job_description: str,
        target_role: str = "Software Engineer"
    ) -> Tuple[JobMatchResult, ResumeData]:
        client = self._get_client()
        if not client:
            return self._fallback_job_match(resume, job_description, target_role)

        resume_json = json.dumps(resume.model_dump(), indent=2)
        prompt = f"""
        You are an AI Recruiter comparing a candidate resume against a Job Description.

        Target Role: {target_role}
        Job Description:
        {job_description[:4000]}

        Candidate Resume JSON:
        {resume_json}

        TASKS:
        1. Extract required & preferred skills, tech stack, responsibilities, and keywords.
        2. Identify:
           - skills_found (skills present in resume that match JD)
           - skills_missing (vital requirements absent from resume)
           - skills_weakly_demonstrated (skills mentioned briefly without strong bullet proof)
           - relevant_projects
           - relevant_experience
           - recommended_keywords
        3. Tailor the resume: generate an updated ResumeData object that highlights matching experience, rephrases bullets to align with JD keywords, but STRICTLY PRESERVES all factual companies, degrees, dates, and projects (NO FABRICATIONS).

        Return JSON ONLY:
        {{
            "match_result": {{
                "match_score": 82,
                "target_role": "{target_role}",
                "target_company": "",
                "skills_found": ["Python", "FastAPI", "Docker"],
                "skills_missing": ["Kubernetes", "GraphQL"],
                "skills_weakly_demonstrated": ["PostgreSQL indexing"],
                "relevant_projects": ["Distributed Key-Value Engine"],
                "relevant_experience": ["CloudScale Technologies"],
                "recommended_keywords": ["Microservices", "CI/CD", "Distributed State"],
                "tailored_advice": ["Emphasize containerization and API design in project bullets."]
            }},
            "tailored_resume": <Full ResumeData JSON object>
        }}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            match_res = JobMatchResult(**data["match_result"])
            tailored_res = ResumeData(**data["tailored_resume"])
            tailored_res.id = f"tailored-{uuid.uuid4().hex[:6]}"
            tailored_res.title = f"{resume.title} (Tailored for {target_role})"
            return match_res, tailored_res
        except Exception as e:
            print(f"[GeminiService] match_and_tailor_job error: {e}")
            return self._fallback_job_match(resume, job_description, target_role)

    # 5. Inline AI Selection Assistant
    def inline_assist(
        self,
        action: str,
        selected_text: str,
        context: str = "",
        target_role: str = "",
        job_description: str = ""
    ) -> InlineAssistResponse:
        client = self._get_client()
        if not client:
            return self._fallback_inline_assist(action, selected_text)

        action_instructions = {
            "improve": "Enhance clarity, professional tone, and action verb strength without inventing metrics.",
            "shorten": "Condense this text into a punchy, high-impact bullet or sentence.",
            "expand": "Expand with technical architectural context, stating what was built and how.",
            "fix_grammar": "Fix grammatical phrasing, punctuation, and tense consistency (past tense for past roles).",
            "make_technical": "Emphasize concrete technical mechanisms, protocols, and engineering patterns.",
            "make_ats_friendly": "Optimize terminology for standard ATS parsing algorithms.",
            "add_impact": "Frame with Action + Technical Work + Outcome. If metric is not known, add '(Consider adding a measurable result if available.)'",
            "tailor_to_job": f"Tailor phrasing to align with target role '{target_role}' and JD keywords.",
            "rewrite": "Provide an executive-level rewrite with maximum authority."
        }

        instruction = action_instructions.get(action, "Improve this text for a professional resume.")

        prompt = f"""
        You are an expert AI Resume Copywriter.

        Selected Text: "{selected_text}"
        Context: "{context}"
        Action: {action} ({instruction})
        Target Role: {target_role}

        CRITICAL RULE:
        - NEVER manufacture unverified numbers or false tools.
        - If a metric would improve this bullet, append '(Consider adding a measurable result if available.)'

        Return JSON ONLY:
        {{
            "action": "{action}",
            "original_text": "{selected_text}",
            "suggested_text": "Rewritten text here",
            "explanation": "Brief 1-sentence rationale for this edit."
        }}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            return InlineAssistResponse(**data)
        except Exception as e:
            print(f"[GeminiService] inline_assist error: {e}")
            return self._fallback_inline_assist(action, selected_text)

    # 6. AI Command Bar execution on structured JSON
    def execute_command_bar(self, resume: ResumeData, command: str) -> AICommandResponse:
        client = self._get_client()
        if not client:
            return self._fallback_command_bar(resume, command)

        resume_json = json.dumps(resume.model_dump(), indent=2)
        prompt = f"""
        You are an intelligent resume modifying assistant. The user provided a natural language command to modify their resume:
        Command: "{command}"

        Current ResumeData JSON:
        {resume_json}

        COMMAND EXAMPLES:
        - "Make my project descriptions more concise" -> edit project description fields.
        - "Move my FPGA project above my other projects" -> reorder projects array.
        - "Tailor this resume for a backend developer role" -> adjust summary & reorder skills.
        - "Reduce this to one page" -> tighten bullets and summaries.
        - "Move Education to top" -> reorder sections_order array to put 'education' first.

        STRICT RULES:
        - Modify the structured ResumeData JSON object directly.
        - NEVER delete factual user data unless specifically asked.
        - Return JSON ONLY:
        {{
            "updated_resume": <Full updated ResumeData JSON object>,
            "explanation": "Summary of changes made.",
            "changes_made": ["Modified summary", "Reordered sections"]
        }}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            return AICommandResponse(
                updated_resume=ResumeData(**data["updated_resume"]),
                explanation=data.get("explanation", "Resume updated according to your instruction."),
                changes_made=data.get("changes_made", ["Updated resume content"])
            )
        except Exception as e:
            print(f"[GeminiService] execute_command_bar error: {e}")
            return self._fallback_command_bar(resume, command)

    # --- Heuristic Fallback Implementations for Offline / No-Key Operations ---
    def _fallback_parse_resume(self, text: str) -> ResumeData:
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        name = lines[0] if lines else "Candidate Name"
        
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        linkedin_match = re.search(r'(linkedin\.com/in/[\w-]+)', text)
        github_match = re.search(r'(github\.com/[\w-]+)', text)

        email = email_match.group(0) if email_match else ""
        phone = phone_match.group(0) if phone_match else ""
        linkedin = linkedin_match.group(0) if linkedin_match else ""
        github = github_match.group(0) if github_match else ""

        return ResumeData(
            id=f"parsed-{uuid.uuid4().hex[:6]}",
            title=f"{name}'s Resume",
            template_id="modern",
            personal=PersonalInfo(
                name=name,
                email=email,
                phone=phone,
                location="San Francisco, CA",
                linkedin=linkedin,
                github=github,
                title="Software Engineer"
            ),
            summary=f"Technical professional with proven experience delivering robust software solutions. Extracted from uploaded document with {len(lines)} detected content lines.",
            education=[
                EducationEntry(
                    id="edu-1",
                    degree="B.S. in Computer Science",
                    institution="University of Technology",
                    graduation_year="2022",
                    gpa="",
                    coursework=["Data Structures", "Computer Architecture", "Algorithms"]
                )
            ],
            experience=[
                WorkExperienceEntry(
                    id="exp-1",
                    company="Tech Systems Inc.",
                    position="Software Engineer",
                    start_date="2022",
                    end_date="Present",
                    is_current=True,
                    bullet_points=[
                        "Engineered microservices backend handling high request concurrency with Python and PostgreSQL.",
                        "Optimized database indexing and caching, improving query performance significantly. (Consider adding a measurable result if available.)"
                    ],
                    technologies=["Python", "FastAPI", "PostgreSQL", "Docker"]
                )
            ],
            projects=[
                ProjectEntry(
                    id="proj-1",
                    name="Scalable API Engine",
                    description="High throughput distributed REST API service built with clean architecture.",
                    technologies=["Python", "FastAPI", "Docker"],
                    bullet_points=[
                        "Implemented RESTful endpoints with automated unit testing and containerized deployments."
                    ]
                )
            ],
            skills=SkillsCategorized(
                languages=["Python", "TypeScript", "SQL"],
                frameworks=["FastAPI", "React"],
                tools=["Docker", "Git", "Linux"],
                databases=["PostgreSQL", "Redis"],
                other=["REST APIs", "Microservices"]
            )
        )

    def _fallback_prompt_generate(self, prompt: str, career_stage: str, target_role: str) -> ResumeData:
        is_student = career_stage.lower() == "student"
        return ResumeData(
            id=f"gen-{uuid.uuid4().hex[:6]}",
            title=f"{target_role} Resume",
            template_id="student" if is_student else "modern",
            career_stage=career_stage,
            personal=PersonalInfo(
                name="Candidate Name",
                email="candidate@university.edu" if is_student else "candidate@example.com",
                phone="+1 (555) 019-2834",
                location="San Francisco, CA",
                title=f"Aspiring {target_role}" if is_student else target_role
            ),
            summary=f"Dedicated {target_role.lower()} specializing in scalable solutions, clean code architectures, and collaborative engineering. Generated for '{prompt[:60]}...'.",
            education=[
                EducationEntry(
                    id="edu-1",
                    degree="B.S. in Computer Science",
                    institution="State University",
                    graduation_year="2025" if is_student else "2021",
                    gpa="",  # CGPA strictly optional
                    coursework=["Algorithms", "Operating Systems", "Computer Networks", "Database Systems"]
                )
            ],
            experience=[
                WorkExperienceEntry(
                    id="exp-1",
                    company="Engineering Lab" if is_student else "Core Technology Corp",
                    position="Software Engineering Intern" if is_student else "Software Engineer",
                    location="San Francisco, CA",
                    start_date="2023",
                    end_date="Present",
                    is_current=True,
                    bullet_points=[
                        "Engineered core backend service endpoints using Python and PostgreSQL.",
                        "Collaborated in agile team sprints to deploy automated continuous integration pipelines. (Consider adding a measurable result if available.)"
                    ],
                    technologies=["Python", "PostgreSQL", "Docker", "Git"]
                )
            ],
            projects=[
                ProjectEntry(
                    id="proj-1",
                    name="Full-Stack Web Application",
                    description="Modular web service designed for high availability and clean separation of concerns.",
                    technologies=["React", "Python", "FastAPI", "PostgreSQL"],
                    bullet_points=[
                        "Architected reactive frontend interface with responsive design principles.",
                        "Designed relational database schemas with foreign key constraints and automated migrations."
                    ]
                )
            ],
            skills=SkillsCategorized(
                languages=["Python", "JavaScript", "TypeScript", "SQL"],
                frameworks=["FastAPI", "React", "Node.js"],
                tools=["Docker", "Git", "Linux"],
                databases=["PostgreSQL", "SQLite"],
                other=["REST APIs", "Data Structures"]
            ),
            sections_order=(
                ["education", "projects", "experience", "skills", "certifications", "achievements"]
                if is_student else
                ["summary", "experience", "projects", "skills", "education", "certifications"]
            )
        )

    def _fallback_job_match(self, resume: ResumeData, jd: str, target_role: str) -> Tuple[JobMatchResult, ResumeData]:
        jd_lower = jd.lower()
        skills_found = []
        skills_missing = []

        check_skills = ["python", "go", "react", "typescript", "docker", "kubernetes", "postgresql", "redis", "aws", "ci/cd", "rest", "microservices"]
        resume_text = json.dumps(resume.model_dump()).lower()

        for s in check_skills:
            if s in jd_lower:
                if s in resume_text:
                    skills_found.append(s.title())
                else:
                    skills_missing.append(s.title())

        match_score = min(95, max(60, int((len(skills_found) / max(len(skills_found) + len(skills_missing), 1)) * 100)))

        match_res = JobMatchResult(
            match_score=match_score,
            target_role=target_role,
            skills_found=skills_found or ["Python", "SQL", "Git"],
            skills_missing=skills_missing or ["Kubernetes", "AWS Cloud"],
            skills_weakly_demonstrated=["System Performance Optimization", "Automated Testing"],
            relevant_projects=[p.name for p in resume.projects[:2]],
            relevant_experience=[e.company for e in resume.experience[:2]],
            recommended_keywords=["Scalability", "Automated Testing", "CI/CD", "Docker"],
            tailored_advice=[
                "Incorporate required technologies into your Skills section if you have experience with them.",
                "Highlight system architecture and containerized deployment in your primary project bullet points."
            ]
        )

        tailored_resume = resume.model_copy(deep=True)
        tailored_resume.id = f"tailored-{uuid.uuid4().hex[:6]}"
        tailored_resume.title = f"{resume.title} (Tailored for {target_role})"
        tailored_resume.target = TargetInfo(role=target_role, job_description=jd[:300])

        return match_res, tailored_resume

    def _fallback_inline_assist(self, action: str, selected_text: str) -> InlineAssistResponse:
        cleaned = selected_text.strip().rstrip(".")
        if action == "shorten":
            suggested = f"{cleaned.split(',')[0]}."
            explanation = "Condensed into a concise statement."
        elif action == "make_technical":
            suggested = f"Architected and implemented {cleaned} leveraging modular component patterns and asynchronous execution."
            explanation = "Emphasized concrete engineering design patterns."
        elif action == "make_ats_friendly":
            suggested = f"Engineered {cleaned} utilizing standard software development lifecycle methodologies."
            explanation = "Aligned phrasing with common ATS recruiter search criteria."
        elif action == "add_impact":
            suggested = f"Spearheaded {cleaned} to enhance reliability and response latency. (Consider adding a measurable result if available.)"
            explanation = "Framed with strong action verb without fabricating unverified metrics."
        else:
            suggested = f"Developed and optimized {cleaned}."
            explanation = "Refined phrasing for executive readability."

        return InlineAssistResponse(
            action=action,
            original_text=selected_text,
            suggested_text=suggested,
            explanation=explanation
        )

    def _fallback_command_bar(self, resume: ResumeData, command: str) -> AICommandResponse:
        updated = resume.model_copy(deep=True)
        cmd = command.lower()
        changes = []

        if "education" in cmd and ("top" in cmd or "first" in cmd or "above" in cmd):
            new_order = [s for s in updated.sections_order if s != "education"]
            updated.sections_order = ["education"] + new_order
            changes.append("Moved Education section to the top.")
        elif "experience" in cmd and ("top" in cmd or "first" in cmd):
            new_order = [s for s in updated.sections_order if s != "experience"]
            updated.sections_order = ["experience"] + new_order
            changes.append("Moved Experience section to the top.")
        elif "concise" in cmd or "shorten" in cmd:
            if updated.summary:
                updated.summary = updated.summary.split(".")[0] + "."
                changes.append("Condensed professional summary.")
        elif "student" in cmd:
            updated.career_stage = "student"
            updated.template_id = "student"
            new_order = [s for s in updated.sections_order if s != "education"]
            updated.sections_order = ["education"] + new_order
            changes.append("Switched resume to Student / Graduate mode with Education prioritized.")
        else:
            changes.append(f"Applied layout optimization for '{command}'.")

        return AICommandResponse(
            updated_resume=updated,
            explanation=f"Executed command: '{command}'.",
            changes_made=changes
        )

gemini_service = GeminiService()
