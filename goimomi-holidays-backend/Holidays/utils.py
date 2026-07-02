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

def generate_booking_pdf(booking):
    """
    Generates a highly-stylized, professional 1-page PDF voucher for the booking
    using ReportLab SimpleDocTemplate.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    story = []
    styles = getSampleStyleSheet()
    
    # Premium Color Palette matching Goimomi theme
    primary_color = colors.HexColor("#14532d") # Deep emerald
    secondary_color = colors.HexColor("#15803d") # Lighter green accent
    text_color = colors.HexColor("#334155") # Slate dark
    bg_light = colors.HexColor("#f8fafc") # Slate light
    border_color = colors.HexColor("#cbd5e1") # Slate borders
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.white,
        alignment=1, # Center
        spaceAfter=5
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor("#d1fae5"),
        alignment=1, # Center
        spaceAfter=0
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
        borderPadding=(0, 0, 2, 0),
        borderColor=primary_color
    )
    
    normal_bold = ParagraphStyle(
        'NormalBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=text_color
    )
    
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=text_color
    )
    
    # 1. Header Banner Table
    header_data = [
        [Paragraph("GOIMOMI HOLIDAYS", title_style)],
        [Paragraph("CAB CONFIRMATION VOUCHER", subtitle_style)]
    ]
    header_table = Table(header_data, colWidths=[540])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), primary_color),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 16),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))
    
    # 2. Reference Block
    ref_data = [
        [
            Paragraph("<b>Voucher ID:</b>", normal_style),
            Paragraph(f"<font color='#14532d'><b>{booking.booking_id}</b></font>", normal_bold),
            Paragraph("<b>Issue Date:</b>", normal_style),
            Paragraph(booking.created_at.strftime('%d %b %Y %H:%M') if booking.created_at else "", normal_style)
        ]
    ]
    ref_table = Table(ref_data, colWidths=[90, 180, 90, 180])
    ref_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_light),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(ref_table)
    
    # 3. Passenger Details
    story.append(Paragraph("PRIMARY GUEST DETAILS", section_heading))
    guest_name = f"{booking.title} {booking.first_name} {booking.last_name}"
    passenger_data = [
        [Paragraph("Guest Name:", normal_bold), Paragraph(guest_name, normal_style)],
        [Paragraph("Email ID:", normal_bold), Paragraph(booking.email or "N/A", normal_style)],
        [Paragraph("Phone Number:", normal_bold), Paragraph(booking.phone or "N/A", normal_style)],
    ]
    if booking.special_requirements:
        passenger_data.append([Paragraph("Special Req:", normal_bold), Paragraph(booking.special_requirements, normal_style)])
        
    passenger_table = Table(passenger_data, colWidths=[120, 420])
    passenger_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(passenger_table)
    
    # 4. Trip Details
    story.append(Paragraph("VEHICLE & ROUTE DETAILS", section_heading))
    trip_data = [
        [Paragraph("Vehicle Type:", normal_bold), Paragraph(f"{booking.vehicle_name} ({booking.vehicle_category})", normal_style)],
        [Paragraph("From City:", normal_bold), Paragraph(booking.from_city, normal_style)],
        [Paragraph("To City:", normal_bold), Paragraph(booking.to_city, normal_style)],
        [Paragraph("Travel Date:", normal_bold), Paragraph(booking.pickup_date.strftime('%d %b %Y') if booking.pickup_date else "", normal_style)],
        [Paragraph("No. of Guests:", normal_bold), Paragraph(str(booking.guests), normal_style)],
    ]
    if booking.luggage_count:
        trip_data.append([Paragraph("Luggage Count:", normal_bold), Paragraph(str(booking.luggage_count), normal_style)])
        
    trip_table = Table(trip_data, colWidths=[120, 420])
    trip_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(trip_table)
    
    # 5. Transfer Specifics
    story.append(Paragraph("TRANSFER SPECIFICS", section_heading))
    spec_data = [
        [Paragraph("Transfer Type:", normal_bold), Paragraph(booking.transfer_type.upper(), normal_style)]
    ]
    if booking.transfer_type == 'airport':
        if booking.flight_number:
            spec_data.append([Paragraph("Flight Number:", normal_bold), Paragraph(booking.flight_number, normal_style)])
        if booking.terminal:
            spec_data.append([Paragraph("Airport Terminal:", normal_bold), Paragraph(booking.terminal, normal_style)])
        if booking.arrival_time:
            spec_data.append([Paragraph("Arrival Date/Time:", normal_bold), Paragraph(booking.arrival_time, normal_style)])
        if booking.departure_time:
            spec_data.append([Paragraph("Departure Date/Time:", normal_bold), Paragraph(booking.departure_time, normal_style)])
    else:
        if booking.pickup_time:
            spec_data.append([Paragraph("Pickup Time:", normal_bold), Paragraph(booking.pickup_time, normal_style)])
        if booking.pickup_location_details:
            spec_data.append([Paragraph("Pickup/Drop Details:", normal_bold), Paragraph(booking.pickup_location_details, normal_style)])
            
    spec_table = Table(spec_data, colWidths=[120, 420])
    spec_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(spec_table)
    
    # 6. Fare Block
    story.append(Spacer(1, 12))
    try:
        fare_val = f"₹{booking.price:,.2f}"
    except (TypeError, ValueError):
        fare_val = f"₹{booking.price}" if booking.price is not None else "₹0.00"

    fare_data = [
        [
            Paragraph("<b>TOTAL FARE AMOUNT (INR):</b>", ParagraphStyle('FareLabel', parent=normal_bold, fontSize=11, textColor=primary_color)),
            Paragraph(f"<b>{fare_val}</b>", ParagraphStyle('FareVal', parent=normal_bold, fontSize=14, textColor=primary_color, alignment=2))
        ]
    ]
    fare_table = Table(fare_data, colWidths=[300, 240])
    fare_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#ecfdf5")),
        ('BOX', (0, 0), (-1, -1), 1, primary_color),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ]))
    story.append(fare_table)
    
    # 7. Terms & Support Footer
    story.append(Spacer(1, 15))
    terms_title_style = ParagraphStyle(
        'TermsTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=colors.HexColor("#475569")
    )
    terms_body_style = ParagraphStyle(
        'TermsBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        textColor=colors.HexColor("#64748b"),
        leading=11
    )
    
    story.append(Paragraph("IMPORTANT INFORMATION", terms_title_style))
    story.append(Paragraph("1. Please present this voucher (printed or digital copy) to your driver upon pickup.<br/>"
                           "2. In case of any flight delays or schedule changes, please contact the helpline immediately.<br/>"
                           "3. Free cancellation is allowed up to 48 hours prior to the scheduled pickup time.", terms_body_style))
    
    story.append(Spacer(1, 12))
    support_style = ParagraphStyle(
        'SupportInfo',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=primary_color,
        alignment=1
    )
    story.append(Paragraph("Goimomi 24/7 Helpline: +91 81100 82222  |  Email: hello@goimomi.com  |  Website: www.goimomi.com", support_style))
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

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
    raw_time = booking.pickup_time or booking.arrival_time or "N/A"
    formatted_time = "N/A"
    if raw_time != "N/A":
        parts = raw_time.strip().split()
        time_part = parts[1] if len(parts) == 2 else parts[0]
        try:
            t_obj = datetime.strptime(time_part, "%H:%M")
            formatted_time = t_obj.strftime("%I:%M %p")
        except Exception:
            try:
                t_obj = datetime.strptime(time_part, "%H:%M:%S")
                formatted_time = t_obj.strftime("%I:%M %p")
            except Exception:
                formatted_time = time_part

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
