import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Calendar, Home, Users, BookOpen, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';

const getCurrentDate = () => new Date().toISOString().split('T')[0];
const getMaxDate = () => getCurrentDate();
const getCurrentYear = () => new Date().getFullYear();

// --- Initial State for Form Data ---
const initialFormData = {
  // Application Details
  academicYear: '',
  gradeApplied: '',
  applicationType: 'new',
  category: 'general',

  // Student Details
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phone: '',

  // Nested JSON fields
  address: { street: '', city: '', state: '', pincode: '' },
  parentInfo: { fatherName: '', motherName: '' },
  previousSchool: { name: '', grade: '', year: '' },

  // Remarks
  remarks: '',

  // Mocked Foreign Keys / System Values (for payload generation)
  applicationNumber: 'ADM-PENDING', // Will be replaced on submit
};

/**
 * Custom Input Component to handle styling, state, and errors consistently.
 */
const FormInput = React.memo(({ label, name, type = 'text', required, parent, error, ...props }) => {
  const isTextarea = type === 'textarea';
  const inputId = parent ? `${parent}_${name}` : name;

  const baseStyle = "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150";
  const errorStyle = error ? "border-red-500 ring-red-500" : "";

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={inputId}
          name={name}
          data-parent={parent}
          className={`${baseStyle} ${errorStyle} resize-none`}
          required={required}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          data-parent={parent}
          className={`${baseStyle} ${errorStyle}`}
          required={required}
          {...props}
        />
      )}
      {error && <p className="text-xs text-red-500 flex items-center mt-1"><AlertTriangle className="w-3 h-3 mr-1" />{error}</p>}
    </div>
  );
});


/**
 * Main Application Component
 */
const AdmissionForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [payload, setPayload] = useState(null);

  // --- State Handler (Handles both top-level and nested JSON fields) ---
  const handleChange = useCallback((e) => {
    const { name, value, dataset } = e.target;

    // Clear specific error on change
    const errorKey = dataset.parent ? `${dataset.parent}_${name}` : name;
    setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));

    if (dataset.parent) {
      // Handle nested JSON fields (e.g., address, parentInfo)
      setFormData(prev => ({
        ...prev,
        [dataset.parent]: {
          ...prev[dataset.parent],
          [name]: value
        }
      }));
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  // --- Validation Logic ---
  const validateForm = useCallback(() => {
    let errors = {};
    let isValid = true;

    // Helper for required/length validation
    const validateField = (key, value, min, max, message) => {
      if (!value || String(value).trim() === '') {
        errors[key] = 'This field is required.';
        isValid = false;
        return false;
      }
      if ((min !== undefined && String(value).length < min) || (max !== undefined && String(value).length > max)) {
        errors[key] = message || `Length must be between ${min} and ${max} characters.`;
        isValid = false;
        return false;
      }
      return true;
    };

    // 1. Core Fields
    validateField('academicYear', formData.academicYear, 9, 9, 'Must be 9 characters (YYYY-YYYY format).');
    if (formData.academicYear && !/^\d{4}-\d{4}$/.test(formData.academicYear)) {
      errors['academicYear'] = 'Format must be YYYY-YYYY.';
      isValid = false;
    }

    validateField('gradeApplied', formData.gradeApplied, 1, 10);
    validateField('firstName', formData.firstName, 2, 50);
    validateField('lastName', formData.lastName, 2, 50);
    validateField('gender', formData.gender, 1, 10);

    // 2. Email
    if (validateField('email', formData.email)) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors['email'] = 'Must be a valid email address.';
        isValid = false;
      }
    }

    // 3. Date of Birth
    if (validateField('dateOfBirth', formData.dateOfBirth)) {
      if (new Date(formData.dateOfBirth) >= new Date(getMaxDate())) {
        errors['dateOfBirth'] = 'Date of birth must be before today.';
        isValid = false;
      }
    }

    // 4. Address (Nested JSON)
    if (!validateField('address_street', formData.address.street)) isValid = false;
    if (!validateField('address_city', formData.address.city)) isValid = false;
    if (!validateField('address_state', formData.address.state)) isValid = false;
    if (!validateField('address_pincode', formData.address.pincode, 6, 8, 'Pincode must be 6 to 8 digits.')) isValid = false;

    // 5. Parent Info (Custom Logic: At least one parent name required)
    const hasParent = formData.parentInfo.fatherName.trim().length > 0 || formData.parentInfo.motherName.trim().length > 0;
    if (!hasParent) {
      errors['parentInfo_required'] = 'At least one parent name (Father or Mother) is required.';
      isValid = false;
    }

    // 6. Remarks (Max 1000)
    if (formData.remarks.length > 1000) {
      errors['remarks'] = 'Remarks cannot exceed 1000 characters.';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [formData]);


  // --- Submission Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // --- Compile Final Payload (Mimicking Backend Logic) ---
    const finalPayload = {
      ...formData,
      applicationNumber: `ADM-${Date.now().toString().slice(-6)}`,
      applicationDate: new Date().toISOString(),
      status: 'submitted',

      // Clean up potentially empty nested JSON objects before submission
      previousSchool: (formData.previousSchool.name || formData.previousSchool.grade || formData.previousSchool.year)
        ? {
          ...formData.previousSchool,
          year: formData.previousSchool.year ? parseInt(formData.previousSchool.year) : null,
        }
        : null,

      // Placeholder for documents
      documents: [],

      // Remove temporary fields not in the final model (like schoolId/userId if they came from auth context)
      // (We keep them here to reflect the FK fields in the model)
    };

    // Set payload and show success modal
    setPayload(finalPayload);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Helper: Section Title ---
  const SectionTitle = ({ icon: Icon, title }) => (
    <h2 className="section-header text-2xl font-bold text-gray-700 mb-6 flex items-center space-x-3 border-l-4 border-blue-700 pl-3 py-1">
      <Icon className="w-6 h-6 text-blue-600" />
      <span>{title}</span>
    </h2>
  );

  // --- Render: Output Modal/Success View ---
  const SubmissionModal = ({ data, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-3xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100 p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-3 text-emerald-600">
          <CheckCircle className="w-8 h-8" />
          <h3 className="text-3xl font-bold">Application Submitted!</h3>
        </div>
        <p className="text-gray-700">The following JSON payload, structured according to your Sequelize model, would be sent to the backend.</p>

        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto border border-gray-200">
          {JSON.stringify(data, null, 2)}
        </pre>

        <div className="flex justify-end pt-4">
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">
            Start New Application
          </button>
        </div>
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-100  sm:p-8 antialiased ">
      {isSubmitted && payload && (
        <SubmissionModal
          data={payload}
          onClose={() => {
            setIsSubmitted(false);
            setFormData(initialFormData);
            setPayload(null);
          }}
        />
      )}

      <div className=" mx-auto">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            <BookOpen className="inline w-8 h-8 mr-2 text-blue-600" />
            Student Admission Application
          </h1>
          <p className="text-gray-500">All fields marked with an asterisk (<span className="text-red-500">*</span>) are required.</p>
        </header>

        <div className="p-8 card shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* 1. Application Details */}
            <div>
              <SectionTitle icon={Calendar} title="Application Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Academic Year" name="academicYear" required
                  placeholder="e.g., 2024-2025" minLength="9" maxLength="9"
                  value={formData.academicYear} onChange={handleChange}
                  error={validationErrors.academicYear}
                />
                <FormInput
                  label="Grade Applied For" name="gradeApplied" required
                  placeholder="Grade 10" minLength="1" maxLength="10"
                  value={formData.gradeApplied} onChange={handleChange}
                  error={validationErrors.gradeApplied}
                />
                <div>
                  <label htmlFor="applicationType" className="block text-sm font-medium text-gray-700">Application Type</label>
                  <select id="applicationType" name="applicationType" className="w-full p-3 border border-gray-300 rounded-lg"
                    value={formData.applicationType} onChange={handleChange}>
                    <option value="new">New Admission</option>
                    <option value="transfer">Transfer</option>
                    <option value="re-admission">Re-Admission</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select id="category" name="category" className="w-full p-3 border border-gray-300 rounded-lg"
                    value={formData.category} onChange={handleChange}>
                    <option value="general">General</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="obc">OBC</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Student Personal Details */}
            <div>
              <SectionTitle icon={Users} title="Student Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name" name="firstName" required
                  minLength="2" maxLength="50"
                  value={formData.firstName} onChange={handleChange}
                  error={validationErrors.firstName}
                />
                <FormInput
                  label="Last Name" name="lastName" required
                  minLength="2" maxLength="50"
                  value={formData.lastName} onChange={handleChange}
                  error={validationErrors.lastName}
                />
                <FormInput
                  label="Date of Birth" name="dateOfBirth" type="date" required
                  max={getMaxDate()}
                  value={formData.dateOfBirth} onChange={handleChange}
                  error={validationErrors.dateOfBirth}
                />
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                  <select id="gender" name="gender" required className="w-full p-3 border border-gray-300 rounded-lg"
                    value={formData.gender} onChange={handleChange}>
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.gender && <p className="text-xs text-red-500 flex items-center mt-1"><AlertTriangle className="w-3 h-3 mr-1" />{validationErrors.gender}</p>}
                </div>
                <FormInput
                  label="Email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  error={validationErrors.email}
                />
                <FormInput
                  label="Phone" name="phone" type="tel"
                  minLength="10" maxLength="15"
                  value={formData.phone} onChange={handleChange}
                  error={validationErrors.phone}
                />
              </div>
            </div>

            {/* 3. Address Details (Nested JSON: address) */}
            <div>
              <SectionTitle icon={Home} title="Current Address" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <FormInput
                    label="Street/Locality" name="street" required parent="address"
                    value={formData.address.street} onChange={handleChange}
                    error={validationErrors.address_street}
                  />
                </div>
                <FormInput
                  label="City" name="city" required parent="address"
                  value={formData.address.city} onChange={handleChange}
                  error={validationErrors.address_city}
                />
                <FormInput
                  label="State" name="state" required parent="address"
                  value={formData.address.state} onChange={handleChange}
                  error={validationErrors.address_state}
                />
                <FormInput
                  label="Pincode" name="pincode" required parent="address"
                  type="text" minLength="6" maxLength="8"
                  value={formData.address.pincode} onChange={handleChange}
                  error={validationErrors.address_pincode}
                />
              </div>
            </div>

            {/* 4. Parent/Guardian Info (Nested JSON: parentInfo) */}
            <div>
              <SectionTitle icon={Users} title="Parent/Guardian Information" />
              <p className="text-sm text-gray-500 mb-4">At least one parent's name is required.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Father's Name" name="fatherName" parent="parentInfo"
                  value={formData.parentInfo.fatherName} onChange={handleChange}
                />
                <FormInput
                  label="Mother's Name" name="motherName" parent="parentInfo"
                  value={formData.parentInfo.motherName} onChange={handleChange}
                />
              </div>
              {validationErrors.parentInfo_required && (
                <p className="text-sm text-red-500 flex items-center mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-4 h-4 mr-2" />{validationErrors.parentInfo_required}
                </p>
              )}
            </div>

            {/* 5. Previous School Details (Nested JSON: previousSchool) */}
            <div>
              <SectionTitle icon={BookOpen} title="Previous School Details (Optional)" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="School Name" name="name" parent="previousSchool"
                  value={formData.previousSchool.name} onChange={handleChange}
                />
                <FormInput
                  label="Last Grade Attended" name="grade" parent="previousSchool"
                  value={formData.previousSchool.grade} onChange={handleChange}
                />
                <FormInput
                  label="Year of Passing" name="year" parent="previousSchool" type="number"
                  min="1950" max={getCurrentYear()}
                  value={formData.previousSchool.year} onChange={handleChange}
                />
              </div>
            </div>

            {/* 6. Remarks */}
            <div>
              <SectionTitle icon={Clock} title="Additional Remarks (Optional)" />
              <FormInput
                label="Please include any additional information relevant to the application (Max 1000 characters)"
                name="remarks" type="textarea"
                maxLength="1000" rows="3"
                value={formData.remarks} onChange={handleChange}
                error={validationErrors.remarks}
              />
            </div>

            {/* Submission Button */}
            <div className="pt-6">
              <button type="submit" className="w-full py-4 bg-blue-700 text-white font-bold text-xl rounded-xl hover:bg-blue-800 transition transform hover:scale-[1.005] shadow-lg flex items-center justify-center space-x-3">
                <Mail className="w-6 h-6" />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
