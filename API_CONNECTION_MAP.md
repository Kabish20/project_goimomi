# Admin UI ↔ REST API Connection Map

## ✅ Complete API Integration Status

All admin UI pages are **fully connected** to the Django REST API and PostgreSQL database.

**Base URL**: `http://127.0.0.1:8000/api`

---

## 📊 Complete API Mapping

### 1. **Destinations** ✅

#### Frontend Pages:
- **Add**: `src/pages/Admin/DestinationAdd.jsx`
- **Manage**: `src/pages/Admin/DestinationManage.jsx`

#### API Endpoints:
```javascript
// Fetch all destinations
GET http://127.0.0.1:8000/api/destinations/

// Add new destination
POST http://127.0.0.1:8000/api/destinations/
Body: FormData {
  name: string,
  country: string,
  region: string,
  description: text,
  image: file
}

// Update destination
PUT http://127.0.0.1:8000/api/destinations/{id}/
Body: FormData (same as POST)

// Delete destination
DELETE http://127.0.0.1:8000/api/destinations/{id}/
```

#### Code References:
```javascript
// DestinationAdd.jsx (Line 18)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// POST request (Lines 29-48)
const response = await axios.post(`${API_BASE_URL}/destinations/`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// DestinationManage.jsx (Line 19)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 22-28)
const response = await axios.get(`${API_BASE_URL}/destinations/`);

// PUT request (Lines 49-57)
await axios.put(`${API_BASE_URL}/destinations/${id}/`, editForm);

// DELETE request (Lines 60-68)
await axios.delete(`${API_BASE_URL}/destinations/${id}/`);
```

---

### 2. **Holiday Packages** ✅

#### Frontend Pages:
- **Add**: `src/pages/Admin/HolidayPackageAdd.jsx`
- **Edit**: `src/pages/Admin/HolidayPackageEdit.jsx`
- **Manage**: `src/pages/Admin/HolidayPackageManage.jsx`

#### API Endpoints:
```javascript
// Fetch all packages
GET http://127.0.0.1:8000/api/packages/

// Fetch single package
GET http://127.0.0.1:8000/api/packages/{id}/

// Add new package
POST http://127.0.0.1:8000/api/packages/
Body: FormData {
  title, description, category, starting_city, days,
  start_date, group_size, price, Offer_price,
  header_image, card_image,
  package_destinations: JSON,
  itinerary_days: JSON,
  inclusions: JSON,
  exclusions: JSON,
  itinerary_image_0, itinerary_image_1, ... (files)
}

// Update package
PUT http://127.0.0.1:8000/api/packages/{id}/
Body: FormData (same as POST)

// Delete package
DELETE http://127.0.0.1:8000/api/packages/{id}/
```

#### Code References:
```javascript
// HolidayPackageAdd.jsx (Line 149)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// POST request (Lines 282-286)
const response = await axios.post(`${API_BASE_URL}/packages/`, formDataToSend, {
  headers: { "Content-Type": "multipart/form-data" }
});

// HolidayPackageEdit.jsx (Line 128)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 141-145)
const response = await axios.get(`${API_BASE_URL}/packages/${id}/`);

// PUT request (Lines 334-338)
const response = await axios.put(`${API_BASE_URL}/packages/${id}/`, formDataToSend, {
  headers: { "Content-Type": "multipart/form-data" }
});

// HolidayPackageManage.jsx (Line 19)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 22-28)
const response = await axios.get(`${API_BASE_URL}/packages/`);

// DELETE request (Lines 49-57)
await axios.delete(`${API_BASE_URL}/packages/${id}/`);
```

---

### 3. **Starting Cities** ✅

#### Frontend Pages:
- **Add**: `src/pages/Admin/StartingCityAdd.jsx`
- **Manage**: `src/pages/Admin/StartingCityManage.jsx`

#### API Endpoints:
```javascript
// Fetch all starting cities
GET http://127.0.0.1:8000/api/starting-cities/

// Add new starting city
POST http://127.0.0.1:8000/api/starting-cities/
Body: {
  name: string,
  region: string,
  country: string
}

// Update starting city
PUT http://127.0.0.1:8000/api/starting-cities/{id}/
Body: { name, region, country }

// Delete starting city
DELETE http://127.0.0.1:8000/api/starting-cities/{id}/
```

#### Code References:
```javascript
// StartingCityAdd.jsx (Line 15)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// POST request (Lines 29-47)
const response = await axios.post(`${API_BASE_URL}/starting-cities/`, form);

// StartingCityManage.jsx (Line 19)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 22-28)
const response = await axios.get(`${API_BASE_URL}/starting-cities/`);

// PUT request (Lines 49-57)
await axios.put(`${API_BASE_URL}/starting-cities/${id}/`, editForm);

// DELETE request (Lines 60-68)
await axios.delete(`${API_BASE_URL}/starting-cities/${id}/`);
```

---

### 4. **Itinerary Masters** ✅

