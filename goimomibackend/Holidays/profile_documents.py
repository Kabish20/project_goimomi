"""Branded participant documents, generated from saved profile data."""
from io import BytesIO
import logging
from pathlib import Path
from textwrap import wrap
from threading import Lock
from uuid import uuid4
from xml.sax.saxutils import escape

from django.core.files.base import ContentFile
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Flowable, Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

STATIC = Path(__file__).resolve().parent / 'static'
GREEN = colors.HexColor('#123e29')
GOLD = colors.HexColor('#bb963e')
IVORY = colors.HexColor('#f7f4eb')
PDF_RENDER_LOCK = Lock()
BODY = ParagraphStyle('ProfileBody', fontName='Helvetica', fontSize=10, leading=15,
                      textColor=GREEN, spaceAfter=10, splitLongWords=True)
LABEL = ParagraphStyle('ProfileLabel', parent=BODY, fontName='Helvetica-Bold', fontSize=9,
                       textColor=colors.HexColor('#647568'), spaceBefore=8, spaceAfter=4)
TITLE = ParagraphStyle('ProfileTitle', parent=BODY, fontName='Helvetica-Bold', fontSize=25, leading=30)


def paragraph(value, style=BODY):
    return Paragraph(escape(str(value or '')).replace('\n', '<br/>'), style)


def uploaded_bytes(field):
    with field.open('rb') as source:
        return BytesIO(source.read())


def contained_image(source, width, height):
    result = Image(source)
    scale = min(width / result.imageWidth, height / result.imageHeight)
    result.drawWidth = result.imageWidth * scale
    result.drawHeight = result.imageHeight * scale
    return result


def brand_header(pdf, width, height):
    pdf.setFillColor(colors.white)
    pdf.rect(0, height - 112, width, 112, fill=1, stroke=0)
    pdf.drawImage(str(STATIC / 'goimomilogo.png'), 36, height - 84, 126, 60,
                  preserveAspectRatio=True, anchor='c', mask='auto')
    pdf.drawImage(str(STATIC / 'global_horizons/event-logo.jpeg'), width / 2 - 43, height - 99, 86, 86,
                  preserveAspectRatio=True, mask='auto')
    pdf.drawImage(str(STATIC / 'global_horizons/chithirai-logo.png'), width - 118, height - 79, 56, 56,
                  preserveAspectRatio=True, mask='auto')
    pdf.setFillColor(GREEN)
    pdf.setFont('Helvetica-Bold', 8)
    pdf.drawCentredString(width - 90, height - 91, 'CHITHIRAI')
    pdf.setStrokeColor(GOLD)
    pdf.line(36, height - 112, width - 36, height - 112)


