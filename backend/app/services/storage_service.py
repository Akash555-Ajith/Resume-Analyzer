import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
from app.config import settings
from app.schemas.resume import ResumeData, ResumeVersion, PersonalInfo, SkillsCategorized

class StorageService:
    def __init__(self):
        self.data_dir = settings.DATA_DIR
        self.resumes_file = self.data_dir / "resumes.json"
        self.versions_file = self.data_dir / "versions.json"
        self.profile_file = self.data_dir / "profile.json"
        self._ensure_files()

    def _ensure_files(self):
        if not self.resumes_file.exists():
            default_resumes = [self._create_default_resume()]
            self._save_json(self.resumes_file, [r.model_dump() for r in default_resumes])
        if not self.versions_file.exists():
            self._save_json(self.versions_file, {})
        if not self.profile_file.exists():
            default_profile = self._create_default_resume().model_dump()
            self._save_json(self.profile_file, default_profile)

    def _read_json(self, path: Path) -> Any:
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return None

    def _save_json(self, path: Path, data: Any):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def _create_default_resume(self) -> ResumeData:
        return ResumeData(
            id="master-1",
            title="Software Engineer Resume",
            template_id="modern",
            career_stage="software_engineer",
            personal=PersonalInfo(
                name="Alex Mercer",
                email="alex.mercer@example.com",
                phone="+1 (555) 349-2810",
                location="San Francisco, CA",
                linkedin="linkedin.com/in/alex-mercer",
                github="github.com/alexmercer",
                portfolio="alexmercer.dev",
                title="Full-Stack & Distributed Systems Engineer"
            ),
            summary="Software engineer with 4+ years of experience designing high-throughput backend services and reactive web applications. Proven track record of reducing latency by 35% and automating CI/CD pipelines.",
            education=[
                {
                    "id": "edu-1",
                    "degree": "B.S. in Computer Science",
                    "institution": "University of California, Berkeley",
                    "graduation_year": "2021",
                    "gpa": "3.85",
                    "location": "Berkeley, CA",
                    "coursework": ["Distributed Systems", "Database Management", "Algorithms & Data Structures"]
                }
            ],
            experience=[
                {
                    "id": "exp-1",
                    "company": "CloudScale Technologies",
                    "position": "Senior Software Engineer",
                    "location": "San Francisco, CA",
                    "start_date": "2022",
                    "end_date": "Present",
                    "is_current": True,
                    "bullet_points": [
                        "Architected distributed event-driven ingestion pipeline handling 120,000 events/second using Go, Kafka, and PostgreSQL.",
                        "Optimized database query indexes and caching layers in Redis, reducing p99 API query response times from 180ms to 42ms.",
                        "Collaborated with cross-functional engineering teams to implement automated end-to-end testing with 88% code coverage."
                    ],
                    "technologies": ["Go", "Kafka", "PostgreSQL", "Redis", "Docker", "Kubernetes"]
                },
                {
                    "id": "exp-2",
                    "company": "Nexus Systems",
                    "position": "Software Engineer",
                    "location": "San Jose, CA",
                    "start_date": "2021",
                    "end_date": "2022",
                    "is_current": False,
                    "bullet_points": [
                        "Developed microservices backend for financial analytics dashboard using Python, FastAPI, and SQLAlchemy.",
                        "Designed responsive React and TypeScript UI components with accessible design system guidelines.",
                        "Integrated automated GitHub Actions workflows for continuous integration and staging deployments."
                    ],
                    "technologies": ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL"]
                }
            ],
            projects=[
                {
                    "id": "proj-1",
                    "name": "Distributed Key-Value Engine",
                    "description": "Fault-tolerant distributed key-value store implementing Raft consensus protocol.",
                    "technologies": ["Go", "Raft", "gRPC", "Docker"],
                    "link": "github.com/alexmercer/raft-kv",
                    "contribution": "Engineered leader election and log replication logic.",
                    "results": "Achieved linearizable read performance across 5 distributed nodes.",
                    "bullet_points": [
                        "Implemented Raft consensus algorithm with dynamic leader election and log compaction routines.",
                        "Benchmarked write throughput to 45,000 operations per second under simulated packet loss.",
                        "Configured containerized integration tests using Docker Compose and GitHub Actions."
                    ],
                    "evidence": "Raft KV repository with unit tests and benchmark suite"
                },
                {
                    "id": "proj-2",
                    "name": "Real-time Telemetry Monitor",
                    "description": "Kernel-level packet inspection monitor built with eBPF and visualized via React dashboard.",
                    "technologies": ["C", "eBPF", "Python", "React", "WebSockets"],
                    "link": "github.com/alexmercer/ebpf-monitor",
                    "contribution": "Wrote kernel probes and WebSocket streaming server.",
                    "results": "Zero overhead live packet latency tracking.",
                    "bullet_points": [
                        "Developed eBPF bytecode programs capturing TCP socket metrics directly from Linux kernel space.",
                        "Built streaming WebSocket bridge in Python dispatching telemetry to an interactive React dashboard."
                    ],
                    "evidence": "eBPF C probe source files and frontend telemetry charts"
                }
            ],
            skills=SkillsCategorized(
                languages=["Python", "Go", "TypeScript", "JavaScript", "SQL", "C++"],
                frameworks=["FastAPI", "React", "Node.js", "Django", "Next.js"],
                tools=["Docker", "Kubernetes", "Git", "GitHub Actions", "Linux", "Terraform"],
                databases=["PostgreSQL", "Redis", "MongoDB"],
                other=["Distributed Systems", "REST APIs", "gRPC", "Microservices Architecture"]
            ),
            certifications=["AWS Certified Solutions Architect - Associate", "Certified Kubernetes Administrator (CKA)"],
            achievements=["Dean's Honors List (UC Berkeley 2019-2021)", "1st Place Hackathon Winner - CalHacks"],
            publications=["Low Latency Consensus Patterns in Distributed Ledgers (Conference Paper, 2023)"],
            leadership=["Peer Mentor - CS Undergrad Mentorship Program"],
            created_at=datetime.utcnow().isoformat(),
            updated_at=datetime.utcnow().isoformat()
        )

    def list_resumes(self) -> List[ResumeData]:
        raw = self._read_json(self.resumes_file) or []
        resumes = []
        for r in raw:
            try:
                resumes.append(ResumeData(**r))
            except Exception:
                continue
        if not resumes:
            default_r = self._create_default_resume()
            self.save_resume(default_r)
            return [default_r]
        return resumes

    def get_resume(self, resume_id: str) -> Optional[ResumeData]:
        resumes = self.list_resumes()
        for r in resumes:
            if r.id == resume_id:
                return r
        # Return first if not found, or None
        return resumes[0] if resumes else None

    def save_resume(self, resume: ResumeData) -> ResumeData:
        resumes = self.list_resumes()
        now = datetime.utcnow().isoformat()
        resume.updated_at = now
        
        found = False
        updated_list = []
        for r in resumes:
            if r.id == resume.id:
                updated_list.append(resume)
                found = True
            else:
                updated_list.append(r)
        
        if not found:
            if not resume.created_at:
                resume.created_at = now
            updated_list.append(resume)

        self._save_json(self.resumes_file, [r.model_dump() for r in updated_list])
        return resume

    def delete_resume(self, resume_id: str) -> bool:
        resumes = self.list_resumes()
        if len(resumes) <= 1:
            return False  # Prevent deleting only resume
        updated = [r for r in resumes if r.id != resume_id]
        self._save_json(self.resumes_file, [r.model_dump() for r in updated])
        return True

    def duplicate_resume(self, resume_id: str) -> Optional[ResumeData]:
        target = self.get_resume(resume_id)
        if not target:
            return None
        new_data = target.model_copy(deep=True)
        new_data.id = f"resume-{uuid.uuid4().hex[:6]}"
        new_data.title = f"{target.title} (Copy)"
        new_data.created_at = datetime.utcnow().isoformat()
        new_data.updated_at = datetime.utcnow().isoformat()
        self.save_resume(new_data)
        return new_data

    # Version tracking
    def get_versions(self, resume_id: str) -> List[ResumeVersion]:
        data = self._read_json(self.versions_file) or {}
        raw_list = data.get(resume_id, [])
        return [ResumeVersion(**v) for v in raw_list]

    def create_version(self, resume_id: str, version_name: str, change_summary: str, resume: ResumeData) -> ResumeVersion:
        data = self._read_json(self.versions_file) or {}
        raw_list = data.get(resume_id, [])
        version = ResumeVersion(
            id=f"ver-{uuid.uuid4().hex[:8]}",
            resume_id=resume_id,
            version_name=version_name,
            created_at=datetime.utcnow().isoformat(),
            change_summary=change_summary,
            data=resume
        )
        raw_list.append(version.model_dump())
        data[resume_id] = raw_list[-10:]  # Keep last 10 versions
        self._save_json(self.versions_file, data)
        return version

    # Master Profile
    def get_profile(self) -> ResumeData:
        raw = self._read_json(self.profile_file)
        if raw:
            try:
                return ResumeData(**raw)
            except Exception:
                pass
        default_r = self._create_default_resume()
        self.save_profile(default_r)
        return default_r

    def save_profile(self, profile: ResumeData) -> ResumeData:
        self._save_json(self.profile_file, profile.model_dump())
        return profile

storage_service = StorageService()