#### Frontend Pages:
- **Add**: `src/pages/Admin/ItineraryMasterAdd.jsx`
- **Edit**: `src/pages/Admin/ItineraryMasterEdit.jsx`
- **Manage**: `src/pages/Admin/ItineraryMasterManage.jsx`

#### API Endpoints:
```javascript
// Fetch all itinerary masters
GET http://127.0.0.1:8000/api/itinerary-masters/

// Fetch single itinerary master
GET http://127.0.0.1:8000/api/itinerary-masters/{id}/

// Add new itinerary master
POST http://127.0.0.1:8000/api/itinerary-masters/
Body: FormData {
  name: string,
  title: string,
  description: text,
  image: file (optional)
}

// Update itinerary master
PUT http://127.0.0.1:8000/api/itinerary-masters/{id}/
Body: FormData (same as POST)

// Delete itinerary master
DELETE http://127.0.0.1:8000/api/itinerary-masters/{id}/
```

#### Code References:
```javascript
// ItineraryMasterAdd.jsx (Line 19)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// POST request (Lines 44-48)
const response = await axios.post(`${API_BASE_URL}/itinerary-masters/`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// ItineraryMasterEdit.jsx (Line 23)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 32-36)
const response = await axios.get(`${API_BASE_URL}/itinerary-masters/${id}/`);

// PUT request (Lines 78-82)
const response = await axios.put(`${API_BASE_URL}/itinerary-masters/${id}/`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// ItineraryMasterManage.jsx (Line 19)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 25-31)
const response = await axios.get(`${API_BASE_URL}/itinerary-masters/`);

// DELETE request (Lines 47-57)
await axios.delete(`${API_BASE_URL}/itinerary-masters/${id}/`);
```

---

### 5. **Enquiries** ✅

#### Frontend Pages:
- **Manage**: `src/pages/Admin/EnquiryManage.jsx`

#### API Endpoints:
```javascript
// Fetch all enquiries
GET http://127.0.0.1:8000/api/enquiry-form/

// Delete enquiry
DELETE http://127.0.0.1:8000/api/enquiry-form/{id}/
```

#### Code References:
```javascript
// EnquiryManage.jsx (Line 15)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 21-27)
const response = await axios.get(`${API_BASE_URL}/enquiry-form/`);

// DELETE request (Lines 47-57)
await axios.delete(`${API_BASE_URL}/enquiry-form/${id}/`);
```

---

### 6. **Holiday Enquiries** ✅

#### Frontend Pages:
- **Manage**: `src/pages/Admin/HolidayEnquiryManage.jsx`

#### API Endpoints:
```javascript
// Fetch all holiday enquiries
GET http://127.0.0.1:8000/api/holiday-form/

// Delete holiday enquiry
DELETE http://127.0.0.1:8000/api/holiday-form/{id}/
```

#### Code References:
```javascript
// HolidayEnquiryManage.jsx (Line 15)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 21-27)
const response = await axios.get(`${API_BASE_URL}/holiday-form/`);

// DELETE request (Lines 47-57)
await axios.delete(`${API_BASE_URL}/holiday-form/${id}/`);
```

---

### 7. **Umrah Enquiries** ✅

#### Frontend Pages:
- **Manage**: `src/pages/Admin/UmrahEnquiryManage.jsx`

#### API Endpoints:
```javascript
// Fetch all umrah enquiries
GET http://127.0.0.1:8000/api/umrah-form/

// Delete umrah enquiry
DELETE http://127.0.0.1:8000/api/umrah-form/{id}/
```

#### Code References:
```javascript
// UmrahEnquiryManage.jsx (Line 15)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 21-27)
const response = await axios.get(`${API_BASE_URL}/umrah-form/`);

// DELETE request (Lines 47-57)
await axios.delete(`${API_BASE_URL}/umrah-form/${id}/`);
```

---

### 8. **Users** ✅

#### Frontend Pages:
- **Add**: `src/pages/Admin/UserAdd.jsx`
- **Manage**: `src/pages/Admin/UsersList.jsx`

#### API Endpoints:
```javascript
// Fetch all users
GET http://127.0.0.1:8000/api/users/

// Add new user
POST http://127.0.0.1:8000/api/users/
Body: {
  username: string,
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  is_staff: boolean,
  is_superuser: boolean
}
```

#### Code References:
```javascript
// UserAdd.jsx (Line 16)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// POST request (Lines 29-47)
const response = await axios.post(`${API_BASE_URL}/users/`, form);

// UsersList.jsx (Line 13)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// GET request (Lines 19-25)
const response = await axios.get(`${API_BASE_URL}/users/`);
```

---

### 9. **Admin Dashboard** ✅

#### Frontend Pages:
- **Dashboard**: `src/pages/Admin/AdminDashboard.jsx`

