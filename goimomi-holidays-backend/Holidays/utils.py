import io
from datetime import datetime
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

# ReportLab imports
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def format_time_field(raw_time):
    if not raw_time or raw_time == "N/A":
        return "N/A"
    parts = raw_time.strip().split()
    time_part = parts[1] if len(parts) == 2 else parts[0]
    if ":" in time_part:
        try:
            t_obj = datetime.strptime(time_part, "%H:%M")
            return t_obj.strftime("%I:%M %p")
        except Exception:
            try:
                t_obj = datetime.strptime(time_part, "%H:%M:%S")
                return t_obj.strftime("%I:%M %p")
            except Exception:
                return time_part
    return "N/A"

def generate_booking_pdf(booking):
    """
    Generates a highly-stylized, pixel-perfect multi-page PDF voucher for the booking.
    If the booking is part of multiple parallel bookings created together, 
    all of them are included as separate ticket pages, followed by a final Terms & Conditions page.
    """
    import os
    import sys
    import requests
    import io
    import django.utils.timezone as timezone
    from datetime import timedelta
    from PIL import Image, ImageDraw, ImageFont
    from Holidays.models import CabBooking

    # 1. Fetch related bookings created in the last 10 seconds for this email
    time_threshold = booking.created_at - timedelta(seconds=10) if booking.created_at else timezone.now() - timedelta(seconds=10)
    related_bookings = CabBooking.objects.filter(
        email=booking.email,
        created_at__gte=time_threshold
    ).order_by('id')

    if not related_bookings.exists():
        related_bookings = [booking]

    # Helper to load standard fonts
    def get_font(font_name, size):
        try:
            if sys.platform.startswith('win'):
                if "bold" in font_name.lower():
                    return ImageFont.truetype("arialbd.ttf", size)
                return ImageFont.truetype("arial.ttf", size)
            else:
                paths = [
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if "bold" in font_name.lower() else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if "bold" in font_name.lower() else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
                ]
                for p in paths:
                    if os.path.exists(p):
                        return ImageFont.truetype(p, size)
        except Exception:
            pass
        return ImageFont.load_default()

    font_bold_lg = get_font("bold", 24)
    font_bold_md = get_font("bold", 20)
    font_bold_sm = get_font("bold", 16)
    font_bold_xs = get_font("bold", 14)
    font_reg_xs = get_font("regular", 14)

    def get_text_width(txt, fnt):
        if not txt:
            return 0
        try:
            bbox = fnt.getbbox(txt)
            return bbox[2] - bbox[0]
        except Exception:
            return 0

    def draw_wrapped_text(draw_obj, text, box, font, fill, max_lines=2):
        x1, y1, x2, y2 = box
        max_w = x2 - x1
        words = text.split()
        lines = []
        current_line = []
        for word in words:
            test_line = " ".join(current_line + [word])
            # Use draw_obj-independent length if possible, or fallback
            try:
                w_len = draw_obj.textlength(test_line, font=font)
            except Exception:
                w_len = font.getbbox(test_line)[2] - font.getbbox(test_line)[0]
                
            if w_len <= max_w:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(" ".join(current_line))
                current_line = [word]
        if current_line:
            lines.append(" ".join(current_line))
            
        y = y1
        lines_to_draw = lines[:max_lines] if max_lines is not None else lines
        for line in lines_to_draw:
            draw_obj.text((x1, y), line, font=font, fill=fill)
            y += font.getbbox(line)[3] - font.getbbox(line)[1] + 6
        return y

    pages = []
    white = (255, 255, 255)

    # 2. Generate a consolidated single-page ticket containing all related bookings
    template_path = os.path.join(os.path.dirname(__file__), 'cab_voucher.png')
    template_img = Image.open(template_path).convert('RGB')

    N = len(related_bookings)
    consolidated_height = 744 + N * 400
    consolidated_img = Image.new('RGB', (1536, consolidated_height), (238, 242, 246))

    # Paste Header
    header_crop = template_img.crop((0, 0, 1536, 220))
    consolidated_img.paste(header_crop, (0, 0))

    # Draw each booking's ticket card
    card_box = (0, 220, 1536, 620)
    for i, b in enumerate(related_bookings):
        card_crop = template_img.crop(card_box)
        shift_y = i * 400
        consolidated_img.paste(card_crop, (0, 220 + shift_y))
        
        card_draw = ImageDraw.Draw(consolidated_img)
        
        # Cover old template text fields with white rectangles (shifted by shift_y)
        # Left Barcode Label
        card_draw.rectangle((80, 375 + shift_y, 115, 605 + shift_y), fill=white)

        # Pickup Column
        card_draw.rectangle((210, 340 + shift_y, 500, 390 + shift_y), fill=white)
        card_draw.rectangle((210, 440 + shift_y, 500, 520 + shift_y), fill=white)
        card_draw.rectangle((210, 540 + shift_y, 500, 595 + shift_y), fill=white)

        # Car Column
        card_draw.rectangle((580, 305 + shift_y, 920, 350 + shift_y), fill=white)
        card_draw.rectangle((580, 350 + shift_y, 920, 395 + shift_y), fill=white)
        card_draw.rectangle((600, 535 + shift_y, 710, 580 + shift_y), fill=white)
        card_draw.rectangle((840, 535 + shift_y, 950, 580 + shift_y), fill=white)
        
        # Cover default template car image (completely cover roof and wheels)
        card_draw.rectangle((530, 360 + shift_y, 1000, 540 + shift_y), fill=white)

        # Drop Column
        card_draw.rectangle((1110, 335 + shift_y, 1420, 420 + shift_y), fill=white)
        card_draw.rectangle((1110, 440 + shift_y, 1420, 490 + shift_y), fill=white)
        card_draw.rectangle((1110, 540 + shift_y, 1420, 595 + shift_y), fill=white)

        # Draw vertical barcode text
        b_id = b.booking_id or f"GO-TRN-{str(b.pk).zfill(4)}"
        txt_img = Image.new('RGBA', (250, 40), (255, 255, 255, 0))
        txt_draw = ImageDraw.Draw(txt_img)
        txt_draw.text((0, 0), b_id, font=font_bold_sm, fill=(71, 85, 105))
        rotated_txt = txt_img.rotate(90, expand=True)
        consolidated_img.paste(rotated_txt, (85, 380 + shift_y), rotated_txt)

        # Pickup details
        try:
            travel_date_str = b.pickup_date.strftime('%d %b %Y') if b.pickup_date else "N/A"
        except Exception:
            travel_date_str = str(b.pickup_date) if b.pickup_date else "N/A"
        card_draw.text((215, 345 + shift_y), travel_date_str, font=font_bold_xs, fill=(12, 35, 64))
        
        # Extract location types (e.g. "Airport" or "CITY") from pickup_location_details
        pickup_type = ""
        drop_type = ""
        if b.pickup_location_details:
            try:
                if "Pickup:" in b.pickup_location_details:
                    pickup_type = b.pickup_location_details.split("Pickup:")[1].split(",")[0].strip()
                if "Drop:" in b.pickup_location_details:
                    drop_type = b.pickup_location_details.split("Drop:")[1].split(".")[0].strip()
            except Exception:
                pass

        if pickup_type:
            pickup_point = f"{b.from_city} ({pickup_type.title()})"
        elif b.airport_name and b.transfer_type == 'airport':
            pickup_point = b.airport_name
        else:
            pickup_point = b.from_city

        if drop_type:
            drop_point = f"{b.to_city} ({drop_type.title()})"
        else:
            drop_point = b.to_city

        draw_wrapped_text(card_draw, pickup_point, (215, 445 + shift_y, 490, 515 + shift_y), font_bold_xs, fill=(12, 35, 64))
        
        formatted_time = format_time_field(b.pickup_time or b.arrival_time)
        card_draw.text((215, 545 + shift_y), formatted_time, font=font_bold_xs, fill=(12, 35, 64))

        # Car details
        cat_text = b.vehicle_category.upper() if b.vehicle_category else "SEDAN"
        w = get_text_width(cat_text, font_bold_sm)
        card_draw.text((580 + (340 - w) // 2, 315 + shift_y), cat_text, font=font_bold_sm, fill=(12, 35, 64))

        name_text = b.vehicle_name
        w = get_text_width(name_text, font_reg_xs)
        card_draw.text((580 + (340 - w) // 2, 355 + shift_y), name_text, font=font_reg_xs, fill=(100, 116, 139))

        card_draw.text((610, 545 + shift_y), f"{b.guests} Seats", font=font_bold_xs, fill=(71, 85, 105))
        card_draw.text((850, 545 + shift_y), f"{b.luggage_count or 0} Bags", font=font_bold_xs, fill=(71, 85, 105))

        # Drop details
        draw_wrapped_text(card_draw, drop_point, (1115, 335 + shift_y, 1410, 415 + shift_y), font_bold_xs, fill=(12, 35, 64))
        card_draw.text((1115, 445 + shift_y), "As per travel schedule", font=font_bold_xs, fill=(12, 35, 64))
        card_draw.text((1115, 545 + shift_y), "Approx. standard route", font=font_bold_xs, fill=(12, 35, 64))

        # Dynamic car image
        try:
            from Holidays.models import VehicleMaster
            from django.db.models import Q
            vm = VehicleMaster.objects.filter(
                Q(name__icontains=b.vehicle_name) | 
                Q(brand__name__icontains=b.vehicle_name)
            ).first()
            if not vm and b.vehicle_category:
                vm = VehicleMaster.objects.filter(
                    Q(name__icontains=b.vehicle_category) | 
                    Q(brand__name__icontains=b.vehicle_category)
                ).first()
            vehicle_photo = None
            if vm and vm.photo:
                if hasattr(vm.photo, 'path') and os.path.exists(vm.photo.path):
                    vehicle_photo = vm.photo.path
                else:
                    vehicle_photo = f"https://goimomi.com{vm.photo.url}"
            if vehicle_photo:
                if os.path.exists(vehicle_photo):
                    car_img = Image.open(vehicle_photo)
                else:
                    resp = requests.get(vehicle_photo, timeout=5)
                    if resp.status_code == 200:
                        car_img = Image.open(io.BytesIO(resp.content))
                    else:
                        car_img = None
                if car_img:
                    car_img.thumbnail((340, 120), Image.Resampling.LANCZOS)
                    cx = 580 + (340 - car_img.width) // 2
                    cy = 405 + (120 - car_img.height) // 2 + shift_y
                    consolidated_img.paste(car_img, (cx, cy), car_img.convert("RGBA") if "transparency" in car_img.info or car_img.mode == "RGBA" else None)
        except Exception as e:
            print(f"Error drawing vehicle image on PDF: {e}")

    # Paste Customer Details Panel
    y_cust_offset = 220 + N * 400
    cust_crop = template_img.crop((0, 620, 1536, 840))
    consolidated_img.paste(cust_crop, (0, y_cust_offset))
    
    cust_draw = ImageDraw.Draw(consolidated_img)
    shift_cust_y = y_cust_offset - 620

    # Clear template customer fields
    cust_draw.rectangle((200, 710 + shift_cust_y, 470, 745 + shift_cust_y), fill=white)
    cust_draw.rectangle((200, 790 + shift_cust_y, 470, 825 + shift_cust_y), fill=white)
    cust_draw.rectangle((530, 710 + shift_cust_y, 800, 745 + shift_cust_y), fill=white)
    cust_draw.rectangle((530, 790 + shift_cust_y, 800, 825 + shift_cust_y), fill=white)
    cust_draw.rectangle((900, 710 + shift_cust_y, 1140, 745 + shift_cust_y), fill=white)
    cust_draw.rectangle((900, 790 + shift_cust_y, 1140, 825 + shift_cust_y), fill=white)

    # Draw customer details
    customer_name = f"{booking.title} {booking.first_name} {booking.last_name}".strip()
    cust_draw.text((200, 710 + shift_cust_y), customer_name, font=font_bold_xs, fill=(12, 35, 64))
    cust_draw.text((200, 790 + shift_cust_y), booking.phone or "N/A", font=font_bold_xs, fill=(12, 35, 64))
    cust_draw.text((530, 710 + shift_cust_y), booking.email or "N/A", font=font_bold_xs, fill=(12, 35, 64))
    
    # Comma-separated Booking IDs list
    all_booking_ids = ", ".join([rb.booking_id or f"GO-TRN-{str(rb.pk).zfill(4)}" for rb in related_bookings])
    cust_draw.text((530, 790 + shift_cust_y), all_booking_ids, font=font_bold_xs, fill=(12, 35, 64))
    
    cust_draw.text((900, 710 + shift_cust_y), f"{booking.guests} Guest(s)", font=font_bold_xs, fill=(12, 35, 64))
    
    status_text = booking.status.upper()
    status_color = (19, 128, 72) if booking.status in ["Confirmed", "Completed", "defined"] else (209, 38, 22)
    cust_draw.text((900, 790 + shift_cust_y), status_text, font=font_bold_xs, fill=status_color)

    # Construct dynamic QR code text containing all bookings
    qr_text = f"Goimomi Holidays Cab Booking\n"
    qr_text += f"-----------------------------\n"
    for rb in related_bookings:
        p_type = ""
        d_type = ""
        if rb.pickup_location_details:
            try:
                if "Pickup:" in rb.pickup_location_details:
                    p_type = rb.pickup_location_details.split("Pickup:")[1].split(",")[0].strip()
                if "Drop:" in rb.pickup_location_details:
                    d_type = rb.pickup_location_details.split("Drop:")[1].split(".")[0].strip()
            except Exception:
                pass
        p_loc = f"{rb.from_city} ({p_type.title()})" if p_type else rb.from_city
        d_loc = f"{rb.to_city} ({d_type.title()})" if d_type else rb.to_city
        
        qr_text += f"ID: {rb.booking_id}\n"
        qr_text += f"Vehicle: {rb.vehicle_name} ({rb.vehicle_category or 'Sedan'})\n"
        qr_text += f"Route: {p_loc} to {d_loc}\n\n"
    
    qr_text += f"Guest: {customer_name}\n"
    qr_text += f"Phone: {booking.phone or 'N/A'}\n"
    qr_text += f"Status: {booking.status.upper()}"

    try:
        import urllib.parse
        qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=138048&data={urllib.parse.quote(qr_text)}"
        resp = requests.get(qr_url, timeout=5)
        if resp.status_code == 200:
            qr_img = Image.open(io.BytesIO(resp.content)).convert("RGB")
            qr_img = qr_img.resize((150, 150), Image.Resampling.LANCZOS)
            consolidated_img.paste(qr_img, (1200, 670 + shift_cust_y))
    except Exception as e:
        print(f"Error drawing QR code on PDF: {e}")

    # Draw Total Booking Fare Block (matches email UI design)
    y_fare_offset = y_cust_offset + 220 + 20
    cust_draw.rounded_rectangle(
        [(80, y_fare_offset), (1456, y_fare_offset + 80)],
        radius=12,
        fill=(255, 255, 255),
        outline=(191, 219, 254),
        width=2
    )
    cust_draw.text((120, y_fare_offset + 25), "TOTAL BOOKING FARE", font=font_bold_sm, fill=(12, 35, 64))
    
    total_amount = sum([float(rb.price or 0) for rb in related_bookings])
    try:
        total_amount_str = f"{total_amount:,.2f}"
    except Exception:
        total_amount_str = str(total_amount)
    
    # Check if bookings are INR (represented by Rs/INR)
    fare_text = f"INR {total_amount_str}"
    try:
        tw = font_bold_lg.getbbox(fare_text)[2] - font_bold_lg.getbbox(fare_text)[0]
    except Exception:
        tw = 200
    cust_draw.text((1416 - tw, y_fare_offset + 22), fare_text, font=font_bold_lg, fill=(19, 128, 72))

    # Paste Support Footer
    y_footer_offset = y_fare_offset + 80 + 20
    footer_crop = template_img.crop((0, 840, 1536, 1024))
    consolidated_img.paste(footer_crop, (0, y_footer_offset))

    # Scale consolidated_img to standard A4 size (1240 x 1754)
    a4_width = 1240
    a4_height = 1754
    scale = a4_width / consolidated_img.width  # 1240 / 1530 = 0.81045
    scaled_w = a4_width
    scaled_h = int(consolidated_img.height * scale)

    scaled_consolidated = consolidated_img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)

    a4_page1 = Image.new('RGB', (a4_width, a4_height), (255, 255, 255))
    a4_page1.paste(scaled_consolidated, (0, 0))

    pages.append(a4_page1)

    # 3. Generate the Terms & Conditions Page
    append_images = []
    try:
        terms_img = Image.new('RGB', (1240, 1754), (255, 255, 255))
        terms_draw = ImageDraw.Draw(terms_img)

        # Deep green sidebar
        terms_draw.rectangle((0, 0, 20, 1754), fill=(20, 83, 45))

        # Fonts for Terms Page
        font_title = get_font("bold", 36)
        font_reg_sm = get_font("regular", 18)

        # Title
        terms_draw.text((100, 100), "TERMS & CONDITIONS", font=font_title, fill=(20, 83, 45))

        # Decorative line
        terms_draw.line((100, 160, 1140, 160), fill=(229, 231, 235), width=2)

        terms = [
            "1. Booking is confirmed only after receipt of the required advance or full payment.",
            "2. The quoted fare includes only the services mentioned in the booking confirmation. Toll, parking, permit, entry tax, and other applicable charges are extra unless specified.",
            "3. Customers must be present at the pickup location on time. Waiting beyond 15 minutes (city pickups) or 30 minutes (airport pickups) may incur additional charges.",
            "4. Any change in pickup location, destination, route, duration, or travel plan after confirmation may result in additional charges.",
            "5. Extra kilometers and extra hours will be charged as per the applicable rates for the selected vehicle.",
            "6. Cancellation, no-show, or cancellation after vehicle dispatch may attract cancellation charges, and refunds (if applicable) will be processed as per company policy.",
            "7. GOIMOMI HOLIDAYS is not responsible for delays caused by traffic, weather, road conditions, government restrictions, vehicle breakdowns due to unforeseen circumstances, or any force majeure events.",
            "8. Customers are responsible for their personal belongings. GOIMOMI HOLIDAYS shall not be liable for any loss, theft, or damage to luggage or valuables.",
            "9. Any damage caused to the vehicle by the customer or passengers will be chargeable to the customer.",
            "10. By confirming the booking, the customer agrees to abide by these Terms & Conditions and accepts the company's policies."
        ]

        # Draw terms in single column for clean A4 reading
        y_pos = 220
        for term in terms:
            y_pos = draw_wrapped_text(terms_draw, term, (100, y_pos, 1140, 0), font_reg_sm, fill=(12, 35, 64), max_lines=None)
            y_pos += 30

        # Footer
        terms_draw.line((100, 1600, 1140, 1600), fill=(229, 231, 235), width=2)
        footer_text = "24/7 Helpline: +91 81100 82222  |  Email: hello@goimomi.com  |  Website: www.goimomi.com"
        try:
            fw = terms_draw.textlength(footer_text, font=font_reg_sm)
        except Exception:
            fw = font_reg_sm.getbbox(footer_text)[2] - font_reg_sm.getbbox(footer_text)[0]
        terms_draw.text((100 + (1040 - fw) // 2, 1630), footer_text, font=font_reg_sm, fill=(71, 85, 105))
        
        append_images = [terms_img]
    except Exception as e:
        print(f"Error creating Terms page on PDF: {e}")
        append_images = []

    # 4. Export to PDF bytes
    buffer = io.BytesIO()
    pages[0].save(buffer, "PDF", save_all=True, append_images=append_images, resolution=150.0)
    return buffer.getvalue()


def send_booking_voucher(booking):
    """
    Sends the booking voucher HTML email with generated PDF attachment to
    both the customer and the company email.
    Consolidates parallel bookings created by the same user within 10 seconds into a single email.
    """
    import time
    import io
    import requests
    from PIL import Image
    import django.utils.timezone as timezone
    from datetime import timedelta
    from django.core.mail import EmailMultiAlternatives
    from django.conf import settings
    from django.template.loader import render_to_string
    from Holidays.models import CabBooking, VehicleMaster
    from django.db.models import Q
    
    # 1. Debounce to let all parallel bookings complete their DB insert
    time.sleep(1.8)
    
    # 2. Get all bookings created by this email in the last 10 seconds
    time_threshold = timezone.now() - timedelta(seconds=10)
    related_bookings = CabBooking.objects.filter(
        email=booking.email,
        created_at__gte=time_threshold
    ).order_by('id')
    
    if not related_bookings.exists():
        related_bookings = [booking]
        
    # 3. Only send from the last booking request in the batch to avoid duplicate emails
    if booking.id != related_bookings.last().id:
        print(f"Skipping email for booking {booking.booking_id} as it is part of a batch. Latest is {related_bookings.last().booking_id}.")
        return True
        
    # 4. Prepare consolidated context
    bookings_contexts = []
    total_amount = 0
    booking_ids = []
    
    for b in related_bookings:
        try:
            travel_date_str = b.pickup_date.strftime('%d %b %Y') if b.pickup_date else "N/A"
        except Exception:
            travel_date_str = str(b.pickup_date) if b.pickup_date else "N/A"
            
        try:
            price_str = f"{b.price:,.2f}"
        except (TypeError, ValueError):
            price_str = str(b.price) if b.price is not None else "0.00"
            
        total_amount += b.price if b.price is not None else 0
        booking_ids.append(b.booking_id)
        
        formatted_time = format_time_field(b.pickup_time or b.arrival_time)
        
        # Vehicle Photo
        vehicle_photo = "https://goimomi.com/media/vehicles/download_2_YaJg5h3.jpeg"
        vm = None
        try:
            vm = VehicleMaster.objects.filter(
                Q(name__icontains=b.vehicle_name) | 
                Q(brand__name__icontains=b.vehicle_name)
            ).first()
            if not vm and b.vehicle_category:
                vm = VehicleMaster.objects.filter(
                    Q(name__icontains=b.vehicle_category) | 
                    Q(brand__name__icontains=b.vehicle_category)
                ).first()
        except Exception:
            pass
        if vm and vm.photo:
            vehicle_photo = f"https://goimomi.com{vm.photo.url}"
            
        # Extract location types (e.g. "Airport" or "CITY") from pickup_location_details
        pickup_type = ""
        drop_type = ""
        if b.pickup_location_details:
            try:
                if "Pickup:" in b.pickup_location_details:
                    pickup_type = b.pickup_location_details.split("Pickup:")[1].split(",")[0].strip()
                if "Drop:" in b.pickup_location_details:
                    drop_type = b.pickup_location_details.split("Drop:")[1].split(".")[0].strip()
            except Exception:
                pass

        if pickup_type:
            pickup_location_formatted = f"{b.from_city} ({pickup_type.title()})"
        elif b.airport_name and b.transfer_type == 'airport':
            pickup_location_formatted = b.airport_name
        else:
            pickup_location_formatted = b.from_city

        if drop_type:
            drop_location_formatted = f"{b.to_city} ({drop_type.title()})"
        else:
            drop_location_formatted = b.to_city

        # Construct detailed QR code text
        qr_text = (
            f"Goimomi Holidays Cab Booking\n"
            f"-----------------------------\n"
            f"Booking ID: {b.booking_id}\n"
            f"Guest: {b.title} {b.first_name} {b.last_name}\n"
            f"Phone: {b.phone or 'N/A'}\n"
            f"Date: {travel_date_str}\n"
            f"Time: {formatted_time}\n"
            f"Vehicle: {b.vehicle_name} ({b.vehicle_category or 'Sedan'})\n"
            f"Pickup: {pickup_location_formatted}\n"
            f"Dropoff: {drop_location_formatted}\n"
            f"Status: {b.status.upper()}"
        )
        import urllib.parse
        qr_data_encoded = urllib.parse.quote(qr_text)

        bookings_contexts.append({
            'booking_id': b.booking_id,
            'customer_name': f"{b.title} {b.first_name} {b.last_name}".strip(),
            'customer_email': b.email or "N/A",
            'phone': b.phone or "N/A",
            'vehicle_type': f"{b.vehicle_name} ({b.vehicle_category})" if b.vehicle_category else b.vehicle_name,
            'vehicle_name': b.vehicle_name,
            'vehicle_category': b.vehicle_category or "Sedan",
            'vehicle_photo': vehicle_photo,
            'pickup_location': pickup_location_formatted,
            'drop_location': drop_location_formatted,
            'travel_date': travel_date_str,
            'pickup_time': formatted_time,
            'total_amount': price_str,
            'payment_status': b.status,
            'guests': b.guests or 1,
            'luggage_count': b.luggage_count or "0",
            'special_requirements': b.special_requirements or "None",
            'driver': b.driver or "Not Assigned Yet",
            'qr_data': qr_data_encoded,
        })
        
    try:
        total_amount_str = f"{total_amount:,.2f}"
    except Exception:
        total_amount_str = str(total_amount)
        
    customer_name = f"{booking.title} {booking.first_name} {booking.last_name}".strip()
    customer_email = booking.email or "N/A"
    phone = booking.phone or "N/A"
    
    # Construct consolidated QR code text for email
    qr_text = f"Goimomi Holidays Cab Booking\n"
    qr_text += f"-----------------------------\n"
    for rb in related_bookings:
        p_type = ""
        d_type = ""
        if rb.pickup_location_details:
            try:
                if "Pickup:" in rb.pickup_location_details:
                    p_type = rb.pickup_location_details.split("Pickup:")[1].split(",")[0].strip()
                if "Drop:" in rb.pickup_location_details:
                    d_type = rb.pickup_location_details.split("Drop:")[1].split(".")[0].strip()
            except Exception:
                pass
        p_loc = f"{rb.from_city} ({p_type.title()})" if p_type else rb.from_city
        d_loc = f"{rb.to_city} ({d_type.title()})" if d_type else rb.to_city
        
        qr_text += f"ID: {rb.booking_id}\n"
        qr_text += f"Vehicle: {rb.vehicle_name} ({rb.vehicle_category or 'Sedan'})\n"
        qr_text += f"Route: {p_loc} to {d_loc}\n\n"
    
    qr_text += f"Guest: {customer_name}\n"
    qr_text += f"Phone: {phone}\n"
    qr_text += f"Status: {booking.status.upper()}"

    import urllib.parse
    email_qr_data = urllib.parse.quote(qr_text)

    # Render HTML content
    html_content = render_to_string(
        'emails/car_booking_voucher.html',
        {
            'bookings': bookings_contexts,
            'customer_name': customer_name,
            'customer_email': customer_email,
            'phone': phone,
            'total_amount': total_amount_str,
            'booking_ids': ", ".join(booking_ids),
            'payment_status': booking.status,
            'total_guests': sum([rb.guests or 1 for rb in related_bookings]),
            'qr_data': email_qr_data,
        }
    )
    
    # Subject line listing all booking IDs
    subject = f"Goimomi Holidays - Booking Confirmation - {', '.join(booking_ids)}"
    
    # Fallback plain text message
    text_content = f"""
Dear {customer_name},

Thank you for choosing Goimomi Holidays. Your booking(s) have been confirmed!

Booking Reference(s): {', '.join(booking_ids)}
Total Fare Amount: INR {total_amount_str}

A professional PDF voucher containing all booking tickets is attached to this email.

For support, contact our 24/7 Travel Desk:
Call: +91 81100 82222
Email: hello@goimomi.com

Thank you,
Goimomi Holidays
"""
    
    # Add company email from settings (default to Reservations@goimomi.com if not defined)
    company_email = getattr(settings, 'COMPANY_EMAIL', 'Reservations@goimomi.com')

    # Compile recipients list
    recipients = []
    if booking.email:
        recipients.append(booking.email)
        
    # Ensure recipients is a list of unique non-empty emails
    recipients = list(set(recipients))
    if not recipients:
        if company_email:
            recipients = [company_email]
            bcc_recipients = []
        else:
            print("Error: No email recipients found for booking.")
            return False
    else:
        bcc_recipients = [company_email] if company_email else []
        
    # Build email message
    sender = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Reservations@goimomi.com')
    if not sender:
        sender = 'Reservations@goimomi.com'
        
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=sender,
        to=recipients,
        bcc=bcc_recipients
    )
    email.attach_alternative(html_content, "text/html")
    
    # Generate PDF and attach
    try:
        pdf_bytes = generate_booking_pdf(booking)
        # Use first booking ID or generic name for file
        pdf_filename = f"Voucher_{'_'.join(booking_ids[:2])}.pdf"
        email.attach(
            filename=pdf_filename,
            content=pdf_bytes,
            mimetype="application/pdf"
        )
    except Exception as e:
        print(f"Error generating or attaching PDF voucher: {e}")
        # Do not block email sending if PDF generation fails, send standard HTML email
        pass
        
    # Send email
    try:
        email.send(fail_silently=False)
        print(f"Booking confirmation email sent successfully to {recipients} for bookings {booking_ids}")
        return True
    except Exception as e:
        print(f"Error sending booking confirmation email: {e}")
        return False


def send_enquiry_email(enquiry, enquiry_type):
    """
    Sends an enquiry confirmation email to the customer and a BCC copy to the company.
    """
    # Build a clean subject line
    subject = f"Goimomi Holidays - {enquiry_type} Enquiry Received - #{enquiry.id}"
    
    # Safely get full name
    customer_name = getattr(enquiry, 'full_name', getattr(enquiry, 'name', 'Customer'))
    
    # Safely format date
    travel_date_val = getattr(enquiry, 'travel_date', None)
    try:
        travel_date_str = travel_date_val.strftime('%d %b %Y') if travel_date_val else "N/A"
    except Exception:
        travel_date_str = str(travel_date_val) if travel_date_val else "N/A"

    # Gather all fields into details based on what enquiry model has
    details = []
    
    # Common fields
    if hasattr(enquiry, 'email') and enquiry.email:
        details.append({'label': 'Email Address', 'value': enquiry.email})
    if hasattr(enquiry, 'phone') and enquiry.phone:
        details.append({'label': 'Phone Number', 'value': enquiry.phone})
    if hasattr(enquiry, 'nationality') and enquiry.nationality:
        details.append({'label': 'Nationality', 'value': enquiry.nationality})
        
    # Travel parameters
    if hasattr(enquiry, 'start_city') and enquiry.start_city:
        details.append({'label': 'Starting City', 'value': enquiry.start_city})
    elif hasattr(enquiry, 'from_city') and enquiry.from_city:
        details.append({'label': 'From City', 'value': enquiry.from_city})
        
    if hasattr(enquiry, 'to_city') and enquiry.to_city:
        details.append({'label': 'To City', 'value': enquiry.to_city})
    elif hasattr(enquiry, 'destination') and enquiry.destination:
        details.append({'label': 'Destination', 'value': enquiry.destination})
        
    if travel_date_val:
        details.append({'label': 'Travel Date', 'value': travel_date_str})
        
    # Package specific details
    if hasattr(enquiry, 'package_type') and enquiry.package_type:
        details.append({'label': 'Package Type', 'value': enquiry.package_type})
    if hasattr(enquiry, 'holiday_type') and enquiry.holiday_type:
        details.append({'label': 'Holiday Type', 'value': enquiry.holiday_type})
    if hasattr(enquiry, 'nights') and enquiry.nights:
        details.append({'label': 'Number of Nights', 'value': str(enquiry.nights)})
    if hasattr(enquiry, 'rooms') and enquiry.rooms:
        details.append({'label': 'Rooms Required', 'value': str(enquiry.rooms)})
    if hasattr(enquiry, 'star_rating') and enquiry.star_rating:
        details.append({'label': 'Hotel Star Rating', 'value': enquiry.star_rating})
    if hasattr(enquiry, 'room_type') and enquiry.room_type:
        details.append({'label': 'Room Type Preference', 'value': enquiry.room_type})
    if hasattr(enquiry, 'meal_plan') and enquiry.meal_plan:
        details.append({'label': 'Meal Plan Preference', 'value': enquiry.meal_plan})
    if hasattr(enquiry, 'transfer_details') and enquiry.transfer_details:
        details.append({'label': 'Transfer Details', 'value': enquiry.transfer_details})
        
    # Passengers
    passenger_info = []
    if hasattr(enquiry, 'adults') and enquiry.adults:
        passenger_info.append(f"{enquiry.adults} Adults")
    if hasattr(enquiry, 'children') and enquiry.children:
        passenger_info.append(f"{enquiry.children} Children")
    if hasattr(enquiry, 'infants') and enquiry.infants:
        passenger_info.append(f"{enquiry.infants} Infants")
    if passenger_info:
        details.append({'label': 'Travelers', 'value': ", ".join(passenger_info)})
        
    # Vehicle and Budget
    if hasattr(enquiry, 'vehicle') and enquiry.vehicle:
        details.append({'label': 'Vehicle Preference', 'value': enquiry.vehicle})
    if hasattr(enquiry, 'budget') and enquiry.budget:
        details.append({'label': 'Expected Budget', 'value': enquiry.budget})
        
    # Purpose / Message
    if hasattr(enquiry, 'purpose') and enquiry.purpose:
        details.append({'label': 'Purpose of Travel', 'value': enquiry.purpose})
    if hasattr(enquiry, 'message') and enquiry.message:
        details.append({'label': 'Additional Comments', 'value': enquiry.message})
        
    # Render HTML content
    html_content = render_to_string(
        'emails/enquiry_notification.html',
        {
            'enquiry_type': enquiry_type,
            'customer_name': customer_name,
            'details': details
        }
    )
    
    # Fallback plain text
    text_content = f"Dear {customer_name},\n\nThank you for contacting Goimomi Holidays.\nWe have received your request for: {enquiry_type} Enquiry.\n\nOur travel experts will review your request and get back to you shortly.\n\nRegards,\nGoimomi Holidays"
    
    # Compile recipient list
    company_email = getattr(settings, 'COMPANY_EMAIL', 'Reservations@goimomi.com')
    customer_email = getattr(enquiry, 'email', None)
    
    recipients = []
    if customer_email:
        recipients.append(customer_email)
        
    recipients = list(set(recipients))
    if not recipients:
        if company_email:
            recipients = [company_email]
            bcc_recipients = []
        else:
            print(f"Error: No email recipients found for enquiry {enquiry.id}.")
            return False
    else:
        bcc_recipients = [company_email] if company_email else []
        
    sender = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Reservations@goimomi.com')
    if not sender:
        sender = 'Reservations@goimomi.com'
        
    email_msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=sender,
        to=recipients,
        bcc=bcc_recipients
    )
    email_msg.attach_alternative(html_content, "text/html")
    
    try:
        email_msg.send(fail_silently=False)
        print(f"Enquiry confirmation email sent successfully to {recipients} for enquiry {enquiry.id}")
        return True
    except Exception as e:
        print(f"Error sending enquiry confirmation email: {e}")
        return False
