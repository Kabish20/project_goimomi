from pathlib import Path
from types import SimpleNamespace
import sys
import fitz

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'goimomibackend'))
from Holidays.profile_documents import attending_poster, participant_booklet, poster_png


class LocalImage:
    def __init__(self, path):
        self.path = path

    def open(self, mode):
        return self.path.open(mode)


output = ROOT / 'output/pdf'
output.mkdir(parents=True, exist_ok=True)
profile = SimpleNamespace(
    full_name='Sample Participant', city='Chennai', country='India',
    profession='Entrepreneur & Business Owner', organization='Sample Textiles',
    years_of_experience=12, interests='Sustainable textiles, responsible sourcing and international trade.',
    connections_sought='Looking to meet distributors and business partners in Colombo to explore new opportunities.',
    website='https://example.com', email='sample@example.com',
    photo=LocalImage(ROOT / 'goimomifrontend/src/assets/TravelGallery/client11.webp'),
    logo=LocalImage(ROOT / 'goimomibackend/Holidays/static/goimomilogo.png'),
)
long_profile = SimpleNamespace(**vars(profile))
long_profile.full_name = 'Long Participant Name ' * 7
long_profile.profession = 'Professional services and international business development ' * 4
long_profile.organization = 'International textiles and sustainable manufacturing organization ' * 4
long_profile.interests = 'Long profile description with opportunities and expertise. ' * 85
long_profile.connections_sought = 'Seeking partnerships and introductions in Sri Lanka. ' * 95
(output / 'attending-poster-social.png').write_bytes(poster_png(attending_poster(profile)))
for name, content in [('attending-poster-sample', attending_poster(profile)),
                      ('participant-booklet-sample', participant_booklet([profile])),
                      ('attending-poster-long', attending_poster(long_profile)),
                      ('participant-booklet-long', participant_booklet([profile, long_profile]))]:
    (output / f'{name}.pdf').write_bytes(content)
    document = fitz.open(stream=content, filetype='pdf')
    text = ' '.join(' '.join(page.get_text() for page in document).split())
    assert 'Sample Participant' in text or 'Long Participant Name' in text
    for index, page in enumerate(document):
        assert len(page.get_images()) >= 3
        page.get_pixmap(matrix=fitz.Matrix(1.2, 1.2)).save(str(output / f'{name}-{index + 1}.png'))
    print(name, len(document), 'pages')
