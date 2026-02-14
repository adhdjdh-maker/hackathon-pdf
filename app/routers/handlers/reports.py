from app.database.db import history
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, Response
from app.database.db import reports

import io
import re
import html as html_lib
import fitz

router = APIRouter()

@router.get("/{report_id}")
async def get_public_report(report_id: str):
    print(f"Searching for report_id: {report_id}") # ЛОГ В КОНСОЛЬ
    report = await reports.find_one({"report_id": report_id})
    
    if not report:
        print("Not found in reports collection")
        raise HTTPException(status_code=404, detail="Report not found")
        
    report["_id"] = str(report["_id"])
    return report


@router.get("/{report_id}/pdf")
async def export_report_pdf(report_id: str):
    """Экспорт отчета в PDF с подсветкой заимствований (фрагменты из diff-match)."""
    report = await reports.find_one({"report_id": report_id})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    def extract_matches(html_text: str):
        if not html_text:
            return []
        spans = re.findall(r"<span class='diff-match'>(.*?)</span>", html_text, flags=re.DOTALL)
        cleaned = []
        for chunk in spans:
            text = re.sub(r'<[^>]+>', '', chunk)
            text = html_lib.unescape(text).strip()
            if text:
                cleaned.append(text)
        return cleaned

    matches_a = extract_matches(report.get("docA", {}).get("html", ""))
    matches_b = extract_matches(report.get("docB", {}).get("html", ""))

    pdf = fitz.open()
    page = pdf.new_page()

    text_lines = []
    text_lines.append(f"Report ID: {report.get('report_id', '')}")
    text_lines.append(f"Originality: {report.get('originality', 0)}%")
    text_lines.append("")
    text_lines.append("Document A matched fragments:")
    if matches_a:
        for idx, frag in enumerate(matches_a, 1):
            text_lines.append(f"  [{idx}] {frag}")
    else:
        text_lines.append("  (no highlighted overlaps)")
    text_lines.append("")
    text_lines.append("Document B matched fragments:")
    if matches_b:
        for idx, frag in enumerate(matches_b, 1):
            text_lines.append(f"  [{idx}] {frag}")
    else:
        text_lines.append("  (no highlighted overlaps)")

    full_text = "\n".join(text_lines)
    rect = fitz.Rect(40, 40, 550, 800)
    page.insert_textbox(rect, full_text, fontsize=11, fontname="helv")

    pdf_bytes = pdf.tobytes()
    filename = f"qazzerep-report-{report_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        },
    )
