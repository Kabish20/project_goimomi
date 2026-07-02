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
    Generates a highly-stylized, pixel-perfect 1-page PDF voucher for the booking
    by overlaying dynamic details on top of the designed voucher template image.
    """
    import os
    import sys
    import requests
    from PIL import Image, ImageDraw, ImageFont

    # 1. Load the template image
    template_path = os.path.join(os.path.dirname(__file__), 'cab_voucher.png')
    img = Image.open(template_path).convert('RGB')
    draw = ImageDraw.Draw(img)

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

    font_bold_sm = get_font("bold", 16)
    font_bold_xs = get_font("bold", 14)
    font_reg_xs = get_font("regular", 14)

    def get_text_width(txt, fnt):
        try:
            return draw.textlength(txt, font=fnt)
        except Exception:
            return fnt.getbbox(txt)[2] - fnt.getbbox(txt)[0]

    def draw_wrapped_text(draw_obj, text, box, font, fill):
        x1, y1, x2, y2 = box
        max_w = x2 - x1
        words = text.split()
        lines = []
        current_line = []
        for word in words:
            test_line = " ".join(current_line + [word])
            if get_text_width(test_line, font) <= max_w:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(" ".join(current_line))
                current_line = [word]
        if current_line:
            lines.append(" ".join(current_line))
            
        y = y1
        for line in lines[:2]: # Max 2 lines
            draw_obj.text((x1, y), line, font=font, fill=fill)
            y += font.getbbox(line)[3] - font.getbbox(line)[1] + 4

    # 2. Cover old text fields with white rectangles
    white = (255, 255, 255)
    
    # Left Barcode Label
    draw.rectangle((80, 375, 115, 605), fill=white)

    # Pickup Column
    draw.rectangle((210, 340, 500, 390), fill=white)
    draw.rectangle((210, 440, 500, 520), fill=white)
    draw.rectangle((210, 540, 500, 595), fill=white)

    # Car Column
    draw.rectangle((580, 305, 920, 350), fill=white)
    draw.rectangle((580, 350, 920, 395), fill=white)
    draw.rectangle((600, 535, 710, 580), fill=white)
    draw.rectangle((840, 535, 950, 580), fill=white)

    # Drop Column
    draw.rectangle((1110, 335, 1420, 420), fill=white)
    draw.rectangle((1110, 440, 1420, 490), fill=white)
    draw.rectangle((1110, 540, 1420, 595), fill=white)

    # Customer details
    draw.rectangle((200, 710, 470, 745), fill=white)
    draw.rectangle((200, 790, 470, 825), fill=white)
    draw.rectangle((530, 710, 800, 745), fill=white)
    draw.rectangle((530, 790, 800, 825), fill=white)
    draw.rectangle((900, 710, 1140, 745), fill=white)
    draw.rectangle((900, 790, 1140, 825), fill=white)

    # 3. Draw new texts
    # Vertical Barcode Text
    booking_id = booking.booking_id or f"GO-TRN-{str(booking.pk).zfill(4)}"
    txt_img = Image.new('RGBA', (250, 40), (255, 255, 255, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((0, 0), booking_id, font=font_bold_sm, fill=(71, 85, 105))
    rotated_txt = txt_img.rotate(90, expand=True)
    img.paste(rotated_txt, (85, 380), rotated_txt)

    # Pickup details
    travel_date_str = booking.pickup_date.strftime('%d %b %Y') if booking.pickup_date else "N/A"
    draw.text((215, 345), travel_date_str, font=font_bold_xs, fill=(12, 35, 64))
    
    pickup_point = booking.airport_name or booking.from_city if booking.transfer_type == 'airport' else (f"{booking.from_city} ({booking.pickup_location_details})" if booking.pickup_location_details else booking.from_city)
    draw_wrapped_text(draw, pickup_point, (215, 445, 490, 515), font_bold_xs, fill=(12, 35, 64))
    
    formatted_time = format_time_field(booking.pickup_time or booking.arrival_time)
    draw.text((215, 545), formatted_time, font=font_bold_xs, fill=(12, 35, 64))

    # Car details
    cat_text = booking.vehicle_category.upper() if booking.vehicle_category else "SEDAN"
    w = get_text_width(cat_text, font_bold_sm)
    draw.text((580 + (340 - w) // 2, 315), cat_text, font=font_bold_sm, fill=(12, 35, 64))

    name_text = booking.vehicle_name
    w = get_text_width(name_text, font_reg_xs)
    draw.text((580 + (340 - w) // 2, 355), name_text, font=font_reg_xs, fill=(100, 116, 139))

    draw.text((610, 545), f"{booking.guests} Seats", font=font_bold_xs, fill=(71, 85, 105))
    draw.text((850, 545), f"{booking.luggage_count or 0} Bags", font=font_bold_xs, fill=(71, 85, 105))

    # Drop details
    draw_wrapped_text(draw, booking.to_city, (1115, 335, 1410, 415), font_bold_xs, fill=(12, 35, 64))
    draw.text((1115, 445), "As per travel schedule", font=font_bold_xs, fill=(12, 35, 64))
    draw.text((1115, 545), "Approx. standard route", font=font_bold_xs, fill=(12, 35, 64))

    # Customer details
    customer_name = f"{booking.title} {booking.first_name} {booking.last_name}".strip()
    draw.text((200, 710), customer_name, font=font_bold_xs, fill=(12, 35, 64))
    draw.text((200, 790), booking.phone or "N/A", font=font_bold_xs, fill=(12, 35, 64))
    draw.text((530, 710), booking.email or "N/A", font=font_bold_xs, fill=(12, 35, 64))
    draw.text((530, 790), booking_id, font=font_bold_xs, fill=(12, 35, 64))
    draw.text((900, 710), f"{booking.guests} Guest(s)", font=font_bold_xs, fill=(12, 35, 64))
    
    status_text = booking.status.upper()
    status_color = (19, 128, 72) if booking.status in ["Confirmed", "Completed", "defined"] else (209, 38, 22)
    draw.text((900, 790), status_text, font=font_bold_xs, fill=status_color)

    # 4. Fetch and paste dynamic car image
    try:
        from Holidays.models import VehicleMaster
        from django.db.models import Q
        vm = VehicleMaster.objects.filter(
            Q(name__icontains=booking.vehicle_name) | 
            Q(brand__name__icontains=booking.vehicle_name)
        ).first()
        
        if not vm and booking.vehicle_category:
            vm = VehicleMaster.objects.filter(
                Q(name__icontains=booking.vehicle_category) | 
                Q(brand__name__icontains=booking.vehicle_category)
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
                # Cover old car image
                draw.rectangle((580, 405, 920, 525), fill=white)
                # Resize car image to fit the 340x120 area
                car_img.thumbnail((340, 120), Image.Resampling.LANCZOS)
                # Center and paste
                cx = 580 + (340 - car_img.width) // 2
                cy = 405 + (120 - car_img.height) // 2
                img.paste(car_img, (cx, cy), car_img.convert("RGBA") if "transparency" in car_img.info or car_img.mode == "RGBA" else None)
    except Exception as e:
        print(f"Error drawing vehicle image on PDF: {e}")

    # 5. Export to PDF bytes
    buffer = io.BytesIO()
    img.save(buffer, "PDF")
    return buffer.getvalue()

def send_booking_voucher(booking):
    """
    Sends the booking voucher HTML email with generated PDF attachment to
    both the customer and the company email.
    """
    subject = f"Goimomi Holidays - Booking Confirmation - {booking.booking_id}"
    
    # Prepare date and price formatting safely
    try:
        travel_date_str = booking.pickup_date.strftime('%d %b %Y') if booking.pickup_date else "N/A"
    except Exception:
        travel_date_str = str(booking.pickup_date) if booking.pickup_date else "N/A"
        
    try:
        total_amount_str = f"{booking.price:,.2f}"
    except (TypeError, ValueError):
        total_amount_str = str(booking.price) if booking.price is not None else "0.00"

    # Prepare booking context compatible with the new car_booking_voucher template
    formatted_time = format_time_field(booking.pickup_time or booking.arrival_time)

    # Look up matching VehicleMaster for photo and capacities
    from Holidays.models import VehicleMaster
    from django.db.models import Q
    
    vehicle_photo = "https://goimomi.com/media/vehicles/download_2_YaJg5h3.jpeg"
    vm = None
    try:
        vm = VehicleMaster.objects.filter(
            Q(name__icontains=booking.vehicle_name) | 
            Q(brand__name__icontains=booking.vehicle_name)
        ).first()
        
        if not vm and booking.vehicle_category:
            vm = VehicleMaster.objects.filter(
                Q(name__icontains=booking.vehicle_category) | 
                Q(brand__name__icontains=booking.vehicle_category)
            ).first()
    except Exception:
        pass
        
    if vm and vm.photo:
        vehicle_photo = f"https://goimomi.com{vm.photo.url}"

    booking_context = {
        'booking_id': booking.booking_id,
        'customer_name': f"{booking.title} {booking.first_name} {booking.last_name}".strip(),
        'customer_email': booking.email or "N/A",
        'phone': booking.phone or "N/A",
        'vehicle_type': f"{booking.vehicle_name} ({booking.vehicle_category})" if booking.vehicle_category else booking.vehicle_name,
        'vehicle_name': booking.vehicle_name,
        'vehicle_category': booking.vehicle_category or "Sedan",
        'vehicle_photo': vehicle_photo,
        'pickup_location': booking.airport_name or booking.from_city if booking.transfer_type == 'airport' else (f"{booking.from_city} ({booking.pickup_location_details})" if booking.pickup_location_details else booking.from_city),
        'drop_location': booking.to_city,
        'travel_date': travel_date_str,
        'pickup_time': formatted_time,
        'total_amount': total_amount_str,
        'payment_status': booking.status,
        'guests': booking.guests or 1,
        'luggage_count': booking.luggage_count or "0",
        'special_requirements': booking.special_requirements or "None",
        'driver': booking.driver or "Not Assigned Yet",
    }
    
    # Render HTML content
    html_content = render_to_string(
        'emails/car_booking_voucher.html',
        {'booking': booking_context}
    )
    
    # Fallback plain text message
    text_content = f"""
Dear {booking.title} {booking.first_name} {booking.last_name},

Thank you for choosing Goimomi Holidays. Your booking has been confirmed!

Booking Reference ID: {booking.booking_id}
Vehicle: {booking.vehicle_name} ({booking.vehicle_category})
Route: {booking.from_city} to {booking.to_city}
Travel Date: {travel_date_str}
Fare Amount: INR {total_amount_str}

A professional PDF voucher is attached to this email.

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
        email.attach(
            filename=f"Voucher_{booking.booking_id}.pdf",
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
        print(f"Booking confirmation email sent successfully to {recipients} for booking {booking.booking_id}")
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
