import zipfile
import os

def zipdir(path, ziph, exclude_dirs):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            file_path = os.path.join(root, file)
            ziph.write(file_path, os.path.relpath(file_path, os.path.join(path, '..')))

if __name__ == "__main__":
    zipf = zipfile.ZipFile('d:/G/update_package.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir('d:/G/goimomi-holidays-backend', zipf, ['venv', '__pycache__', '.git', 'node_modules', 'static', 'media'])
    zipdir('d:/G/goimomi-holidays-frontend', zipf, ['node_modules', '.git', 'dist'])
    zipf.close()
    print("Zip created successfully.")
