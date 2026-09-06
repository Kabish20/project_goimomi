import tempfile
import unittest
import zipfile
from pathlib import Path

from create_zip import create_zip


class DeploymentArchiveTests(unittest.TestCase):
    def test_packages_source_and_env_template_without_local_secrets_or_runtime_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'source'
            source.mkdir()
            for name in ('app.py', '.env.example', '.env', '.env.production', 'server.key',
                         'self_client.json', 'db.sqlite3', 'debug.log', '.venv/pyvenv.cfg',
                         'node_modules/package/index.js', 'media/passport.jpg'):
                path = source / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('test fixture', encoding='utf-8')
            archive = root / 'package.zip'
            create_zip(archive, {str(source): ['backend']})
            with zipfile.ZipFile(archive) as result:
                self.assertEqual(set(result.namelist()), {'backend/app.py', 'backend/.env.example'})
