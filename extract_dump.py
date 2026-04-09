import re
import json

def extract_table_data(sql_file, table_name):
    with open(sql_file, 'r', encoding='latin-1') as f:
        content = f.read()
    pattern = rf'COPY public\."{table_name}" .*? FROM stdin;(.*?)' + r'\\\.'
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1).strip().split('\n') if match else None

def parse_simple_related(data):
    # For Inclusion, Exclusion, Highlight
    mapping = {}
    if not data: return mapping
    for line in data:
        parts = line.split('\t')
        if len(parts) >= 3:
            # id, text, package_id
            pkg_id = parts[2]
            if pkg_id not in mapping: mapping[pkg_id] = []
            mapping[pkg_id].append(parts[1])
    return mapping

def main():
    itinerary_data = extract_table_data('d:/G/full_dump.sql', 'Holidays_itineraryday')
    pkg_data = extract_table_data('d:/G/full_dump.sql', 'Holidays_holidaypackage')
    incl_data = extract_table_data('d:/G/full_dump.sql', 'Holidays_inclusion')
    excl_data = extract_table_data('d:/G/full_dump.sql', 'Holidays_exclusion')
    high_data = extract_table_data('d:/G/full_dump.sql', 'Holidays_highlight')
    
    if itinerary_data and pkg_data:
        itineraries = []
        for line in itinerary_data:
            parts = line.split('\t')
            if len(parts) >= 6:
                itineraries.append({'id': parts[0], 'day': parts[1], 'title': parts[2], 'description': parts[3], 'package_id': parts[5]})
        
        inclusions = parse_simple_related(incl_data)
        exclusions = parse_simple_related(excl_data)
        highlights = parse_simple_related(high_data)
        
        packages = []
        for line in pkg_data:
            parts = line.split('\t')
            if len(parts) >= 6:
                pkg_id = parts[0]
                packages.append({
                    'id': pkg_id,
                    'title': parts[1],
                    'description': parts[2] if parts[2] != '\\N' else "",
                    'days': parts[3] if parts[3] != '\\N' else "1",
                    'offer_price': parts[4] if parts[4] != '\\N' else "0",
                    'price': parts[5] if parts[5] != '\\N' else "0",
                    'itinerary': [d for d in itineraries if d['package_id'] == pkg_id],
                    'inclusions': inclusions.get(pkg_id, []),
                    'exclusions': exclusions.get(pkg_id, []),
                    'highlights': highlights.get(pkg_id, [])
                })
        
        with open('d:/G/full_restoration_data.json', 'w', encoding='utf-8') as f:
            json.dump(packages, f, indent=2)
        print(f"Extraction complete with inclusions/exclusions.")

if __name__ == "__main__":
    main()
