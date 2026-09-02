import zipfile
import os

def create_zip(filename, mapping):
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for local_dir, zip_prefixes in mapping.items():
            if not os.path.exists(local_dir):
                print(f"Skipping non-existent directory: {local_dir}")
                continue
            for root, dirs, files in os.walk(local_dir):
                # Exclude node_modules, venv, dist, media, and cache
                for exc in ['node_modules', 'venv', 'dist', '__pycache__', '.git', 'media', 'visa_cards', '.vscode']:
                    if exc in dirs:
                        dirs.remove(exc)
                
                for file in files:
                    if file.lower().endswith(('.pdf', '.mp4', '.zip', '.tar', '.gz')):
                        continue
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, local_dir).replace('\\', '/')
                    for prefix in zip_prefixes:
                        arcname = f"{prefix}/{rel_path}" if prefix else rel_path
                        zipf.write(file_path, arcname)

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)
    
    mapping = {}
    
    # Map local backend
    backend_local = os.path.join(base_dir, 'goimomibackend') if os.path.exists(os.path.join(base_dir, 'goimomibackend')) else os.path.join(base_dir, 'goimomi-holidays-backend')
    if os.path.exists(backend_local):
        mapping[backend_local] = ['goimomibackend', 'goimomi-holidays-backend']
        
    # Map local frontend
    frontend_local = os.path.join(base_dir, 'goimomifrontend') if os.path.exists(os.path.join(base_dir, 'goimomifrontend')) else os.path.join(base_dir, 'goimomi-holidays-frontend')
    if os.path.exists(frontend_local):
        mapping[frontend_local] = ['goimomifrontend', 'goimomi-holidays-frontend']

    # Map scripts
    scripts_local = os.path.join(base_dir, 'scripts')
    if os.path.exists(scripts_local):
        mapping[scripts_local] = ['scripts']

    zip_output = os.path.join(base_dir, 'update_package.zip')
    create_zip(zip_output, mapping)
    print(f"Zip created successfully at: {zip_output}")
