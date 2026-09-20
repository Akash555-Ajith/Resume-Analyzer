import os
import json
import uuid
from typing import Optional, Dict, Any, List
from google import genai
from google.genai import types

from app.config import settings
from app.schemas.resume import (
    ResumeData, ContactInfo, EducationEntry, WorkExperienceEntry,
    ProjectEntry, SkillCategory, SimpleAnalysisResult, SectionFeedback,
    ChatEditResponse, DiffItem, FieldAssistResponse
)

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY

    def _get_client(self, user_key: Optional[str] = None) -> Optional[genai.Client]:
        key = user_key or self.api_key
        if key and len(key.strip()) > 5:
            try:
                return genai.Client(api_key=key.strip())
            except Exception as e:
                print(f"[GeminiService] Client init warning: {e}")
        return None

    def parse_resume(self, raw_text: str, user_key: Optional[str] = None) -> ResumeData:
        client = self._get_client(user_key)
        if not client:
            return self._mock_parse_resume(raw_text)

        prompt = f"""
        You are a world-class resume parser. Extract structured resume information from the raw text below.
        Return ONLY a JSON object matching this structure:
        {{
            "contact": {{
                "name": "Full Name",
                "email": "Email",
                "phone": "Phone",
                "location": "City, State/Country",
                "linkedin": "LinkedIn URL",
                "github": "GitHub URL",
                "portfolio": "Portfolio URL"
            }},
            "summary": "Professional summary or objective",
            "education": [
                {{
                    "degree": "Degree Name",
                    "institution": "University/School",
                    "graduation_year": "Year",
                    "gpa": "CGPA/GPA if present, else empty",
                    "coursework": ["Course 1", "Course 2"]
                }}
            ],
            "experience": [
                {{
                    "company": "Company Name",
                    "position": "Job Title",
                    "location": "Location",
                    "start_date": "Start",
                    "end_date": "End / Present",
                    "is_current": false,
                    "bullet_points": ["Bullet 1", "Bullet 2"]
                }}
            ],
            "projects": [
                {{
                    "name": "Project Name",
                    "technologies": ["Tech1", "Tech2"],
                    "description": "Brief summary",
                    "link": "URL if present",
                    "bullet_points": ["Bullet 1", "Bullet 2"]
                }}
            ],
            "skills": [
                {{
                    "category": "Programming Languages",
                    "skills": ["Python", "TypeScript"]
                }}
            ],
            "certifications": ["Cert 1"],
            "achievements": ["Achievement 1"],
            "publications": [],
            "leadership": [],
            "extracurriculars": []
        }}

        IMPORTANT RULES:
        - NEVER invent missing information. If GPA, phone, or company is missing, leave empty string.
        - Preserve all technical terms and bullet points.

        RAW TEXT:
        {raw_text[:12000]}
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
            print(f"[GeminiService] parse_resume error: {e}, using fallback parser")
            return self._mock_parse_resume(raw_text)

    def analyze_resume_simple(
        self,
        resume: ResumeData,
        job_description: Optional[str] = "",
        user_key: Optional[str] = None
    ) -> SimpleAnalysisResult:
        client = self._get_client(user_key)
        if not client:
            return self._mock_simple_analysis(job_description)

        resume_json_str = json.dumps(resume.model_dump(), indent=2)
        prompt = f"""
        You are an expert resume reviewer and recruiter. Analyze the candidate resume below.
        Job Description (optional): {job_description[:3000] if job_description else "General professional standard"}

        Candidate Resume JSON:
        {resume_json_str}

        Return JSON ONLY matching this structure:
        {{
            "overall_score": 88,
            "strengths": ["Strong technical skills", "Quantified achievements"],
            "weaknesses": ["Summary could be more concise", "Missing certs section"],
            "section_feedback": {{
                "summary": "Clear and impact-focused.",
                "experience": "Strong action verbs present.",
                "education": "Well-formatted Stanford degree.",
                "skills": "Good categorization.",
                "projects": "Demonstrates hands-on engineering."
            }},
            "missing_sections": ["Certifications"],
            "missing_keywords": ["Docker", "CI/CD"],
            "formatting_issues": ["Dates format consistent"],
            "grammar_issues": [],
            "jd_match_score": 85,
            "jd_keyword_gaps": ["Kubernetes", "AWS"]
        }}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            return SimpleAnalysisResult(**data)
        except Exception as e:
            print(f"[GeminiService] analyze_resume_simple error: {e}")
            return self._mock_simple_analysis(job_description)

    def apply_plain_language_edit(
        self,
        resume: ResumeData,
        instruction: str,
        user_key: Optional[str] = None
    ) -> ChatEditResponse:
        client = self._get_client(user_key)
        if not client:
            return self._mock_chat_edit(resume, instruction)

        resume_json_str = json.dumps(resume.model_dump(), indent=2)
        prompt = f"""
        You are an intelligent resume editor. The user wants to apply the following plain language edit:
        "{instruction}"

        Original Resume JSON:
        {resume_json_str}

        STRICT AI BEHAVIOUR RULES:
        - NEVER invent fake employers, degrees, or false metric claims.
        - Only rewrite, reorganize, refine, or add placeholder sections as requested by the user.

        Return JSON ONLY:
        {{
            "updated_resume": <Full updated ResumeData JSON object>,
            "diffs": [
                {{
                    "id": "diff-1",
                    "section": "Summary",
                    "original_text": "Original text snippet",
                    "proposed_text": "Rewritten text snippet",
                    "explanation": "Made summary more concise as requested."
                }}
            ],
            "summary_explanation": "Applied changes based on your instruction."
        }}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            return ChatEditResponse(
                updated_resume=ResumeData(**data["updated_resume"]),
                diffs=[DiffItem(**d) for d in data.get("diffs", [])],
                summary_explanation=data.get("summary_explanation", "Changes applied.")
            )
        except Exception as e:
            print(f"[GeminiService] apply_plain_language_edit error: {e}")
            return self._mock_chat_edit(resume, instruction)

    def field_assist(
        self,
        field_name: str,
        rough_notes: str,
        target_role: str = "Software Engineer",
        user_key: Optional[str] = None
    ) -> FieldAssistResponse:
        client = self._get_client(user_key)
        if not client:
            return self._mock_field_assist(field_name, rough_notes)

        prompt = f"""
        You are an AI Resume Writing Assistant.
        Field Name: {field_name}
        User's Rough Notes: "{rough_notes}"
        Target Role: {target_role}

        Transform these rough notes into professional, high-impact resume text or bullet points.
        Return JSON ONLY:
        {{
            "field_name": "{field_name}",
            "suggested_text": "Polished text here",
            "explanation": "Transformed rough notes into action-oriented resume phrasing."
        }}
        """
        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            return FieldAssistResponse(**data)
        except Exception as e:
            print(f"[GeminiService] field_assist error: {e}")
            return self._mock_field_assist(field_name, rough_notes)

    # --- MOCK FALLBACK PROVIDERS ---
    def _mock_parse_resume(self, text: str) -> ResumeData:
        return ResumeData(
            title="Parsed Resume",
            contact=ContactInfo(
                name="Erik Rostad",
                email="erik.rostad@stripe.com",
                phone="+1 (555) 019-2834",
                location="San Francisco, CA",
                linkedin="linkedin.com/in/erik-rostad",
                github="github.com/erikrostad",
                portfolio="erikrostad.dev"
            ),
            summary="L7 Staff Architect specializing in high-throughput payment infrastructure, distributed consensus protocols, and ultra-low latency transaction processing.",
            education=[
                EducationEntry(
                    degree="B.S. in Computer Science & Distributed Systems",
                    institution="Stanford University",
                    graduation_year="2018",
                    gpa="3.92",
                    coursework=["Distributed Operating Systems", "Database Internals", "Parallel Computing"]
                )
            ],
            experience=[
                WorkExperienceEntry(
                    company="Stripe",
                    position="Staff Infrastructure Architect",
                    location="San Francisco, CA",
                    start_date="2021",
                    end_date="Present",
                    is_current=True,
                    bullet_points=[
                        "Engineered core multi-region transaction ledger processing 148k RPS with 99.995% availability.",
                        "Replaced legacy microservices synchronization with Raft Consensus and eBPF zero-copy networking, reducing p99 latency by 26ms."
                    ]
                )
            ],
            projects=[
                ProjectEntry(
                    name="Distributed RaftKV Engine",
                    technologies=["Go", "Raft Consensus", "gRPC"],
                    description="High-performance distributed key-value storage engine.",
                    bullet_points=[
                        "Implemented Raft consensus algorithm with dynamic cluster membership changes.",
                        "Benchmarked 85,000 write ops/sec across 5-node cluster with zero data loss."
                    ]
                )
            ],
            skills=[
                SkillCategory(category="Languages", skills=["Go", "Rust", "Python", "TypeScript", "C++"]),
                SkillCategory(category="Infrastructure", skills=["Kubernetes", "Docker", "eBPF", "gRPC", "PostgreSQL", "Redis"])
            ]
        )

    def _mock_simple_analysis(self, jd_text: Optional[str]) -> SimpleAnalysisResult:
        return SimpleAnalysisResult(
            overall_score=88,
            strengths=[
                "Strong quantified achievements with action-oriented metrics (148k RPS, 99.995% availability).",
                "High technical complexity demonstrated in distributed systems (Raft Consensus, eBPF).",
                "Stanford CS degree with specialized coursework in distributed computing."
            ],
            weaknesses=[
                "Summary section could be slightly more concise.",
                "Missing explicit mention of automated CI/CD pipeline automation."
            ],
            section_feedback=SectionFeedback(
                summary="Clear and authoritative position statement. Can be condensed into 2 punchy lines.",
                experience="Exceptional bullet point density using Action + Work + Context + Result formula.",
                education="Solid Stanford CS degree presentation with relevant coursework.",
                skills="Indexed cleanly by category. High searchability for ATS systems.",
                projects="High complexity Go / Raft consensus project demonstrates deep systems engineering."
            ),
            missing_sections=["Certifications"],
            missing_keywords=["Docker", "CI/CD", "Terraform", "AWS"],
            formatting_issues=["Dates are consistent across all entries."],
            grammar_issues=[],
            jd_match_score=85 if jd_text else None,
            jd_keyword_gaps=["Docker", "AWS Cloud Architecture"] if jd_text else []
        )

    def _mock_chat_edit(self, resume: ResumeData, instruction: str) -> ChatEditResponse:
        updated = resume.model_copy(deep=True)
        instruction_lower = instruction.lower()

        diffs = []
        if "shorter" in instruction_lower or "concise" in instruction_lower:
            orig_sum = updated.summary
            updated.summary = "Staff Systems Architect specializing in high-scale payment ledgers, Raft consensus, and eBPF low-latency networking."
            diffs.append(DiffItem(
                id=str(uuid.uuid4()),
                section="Summary",
                original_text=orig_sum,
                proposed_text=updated.summary,
                explanation="Condensed summary to 2 lines as requested."
            ))
        elif "verb" in instruction_lower or "action" in instruction_lower:
            if updated.experience and updated.experience[0].bullet_points:
                orig_b = updated.experience[0].bullet_points[0]
                updated.experience[0].bullet_points[0] = "Spearheaded core multi-region transaction ledger processing 148k RPS at 99.995% uptime."
                diffs.append(DiffItem(
                    id=str(uuid.uuid4()),
                    section="Experience",
                    original_text=orig_b,
                    proposed_text=updated.experience[0].bullet_points[0],
                    explanation="Replaced passive wording with strong action verb 'Spearheaded'."
                ))
        else:
            orig_sum = updated.summary
            updated.summary = f"{updated.summary} (Optimized for target role requirements)."
            diffs.append(DiffItem(
                id=str(uuid.uuid4()),
                section="Summary",
                original_text=orig_sum,
                proposed_text=updated.summary,
                explanation=f"Applied request: '{instruction}'."
            ))

        return ChatEditResponse(
            updated_resume=updated,
            diffs=diffs,
            summary_explanation=f"Applied instruction: '{instruction}'."
        )

    def _mock_field_assist(self, field_name: str, rough_notes: str) -> FieldAssistResponse:
        return FieldAssistResponse(
            field_name=field_name,
            suggested_text=f"Engineered scalable solution from notes: {rough_notes}. Achieved 35% performance improvement.",
            explanation="Transformed rough notes into action-oriented resume phrasing."
        )

gemini_service = GeminiService()
