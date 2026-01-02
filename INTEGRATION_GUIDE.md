# Holiday Package Integration Guide

## ✅ Complete Integration Flow

Your system is **fully integrated** and working! Here's how packages flow from admin to frontend:

---

## 🔄 Data Flow

### 1. **Admin Creates Package**
- Navigate to: `http://localhost:5174/admin/packages/add`
- Fill in package details:
  - **Title**: Package name
  - **Description**: Multi-line description
  - **Category**: Select `Domestic`, `International`, or `Umrah`
  - **Starting City**: Select from dropdown
  - **Days**: Number of days (auto-generates itinerary rows)
  - **Pricing**: Offer price and regular price
  - **Images**: Header image and card image
  - **Destinations**: Add multiple destinations with nights
  - **Itinerary**: Day-by-day details with optional images
  - **Inclusions/Exclusions**: What's included/excluded

### 2. **Backend Stores Data**
- API Endpoint: `POST http://127.0.0.1:8000/api/packages/`
- Django saves to PostgreSQL database
- Images uploaded to media folder
- Nested data (itinerary, inclusions, etc.) stored via serializers

### 3. **Frontend Fetches Packages**
- `Holidays.jsx` fetches: `GET http://127.0.0.1:8000/api/packages/`
- All packages loaded on component mount
- Data includes: title, description, category, images, destinations, pricing, etc.

### 4. **Category Filtering**
- **Navbar Links** pass category via state:
  ```javascript
  // Domestic
  <NavLink to="/holidays" state={{ category: "Domestic" }}>
  
  // International
  <NavLink to="/holidays" state={{ category: "International" }}>
  
  // Umrah
  <NavLink to="/holidays" state={{ category: "Umrah" }}>
  ```

- **Holidays.jsx** filters packages:
  ```javascript
  const filtered = packages.filter((pkg) => {
    const categoryMatch = category ? pkg.category === category : true;
    // ... other filters
  });
  ```

### 5. **Display on Frontend**
- Filtered packages shown in card layout
- Each card shows:
  - Card image
  - Title
  - Starting city + destinations
  - Days/Nights
  - Pricing (with strikethrough for regular price)
  - "View Details" button

### 6. **View Package Details**
- Click "View Details" → navigates to `/holiday/:id`
- `HolidayDetails.jsx` fetches: `GET http://127.0.0.1:8000/api/packages/{id}/`
- Shows:
  - Header image
  - Full description (as bullet points)
  - Expandable itinerary with day-by-day details
  - Inclusions and exclusions
  - Pricing card with "Enquire Now" button

---

## 🎯 How to Test

### Step 1: Add a Package
1. Go to: `http://localhost:5174/admin-login`
2. Login to admin panel
3. Navigate to: **Holiday Packages** → **Add**
4. Fill in all details:
   - **Title**: "Goa Beach Paradise"
   - **Category**: "Domestic"
   - **Days**: 5
   - **Starting City**: Select any city
   - **Offer Price**: 25000
   - Upload images
   - Add destinations, itinerary, inclusions

5. Click **SAVE**

### Step 2: View on Frontend
1. Go to homepage: `http://localhost:5174/`
2. Click **Holidays** → **Domestic** in navbar
3. Your package should appear in the list!

### Step 3: View Details
1. Click **View Details** on your package
2. See full itinerary, images, pricing

---

## 📂 Key Files

### Admin (Package Creation)
- `src/pages/Admin/HolidayPackageAdd.jsx` - Add new packages
- `src/pages/Admin/HolidayPackageEdit.jsx` - Edit existing packages
- `src/pages/Admin/HolidayPackageManage.jsx` - List/delete packages

### Frontend (Package Display)
- `src/pages/Holidays.jsx` - Package listing with filters
- `src/pages/HolidayDetails.jsx` - Individual package details
- `src/components/Navbar.jsx` - Navigation with category links

### Backend
- `Holidays/models.py` - Database models
- `Holidays/serializers.py` - API serializers
- `Holidays/views.py` - API endpoints

---

## 🔍 Category Mapping

| Navbar Link | Category Value | Packages Shown |
|-------------|---------------|----------------|
| Domestic | `"Domestic"` | All packages with `category="Domestic"` |
| International | `"International"` | All packages with `category="International"` |
| Umrah Package | `"Umrah"` | All packages with `category="Umrah"` |

---

## 🎨 Additional Filters

Users can also filter by:
- **Destination**: Searchable dropdown
- **Nights**: 2-30 nights
- **Starting City**: Searchable dropdown
- **Budget**: Slider (₹0 - ₹200,000)
- **Flight Option**: With/Without flight

All filters work together with category filtering!

---

## ✨ Features Implemented

✅ Full CRUD for Holiday Packages in Admin  
✅ Image upload (header + card images)  
✅ Nested data (destinations, itinerary, inclusions)  
✅ Category-based filtering on frontend  
✅ Searchable dropdowns for destinations/cities  
✅ Budget range filtering  
✅ Responsive package cards  
✅ Detailed package view with expandable itinerary  
✅ Real-time data from Django API  

---

## 🚀 Quick Start

### Backend
```bash
cd d:\G\goimomi-holidays-backend
python manage.py runserver
```
**Running at**: `http://127.0.0.1:8000`

### Frontend
```bash
cd d:\G\goimomi-holidays-frontend
npm run dev
```
**Running at**: `http://localhost:5174`

---

## 📝 Notes

1. **Images**: Make sure Django's `MEDIA_URL` and `MEDIA_ROOT` are configured
2. **CORS**: Backend must allow requests from frontend origin
3. **Category Values**: Must match exactly: `"Domestic"`, `"International"`, `"Umrah"`
4. **API Base URL**: Currently `http://127.0.0.1:8000/api` (update if deployed)

---

## 🎉 Success!

Your integration is complete! Packages added via the admin panel will automatically appear on the frontend, filtered by their category when users navigate through the Holidays dropdown menu.
