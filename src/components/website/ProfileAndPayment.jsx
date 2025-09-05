import React, { useState } from "react";
import Select from "react-select";
import { FaCcVisa, FaCcPaypal, FaCcApplePay, FaCcMastercard, FaMapMarkerAlt } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const ProfileAndPayment = () => {
    const [selectedSection, setSelectedSection] = useState("contact");
    const [selectedPayment, setSelectedPayment] = useState("visa");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        comingAlone: "",
        studyOrWork: "",
        university: "",
        description: "",
        cardNumber: "",
        expiryDate: "",
        securityNumber: "",
        savePayment: false,
        promoCode: ""
    });

    const countryOptions = [
        { value: "US", label: "US (+1)" },
        { value: "UK", label: "UK (+44)" },
        { value: "PK", label: "Pakistan (+92)" },
        { value: "IN", label: "India (+91)" },
        { value: "DE", label: "Germany (+49)" },
    ];

    const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
        // Add your booking logic here
    };

    const toggleSection = (section) => {
        setSelectedSection(selectedSection === section ? null : section);
    };

    return (
        <div className="flex flex-col lg:flex-row w-full p-4 md:p-6 gap-4 md:gap-6">
            {/* Left Column - Form */}
            <div className="w-full lg:w-1/2 px-4 py-6 rounded-lg shadow-lg bg-white">
                <form onSubmit={handleSubmit}>
                    {/* Contact Information */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => toggleSection("contact")}
                            className="w-full flex justify-between items-center text-left text-lg font-semibold py-2 border-b"
                        >
                            <span>1. Contact Information</span>
                            {selectedSection === "contact" ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {selectedSection === "contact" && (
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter name"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Surname</label>
                                        <input
                                            type="text"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleInputChange}
                                            placeholder="Enter surname"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Telephone Number</label>
                                    <div className="flex gap-2">
                                        <div className="w-1/3">
                                            <Select
                                                options={countryOptions}
                                                defaultValue={selectedCountry}
                                                onChange={setSelectedCountry}
                                                className="text-black"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        padding: '0.25rem',
                                                        borderRadius: '0.5rem',
                                                        borderColor: '#d1d5db',
                                                        '&:hover': {
                                                            borderColor: '#3b82f6'
                                                        }
                                                    })
                                                }}
                                            />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Phone number"
                                            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="text-lg font-semibold">Room Application Form</h3>

                                    <div className="mt-3">
                                        <label className="block text-gray-700 font-semibold mb-2">Are you coming alone?</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="comingAlone"
                                                    value="yes"
                                                    checked={formData.comingAlone === "yes"}
                                                    onChange={handleInputChange}
                                                    className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                                                    required
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="comingAlone"
                                                    value="no"
                                                    checked={formData.comingAlone === "no"}
                                                    onChange={handleInputChange}
                                                    className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                                                />
                                                No
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label className="block text-gray-700 font-semibold mb-2">Do you study or work?</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="studyOrWork"
                                                    value="work"
                                                    checked={formData.studyOrWork === "work"}
                                                    onChange={handleInputChange}
                                                    className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                                                    required
                                                />
                                                Work
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="studyOrWork"
                                                    value="study"
                                                    checked={formData.studyOrWork === "study"}
                                                    onChange={handleInputChange}
                                                    className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                                                />
                                                Study
                                            </label>
                                        </div>
                                    </div>

                                    {formData.studyOrWork === "study" && (
                                        <div className="mt-3">
                                            <label className="block text-gray-700 font-semibold mb-1">At which university do you study?</label>
                                            <select
                                                name="university"
                                                value={formData.university}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            >
                                                <option value="">Select university</option>
                                                <option value="University A">University A</option>
                                                <option value="University B">University B</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="mt-3">
                                        <label className="block text-gray-700 font-semibold mb-1">Tell us about yourself</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter a description..."
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Section */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => toggleSection("payment")}
                            className="w-full flex justify-between items-center text-left text-lg font-semibold py-2 border-b"
                        >
                            <span>2. Payment</span>
                            {selectedSection === "payment" ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {selectedSection === "payment" && (
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPayment("visa")}
                                        className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 ${selectedPayment === "visa" ? "border-primary bg-blue-50" : "bg-gray-50 hover:bg-gray-100"}`}
                                    >
                                        <FaCcVisa className="text-3xl text-primary" />
                                        <span>Visa</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPayment("applepay")}
                                        className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 ${selectedPayment === "applepay" ? "border-gray-700 bg-gray-100" : "bg-gray-50 hover:bg-gray-100"}`}
                                    >
                                        <FaCcApplePay className="text-3xl text-black" />
                                        <span>Apple Pay</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPayment("paypal")}
                                        className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 ${selectedPayment === "paypal" ? "border-primary bg-blue-50" : "bg-gray-50 hover:bg-gray-100"}`}
                                    >
                                        <FaCcPaypal className="text-3xl text-primary" />
                                        <span>PayPal</span>
                                    </button>
                                </div>

                                {selectedPayment === "visa" && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Credit Card</p>
                                                <p className="text-gray-600 text-sm">Mastercard, Visa, American Amex</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1">Card Number</label>
                                            <div className="relative">
                                                <FaCcMastercard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-secondary" />
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Card number"
                                                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-1">Security Number</label>
                                                <input
                                                    type="text"
                                                    name="securityNumber"
                                                    value={formData.securityNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="XXX"
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="savePayment"
                                                name="savePayment"
                                                checked={formData.savePayment}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-primary focus:ring-primary"
                                            />
                                            <label htmlFor="savePayment" className="text-gray-700">
                                                Remember my payment details
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cancellation Policy */}
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => toggleSection("cancellation")}
                            className="w-full flex justify-between items-center text-left text-lg font-semibold py-2 border-b"
                        >
                            <span>3. Cancellation Policy</span>
                            {selectedSection === "cancellation" ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {selectedSection === "cancellation" && (
                            <div className="mt-4 space-y-4">
                                <p className="text-sm text-gray-600">
                                    By selecting the button below, I agree to the Housing rules, Booking, and Refund rules.
                                </p>
                                <button
                                    type="submit"
                                    className="w-full p-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Confirm and Book
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="w-full lg:w-1/2 p-4 md:p-6 border border-gray-200 rounded-lg bg-white">
                <div className="space-y-4">
                    <img
                        src="/Hero/hero.jpg"
                        alt="Room"
                        className="w-full h-48 md:h-56 object-cover rounded-lg"
                    />
                    <h2 className="text-xl font-bold">Room 7 in Casa Monteiro II</h2>
                    <div className="flex items-center gap-2 text-gray-500">
                        <FaMapMarkerAlt />
                        <p>R. Damasceno Monteiro, 1170 Lisboa</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Check-in</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Check-out</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Monthly (for 1 Person)</span>
                            <span className="font-semibold">$550</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bills (Gas, Media, Cleaning)</span>
                            <span className="font-semibold">$50</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fee</span>
                            <span className="font-semibold">$0</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                            <span className="font-bold text-gray-800">Total</span>
                            <span className="font-bold text-gray-800">$600</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-gray-700 font-semibold mb-1">Promo Code</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="promoCode"
                                value={formData.promoCode}
                                onChange={handleInputChange}
                                placeholder="Enter promo code"
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="button"
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAndPayment;