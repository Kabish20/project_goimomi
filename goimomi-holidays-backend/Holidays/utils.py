import io
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
    fare_data = [
        [
            Paragraph("<b>TOTAL FARE AMOUNT (INR):</b>", ParagraphStyle('FareLabel', parent=normal_bold, fontSize=11, textColor=primary_color)),
            Paragraph(f"<b>₹{booking.price:,.2f}</b>", ParagraphStyle('FareVal', parent=normal_bold, fontSize=14, textColor=primary_color, alignment=2))
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
    
    # Prepare booking context compatible with the new car_booking_voucher template
    booking_context = {
        'booking_id': booking.booking_id,
        'customer_name': f"{booking.title} {booking.first_name} {booking.last_name}".strip(),
        'customer_email': booking.email or "N/A",
        'phone': booking.phone or "N/A",
        'vehicle_type': f"{booking.vehicle_name} ({booking.vehicle_category})" if booking.vehicle_category else booking.vehicle_name,
        'pickup_location': booking.airport_name or booking.from_city if booking.transfer_type == 'airport' else (f"{booking.from_city} ({booking.pickup_location_details})" if booking.pickup_location_details else booking.from_city),
        'drop_location': booking.to_city,
        'travel_date': booking.pickup_date.strftime('%d %b %Y') if booking.pickup_date else "N/A",
        'pickup_time': booking.pickup_time or booking.arrival_time or "N/A",
        'total_amount': f"{booking.price:,.2f}",
        'payment_status': booking.status,
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
Travel Date: {booking.pickup_date}
Fare Amount: INR {booking.price}

A professional PDF voucher is attached to this email.

For support, contact our 24/7 Travel Desk:
Call: +91 81100 82222
Email: hello@goimomi.com

Thank you,
Goimomi Holidays
"""
    
    # Compile recipients list
    recipients = []
    if booking.email:
        recipients.append(booking.email)
    
    # Add company email from settings (default to hello@goimomi.com if not defined)
    company_email = getattr(settings, 'COMPANY_EMAIL', 'hello@goimomi.com')
    if company_email:
        recipients.append(company_email)
        
    # Ensure recipients is a list of unique non-empty emails
    recipients = list(set(recipients))
    if not recipients:
        print("Error: No email recipients found for booking.")
        return False
        
    # Build email message
    sender = getattr(settings, 'EMAIL_HOST_USER', 'hello@goimomi.com')
    if not sender:
        sender = 'hello@goimomi.com'
        
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=sender,
        to=recipients
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
