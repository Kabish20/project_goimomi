import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Upload, ChevronDown, Check, User, Info, FileText, Image as ImageIcon, Trash2, X, Plus } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const VisaApplication = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const visa = location.state?.visa;
    const citizenOf = location.state?.citizenOf || "India";
    const departureDate = location.state?.departureDate || "";
    const returnDate = location.state?.returnDate || "";

    // Steps for Sidebar
    const steps = [
        { id: "internal_id", label: "Internal ID" },
        { id: "group_name", label: "Group Name" },
        { id: "traveler_1", label: "Traveler 1", subSteps: ["Passport", "Traveler Photo"] },
        { id: "review", label: "Review" },
        { id: "submit", label: "Submit" }
    ];

    const [currentStep, setCurrentStep] = useState("internal_id");

    // Form State
    const [applicationType, setApplicationType] = useState("Individual");
    const [internalId, setInternalId] = useState("");
    const [groupName, setGroupName] = useState("");
    const [selectedVisaType, setSelectedVisaType] = useState(visa?.title || "");

    // Data State
    const [countries, setCountries] = useState([]);

    // Travelers State
    const [applicants, setApplicants] = useState([{
        first_name: "",
        last_name: "",
        phone: "",
        passport_number: "",
        nationality: citizenOf,
        sex: "",
        dob: "",
        place_of_birth: "",
        place_of_issue: "",
        marital_status: "",
        date_of_issue: "",
        date_of_expiry: "",
        passport_front: null,
        photo: null,
        passport_front_preview: null,
        photo_preview: null,
        additional_documents: []
    }]);

    const [errors, setErrors] = useState({});

    const [submitting, setSubmitting] = useState(false);
    const [showPriceDetails, setShowPriceDetails] = useState(false);

    // Refs for scrolling to sections
    const internalIdRef = useRef(null);
    const groupNameRef = useRef(null);
    const travelerRef = useRef(null);

    const VISA_FEES = visa?.price || 2250;
    const SERVICE_FEES = 0;
    const TOTAL_PRICE = (VISA_FEES + SERVICE_FEES) * applicants.length;

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("/api/countries/");
                setCountries(response.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchCountries();
    }, []);

    const handleApplicantChange = (index, field, value) => {
        const updated = [...applicants];
        updated[index][field] = value;
        setApplicants(updated);
        // Clear error for this field when it changes
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`applicant_${index}_${field}`];
            return newErrors;
        });
    };

    const handleFileChange = (index, field, file) => {
        if (file) {
            const updated = [...applicants];
            updated[index][field] = file;
            updated[index][`${field}_preview`] = URL.createObjectURL(file);
            setApplicants(updated);
            // Clear error for this file field when it changes
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[`applicant_${index}_${field}`];
                return newErrors;
            });
        }
    };

    const removeFile = (index, field) => {
        const updated = [...applicants];
        updated[index][field] = null;
        updated[index][`${field}_preview`] = null;
        setApplicants(updated);
    };

    const addAdditionalDocument = (applicantIndex) => {
        const updated = [...applicants];
        updated[applicantIndex].additional_documents.push({
            id: Date.now() + Math.random(),
            file: null,
            preview: null
        });
        setApplicants(updated);
    };

    const removeAdditionalDocument = (applicantIndex, docIndex) => {
        const updated = [...applicants];
        updated[applicantIndex].additional_documents.splice(docIndex, 1);
        setApplicants(updated);
    };

    const handleAdditionalFileChange = (applicantIndex, docIndex, file) => {
        if (file) {
            const updated = [...applicants];
            updated[applicantIndex].additional_documents[docIndex].file = file;
            updated[applicantIndex].additional_documents[docIndex].preview = URL.createObjectURL(file);
            setApplicants(updated);
        }
    };

    const addApplicant = () => {
        setApplicants([...applicants, {
            first_name: "",
            last_name: "",
            phone: "",
            passport_number: "",
            nationality: citizenOf,
            sex: "",
            dob: "",
            place_of_birth: "",
            place_of_issue: "",
            marital_status: "",
            date_of_issue: "",
            date_of_expiry: "",
            passport_front: null,
            photo: null,
            passport_front_preview: null,
            photo_preview: null,
            additional_documents: []
        }]);
    };

    const removeApplicant = (index) => {
        const updated = applicants.filter((_, i) => i !== index);
        setApplicants(updated);
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Internal ID and Group Name are not marked as required in the UI, so skipping validation for them for now.
        // If they become required, add checks here:
        // if (!internalId.trim()) {
        //      newErrors.internal_id = "Internal ID is required";
        //      isValid = false;
        // }
        // if (applicationType === "Group" && !groupName.trim()) {
        //      newErrors.group_name = "Group Name is required for group applications";
        //      isValid = false;
        // }

        applicants.forEach((applicant, index) => {
            // Passport Number
            if (!applicant.passport_number.trim()) {
                newErrors[`applicant_${index}_passport_number`] = "Passport number is required";
                isValid = false;
            } else if (!/^[a-zA-Z0-9]+$/.test(applicant.passport_number)) {
                newErrors[`applicant_${index}_passport_number`] = "Invalid passport format (alphanumeric only)";
                isValid = false;
            }

            // First Name
            if (!applicant.first_name.trim()) {
                newErrors[`applicant_${index}_first_name`] = "First name is required";
                isValid = false;
            }

            // Phone
            if (!applicant.phone || applicant.phone.trim().length < 5) {
                newErrors[`applicant_${index}_phone`] = "Invalid phone number";
                isValid = false;
            }

            // Nationality
            if (!applicant.nationality) {
                newErrors[`applicant_${index}_nationality`] = "Nationality is required";
                isValid = false;
            }

            // Sex
            if (!applicant.sex) {
                newErrors[`applicant_${index}_sex`] = "Sex is required";
                isValid = false;
            }

            // DOB
            if (!applicant.dob) {
                newErrors[`applicant_${index}_dob`] = "Date of birth is required";
                isValid = false;
            } else {
                const dobDate = new Date(applicant.dob);
                const today = new Date();
                // Set today's time to 00:00:00 for accurate date comparison
                today.setHours(0, 0, 0, 0);
                if (dobDate >= today) {
                    newErrors[`applicant_${index}_dob`] = "Date of birth must be in the past";
                    isValid = false;
                }
            }

            // Place of Birth
            if (!applicant.place_of_birth.trim()) {
                newErrors[`applicant_${index}_place_of_birth`] = "Place of birth is required";
                isValid = false;
            }

            // Place of Issue
            if (!applicant.place_of_issue.trim()) {
                newErrors[`applicant_${index}_place_of_issue`] = "Place of issue is required";
                isValid = false;
            }

            // Marital Status
            if (!applicant.marital_status) {
                newErrors[`applicant_${index}_marital_status`] = "Marital status is required";
                isValid = false;
            }

            // Date of Issue
            if (!applicant.date_of_issue) {
                newErrors[`applicant_${index}_date_of_issue`] = "Date of issue is required";
                isValid = false;
            }

            // Date of Expiry
            if (!applicant.date_of_expiry) {
                newErrors[`applicant_${index}_date_of_expiry`] = "Date of expiry is required";
                isValid = false;
            } else {
                const expiryDate = new Date(applicant.date_of_expiry);
                const today = new Date();
                // Set today's time to 00:00:00 for accurate date comparison
                today.setHours(0, 0, 0, 0);
                if (expiryDate <= today) {
                    newErrors[`applicant_${index}_date_of_expiry`] = "Passport has expired";
                    isValid = false;
                }
            }

            // Files
            if (!applicant.passport_front) {
                newErrors[`applicant_${index}_passport_front`] = "Passport image is required";
                isValid = false;
            }
            if (!applicant.photo) {
                newErrors[`applicant_${index}_photo`] = "Traveler photo is required";
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            // Scroll to the first error
            const firstErrorField = document.querySelector('.text-red-500.text-xs.mt-1, .text-red-500.text-xs.mt-2');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("visa", id);
            formData.append("application_type", applicationType);
            formData.append("internal_id", internalId);
            formData.append("group_name", groupName);
            formData.append("departure_date", departureDate);
            formData.append("return_date", returnDate);
            formData.append("total_price", TOTAL_PRICE);

            // Filter out previews and nulls
            const applicantsData = applicants.map(({ passport_front, photo, passport_front_preview, photo_preview, ...rest }) => rest);
            formData.append("applicants_data", JSON.stringify(applicantsData));

            applicants.forEach((applicant, index) => {
                if (applicant.passport_front) {
                    formData.append(`applicant_${index}_passport_front`, applicant.passport_front);
                }
                if (applicant.photo) {
                    formData.append(`applicant_${index}_photo`, applicant.photo);
                }

                // Append additional documents
                applicant.additional_documents.forEach((doc, docIndex) => {
                    if (doc.file) {
                        formData.append(`applicant_${index}_additional_doc_${docIndex}`, doc.file);
                    }
                });
            });

            await axios.post("/api/visa-applications/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Application submitted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit application. Please try again.");
            setSubmitting(false);
        }
    };

    // Check if steps are complete for Sidebar visual feedback
    const isStepComplete = (stepId) => {
        switch (stepId) {
            case "internal_id":
                return internalId.trim().length > 0;
            case "group_name":
                return groupName.trim().length > 0;
            case "traveler_1":
                // Basic check for traveler 1 completion
                const app = applicants[0];
                return app && app.first_name && app.passport_number && app.passport_front && app.photo;
            case "review":
                // Considered complete if we have at least one valid traveler
                return applicants.length > 0 && isStepComplete("traveler_1");
            default:
                return false;
        }
    };

    const isSubStepComplete = (stepId, subLabel) => {
        if (stepId === "traveler_1") {
            const app = applicants[0];
            if (!app) return false;
            if (subLabel === "Passport") return !!app.passport_front;
            if (subLabel === "Traveler Photo") return !!app.photo;
        }
        return false;
    };

    if (!visa) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block w-72 bg-white h-screen sticky top-0 p-8 border-r border-gray-100 overflow-y-auto">
                <div className="space-y-8">
                    {steps.map((step) => {
                        const completed = isStepComplete(step.id);
                        const active = currentStep === step.id;

                        return (
                            <div key={step.id}>
                                <div className={`flex items-center gap-3 font-semibold ${completed || active ? "text-[#14532d]" : "text-gray-400"
                                    }`}>
                                    <div className={`mt-0.5`}>
                                        {completed ? (
                                            <CheckCircle size={18} fill="#14532d" className="text-white" />
                                        ) : (
                                            <div className={`w-4 h-4 rounded-full border-2 ${active ? "border-[#14532d]" : "border-gray-300"}`} />
                                        )}
                                    </div>
                                    <span>{step.label}</span>
                                </div>

                                {/* Substeps line */}
                                {step.subSteps && (
                                    <div className="ml-2.5 pl-4 border-l-2 border-gray-100 my-2 space-y-3">
                                        {step.subSteps.map(sub => {
                                            const subCompleted = isSubStepComplete(step.id, sub);
                                            return (
                                                <div key={sub} className={`flex items-center gap-2 text-sm ${subCompleted ? "text-[#14532d]" : "text-gray-500"}`}>
                                                    <CheckCircle size={14} className={subCompleted ? "text-[#14532d] fill-green-50" : "text-gray-300"} />
                                                    <span>{sub}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">

                {/* Header Actions */}
                <div className="flex justify-end gap-3 mb-6">
                    <button
                        onClick={addApplicant}
                        className="px-4 py-2 text-[#14532d] border border-[#14532d] rounded-full font-medium hover:bg-green-50 text-sm flex items-center gap-2"
                    >
                        <User size={16} /> + Add Another Traveler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-6 py-2 bg-[#14532d] text-white rounded-full font-medium hover:bg-[#0f4a24] text-sm shadow-sm flex items-center gap-2"
                        style={{ backgroundColor: '#14532d' }}
                    >
                        {submitting ? "Saving..." : "Review and Save"}
                    </button>
                </div>

                <div className="space-y-8">

                    {/* Section 1: Application Type */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Are You Applying For</h2>

                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => setApplicationType("Individual")}
                                className={`px-8 py-2 rounded-full font-semibold transition-all text-sm ${applicationType === "Individual"
                                    ? "bg-[#14532d] text-white shadow-md"
                                    : "bg-white border border-gray-200 text-gray-500"
                                    }`}
                                style={{ backgroundColor: applicationType === "Individual" ? '#14532d' : '' }}
                            >
                                Individual
                            </button>
                            <button
                                onClick={() => setApplicationType("Group")}
                                className={`px-8 py-2 rounded-full font-semibold transition-all text-sm ${applicationType === "Group"
                                    ? "bg-[#14532d] text-white shadow-md"
                                    : "bg-white border border-gray-200 text-gray-500"
                                    }`}
                                style={{ backgroundColor: applicationType === "Group" ? '#14532d' : '' }}
                            >
                                Group
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2">Internal ID</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#14532d] outline-none transition-colors bg-gray-50/50 text-sm"
                                    value={internalId}
                                    onChange={(e) => setInternalId(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2">Group Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#14532d] outline-none transition-colors bg-gray-50/50 text-sm"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-gray-500 mb-2">Visa Type</label>
                            <div className="relative">
                                <select
                                    value={selectedVisaType}
                                    onChange={(e) => setSelectedVisaType(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-[#14532d] text-gray-900 appearance-none bg-white font-medium outline-none focus:ring-1 focus:ring-[#14532d] text-sm"
                                    style={{ borderColor: '#14532d' }}
                                >
                                    <option>{visa.title}</option>
                                    <option>Vietnam E-Visa</option>
                                    <option>Vietnam 90 Days Multiple Entry E-Visa</option>
                                    <option>Lighting Fast (6 Business Hours)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Travelers Forms */}
                    {applicants.map((applicant, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Traveler {index + 1}</h2>
                                {applicants.length > 1 && (
                                    <button
                                        onClick={() => removeApplicant(index)}
                                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors"
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                )}
                            </div>

                            {/* Passport Upload */}
                            <div className="mb-8">
                                <h3 className="text-md font-bold text-gray-900 mb-1">Upload Traveler's Front Passport Page</h3>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-3xl">
                                    Vietnam requires a scan of the traveler's passport. Upload a clear passport image and your details will be filled automatically. However, it is mandatory to review the information before submitting to ensure there are no mistakes.
                                </p>

                                <div className={`border-2 border-dashed ${errors[`applicant_${index}_passport_front`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors w-full md:w-2/3 relative group cursor-pointer`}>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => handleFileChange(index, 'passport_front', e.target.files[0])}
                                    />
                                    {applicant.passport_front_preview ? (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault(); // Prevent opening file dialog
                                                    removeFile(index, 'passport_front');
                                                }}
                                                className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200"
                                                title="Remove file"
                                                type="button"
                                            >
                                                <X size={16} />
                                            </button>
                                            <img src={applicant.passport_front_preview} alt="Passport Preview" className="h-48 mx-auto object-contain rounded-lg shadow-sm" />
                                            <div className="mt-2 text-[#14532d] font-semibold text-sm flex items-center justify-center gap-2">
                                                <CheckCircle size={16} /> File Selected: {applicant.passport_front.name}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#14532d]">
                                                <Upload size={24} />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Drag and drop files to upload</h4>
                                            <p className="text-gray-400 text-sm mb-4">or</p>
                                            <button className="px-6 py-2 bg-[#14532d] text-white rounded-lg text-sm font-semibold">Select file</button>
                                            <p className="text-xs text-gray-400 mt-4">Supports JPEG, JPG, PDF, PNG. Max file size 5MB</p>
                                        </>
                                    )}
                                </div>
                                {errors[`applicant_${index}_passport_front`] && <p className="text-red-500 text-xs mt-2">{errors[`applicant_${index}_passport_front`]}</p>}
                            </div>

                            {/* Manual Form Fields */}
                            <div className="grid md:grid-cols-2 gap-4 mb-8 border-t border-gray-100 pt-6 text-sm">
                                <div>
                                    <label className="block text-xs font-bold text-gray-900 mb-1.5 ">Passport Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_passport_number`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors text-sm`}
                                        value={applicant.passport_number}
                                        onChange={(e) => handleApplicantChange(index, "passport_number", e.target.value)}
                                    />
                                    {errors[`applicant_${index}_passport_number`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_passport_number`]}</p>}
                                </div>
                                <div className="hidden md:block"></div> {/* Spacer */}

                                <div>
                                    <label className="block text-xs font-bold text-gray-900 mb-1.5">First Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_first_name`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors text-sm`}
                                        value={applicant.first_name}
                                        onChange={(e) => handleApplicantChange(index, "first_name", e.target.value)}
                                    />
                                    {errors[`applicant_${index}_first_name`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_first_name`]}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-900 mb-1.5 ">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#14532d] transition-colors text-sm"
                                        value={applicant.last_name}
                                        onChange={(e) => handleApplicantChange(index, "last_name", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                                    <div className="mt-1">
                                        <PhoneInput
                                            country={"in"}
                                            value={applicant.phone}
                                            onChange={(phone) => handleApplicantChange(index, "phone", phone)}
                                            inputProps={{
                                                name: `phone_${index}`,
                                                required: true,
                                            }}
                                            containerClass="!w-full"
                                            inputClass={`!w-full !px-3 !py-2 !rounded-xl !border ${errors[`applicant_${index}_phone`] ? '!border-red-500' : '!border-gray-200'} !outline-none focus:!border-[#14532d] !transition-colors !text-sm !h-[38px]`}
                                            buttonClass="!bg-white !border !border-gray-200 !rounded-l-xl"
                                        />
                                    </div>
                                    {errors[`applicant_${index}_phone`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_phone`]}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Nationality <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_nationality`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors bg-white text-sm`}
                                        value={applicant.nationality}
                                        onChange={(e) => handleApplicantChange(index, "nationality", e.target.value)}
                                    >
                                        <option value="">Select Nationality</option>
                                        {countries.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors[`applicant_${index}_nationality`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_nationality`]}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Sex <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_sex`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors bg-white text-sm`}
                                            value={applicant.sex}
                                            onChange={(e) => handleApplicantChange(index, "sex", e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {errors[`applicant_${index}_sex`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_sex`]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            required
                                            className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_dob`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors text-gray-500 uppercase text-sm`}
                                            value={applicant.dob}
                                            onChange={(e) => handleApplicantChange(index, "dob", e.target.value)}
                                        />
                                        {errors[`applicant_${index}_dob`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_dob`]}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Place of Birth <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_place_of_birth`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors text-sm`}
                                        value={applicant.place_of_birth}
                                        onChange={(e) => handleApplicantChange(index, "place_of_birth", e.target.value)}
                                    />
                                    {errors[`applicant_${index}_place_of_birth`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_place_of_birth`]}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Place of Issue <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_place_of_issue`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors text-sm`}
                                        value={applicant.place_of_issue}
                                        onChange={(e) => handleApplicantChange(index, "place_of_issue", e.target.value)}
                                    />
                                    {errors[`applicant_${index}_place_of_issue`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_place_of_issue`]}</p>}
                                </div>

                                <div className="grid grid-cols-6 gap-4 col-span-1 md:col-span-2">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Marital Status <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_marital_status`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors bg-white text-sm`}
                                            value={applicant.marital_status}
                                            onChange={(e) => handleApplicantChange(index, "marital_status", e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                        </select>
                                        {errors[`applicant_${index}_marital_status`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_marital_status`]}</p>}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Date of Issue <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            required
                                            className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_date_of_issue`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors text-gray-500 uppercase text-sm`}
                                            value={applicant.date_of_issue}
                                            onChange={(e) => handleApplicantChange(index, "date_of_issue", e.target.value)}
                                        />
                                        {errors[`applicant_${index}_date_of_issue`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_date_of_issue`]}</p>}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Date of Expiry <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            required
                                            className={`w-full px-3 py-2 rounded-xl border ${errors[`applicant_${index}_date_of_expiry`] ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-[#14532d] transition-colors text-gray-500 uppercase text-sm`}
                                            value={applicant.date_of_expiry}
                                            onChange={(e) => handleApplicantChange(index, "date_of_expiry", e.target.value)}
                                        />
                                        {errors[`applicant_${index}_date_of_expiry`] && <p className="text-red-500 text-xs mt-1">{errors[`applicant_${index}_date_of_expiry`]}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <h3 className="text-md font-bold text-gray-900 mb-1">Upload Traveler Photo</h3>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-3xl">
                                    Vietnam requires a passport-sized photo of the traveler. You can upload a selfie of the traveler.
                                </p>

                                <div className={`border-2 border-dashed ${errors[`applicant_${index}_photo`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors w-full md:w-1/2 relative group cursor-pointer`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => handleFileChange(index, 'photo', e.target.files[0])}
                                    />
                                    {applicant.photo_preview ? (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    removeFile(index, 'photo');
                                                }}
                                                className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200"
                                                title="Remove file"
                                                type="button"
                                            >
                                                <X size={16} />
                                            </button>
                                            <img src={applicant.photo_preview} alt="Photo Preview" className="h-40 mx-auto object-cover rounded-lg shadow-sm" />
                                            <div className="mt-2 text-[#14532d] font-semibold text-sm flex items-center justify-center gap-2">
                                                <CheckCircle size={16} /> Image Selected
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#14532d]">
                                                <ImageIcon size={24} />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Drag and drop files to upload</h4>
                                            <p className="text-gray-400 text-sm mb-4">or</p>
                                            <button className="px-6 py-2 bg-[#14532d] text-white rounded-lg text-sm font-semibold">Select file</button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Additional Documents */}
                            <div className="mt-10 border-t border-gray-100 pt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Additional Documents</h3>
                                    <button
                                        onClick={() => addAdditionalDocument(index)}
                                        className="text-[#14532d] font-medium text-sm flex items-center gap-1 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors border border-[#14532d]"
                                    >
                                        <Plus size={16} /> Add Document
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-3xl">
                                    If you have any other supporting documents (e.g., flight tickets, hotel bookings, etc.), you can upload them here.
                                </p>

                                <div className="space-y-6">
                                    {applicant.additional_documents.map((doc, docIndex) => (
                                        <div key={doc.id} className="relative">
                                            {/* Header with Remove button */}
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold text-gray-700">Document {docIndex + 1}</span>
                                                <button
                                                    onClick={() => removeAdditionalDocument(index, docIndex)}
                                                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                                                >
                                                    <Trash2 size={14} /> Remove Slot
                                                </button>
                                            </div>

                                            <div className={`border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors w-full md:w-1/2 relative group cursor-pointer`}>
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => handleAdditionalFileChange(index, docIndex, e.target.files[0])}
                                                />
                                                {doc.preview ? (
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                // Clear the file but keep the slot
                                                                const updated = [...applicants];
                                                                updated[index].additional_documents[docIndex].file = null;
                                                                updated[index].additional_documents[docIndex].preview = null;
                                                                setApplicants(updated);
                                                            }}
                                                            className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200"
                                                            title="Remove file"
                                                            type="button"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                        {doc.file?.type?.includes('pdf') ? (
                                                            <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                                                                <FileText size={48} className="text-gray-400" />
                                                            </div>
                                                        ) : (
                                                            <img src={doc.preview} alt="Document Preview" className="h-40 mx-auto object-cover rounded-lg shadow-sm" />
                                                        )}
                                                        <div className="mt-2 text-[#14532d] font-semibold text-sm flex items-center justify-center gap-2">
                                                            <CheckCircle size={16} /> File Selected: {doc.file.name}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#14532d]">
                                                            <FileText size={24} />
                                                        </div>
                                                        <h4 className="font-semibold text-gray-900 mb-1">Drag and drop files to upload</h4>
                                                        <p className="text-gray-400 text-sm mb-4">or</p>
                                                        <button className="px-6 py-2 bg-[#14532d] text-white rounded-lg text-sm font-semibold">Select file</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {applicant.additional_documents.length === 0 && (
                                        <div className="text-sm text-gray-400 italic">No additional documents added.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Right/Bottom Price Details Floating Card or Inline */}
                <div className="fixed bottom-0 right-0 p-4 w-full md:w-auto z-50">
                    {/* Can be implemented as a sticky footer or sidebar widget. 
                         For now, let's keep it simple as per screenshot which shows it as a card possibly on the right side on large screens. 
                         I'll add it as a floating widget for now designated for desktop, or inline.
                     */}
                </div>
            </main>

            {/* Right Side Price Panel (Desktop) */}
            <div className="hidden xl:block w-96 p-8 sticky top-0 h-screen overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Visa Information</h3>
                    <div className="space-y-4 mb-8">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Vietnam - {selectedVisaType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Travelers: <span className="text-gray-900">{applicants.length}</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Travel Dates: <span className="text-gray-900">{departureDate} - {returnDate}</span></p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">Expected Visa Approval</h3>
                    <div className="flex items-center gap-2 text-gray-700 mb-8 font-medium">
                        <CalendarIcon />
                        {/* Calculate approx date, +3 days from now */}
                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Price Details</h3>
                        </div>



                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <span className="text-gray-900 font-bold">Total Amount</span>
                            <span className="text-2xl font-bold text-[#14532d]">₹{TOTAL_PRICE.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-[#14532d] text-white rounded-xl font-bold hover:bg-[#0f4a24] shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        {submitting ? "Processing..." : "Review and Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper components
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default VisaApplication;