#### API Endpoints:
```javascript
// Fetch dashboard statistics (multiple endpoints)
GET http://127.0.0.1:8000/api/destinations/
GET http://127.0.0.1:8000/api/packages/
GET http://127.0.0.1:8000/api/enquiry-form/
GET http://127.0.0.1:8000/api/holiday-form/
GET http://127.0.0.1:8000/api/umrah-form/
GET http://127.0.0.1:8000/api/starting-cities/
GET http://127.0.0.1:8000/api/itinerary-masters/
```

#### Code References:
```javascript
// AdminDashboard.jsx (Line 24)
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Multiple GET requests (Lines 37-44)
const fetchPromises = [
  axios.get(`${API_BASE_URL}/destinations/`),
  axios.get(`${API_BASE_URL}/packages/`),
  axios.get(`${API_BASE_URL}/enquiry-form/`),
  axios.get(`${API_BASE_URL}/holiday-form/`),
  axios.get(`${API_BASE_URL}/umrah-form/`),
  axios.get(`${API_BASE_URL}/starting-cities/`),
  axios.get(`${API_BASE_URL}/itinerary-masters/`)
];
```

---

## 🔗 Backend API Configuration

### Django URLs (`Holidays/urls.py`):
```python
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet)
router.register(r'packages', HolidayPackageViewSet)
router.register(r'starting-cities', StartingCityViewSet)
router.register(r'itinerary-masters', ItineraryMasterViewSet)
router.register(r'enquiry-form', EnquiryAPI)
router.register(r'holiday-form', HolidayEnquiryAPI)
router.register(r'umrah-form', UmrahEnquiryAPI)
router.register(r'users', UserViewSet)

urlpatterns = router.urls
```

### ViewSets (`Holidays/views.py`):
```python
class DestinationViewSet(ModelViewSet):          # ✅ Full CRUD
class HolidayPackageViewSet(ModelViewSet):       # ✅ Full CRUD
class StartingCityViewSet(ModelViewSet):         # ✅ Full CRUD
class ItineraryMasterViewSet(ModelViewSet):      # ✅ Full CRUD
class EnquiryAPI(ModelViewSet):                  # ✅ Full CRUD
class HolidayEnquiryAPI(ModelViewSet):           # ✅ Full CRUD
class UmrahEnquiryAPI(ModelViewSet):             # ✅ Full CRUD
class UserViewSet(ModelViewSet):                 # ✅ Full CRUD
```

---

## 📦 HTTP Methods Supported

| Endpoint | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| `/api/destinations/` | ✅ | ✅ | ✅ | ✅ |
| `/api/packages/` | ✅ | ✅ | ✅ | ✅ |
| `/api/starting-cities/` | ✅ | ✅ | ✅ | ✅ |
| `/api/itinerary-masters/` | ✅ | ✅ | ✅ | ✅ |
| `/api/enquiry-form/` | ✅ | ✅ | ✅ | ✅ |
| `/api/holiday-form/` | ✅ | ✅ | ✅ | ✅ |
| `/api/umrah-form/` | ✅ | ✅ | ✅ | ✅ |
| `/api/users/` | ✅ | ✅ | ✅ | ✅ |

---

## 🗄️ Database Tables

All API endpoints interact with PostgreSQL database `goimomi_holidays`:

| API Endpoint | Database Table |
|--------------|----------------|
| `/api/destinations/` | `Holidays_destination` |
| `/api/packages/` | `Holidays_holidaypackage` |
| `/api/starting-cities/` | `Holidays_startingcity` |
| `/api/itinerary-masters/` | `Holidays_itinerarymaster` |
| `/api/enquiry-form/` | `Holidays_enquiry` |
| `/api/holiday-form/` | `Holidays_holidayenquiry` |
| `/api/umrah-form/` | `Holidays_umrahenquiry` |
| `/api/users/` | `auth_user` |

---

## ✅ Connection Verification

### Test All Connections:

```bash
# 1. Check if backend is running
curl http://127.0.0.1:8000/api/

# 2. Test each endpoint
curl http://127.0.0.1:8000/api/destinations/
curl http://127.0.0.1:8000/api/packages/
curl http://127.0.0.1:8000/api/starting-cities/
curl http://127.0.0.1:8000/api/itinerary-masters/
curl http://127.0.0.1:8000/api/enquiry-form/
curl http://127.0.0.1:8000/api/holiday-form/
curl http://127.0.0.1:8000/api/umrah-form/
curl http://127.0.0.1:8000/api/users/
```

### Frontend Connection Test:
1. Open browser: `http://localhost:5174/admin-dashboard`
2. Check browser console (F12) for API calls
3. All requests should show: `Status: 200 OK`

---

## 🎯 Summary

**✅ All admin UI pages are fully connected to the REST API!**

- **16 Admin Pages** connected
- **8 API Endpoints** integrated
- **8 Database Tables** accessible
- **Full CRUD Operations** on all entities
- **Real-time Data Sync** between frontend and PostgreSQL

**Backend**: Django REST Framework @ `http://127.0.0.1:8000`  
**Frontend**: React @ `http://localhost:5174`  
**Database**: PostgreSQL `goimomi_holidays`