def attending_poster(profile):
    """Personalised 4:5 social artwork inspired by the Sri Lanka event campaign."""
    output = BytesIO()
    width, height = 720, 900
    pdf = canvas.Canvas(output, pagesize=(width, height))
    pdf.setTitle(f"We are attending - {profile.full_name} - Global Horizons Sri Lanka")
    pdf.drawImage(str(STATIC / 'global_horizons/attending-landscape-v2.png'),
                  0, 0, width, height, mask='auto')

    # Scenic upper half and the original event identity, with no re-created logo text.
    pdf.setFillColor(GREEN)
    pdf.setFont('Helvetica', 8)
    for index, line in enumerate(['PEOPLE', 'PARTNERSHIPS', 'POSSIBILITIES', 'A BRIGHTER TOMORROW']):
        pdf.drawString(32, 864 - index * 15, line)
    pdf.setStrokeColor(GOLD)
    pdf.setLineWidth(1.5)
    pdf.line(32, 795, 82, 795)
    pdf.setFillColor(GREEN)
    pdf.setFont('Times-Italic', 30)
    pdf.drawRightString(686, 843, 'Sri Lanka')
    pdf.setFont('Helvetica', 7)
    pdf.drawRightString(686, 825, 'LAND OF NEW HORIZONS')
    pdf.setStrokeColor(GOLD)
    pdf.line(602, 815, 686, 815)

    pdf.saveState()
    clip = pdf.beginPath()
    clip.circle(360, 744, 146)
    pdf.clipPath(clip, stroke=0)
    pdf.drawImage(str(STATIC / 'global_horizons/event-logo.jpeg'), 214, 598, 292, 292)
    pdf.restoreState()
    pdf.setStrokeColor(GREEN)
    pdf.setLineWidth(3)
    pdf.circle(360, 744, 146, fill=0, stroke=1)

    # A brush-edged banner echoes the supplied reference without obscuring details.
    brush = pdf.beginPath()
    brush.moveTo(76, 600)
    for x, y in [(132, 608), (121, 602), (587, 605), (632, 594), (617, 587),
                 (650, 574), (635, 568), (654, 549), (641, 537), (651, 521),
                 (631, 509), (646, 494), (600, 491), (608, 483), (97, 488),
                 (74, 495), (88, 505), (66, 519), (79, 536), (67, 549),
                 (81, 561), (70, 575), (88, 586)]:
        brush.lineTo(x, y)
    brush.close()
    pdf.setFillColor(colors.HexColor('#07351f'))
    pdf.drawPath(brush, fill=1, stroke=0)
    pdf.setFillColor(colors.white)
    pdf.setFont('Helvetica-Bold', 35)
    pdf.drawCentredString(360, 563, 'WE ARE')
    pdf.setFont('Helvetica-Bold', 65)
    pdf.setFillColor(colors.HexColor('#735522'))
    pdf.drawCentredString(361, 500, 'ATTENDING')
    pdf.setFillColor(colors.HexColor('#efce73'))
    pdf.drawCentredString(360, 503, 'ATTENDING')
    pdf.setStrokeColor(GOLD)
    pdf.setLineWidth(1)
    pdf.line(146, 491, 574, 491)
    pdf.saveState()
    pdf.setFillColor(IVORY)
    pdf.setFillAlpha(0.94)
    pdf.roundRect(60, 423, 600, 59, 9, fill=1, stroke=0)
    pdf.restoreState()
    pdf.setFillColor(GREEN)
    pdf.setFont('Helvetica-Bold', 23)
    pdf.drawCentredString(360, 459, 'GLOBAL HORIZONS SRI LANKA 2026')
    pdf.setFont('Times-Italic', 20)
    pdf.drawCentredString(360, 434, 'Business Beyond Borders')
    pdf.setStrokeColor(GOLD)
    pdf.line(105, 441, 180, 441)
    pdf.line(540, 441, 615, 441)

    # Personalisation sits on a quiet panel so real photos and long names stay clear.
    pdf.setFillColor(colors.white)
    pdf.setStrokeColor(colors.HexColor('#d3b66b'))
    pdf.roundRect(44, 207, 632, 212, 15, fill=1, stroke=1)
    pdf.saveState()
    clip = pdf.beginPath()
    clip.roundRect(62, 225, 160, 176, 9)
    pdf.clipPath(clip, stroke=0)
    draw_portrait(pdf, uploaded_bytes(profile.photo), 62, 225, 160, 176)
    pdf.restoreState()
    pdf.setFillColor(GOLD)
    pdf.setFont('Helvetica-Bold', 8)
    pdf.drawString(246, 394, 'MEET US IN COLOMBO')
    fitted_text(pdf, profile.full_name, 246, 380, 408, 61, 29, bold=True)
    fitted_text(pdf, profile.organization, 246, 312, 408, 37, 18, bold=True)
    fitted_text(pdf, profile.profession, 246, 268, 318, 27, 12)
    fitted_text(pdf, f'{profile.city}, {profile.country}', 246, 234, 318, 18, 10)
    if profile.logo:
        pdf.drawImage(ImageReader(uploaded_bytes(profile.logo)), 584, 223, 68, 45,
                      preserveAspectRatio=True, anchor='c', mask='auto')

    # Keep approved brand marks intact and visually balanced.
    pdf.setFillColor(colors.white)
    pdf.setStrokeColor(GOLD)
    pdf.roundRect(90, 112, 540, 76, 14, fill=1, stroke=1)
    pdf.drawImage(str(STATIC / 'goimomilogo.png'), 114, 122, 190, 55,
                  preserveAspectRatio=True, anchor='c', mask='auto')
    pdf.line(342, 124, 342, 176)
    pdf.drawImage(str(STATIC / 'global_horizons/chithirai-logo.png'), 368, 127, 46, 46,
                  preserveAspectRatio=True, anchor='c', mask='auto')
    pdf.setFillColor(colors.HexColor('#d30d28'))
    pdf.setFont('Helvetica-Bold', 27)
    pdf.drawString(426, 138, 'Chithirai')
    pdf.setFillColor(GREEN)
    pdf.setStrokeColor(GOLD)
    pdf.setLineWidth(1.5)
    pdf.roundRect(158, 57, 404, 38, 19, fill=1, stroke=1)
    pdf.setFillColor(colors.white)
    pdf.setFont('Helvetica-Bold', 15)
    pdf.drawCentredString(351, 70, "Let's connect in Sri Lanka")
    pdf.setStrokeColor(colors.HexColor('#efce73'))
    pdf.line(522, 76, 539, 76)
    pdf.line(533, 82, 539, 76)
    pdf.line(533, 70, 539, 76)
    pdf.setFillColor(GREEN)
    pdf.setFont('Helvetica', 8)
    pdf.drawCentredString(360, 32, 'TRAVEL   /   PEOPLE   /   PARTNERSHIPS   /   POSSIBILITIES')
    pdf.save()
    return output.getvalue()


