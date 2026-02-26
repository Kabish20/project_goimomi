import re

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # REMOVE FROM Sidebar
    content = re.sub(
        r"\{\s*id\s*:\s*[3|'accommodation'],\s*label\s*:\s*'Accommodation'.*?\},?\n?", 
        "", content, flags=re.MULTILINE)
    content = re.sub(
        r"\{\s*id\s*:\s*[4|'vehicle'],\s*label\s*:\s*'Vehicle'.*?\},?\n?", 
        "", content, flags=re.MULTILINE)

    # ADD TABS TO "ADD TO THIS DAY"
    tab_addition = r"""{ id: 'transfers', label: 'Transfers', symbol: '+ ' },
                                { id: 'accommodation', label: 'Accommodation', symbol: '+ ' },
                                { id: 'vehicle', label: 'Vehicle', symbol: '+ ' }"""
    content = re.sub(
        r"\{\s*id:\s*'transfers',\s*label:\s*'Transfers',\s*symbol:\s*'\+\s*'\s*\}", 
        tab_addition, content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

process_file(r'd:\G\goimomi-holidays-frontend\src\pages\admin\HolidayPackageAdd.jsx')
process_file(r'd:\G\goimomi-holidays-frontend\src\pages\admin\HolidayPackageEdit.jsx')
print("Tabs modified!")
