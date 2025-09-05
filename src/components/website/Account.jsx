import { useState } from "react";
import { Switch } from "@headlessui/react";
import { BsTrash, BsUpload } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

export default function Account() {
    const [notifications, setNotifications] = useState({
        sms: false,
        email: true,
        phone: false,
    });

    const [editMode, setEditMode] = useState({
        basicInfo: false,
        bookingRequest: false,
        additionalDetails: false,
    });

    const [formData, setFormData] = useState({
        firstName: "Anna",
        lastName: "Karlsson",
        gender: "Female",
        email: "anna.karlsson@gmail.com",
        phone: "+1 (555) 123-4567",
        nationality: "Swedish",
        address: "123 Main St, Stockholm, Sweden",
        bookingMessage: "I'm interested in booking your property for 6 months starting next month.",
        studyOrWork: "Work",
        institution: "Tech Solutions Inc.",
        funding: "Employment income",
        about: "I'm a software developer who enjoys traveling and experiencing new cultures. I'm clean, responsible, and looking for a comfortable place to stay while working remotely.",
    });

    const [documents, setDocuments] = useState([
        { name: "passport.pdf", size: "2.4 MB" },
        { name: "id_card.jpg", size: "1.2 MB" },
    ]);

    const toggleEdit = (section) => {
        setEditMode((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newDocuments = files.map((file) => ({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        }));
        setDocuments([...documents, ...newDocuments]);
    };

    const removeDocument = (index) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col lg:flex-row p-4 md:p-6 gap-6">
            {/* Left Side - Profile Card */}
            <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <img
                            src="/Hero/hero.jpg"
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition">
                            <BsUpload className="text-sm" />
                        </button>
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{formData.firstName} {formData.lastName}</h2>
                        <p className="text-gray-600">{formData.email}</p>
                    </div>
                </div>

                {/* Notifications Center */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-center mb-4">Notifications Center</h3>
                    <div className="space-y-3">
                        {Object.entries(notifications).map(([type, enabled]) => (
                            <div key={type} className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                                <span className="capitalize font-medium">{type}</span>
                                <Switch
                                    checked={enabled}
                                    onChange={() => setNotifications({ ...notifications, [type]: !enabled })}
                                    className={`${enabled ? 'bg-primary' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span
                                        className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </Switch>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delete Account Button */}
                <div className="mt-auto pt-6">
                    <button className="w-full bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg flex items-center justify-center transition">
                        <BsTrash className="mr-2" />
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Right Side - Profile Form */}
            <div className="w-full lg:w-2/3 space-y-6">
                {/* Basic Info Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Basic Info</h2>
                        <button
                            onClick={() => toggleEdit("basicInfo")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${editMode.basicInfo ? 'bg-gray-200 text-gray-800' : 'bg-primary text-white'}`}
                        >
                            <FiEdit size={16} />
                            {editMode.basicInfo ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                disabled={!editMode.basicInfo}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                disabled={!editMode.basicInfo}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!editMode.basicInfo}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!editMode.basicInfo}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!editMode.basicInfo}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-1">Nationality</label>
                        <select
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            disabled={!editMode.basicInfo}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                        >
                            <option value="Swedish">Swedish</option>
                            <option value="American">American</option>
                            <option value="British">British</option>
                            <option value="German">German</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-1">Current Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!editMode.basicInfo}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                        />
                    </div>
                </div>

                {/* Booking Request Message */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Booking Request Message</h2>
                        <button
                            onClick={() => toggleEdit("bookingRequest")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${editMode.bookingRequest ? 'bg-gray-200 text-gray-800' : 'bg-primary text-white'}`}
                        >
                            <FiEdit size={16} />
                            {editMode.bookingRequest ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <label className="block text-gray-700 font-medium mb-1">Message to Host</label>
                    <textarea
                        name="bookingMessage"
                        value={formData.bookingMessage}
                        onChange={handleInputChange}
                        disabled={!editMode.bookingRequest}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 h-32"
                    />
                </div>

                {/* Additional Details & Documents */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Additional Details & Documents</h2>
                        <button
                            onClick={() => toggleEdit("additionalDetails")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${editMode.additionalDetails ? 'bg-gray-200 text-gray-800' : 'bg-primary text-white'}`}
                        >
                            <FiEdit size={16} />
                            {editMode.additionalDetails ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Do You Study or Work?</label>
                            <select
                                name="studyOrWork"
                                value={formData.studyOrWork}
                                onChange={handleInputChange}
                                disabled={!editMode.additionalDetails}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            >
                                <option value="Study">Study</option>
                                <option value="Work">Work</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                {formData.studyOrWork === "Study" ? "Where Are You Studying?" : "Where Do You Work?"}
                            </label>
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleInputChange}
                                disabled={!editMode.additionalDetails}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">How Will You Fund Your Stay?</label>
                            <input
                                type="text"
                                name="funding"
                                value={formData.funding}
                                onChange={handleInputChange}
                                disabled={!editMode.additionalDetails}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Tell Us About Yourself */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Tell Us About Yourself</h2>
                    <label className="block text-gray-700 font-medium mb-1">Your Details</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
                    />
                </div>

                {/* Document Upload */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Documents (Passport/ID Card)</h2>

                    {/* Uploaded Documents */}
                    <div className="space-y-3 mb-4">
                        {documents.map((doc, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-gray-500">{doc.size}</p>
                                </div>
                                <button
                                    onClick={() => removeDocument(index)}
                                    className="text-secondary hover:text-red-700"
                                >
                                    <BsTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* File Upload */}
                    <label className="block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <BsUpload className="text-2xl mb-2" />
                            <p>Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-400">PDF, JPG, PNG up to 5MB</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}