def fitted_text(pdf, value, x, top, width, height, size, bold=False):
    while True:
        style = ParagraphStyle('Fitted', fontName='Helvetica-Bold' if bold else 'Helvetica',
                               fontSize=size, leading=size * 1.15, textColor=GREEN, splitLongWords=True)
        text = paragraph(value, style)
        _, actual = text.wrap(width, height)
        if actual <= height or size <= 6:
            break
        size -= 1
    text.drawOn(pdf, x, top - actual)


def draw_portrait(pdf, source, x, y, width, height):
    image = ImageReader(source)
    source_width, source_height = image.getSize()
    scale = max(width / source_width, height / source_height)
    drawn_width, drawn_height = source_width * scale, source_height * scale
    pdf.saveState()
    path = pdf.beginPath()
    path.rect(x, y, width, height)
    pdf.clipPath(path, stroke=0)
    # Keep the upper part of a portrait visible when the frame crops vertically.
    pdf.drawImage(image, x - (drawn_width - width) / 2,
                  y - (drawn_height - height) * 0.8, drawn_width, drawn_height, mask='auto')
    pdf.restoreState()


class Portrait(Flowable):
    def __init__(self, source, width=142, height=172):
        super().__init__()
        self.source, self.width, self.height = source, width, height

    def draw(self):
        draw_portrait(self.canv, self.source, 0, 0, self.width, self.height)


def poster_png(content):
    import pypdfium2 as pdfium
    output = BytesIO()
    # PDFium must not run concurrently in multiple request threads.
    with PDF_RENDER_LOCK:
        document = pdfium.PdfDocument(content)
        try:
            page = document[0]
            bitmap = page.render(scale=1.5)
            try:
                bitmap.to_pil().save(output, format='PNG')
            finally:
                bitmap.close()
                page.close()
        finally:
            document.close()
    return output.getvalue()


