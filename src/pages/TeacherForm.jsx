import React, { useState, useEffect } from 'react';
import {
  Save, X, Plus, Trash2, User, Mail, BookOpen, GraduationCap,
  Calendar, DollarSign, Award, Phone, MapPin, Users
} from 'lucide-react';

const TeacherForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',

    // Professional Information
    schoolId: '00434fa5-a549-4d10-9838-4507e0fa655b',
    department: '',
    subjectSpecialization: '',
    qualification: '',
    yearsOfExperience: '',
    hireDate: '',
    salary: '',

    // Class Teacher Info
    isClassTeacher: false,
    classTeacherOfGrade: '',

    // Additional Info
    bio: '',

    // Awards & Certifications
    awardsAndCertifications: [],

    // Emergency Contact
    emergencyContact: {
      name: '',
      relation: '',
      phone: '',
      address: ''
    }
  });

  const [currentAward, setCurrentAward] = useState({ title: '', year: '' });
  const [errors, setErrors] = useState({});

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          department: '',
          subjectSpecialization: '',
          qualification: '',
          schoolId: '00434fa5-a549-4d10-9838-4507e0fa655b',
          yearsOfExperience: '',
          hireDate: '',
          salary: '',
          isClassTeacher: false,
          classTeacherOfGrade: '',
          bio: '',
          awardsAndCertifications: [],
          emergencyContact: {
            name: '',
            relation: '',
            phone: '',
            address: ''
          }
        });
      }
      setErrors({});
      setCurrentAward({ title: '', year: '' });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddAward = () => {
    if (currentAward.title && currentAward.year) {
      setFormData(prev => ({
        ...prev,
        awardsAndCertifications: [...prev.awardsAndCertifications, { ...currentAward }]
      }));
      setCurrentAward({ title: '', year: '' });
    }
  };

  const handleRemoveAward = (index) => {
    setFormData(prev => ({
      ...prev,
      awardsAndCertifications: prev.awardsAndCertifications.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.subjectSpecialization) newErrors.subjectSpecialization = 'Subject specialization is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';

    // Emergency contact validation
    if (!formData.emergencyContact.name) newErrors['emergencyContact.name'] = 'Emergency contact name is required';
    if (!formData.emergencyContact.relation) newErrors['emergencyContact.relation'] = 'Relation is required';
    if (!formData.emergencyContact.phone) newErrors['emergencyContact.phone'] = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  const departments = ['Science', 'Mathematics', 'English', 'Social Studies', 'Arts', 'Physical Education', 'Computer Science', 'Languages'];
  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English Literature', 'History', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education'];
  const gradeLevels = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="teacher@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Specialization *
                </label>
                <select
                  name="subjectSpecialization"
                  value={formData.subjectSpecialization}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.subjectSpecialization ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subjectSpecialization && (
                  <p className="text-red-500 text-sm mt-1">{errors.subjectSpecialization}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.qualification ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., M.Sc. Physics, B.Ed"
                />
                {errors.qualification && (
                  <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., 5"
                  min="0"
                  max="50"
                />
                {errors.yearsOfExperience && (
                  <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.hireDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                </div>
                {errors.hireDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.salary ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                )}
              </div>
            </div>
          </section>

          {/* Class Teacher Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Class Teacher Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isClassTeacher"
                  name="isClassTeacher"
                  checked={formData.isClassTeacher}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isClassTeacher" className="ml-2 text-sm font-medium text-gray-700">
                  This teacher is a class teacher
                </label>
              </div>

              {formData.isClassTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class/Grade Assigned
                  </label>
                  <select
                    name="classTeacherOfGrade"
                    value={formData.classTeacherOfGrade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Grade/Class</option>
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* Bio */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bio</h3>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about the teacher's background, teaching philosophy, etc."
            />
          </section>

          {/* Awards & Certifications */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Awards & Certifications
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={currentAward.title}
                  onChange={(e) => setCurrentAward(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Award or certification title"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={currentAward.year}
                    onChange={(e) => setCurrentAward(prev => ({ ...prev, year: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Year"
                    min="1900"
                    max="2099"
                  />
                  <button
                    type="button"
                    onClick={handleAddAward}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </button>
                </div>
              </div>

              {/* Awards List */}
              {formData.awardsAndCertifications.length > 0 && (
                <div className="space-y-2">
                  {formData.awardsAndCertifications.map((award, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <div>
                        <span className="font-medium">{award.title}</span>
                        <span className="text-gray-500 ml-2">({award.year})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAward(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors['emergencyContact.name'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Full name"
                />
                {errors['emergencyContact.name'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.name']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relation *
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact.relation}
                  onChange={(e) => handleNestedChange('emergencyContact', 'relation', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors['emergencyContact.relation'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., Father, Mother, Spouse"
                />
                {errors['emergencyContact.relation'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.relation']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors['emergencyContact.phone'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="+91-9876543210"
                  />
                </div>
                {errors['emergencyContact.phone'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['emergencyContact.phone']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    value={formData.emergencyContact.address}
                    onChange={(e) => handleNestedChange('emergencyContact', 'address', e.target.value)}
                    rows="2"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
