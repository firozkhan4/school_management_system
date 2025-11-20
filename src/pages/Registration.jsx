import React, { useState } from 'react';
import { BookOpen, Building2, Link, Users, UserCog, Mail, Lock, Phone } from 'lucide-react';

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, type = 'text', placeholder, icon: Icon, required = false, isError = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative rounded-lg shadow-sm">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition duration-150 ease-in-out ${Icon ? 'pl-10' : 'pl-4'} ${isError ? 'border-red-500' : 'border-gray-300'}`}
      />
    </div>
  </div>
);

// Progress Step Indicator
const StepIndicator = ({ step, title, icon: Icon, isCurrent }) => (
  <div className={`flex items-center space-x-2 flex-1 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`}>
    <div className={`p-2 rounded-full transition-colors duration-300 ${isCurrent ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200'}`}>
      <Icon className="h-5 w-5" />
    </div>
    <span className={`hidden sm:inline text-sm font-medium transition-colors duration-300 ${isCurrent ? 'text-blue-700' : 'text-gray-600'}`}>
      {step}. {title}
    </span>
  </div>
);


// Main App component
const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    // Step 1 (School Basic Info + Contact/Location)
    schoolName: '', city: '', state: '', country: '', schoolContact: '',
    schoolEmail: '', pincode: '', website: '', // Moved from Step 2
    // Step 2 (School Affiliation Info)
    affiliatedTo: '', affiliationNo: '',
    // Step 3 (School Metrics)
    totalStudents: '', teachersCount: '', nonTeachingStaffCount: '', classLevels: '', schoolMedium: '',
    // Step 4 (Admin User Info)
    firstName: '', lastName: '', adminEmail: '', adminContact: '', password: '', confirmPassword: '',
  });

  // State for tracking validation errors
  const [errors, setErrors] = useState({});

  const stepTitles = [
    { title: 'School Info', icon: Building2 },
    { title: 'Affiliation', icon: Link },
    { title: 'Metrics', icon: Users },
    { title: 'Admin Setup', icon: UserCog },
  ];

  // Universal change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error on change
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  // Validation Logic for the current step
  const validateStep = () => {
    const newErrors = {};
    let isValid = true;

    // UPDATED REQUIRED FIELDS
    const requiredFields = {
      // Step 1 now includes contact and location fields
      1: ['schoolName', 'schoolContact', 'city', 'state', 'country', 'schoolEmail', 'pincode'],
      // Step 2 is now just affiliation details
      2: ['affiliatedTo', 'affiliationNo'],
      3: ['totalStudents', 'teachersCount', 'classLevels', 'schoolMedium'],
      4: ['firstName', 'adminEmail', 'adminContact', 'password', 'confirmPassword'],
    };

    requiredFields[currentStep].forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        isValid = false;
      }
    });

    if (currentStep === 4) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev < 4 ? prev + 1 : prev);
      setMessage(''); // Clear message when moving steps
    } else {
      setMessage('Please fill out all required fields correctly before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev > 1 ? prev - 1 : prev);
    setMessage('');
  };

  // Final submission logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      setMessage('Please fill out all required fields correctly.');
      return;
    }

    setLoading(true);
    setMessage('');

    // --- Mock Registration Logic ---
    setTimeout(() => {
      setLoading(false);
      setMessage(`Registration successful for ${formData.schoolName}! School profile created.`);
      console.log('Final Form Data:', formData);
      // In a real app, you would send formData to your API here.
    }, 2000);
  };

  // --- Step Components ---

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // UPDATED STEP 1 CONTENT: Merging original Step 1 and Step 2 contact/location fields
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="School Name" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="ABC International School" required icon={Building2} isError={!!errors.schoolName} />
            <InputField label="School Contact Phone" name="schoolContact" value={formData.schoolContact} onChange={handleChange} type="tel" placeholder="1234567890" required icon={Phone} isError={!!errors.schoolContact} />

            <InputField label="School Email" name="schoolEmail" value={formData.schoolEmail} onChange={handleChange} type="email" placeholder="contact@abc.edu" required icon={Mail} isError={!!errors.schoolEmail} />
            <InputField label="Website (Optional)" name="website" value={formData.website} onChange={handleChange} placeholder="https://abc.edu" icon={Link} />

            <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="New Delhi" required isError={!!errors.city} />
            <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Kota" required isError={!!errors.state} />
            <InputField label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="India" required isError={!!errors.country} />
            <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="560001" required isError={!!errors.pincode} />
          </div>
        );
      case 2:
        // UPDATED STEP 2 CONTENT: Only showing affiliation details
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Affiliated To" name="affiliatedTo" value={formData.affiliatedTo} onChange={handleChange} placeholder="CBSE" required isError={!!errors.affiliatedTo} />
            <InputField label="Affiliation Number" name="affiliationNo" value={formData.affiliationNo} onChange={handleChange} placeholder="Affiliation No." required isError={!!errors.affiliationNo} />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Total Students" name="totalStudents" value={formData.totalStudents} onChange={handleChange} type="number" placeholder="e.g., 500" required isError={!!errors.totalStudents} />
            <InputField label="Teachers Count" name="teachersCount" value={formData.teachersCount} onChange={handleChange} type="number" placeholder="e.g., 30" required isError={!!errors.teachersCount} />
            <InputField label="Non-Teaching Staff" name="nonTeachingStaffCount" value={formData.nonTeachingStaffCount} onChange={handleChange} type="number" placeholder="e.g., 10" />
            <InputField label="Class Levels" name="classLevels" value={formData.classLevels} onChange={handleChange} placeholder="e.g., Primary, Secondary" required isError={!!errors.classLevels} />
            <InputField label="School Medium" name="schoolMedium" value={formData.schoolMedium} onChange={handleChange} placeholder="e.g., English, Hindi" required isError={!!errors.schoolMedium} />
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h2 className="col-span-full text-lg font-bold text-gray-800 border-b pb-2 mb-2">Primary Admin User Setup</h2>
            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required isError={!!errors.firstName} />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
            <InputField label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} type="email" placeholder="admin@gmail.com" required icon={Mail} isError={!!errors.adminEmail} />
            <InputField label="Admin Contact" name="adminContact" value={formData.adminContact} onChange={handleChange} type="tel" placeholder="9876543210" required icon={Phone} isError={!!errors.adminContact} />
            <InputField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="A2345678" required icon={Lock} isError={!!errors.password} />
            <InputField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="A2345678" required icon={Lock} isError={!!errors.confirmPassword} />
            {errors.confirmPassword && <p className="col-span-full text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)', // Light blue gradient background
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* Header Section */}
        <div className="p-6 bg-blue-700 text-white">
          <div className="flex items-center justify-center">
            <BookOpen size={40} className="mr-3 text-blue-200" />
            <h1 className="text-2xl font-extrabold tracking-tight">
              New School Registration
            </h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center relative after:content-[''] after:absolute after:top-1/2 after:left-0 after:right-0 after:h-0.5 after:bg-gray-200 after:z-0">
            {stepTitles.map((step, index) => (
              <div key={index} className="flex flex-col items-center z-10">
                <StepIndicator
                  step={index + 1}
                  title={step.title}
                  icon={step.icon}
                  isCurrent={currentStep >= index + 1}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()} className="p-6 sm:p-8 space-y-6">

          <h2 className="text-xl font-bold text-gray-800">
            Step {currentStep}: {stepTitles[currentStep - 1].title}
          </h2>

          {/* Message/Feedback Area */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Render Current Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                Previous
              </button>
            )}
            <div className={currentStep === 1 ? 'w-full flex justify-end' : ''}>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
