import zipfile
import os

def create_zip(filename, source_dirs):
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for source_dir in source_dirs:
            for root, dirs, files in os.walk(source_dir):
                # Exclude node_modules, venv, and dist
                if 'node_modules' in dirs:
                    dirs.remove('node_modules')
                if 'venv' in dirs:
                    dirs.remove('venv')
                if 'dist' in dirs:
                    dirs.remove('dist')
                if '__pycache__' in dirs:
                    dirs.remove('__pycache__')
                if '.git' in dirs:
                    dirs.remove('.git')
                if 'media' in dirs:
                    dirs.remove('media')
                
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, os.path.join(source_dir, '..')).replace('\\', '/')
                    zipf.write(file_path, arcname)

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sources = [
        os.path.join(base_dir, 'goimomi-holidays-backend'),
        os.path.join(base_dir, 'goimomi-holidays-frontend')
    ]
    create_zip(os.path.join(base_dir, 'update_package.zip'), sources)
    print("Zip created successfully.")
