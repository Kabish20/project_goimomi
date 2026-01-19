import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Calendar, Upload } from "lucide-react";

const VisaApplication = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const visa = location.state?.visa;
    const citizenOf = location.state?.citizenOf || "India";
    const departureDate = location.state?.departureDate || "";
    const returnDate = location.state?.returnDate || "";

    const [applicationType, setApplicationType] = useState("Individual");
    const [internalId, setInternalId] = useState("");
    const [groupName, setGroupName] = useState("");
    const [selectedVisaType, setSelectedVisaType] = useState(visa?.title || "");
    const [applicants, setApplicants] = useState([{
        first_name: "",
        last_name: "",
        passport_number: "",
        nationality: citizenOf,
        sex: "Male",
        dob: "",
        place_of_birth: "",
        place_of_issue: "",
        marital_status: "Single",
        date_of_issue: "",
        date_of_expiry: "",
        passport_front: null,
        photo: null
    }]);

    const [submitting, setSubmitting] = useState(false);

    const handleApplicantChange = (index, field, value) => {
        const updated = [...applicants];
        updated[index][field] = value;
        setApplicants(updated);
    };

    const handleFileChange = (index, field, file) => {
        const updated = [...applicants];
        updated[index][field] = file;
        setApplicants(updated);
    };

    const addApplicant = () => {
        setApplicants([...applicants, {
            first_name: "",
            last_name: "",
            passport_number: "",
            nationality: citizenOf,
            sex: "Male",
            dob: "",
            place_of_birth: "",
            place_of_issue: "",
            marital_status: "Single",
            date_of_issue: "",
            date_of_expiry: "",
            passport_front: null,
            photo: null
        }]);
    };

    const removeApplicant = (index) => {
        if (applicants.length > 1) {
            setApplicants(applicants.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("visa", id);
            formData.append("application_type", applicationType);
            formData.append("internal_id", internalId);
            formData.append("group_name", groupName);
            formData.append("departure_date", departureDate);
            formData.append("return_date", returnDate);
            formData.append("total_price", visa.price * applicants.length);

            const applicantsData = applicants.map(({ passport_front, photo, ...rest }) => rest);
            formData.append("applicants_data", JSON.stringify(applicantsData));

            applicants.forEach((applicant, index) => {
                if (applicant.passport_front) {
                    formData.append(`applicant_${index}_passport_front`, applicant.passport_front);
                }
                if (applicant.photo) {
                    formData.append(`applicant_${index}_photo`, applicant.photo);
                }
            });

            await axios.post("/api/visa-applications/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Application submitted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!visa) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Visa information not found</p>
                    <button
                        onClick={() => navigate("/visa")}
                        className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Visa Application</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Citizen of:</span>
                            <p className="font-semibold">{citizenOf}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Going to:</span>
                            <p className="font-semibold">{visa.country}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Departure:</span>
                            <p className="font-semibold">{departureDate}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Return:</span>
                            <p className="font-semibold">{returnDate}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Application Type */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Are You Applying For</h2>
                        <div className="flex gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setApplicationType("Individual")}
                                className={`flex-1 py-3 rounded-full font-semibold transition-colors ${applicationType === "Individual"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Individual
                            </button>
                            <button
                                type="button"
                                onClick={() => setApplicationType("Group")}
                                className={`flex-1 py-3 rounded-full font-semibold transition-colors ${applicationType === "Group"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Group
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Internal ID
                                </label>
                                <input
                                    type="text"
                                    value={internalId}
                                    onChange={(e) => setInternalId(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Visa Type
                            </label>
                            <input
                                type="text"
                                value={selectedVisaType}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Travelers */}
                    {applicants.map((applicant, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Traveler {index + 1}</h2>
                                {applicants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeApplicant(index)}
                                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={applicant.first_name}
                                        onChange={(e) => handleApplicantChange(index, "first_name", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={applicant.last_name}
                                        onChange={(e) => handleApplicantChange(index, "last_name", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Passport Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={applicant.passport_number}
                                        onChange={(e) => handleApplicantChange(index, "passport_number", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nationality *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={applicant.nationality}
                                        onChange={(e) => handleApplicantChange(index, "nationality", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sex *
                                    </label>
                                    <select
                                        required
                                        value={applicant.sex}
                                        onChange={(e) => handleApplicantChange(index, "sex", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={applicant.dob}
                                        onChange={(e) => handleApplicantChange(index, "dob", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Place of Birth *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={applicant.place_of_birth}
                                        onChange={(e) => handleApplicantChange(index, "place_of_birth", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Place of Issue *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={applicant.place_of_issue}
                                        onChange={(e) => handleApplicantChange(index, "place_of_issue", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Marital Status *
                                    </label>
                                    <select
                                        required
                                        value={applicant.marital_status}
                                        onChange={(e) => handleApplicantChange(index, "marital_status", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date of Issue *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={applicant.date_of_issue}
                                        onChange={(e) => handleApplicantChange(index, "date_of_issue", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date of Expiry *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={applicant.date_of_expiry}
                                        onChange={(e) => handleApplicantChange(index, "date_of_expiry", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Passport Front Copy *
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(index, "passport_front", e.target.files[0])}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Photo *
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(index, "photo", e.target.files[0])}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Traveler Button */}
                    <button
                        type="button"
                        onClick={addApplicant}
                        className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors font-semibold"
                    >
                        + Add Another Traveler
                    </button>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VisaApplication;