def participant_booklet(profiles):
    """Professional introductions only; travel logistics remain in the staff export."""
    output = BytesIO()
    document = SimpleDocTemplate(output, pagesize=A4, leftMargin=40, rightMargin=40,
                                 topMargin=132, bottomMargin=48, title='Global Horizons - Participant Profiles')
    story = []
    if len(profiles) > 1:
        cover_title = ParagraphStyle('CoverTitle', parent=TITLE, fontSize=43, leading=47)
        story.extend([Spacer(1, 24), paragraph('GLOBAL HORIZONS  /  SRI LANKA 2026', LABEL),
                      Spacer(1, 14), paragraph('People.\nPossibilities.\nPartnerships.', cover_title),
                      Spacer(1, 24), contained_image(str(STATIC / 'global_horizons/event-logo.jpeg'), 210, 210),
                      Spacer(1, 24), paragraph('THE PARTICIPANT BOOKLET', LABEL),
                      paragraph(f'{len(profiles)} entrepreneur profiles. A world of opportunity.'),
                      paragraph('Meet the people building meaningful business connections in Colombo.'), PageBreak()])
    for index, profile in enumerate(profiles):
        if index:
            story.append(PageBreak())
        story.extend([paragraph(f'PARTICIPANT {index + 1:02d}  /  GLOBAL HORIZONS', LABEL),
                      paragraph(profile.full_name, TITLE), Spacer(1, 12)])
        identity = [paragraph('BUSINESS / PROFESSION', LABEL), paragraph(profile.profession),
                    paragraph('ORGANIZATION / BRAND', LABEL), paragraph(profile.organization),
                    paragraph(f'{profile.years_of_experience} years of experience'),
                    paragraph(f'{profile.city}, {profile.country}')]
        if profile.logo:
            identity.append(contained_image(uploaded_bytes(profile.logo), 102, 40))
        row = Table([[Portrait(uploaded_bytes(profile.photo)), identity]], colWidths=[170, document.width - 170])
        row.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                                 ('BACKGROUND', (0, 0), (-1, -1), IVORY),
                                 ('LEFTPADDING', (0, 0), (-1, -1), 14),
                                 ('RIGHTPADDING', (0, 0), (-1, -1), 14),
                                 ('TOPPADDING', (0, 0), (-1, -1), 14),
                                 ('BOTTOMPADDING', (0, 0), (-1, -1), 14)]))
        story.extend([row, Spacer(1, 20)])
        for label, value in [
            ('01  /  EXPERTISE & INTERESTS', profile.interests),
            ('02  /  CONNECTIONS I AM LOOKING FOR', profile.connections_sought),
            ('03  /  CONNECT WITH ME', '\n'.join(value for value in [profile.email, profile.website] if value)),
        ]:
            if value:
                label_style = ParagraphStyle('SectionLabel', parent=LABEL, keepWithNext=True)
                story.append(paragraph(label, label_style))
                # Keep the heading with a short opening block so very long
                # introductions can use the remaining space on the current page.
                chunks = wrap(str(value), width=600, replace_whitespace=False, drop_whitespace=False)
                for number, chunk in enumerate(chunks):
                    style = ParagraphStyle('ProfileContinuation', parent=BODY,
                                           spaceAfter=10 if number == len(chunks) - 1 else 0)
                    story.append(paragraph(chunk, style))
    if not story:
        story.append(paragraph('No participant profiles yet.', TITLE))

    def page_frame(pdf, doc):
        pdf.saveState()
        brand_header(pdf, *A4)
        pdf.setFillColor(GREEN)
        pdf.setFont('Helvetica', 8)
        pdf.setStrokeColor(GOLD)
        pdf.line(40, 43, A4[0] - 40, 43)
        pdf.drawString(40, 26, 'BUSINESS BEYOND BORDERS  /  SRI LANKA 2026')
        pdf.drawRightString(A4[0] - 40, 26, f'{doc.page:02d}')
        pdf.restoreState()

    document.build(story, onFirstPage=page_frame, onLaterPages=page_frame)
    return output.getvalue()


def prepare_profile_documents(profile):
    """Save ready-to-download files; document failure must not lose a submission."""
    fields = ('attending_poster', 'profile_booklet', 'attending_poster_image')
    previous = [(getattr(profile, name).storage, getattr(profile, name).name) for name in fields]
    created = []
    try:
        poster = attending_poster(profile)
        booklet = participant_booklet([profile])
        social_image = poster_png(poster)
        for field, content, filename in [(profile.attending_poster, poster, 'attending.pdf'),
                                         (profile.profile_booklet, booklet, 'profile.pdf'),
                                         (profile.attending_poster_image, social_image, 'attending.png')]:
            field.save(f'{uuid4().hex}-{filename}', ContentFile(content), save=False)
            created.append((field.storage, field.name))
        profile.save(update_fields=fields)
    except Exception:
        logging.getLogger(__name__).exception('Unable to prepare documents for profile %s', profile.pk)
        profile.attending_poster = ''
        profile.profile_booklet = ''
        profile.attending_poster_image = ''
        profile.save(update_fields=fields)
        previous += created
    for storage, name in previous:
        if name:
            try:
                storage.delete(name)
            except Exception:
                logging.getLogger(__name__).warning('Unable to remove old profile document %s', name)
