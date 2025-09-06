import qrcode
import pandas as pd
import os

# Load master Excel
students = pd.read_excel("all_students.xlsx")  # Name, Year, Dept, ID

# Create folder if not exists
folder = "QRCodes"
os.makedirs(folder, exist_ok=True)

for _, s in students.iterrows():
    data = f"{s['Name']},{s['Year']},{s['Dept']},{s['ID']}"
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save in folder
    filename = os.path.join(folder, f"{s['ID']}_{s['Name']}.png")
    img.save(filename)
    print(f"QR generated for {s['Name']} ✅")
