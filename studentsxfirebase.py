import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

# Firebase setup
cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Read Excel directly
df = pd.read_excel("all_students.xlsx")  # columns: roll_no, name, dept, year, section

for index, row in df.iterrows():
    roll_no = str(row['roll_no'])
    db.collection("students").document(roll_no).set({
        "roll_no":row['roll_no'],
        "name": row['name'],
        "dept": row['dept'],
        "year": int(row['year']),
        "section": row['section']
    })

print("All students uploaded to Firestore directly from Excel!")
