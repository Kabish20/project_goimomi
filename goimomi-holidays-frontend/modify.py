import re

def main():
    for filepath in [r"d:\G\goimomi-holidays-frontend\src\pages\admin\HolidayPackageAdd.jsx", r"d:\G\goimomi-holidays-frontend\src\pages\admin\HolidayPackageEdit.jsx"]:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        # 1. Remove from Sidebar
        content = re.sub(
            r"\{\s*id\s*:\s*(3|'accommodation'),\s*label\s*:\s*'Accommodation'.*?\},?\n?", 
            "", content)
        content = re.sub(
            r"\{\s*id\s*:\s*(4|'vehicle'),\s*label\s*:\s*'Vehicle'.*?\},?\n?", 
            "", content)
            
        # 2. Add to "Add to this day" tabs
        tab_list = """[
                                { id: 'day_itinerary', label: 'Day Itinerary', symbol: '' },
                                { id: 'sightseeing', label: 'Sightseeing', symbol: '+ ' },
                                { id: 'transfers', label: 'Transfers', symbol: '+ ' },
                                { id: 'accommodation', label: 'Accommodation', symbol: '+ ' },
                                { id: 'vehicle', label: 'Vehicle', symbol: '+ ' }
                              ]"""
        content = re.sub(
            r"\[\s*\{\s*id:\s*'day_itinerary'.*?\{\s*id:\s*'transfers'.*?\}\s*\]", 
            tab_list, content, flags=re.DOTALL)
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    main()
