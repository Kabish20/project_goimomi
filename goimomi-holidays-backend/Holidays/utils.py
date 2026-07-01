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
    using ReportLab SimpleDocTemplate that matches the ticket poster design.
    """
    import os
    import urllib.request
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
    
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
    
    # Premium Color Palette
    primary_green = colors.HexColor("#14532d")
    pill_green = colors.HexColor("#16a34a")
    pill_pink = colors.HexColor("#db2777")
    pill_orange = colors.HexColor("#ea580c")
    bg_pink_box = colors.HexColor("#fdf2f8")
    border_pink_box = colors.HexColor("#fbcfe8")
    bg_grey_box = colors.HexColor("#f8fafc")
    border_grey = colors.HexColor("#cbd5e1")
    text_slate = colors.HexColor("#1e293b")
    text_muted = colors.HexColor("#64748b")
    text_light_muted = colors.HexColor("#94a3b8")

    # Define custom styles
    voucher_title_style = ParagraphStyle(
        'VoucherTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=primary_green,
        alignment=1,
        spaceAfter=1
    )
    voucher_subtitle_style = ParagraphStyle(
        'VoucherSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-BoldOblique',
        fontSize=8,
        textColor=text_muted,
        alignment=1
    )
    badge_label_style = ParagraphStyle(
        'BadgeLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        textColor=colors.white,
        alignment=1
    )
    badge_val_style = ParagraphStyle(
        'BadgeVal',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=text_slate,
        alignment=1
    )
    pill_text_style = ParagraphStyle(
        'PillText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        textColor=colors.white,
        alignment=1
    )
    info_label_style = ParagraphStyle(
        'InfoLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        textColor=text_light_muted,
        spaceAfter=1
    )
    info_val_style = ParagraphStyle(
        'InfoVal',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=text_slate,
        spaceAfter=6
    )
    car_title_style = ParagraphStyle(
        'CarTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=pill_pink,
        alignment=1,
        spaceAfter=4
    )
    car_spec_style = ParagraphStyle(
        'CarSpec',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        textColor=colors.HexColor("#475569")
    )
    car_spec_right_style = ParagraphStyle(
        'CarSpecRight',
        parent=car_spec_style,
        alignment=2
    )

    # Date formatting safely
    try:
        travel_date_str = booking.pickup_date.strftime('%d %b %Y') if booking.pickup_date else "N/A"
    except Exception:
        travel_date_str = str(booking.pickup_date) if booking.pickup_date else "N/A"
        
    try:
        total_amount_str = f"{booking.price:,.2f}"
    except (TypeError, ValueError):
        total_amount_str = str(booking.price) if booking.price is not None else "0.00"

    # Format pickup time
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

    # Resolve vehicle details
    from Holidays.models import VehicleMaster
    v_name = booking.vehicle_name or ""
    v_name_lower = v_name.lower()
    
    photo_rel_path = "vehicles/download_2_YaJg5h3.jpeg"
    seating_capacity = 4
    luggage_capacity = 2
    transmission = "Auto"
    fuel_type = "Petrol"
    
    if 'coaster' in v_name_lower or 'coster' in v_name_lower:
        photo_rel_path = "vehicles/Coaster.jpeg"
        seating_capacity = 22
        luggage_capacity = 15
        transmission = "Manual"
        fuel_type = "Diesel"
    elif 'hiace' in v_name_lower:
        photo_rel_path = "vehicles/Toyota_Hiace_Super_LWB_High_Roof_Van_-_AU_version_2004-10.jpeg"
        seating_capacity = 10
        luggage_capacity = 6
        transmission = "Manual"
        fuel_type = "Diesel"
    elif 'gmc' in v_name_lower or 'yukon' in v_name_lower:
        photo_rel_path = "vehicles/2020_Gmc_Yukon_Xl_Pictures__Engine.jpeg"
        seating_capacity = 7
        luggage_capacity = 5
        transmission = "Auto"
        fuel_type = "Petrol"
    elif 'staria' in v_name_lower or 'starex' in v_name_lower or 'h1' in v_name_lower:
        photo_rel_path = "vehicles/All_New_2025_HYUNDAI_GRAND_STAREX_LUXURY_-_The_Best_MPV_VAN_of_the_Year.jpeg"
        seating_capacity = 9
        luggage_capacity = 5
        transmission = "Auto"
        fuel_type = "Diesel"
    elif 'taurus' in v_name_lower:
        photo_rel_path = "vehicles/Owning_a_2011_Ford_Taurus_SEL__Common_Problems_and_Maintenance_Tips.jpeg"
        seating_capacity = 5
        luggage_capacity = 3
        transmission = "Auto"
        fuel_type = "Petrol"
    elif 'camry' in v_name_lower or 'sonata' in v_name_lower or 'sedan' in v_name_lower:
        photo_rel_path = "vehicles/download_2_YaJg5h3.jpeg"
        seating_capacity = 4
        luggage_capacity = 2
        transmission = "Auto"
        fuel_type = "Petrol"

    # Query db overrides
    for vm in VehicleMaster.objects.all():
        if vm.name and (vm.name.lower() in v_name.lower() or v_name.lower() in vm.name.lower()):
            if vm.photo:
                photo_rel_path = vm.photo.name
            seating_capacity = vm.seating_capacity or seating_capacity
            luggage_capacity = vm.luggage_capacity or luggage_capacity
            break

    photo_abs_path = os.path.join(settings.MEDIA_ROOT, photo_rel_path)

    # 1. Header Banner Table
    logo_img = None
    try:
        logo_url = "https://goimomi.com/logo-preview.png"
        req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=2) as response:
            logo_data = io.BytesIO(response.read())
            logo_img = Image(logo_data, width=110, height=33)
    except Exception:
        logo_img = Paragraph("<b>goimomi</b><br/>Holidays", ParagraphStyle('LogoTextFallback', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, textColor=primary_green))

    title_area = [
        Paragraph("CAB VOUCHER", voucher_title_style),
        Paragraph("— Your Ride, Our Priority! —", voucher_subtitle_style)
    ]
    
    badge_label_pill = Table([[Paragraph("BOOKING ID", badge_label_style)]], colWidths=[90])
    badge_label_pill.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), pill_green),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    
    id_box_data = [
        [badge_label_pill],
        [Paragraph(booking.booking_id, badge_val_style)]
    ]
    id_box_table = Table(id_box_data, colWidths=[100])
    id_box_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_grey_box),
        ('BOX', (0, 0), (-1, -1), 0.5, border_grey),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))

    header_table = Table([[logo_img, title_area, id_box_table]], colWidths=[140, 260, 100])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
    ]))
    
    # 2. Dashed Divider Helper
    def get_divider():
        t = Table([[""]], colWidths=[500])
        t.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, border_grey),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        return t

    # Helper for pills
    def create_pdf_pill(text, bg_color):
        t = Table([[Paragraph(text, pill_text_style)]], colWidths=[100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg_color),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
        ]))
        return t

    # 3. 3-Column details
    # Left Col (Pickup Details)
    pickup_cell_data = [
        [create_pdf_pill("Pickup Details", pill_green)],
        [Spacer(1, 4)],
        [Paragraph("📅 Date", info_label_style)],
        [Paragraph(travel_date_str, info_val_style)],
        [Paragraph("⏰ Time", info_label_style)],
        [Paragraph(formatted_time, info_val_style)],
        [Paragraph("📍 Pick Up At", info_label_style)],
        [Paragraph(booking.airport_name or booking.from_city if booking.transfer_type == 'airport' else (f"{booking.from_city} ({booking.pickup_location_details})" if booking.pickup_location_details else booking.from_city), info_val_style)]
    ]
    pickup_table = Table(pickup_cell_data, colWidths=[150])
    pickup_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))

    # Center Col (Booked Car box)
    car_img = None
    if photo_abs_path and os.path.exists(photo_abs_path):
        try:
            car_img = Image(photo_abs_path, width=105, height=60)
        except Exception:
            pass
    if not car_img:
        car_img = Paragraph("<font size='24' color='#db2777'>🚗</font>", ParagraphStyle('CarFall', parent=styles['Normal'], alignment=1))

    specs_table = Table([
        [Paragraph(f"👤 {seating_capacity} Seater", car_spec_style), Paragraph(f"🧳 {luggage_capacity} Bags", car_spec_right_style)],
        [Paragraph(f"⛽ {fuel_type}", car_spec_style), Paragraph(f"⚙️ {transmission}", car_spec_right_style)]
    ], colWidths=[70, 70])
    specs_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
    ]))

    car_box_data = [
        [create_pdf_pill("Your Booked Car", pill_pink)],
        [Spacer(1, 4)],
        [car_img],
        [Spacer(1, 4)],
        [Paragraph(booking.vehicle_name, car_title_style)],
        [specs_table]
    ]
    car_box_table = Table(car_box_data, colWidths=[150])
    car_box_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_pink_box),
        ('BOX', (0, 0), (-1, -1), 0.5, border_pink_box),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))

    # Right Col (Drop Details)
    drop_cell_data = [
        [create_pdf_pill("Drop Details", pill_orange)],
        [Spacer(1, 4)],
        [Paragraph("🏁 Drop At", info_label_style)],
        [Paragraph(booking.to_city, info_val_style)],
        [Paragraph("⏳ Info", info_label_style)],
        [Paragraph("Verified Chauffeur", info_val_style)],
        [Paragraph("🛣️ Service", info_label_style)],
        [Paragraph("Private Transfer", info_val_style)]
    ]
    drop_table = Table(drop_cell_data, colWidths=[150])
    drop_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))

    # Grid columns
    grid_table = Table([[pickup_table, car_box_table, drop_table]], colWidths=[165, 170, 165])
    grid_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))

    # 4. Map connector design
    map_table = Table([["", "", Paragraph("🚗", ParagraphStyle('MapCar', parent=styles['Normal'], fontSize=11, alignment=1)), "", ""]], colWidths=[6, 170, 20, 170, 6])
    map_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), pill_green), 
        ('BACKGROUND', (4, 0), (4, 0), pill_orange),
        ('LINEBELOW', (1, 0), (1, 0), 1, text_light_muted), 
        ('LINEBELOW', (3, 0), (3, 0), 1, text_light_muted),
        ('ALIGN', (2, 0), (2, 0), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
    ]))

    # 5. Customer & Support Table (bottom part)
    cust_pill = create_pdf_pill("Customer Details", primary_green)
    
    cust_grid_data = [
        [Paragraph("Customer Name", info_label_style), Paragraph("Phone Number", info_label_style)],
        [Paragraph(f"{booking.title} {booking.first_name} {booking.last_name}".strip(), info_val_style), Paragraph(booking.phone or "N/A", info_val_style)],
        [Paragraph("Email ID", info_label_style), Paragraph("No. of Passengers", info_label_style)],
        [Paragraph(booking.email or "N/A", info_val_style), Paragraph(f"{booking.guests or 2} Pax", info_val_style)],
        [Paragraph("Booking Date", info_label_style), Paragraph("Special Request", info_label_style)],
        [Paragraph(booking.created_at.strftime('%d %b %Y') if booking.created_at else "N/A", info_val_style), Paragraph(booking.special_requirements or "None", info_val_style)]
    ]
    cust_grid_table = Table(cust_grid_data, colWidths=[160, 160])
    cust_grid_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    
    left_footer_content = Table([[cust_pill], [Spacer(1, 6)], [cust_grid_table]], colWidths=[320])
    left_footer_content.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))

    # Right footer: Fare & Status & Support
    status_color = primary_green if booking.status in ['Confirmed', 'Tentative Confirmation'] else (pill_orange if booking.status == 'Booking Requested' else text_muted)
    status_pill = Table([[Paragraph(booking.status.upper(), ParagraphStyle('StatTxt', parent=pill_text_style, fontSize=7))]], colWidths=[110])
    status_pill.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), status_color),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))

    right_footer_data = [
        [Paragraph("Total Amount", info_label_style)],
        [Paragraph(f"<font color='#14532d' size='14'><b>₹{total_amount_str}</b></font>", info_val_style)],
        [Paragraph("Booking Status", info_label_style)],
        [status_pill],
        [Spacer(1, 10)],
        [Paragraph("24/7 Support Desk", ParagraphStyle('SupTitle', parent=info_label_style, textColor=text_muted))],
        [Paragraph("📞 +91 81100 82222", ParagraphStyle('SupItem', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=primary_green, spaceAfter=2))],
        [Paragraph("✉️ hello@goimomi.com", ParagraphStyle('SupItem2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=primary_green))]
    ]
    right_footer_table = Table(right_footer_data, colWidths=[140])
    right_footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))

    # Compile footer table
    footer_table = Table([[left_footer_content, right_footer_table]], colWidths=[340, 160])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEAFTER', (0, 0), (0, 0), 0.5, border_grey),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ]))

    footer_note = Paragraph("Thank you for booking with us. Have a safe & pleasant journey!", ParagraphStyle('FootNote', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8, textColor=text_muted, alignment=1))

    # Outer Layout wrap (ticket border outline)
    outer_content = [
        [header_table],
        [Spacer(1, 4)],
        [get_divider()],
        [Spacer(1, 6)],
        [grid_table],
        [Spacer(1, 8)],
        [map_table],
        [Spacer(1, 8)],
        [get_divider()],
        [Spacer(1, 6)],
        [footer_table],
        [Spacer(1, 12)],
        [footer_note]
    ]
    
    outer_wrapper = Table(outer_content, colWidths=[510])
    outer_wrapper.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, border_grey),
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('TOPPADDING', (0, 0), (-1, -1), 15),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ]))

    story.append(outer_wrapper)
    
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

    # Resolve vehicle details for the voucher design
    v_name = booking.vehicle_name or ""
    v_name_lower = v_name.lower()
    
    vehicle_image_url = "https://goimomi.com/media/vehicles/download_2_YaJg5h3.jpeg"
    seating_capacity = 4
    luggage_capacity = 2
    transmission = "Auto"
    fuel_type = "Petrol"
    
    if 'coaster' in v_name_lower or 'coster' in v_name_lower:
        vehicle_image_url = "https://goimomi.com/media/vehicles/Coaster.jpeg"
        seating_capacity = 22
        luggage_capacity = 15
        transmission = "Manual"
        fuel_type = "Diesel"
    elif 'hiace' in v_name_lower:
        vehicle_image_url = "https://goimomi.com/media/vehicles/Toyota_Hiace_Super_LWB_High_Roof_Van_-_AU_version_2004-10.jpeg"
        seating_capacity = 10
        luggage_capacity = 6
        transmission = "Manual"
        fuel_type = "Diesel"
    elif 'gmc' in v_name_lower or 'yukon' in v_name_lower:
        vehicle_image_url = "https://goimomi.com/media/vehicles/2020_Gmc_Yukon_Xl_Pictures__Engine.jpeg"
        seating_capacity = 7
        luggage_capacity = 5
        transmission = "Auto"
        fuel_type = "Petrol"
    elif 'staria' in v_name_lower or 'starex' in v_name_lower or 'h1' in v_name_lower:
        vehicle_image_url = "https://goimomi.com/media/vehicles/All_New_2025_HYUNDAI_GRAND_STAREX_LUXURY_-_The_Best_MPV_VAN_of_the_Year.jpeg"
        seating_capacity = 9
        luggage_capacity = 5
        transmission = "Auto"
        fuel_type = "Diesel"
    elif 'taurus' in v_name_lower:
        vehicle_image_url = "https://goimomi.com/media/vehicles/Owning_a_2011_Ford_Taurus_SEL__Common_Problems_and_Maintenance_Tips.jpeg"
        seating_capacity = 5
        luggage_capacity = 3
        transmission = "Auto"
        fuel_type = "Petrol"
    elif 'camry' in v_name_lower or 'sonata' in v_name_lower or 'sedan' in v_name_lower:
        vehicle_image_url = "https://goimomi.com/media/vehicles/download_2_YaJg5h3.jpeg"
        seating_capacity = 4
        luggage_capacity = 2
        transmission = "Auto"
        fuel_type = "Petrol"

    # Prepare booking context compatible with the new car_booking_voucher template
    booking_context = {
        'booking_id': booking.booking_id,
        'customer_name': f"{booking.title} {booking.first_name} {booking.last_name}".strip(),
        'customer_email': booking.email or "N/A",
        'phone': booking.phone or "N/A",
        'vehicle_type': f"{booking.vehicle_name} ({booking.vehicle_category})" if booking.vehicle_category else booking.vehicle_name,
        'vehicle_name_only': booking.vehicle_name,
        'pickup_location': booking.airport_name or booking.from_city if booking.transfer_type == 'airport' else (f"{booking.from_city} ({booking.pickup_location_details})" if booking.pickup_location_details else booking.from_city),
        'drop_location': booking.to_city,
        'travel_date': travel_date_str,
        'pickup_time': formatted_time,
        'total_amount': total_amount_str,
        'payment_status': booking.status,
        'vehicle_image_url': vehicle_image_url,
        'seating_capacity': seating_capacity,
        'luggage_capacity': luggage_capacity,
        'transmission': transmission,
        'fuel_type': fuel_type,
        'booking_date': booking.created_at.strftime('%d %b %Y') if booking.created_at else "N/A",
        'special_requirements': booking.special_requirements or "None",
        'guests': booking.guests or 2,
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
