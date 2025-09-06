import pandas as pd
from datetime import date
import cv2
import calendar
import os

# Load ECA master
eca_master = pd.read_excel("eca_students.xlsx")  # Name, Year, Dept, ID

# Folder for monthly attendance
os.makedirs("attendance_monthly", exist_ok=True)

# Month info
today = date.today()
month_name = today.strftime("%B-%Y")  # e.g., "September-2025"
attendance_file = f"attendance_monthly/eca_{month_name}.xlsx"

# Initialize or load monthly attendance
days_in_month = calendar.monthrange(today.year, today.month)[1]
day_cols = [str(d) for d in range(1, days_in_month + 1)]
columns = ['ID', 'Name', 'Dept', 'Year'] + day_cols

if os.path.exists(attendance_file):
    attendance = pd.read_excel(attendance_file)
    # Make sure all day columns exist (in case month changed)
    for day in day_cols:
        if day not in attendance.columns:
            attendance[day] = "Absent"
else:
    # Create attendance sheet with default Absent
    attendance = pd.DataFrame(columns=columns)
    for _, s in eca_master.iterrows():
        row = [s['ID'], s['Name'], s['Dept'], s['Year']] + ['Absent'] * days_in_month
        attendance.loc[len(attendance)] = row
    attendance.to_excel(attendance_file, index=False, engine="openpyxl")
    print(f"Monthly attendance created with default Absent ✅")

# Function to mark Present
def mark_attendance(details):
    try:
        name, year, dept, student_id = details.split(",")
    except ValueError:
        print(f"Invalid QR data: {details} ❌")
        return
    
    mask = (attendance['ID'] == int(student_id))
    if mask.any():
        day_col = str(today.day)
        attendance.loc[mask, day_col] = "Present"
        attendance.to_excel(attendance_file, index=False, engine="openpyxl")
        print(f"{name} marked present for {today.strftime('%d-%b')} ✅")
    else:
        print(f"{name} not in ECA master, ignored ❌")

# QR Scanner
cap = cv2.VideoCapture(0)
detector = cv2.QRCodeDetector()

print("Scanning QR codes... Press 'q' to quit.")
while True:
    success, img = cap.read()
    if not success:
        continue
    data, bbox, _ = detector.detectAndDecode(img)
    if data:
        mark_attendance(data)
    cv2.imshow('QR Attendance', img)
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
