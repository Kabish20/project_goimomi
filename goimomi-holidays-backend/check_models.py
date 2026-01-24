import os
path = os.path.expanduser('~/goimomi/goimomi-holidays-backend/Holidays/models.py')
with open(path, 'r') as f:
    lines = f.readlines()
    start = max(0, 200)
    end = min(len(lines), 350)
    for i in range(start, end):
        print(f"{i+1}: {lines[i].strip()}")
