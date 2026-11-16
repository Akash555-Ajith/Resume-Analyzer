import io
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from app.schemas.resume import ResumeData

class ExportService:
    @staticmethod
    def generate_docx(resume: ResumeData) -> io.BytesIO:
        doc = Document()

        # Set standard margins (0.75 in)
        for section in doc.sections:
            section.top_margin = Inches(0.6)
            section.bottom_margin = Inches(0.6)
            section.left_margin = Inches(0.7)
            section.right_margin = Inches(0.7)

        # Header: Name & Contact
        name_p = doc.add_paragraph()
        name_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        name_run = name_p.add_run(resume.personal.name or "Candidate Name")
        name_run.font.name = "Calibri"
        name_run.font.size = Pt(20)
        name_run.font.bold = True
        name_run.font.color.rgb = RGBColor(15, 23, 42)

        # Contact Info Line
        contact_parts = []
        if resume.personal.email: contact_parts.append(resume.personal.email)
        if resume.personal.phone: contact_parts.append(resume.personal.phone)
        if resume.personal.location: contact_parts.append(resume.personal.location)
        if resume.personal.linkedin: contact_parts.append(resume.personal.linkedin)
        if resume.personal.github: contact_parts.append(resume.personal.github)
        if resume.personal.portfolio: contact_parts.append(resume.personal.portfolio)

        contact_p = doc.add_paragraph(" | ".join(contact_parts))
        contact_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in contact_p.runs:
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.color.rgb = RGBColor(71, 85, 105)

        # Add Sections dynamically based on sections_order
        sections_map = {
            "summary": lambda: ExportService._add_summary(doc, resume),
            "education": lambda: ExportService._add_education(doc, resume),
            "experience": lambda: ExportService._add_experience(doc, resume),
            "projects": lambda: ExportService._add_projects(doc, resume),
            "skills": lambda: ExportService._add_skills(doc, resume),
            "certifications": lambda: ExportService._add_certifications(doc, resume),
            "achievements": lambda: ExportService._add_achievements(doc, resume),
            "publications": lambda: ExportService._add_publications(doc, resume),
            "leadership": lambda: ExportService._add_leadership(doc, resume),
        }

        for sec in resume.sections_order:
            if sec in sections_map:
                sections_map[sec]()

        file_stream = io.BytesIO()
        doc.save(file_stream)
        file_stream.seek(0)
        return file_stream

    @staticmethod
    def _add_section_heading(doc: Document, title: str):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(8)
        h.paragraph_format.space_after = Pt(3)
        run = h.add_run(title.upper())
        run.font.name = "Calibri"
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(30, 41, 59)

    @staticmethod
    def _add_summary(doc: Document, resume: ResumeData):
        if not resume.summary: return
        ExportService._add_section_heading(doc, "Professional Summary")
        p = doc.add_paragraph(resume.summary)
        p.paragraph_format.space_after = Pt(4)
        for r in p.runs:
            r.font.name = "Calibri"
            r.font.size = Pt(10)

    @staticmethod
    def _add_education(doc: Document, resume: ResumeData):
        if not resume.education: return
        ExportService._add_section_heading(doc, "Education")
        for edu in resume.education:
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(1)
            deg_run = p.add_run(edu.degree)
            deg_run.bold = True
            p.add_run(f" — {edu.institution}")
            if edu.graduation_year:
                p.add_run(f" ({edu.graduation_year})")
            if edu.gpa:
                p.add_run(f" | GPA: {edu.gpa}")
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(10)

            if edu.coursework:
                cw_p = doc.add_paragraph(f"Relevant Coursework: {', '.join(edu.coursework)}")
                cw_p.paragraph_format.space_after = Pt(3)
                for r in cw_p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(9)
                    r.font.color.rgb = RGBColor(100, 116, 139)

    @staticmethod
    def _add_experience(doc: Document, resume: ResumeData):
        if not resume.experience: return
        ExportService._add_section_heading(doc, "Work Experience")
        for exp in resume.experience:
            header_p = doc.add_paragraph()
            header_p.paragraph_format.space_after = Pt(1)
            pos_run = header_p.add_run(exp.position)
            pos_run.bold = True
            header_p.add_run(f" — {exp.company}")
            dates = f"{exp.start_date} – {exp.end_date or ('Present' if exp.is_current else '')}"
            if dates.strip():
                header_p.add_run(f" | {dates}")
            if exp.location:
                header_p.add_run(f" ({exp.location})")
            for r in header_p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(10)

            for b in exp.bullet_points:
                b_p = doc.add_paragraph(b, style='List Bullet')
                b_p.paragraph_format.space_after = Pt(1)
                for r in b_p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(9.5)

    @staticmethod
    def _add_projects(doc: Document, resume: ResumeData):
        if not resume.projects: return
        ExportService._add_section_heading(doc, "Projects")
        for proj in resume.projects:
            header_p = doc.add_paragraph()
            header_p.paragraph_format.space_after = Pt(1)
            name_run = header_p.add_run(proj.name)
            name_run.bold = True
            if proj.technologies:
                header_p.add_run(f" | Technologies: {', '.join(proj.technologies)}")
            if proj.link:
                header_p.add_run(f" ({proj.link})")
            for r in header_p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(10)

            if proj.description:
                desc_p = doc.add_paragraph(proj.description)
                desc_p.paragraph_format.space_after = Pt(1)
                for r in desc_p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(9.5)

            for b in proj.bullet_points:
                b_p = doc.add_paragraph(b, style='List Bullet')
                b_p.paragraph_format.space_after = Pt(1)
                for r in b_p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(9.5)

    @staticmethod
    def _add_skills(doc: Document, resume: ResumeData):
        s = resume.skills
        has_skills = any([s.languages, s.frameworks, s.tools, s.databases, s.other])
        if not has_skills: return
        ExportService._add_section_heading(doc, "Technical Skills")
        
        cats = [
            ("Languages", s.languages),
            ("Frameworks & Libraries", s.frameworks),
            ("Tools & Cloud", s.tools),
            ("Databases", s.databases),
            ("Other", s.other)
        ]
        for name, items in cats:
            if items:
                p = doc.add_paragraph()
                p.paragraph_format.space_after = Pt(1)
                cat_run = p.add_run(f"{name}: ")
                cat_run.bold = True
                p.add_run(", ".join(items))
                for r in p.runs:
                    r.font.name = "Calibri"
                    r.font.size = Pt(9.5)

    @staticmethod
    def _add_certifications(doc: Document, resume: ResumeData):
        if not resume.certifications: return
        ExportService._add_section_heading(doc, "Certifications")
        for c in resume.certifications:
            p = doc.add_paragraph(c, style='List Bullet')
            p.paragraph_format.space_after = Pt(1)
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9.5)

    @staticmethod
    def _add_achievements(doc: Document, resume: ResumeData):
        if not resume.achievements: return
        ExportService._add_section_heading(doc, "Honors & Achievements")
        for a in resume.achievements:
            p = doc.add_paragraph(a, style='List Bullet')
            p.paragraph_format.space_after = Pt(1)
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9.5)

    @staticmethod
    def _add_publications(doc: Document, resume: ResumeData):
        if not resume.publications: return
        ExportService._add_section_heading(doc, "Publications")
        for pub in resume.publications:
            p = doc.add_paragraph(pub, style='List Bullet')
            p.paragraph_format.space_after = Pt(1)
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9.5)

    @staticmethod
    def _add_leadership(doc: Document, resume: ResumeData):
        if not resume.leadership: return
        ExportService._add_section_heading(doc, "Leadership & Activities")
        for l in resume.leadership:
            p = doc.add_paragraph(l, style='List Bullet')
            p.paragraph_format.space_after = Pt(1)
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9.5)

    @staticmethod
    def generate_txt(resume: ResumeData) -> str:
        lines = []
        name = resume.personal.name or "Candidate Name"
        lines.append(name.upper())
        lines.append("=" * len(name))
        
        contact = []
        if resume.personal.email: contact.append(resume.personal.email)
        if resume.personal.phone: contact.append(resume.personal.phone)
        if resume.personal.location: contact.append(resume.personal.location)
        if resume.personal.linkedin: contact.append(resume.personal.linkedin)
        if resume.personal.github: contact.append(resume.personal.github)
        lines.append(" | ".join(contact))
        lines.append("")

        if resume.summary:
            lines.append("SUMMARY")
            lines.append("-" * 7)
            lines.append(resume.summary)
            lines.append("")

        if resume.education:
            lines.append("EDUCATION")
            lines.append("-" * 9)
            for e in resume.education:
                lines.append(f"{e.degree} - {e.institution} ({e.graduation_year})")
                if e.gpa: lines.append(f"GPA: {e.gpa}")
                if e.coursework: lines.append(f"Coursework: {', '.join(e.coursework)}")
                lines.append("")

        if resume.experience:
            lines.append("EXPERIENCE")
            lines.append("-" * 10)
            for exp in resume.experience:
                lines.append(f"{exp.position} at {exp.company} ({exp.start_date} - {exp.end_date})")
                for b in exp.bullet_points:
                    lines.append(f"  * {b}")
                lines.append("")

        if resume.projects:
            lines.append("PROJECTS")
            lines.append("-" * 8)
            for p in resume.projects:
                lines.append(f"{p.name} [{', '.join(p.technologies)}]")
                if p.description: lines.append(f"  {p.description}")
                for b in p.bullet_points:
                    lines.append(f"  * {b}")
                lines.append("")

        s = resume.skills
        lines.append("SKILLS")
        lines.append("-" * 6)
        if s.languages: lines.append(f"Languages: {', '.join(s.languages)}")
        if s.frameworks: lines.append(f"Frameworks: {', '.join(s.frameworks)}")
        if s.tools: lines.append(f"Tools: {', '.join(s.tools)}")
        if s.databases: lines.append(f"Databases: {', '.join(s.databases)}")
        if s.other: lines.append(f"Other: {', '.join(s.other)}")
        lines.append("")

        if resume.certifications:
            lines.append("CERTIFICATIONS")
            lines.append("-" * 14)
            for c in resume.certifications: lines.append(f"  * {c}")
            lines.append("")

        return "\n".join(lines)

export_service = ExportService()
