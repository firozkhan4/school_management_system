import React, { useState, useEffect } from 'react';
import {
  Users, UserSquare, CheckCircle, Clock, Save,
  BookOpen, Trello, X, Plus, Edit, Trash2, Zap, X as XIcon
} from 'lucide-react';

import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass
} from "../api/auth/class.js";

import { useAppContext } from '../context/AppContext.jsx'

// ----------------------------------------------------------------------
// Reusable Modal Component
// ----------------------------------------------------------------------
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-blue-50">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
const ClassAndSection = () => {
  const [classes, setClasses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [editClassName, setEditClassName] = useState("");
  const [newSectionName, setNewSectionName] = useState("");

  const [newClassName, setNewClassName] = useState("");
  const [newClassCode, setNewClassCode] = useState("");
  const [newGradeLevel, setNewGradeLevel] = useState("");
  const [newCapacity, setNewCapacity] = useState(0);
  const [newStartDate, setNewStartDate] = useState("");

  const [loadingData, setLoadingData] = useState(true);

  const { setMessage, setLoading } = useAppContext()

  // ----------------------------
  // Load Classes from Backend
  // ----------------------------
  const loadClasses = async () => {
    setLoadingData(true);
    const data = await getAllClasses();
    setClasses(data);
    setLoadingData(false);
  };

  useEffect(() => { loadClasses() }, []);

  // ----------------------------
  // Add Class
  // ----------------------------
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    setLoadingData(true);

    const payload = {
      className: newClassName,
      classCode: newClassCode,
      gradeLevel: newGradeLevel,
      capacity: Number(newCapacity),
      startDate: newStartDate,
      sections: [],
      schoolId: "00434fa5-a549-4d10-9838-4507e0fa655b"
    };

    const result = await createClass(payload);
    setMessage(`Class "${newClassName}" created`);
    setNewClassName("");
    loadClasses();
    setLoadingData(false);
  };

  // ----------------------------
  // Delete Class
  // ----------------------------
  const handleDeleteClass = async (id, name) => {
    if (!window.confirm(`Delete class ${name}?`)) return;

    setLoading(true);
    await deleteClass(id);
    setMessage(`Class "${name}" deleted`);
    loadClasses();
    setLoading(false);
  };

  // ----------------------------
  // Update Class + Sections
  // ----------------------------
  const handleSaveClass = async (e) => {
    e.preventDefault();

    setLoading(true);

    await updateClass(currentClass.id, {
      className: editClassName.trim(),
      sections: currentClass.sections
    });

    setMessage("Class updated successfully");
    closeModal();
    loadClasses();
    setLoading(false);
    setEditClassName('');
    setNewSectionName('')
  };

  // ----------------------------
  // Add Section
  // ----------------------------
  const handleAddSection = (e) => {
    e.preventDefault();

    const sec = newSectionName.trim().toUpperCase();
    if (!sec) return;

    if (currentClass.sections.includes(sec)) {
      alert("Section already exists");
      return;
    }

    setCurrentClass({
      ...currentClass,
      sections: [...currentClass.sections, sec]
    });

    setNewSectionName("");
  };

  // ----------------------------
  // Remove Section
  // ----------------------------
  const handleRemoveSection = (section) => {
    setCurrentClass({
      ...currentClass,
      sections: currentClass.sections.filter(s => s !== section)
    });
  };

  // ----------------------------
  // Modal Controls
  // ----------------------------
  const openModal = (c) => {
    setCurrentClass(c);
    setEditClassName(c.className);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentClass(null);
    setIsModalOpen(false);
  };

  // ----------------------------
  // Modal Content
  // ----------------------------
  const modalContent = currentClass && (
    <form onSubmit={handleSaveClass} className="space-y-6">

      {/* Class Name */}
      <div>
        <label className="font-semibold">Class Name</label>
        <input
          value={editClassName}
          onChange={(e) => setEditClassName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Sections */}
      <div>
        <label className="font-semibold">Sections</label>

        <div className="flex flex-wrap gap-2 border p-3 rounded bg-gray-50">
          {currentClass.sections.map(sec => (
            <span key={sec} className="bg-purple-200 px-3 py-1 rounded-full flex items-center">
              {sec}
              <button
                type="button"
                onClick={() => handleRemoveSection(sec)}
                className="ml-2 text-red-600"
              >
                <XIcon size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Add Section */}
        <div className="flex gap-2 mt-3">
          <input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Add section (A)"
            className="flex-grow border p-2 rounded"
          />
          <button className="bg-green-500 text-white px-4 rounded">
            Add
          </button>
        </div>
      </div>

      {/* Save */}
      <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">
        Save Changes
      </button>
    </form>
  );

  // ----------------------------
  // MAIN UI
  // ----------------------------
  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold flex items-center">
        <BookOpen size={28} className="mr-3 text-purple-600" />
        Class & Section Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Add Class */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">Add New Class</h2>

          <form onSubmit={handleAddClass} className="space-y-4 mt-4">

            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Class Name"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              value={newClassCode}
              onChange={(e) => setNewClassCode(e.target.value)}
              placeholder="Class Code"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              value={newGradeLevel}
              onChange={(e) => setNewGradeLevel(e.target.value)}
              placeholder="Grade Level"
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              min='0'
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              placeholder="Capacity"
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
              placeholder="Start Date"
              className="w-full border p-2 rounded"
            />

            <button className="w-full bg-purple-600 text-white py-2 rounded">
              Create Class
            </button>
          </form>
        </div>

        {/* Class List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold">All Classes</h2>

          {loadingData ? (
            <p>Loading…</p>
          ) : (
            <div className="space-y-3">
              {classes.map(c => (
                <div key={c.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{c.className}</div>
                    <div className="text-sm text-gray-600">
                      Sections: {c.sections?.join(", ") || "None"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="text-blue-600"
                      onClick={() => openModal(c)}
                    >
                      <Edit />
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDeleteClass(c.id, c.className)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Class">
        {modalContent}
      </Modal>

    </div>
  );
};

export default ClassAndSection;
