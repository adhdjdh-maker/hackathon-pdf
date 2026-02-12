from app.database.db import history
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.database.db import reports

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
