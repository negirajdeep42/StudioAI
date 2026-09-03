'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { Subject } from '@/types';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  BookOpen, 
  ChevronRight, 
  X, 
  Check, 
} from 'lucide-react';

export default function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Low' | 'Medium' | 'High'>('All'); // by progress thresholds

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form Field States
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formColor, setFormColor] = useState('#8b5cf6'); // default purple
  const [formProgress, setFormProgress] = useState(0);

  const colors = [
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#06b6d4', label: 'Cyan' }
  ];

  // Filters & Search
  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMode === 'All') return matchesSearch;
    if (filterMode === 'Low') return matchesSearch && sub.progress < 50;
    if (filterMode === 'Medium') return matchesSearch && sub.progress >= 50 && sub.progress < 80;
    if (filterMode === 'High') return matchesSearch && sub.progress >= 80;
    return matchesSearch;
  });

  const openAddModal = () => {
    setEditingSubject(null);
    setFormName('');
    setFormCode('');
    setFormColor('#8b5cf6');
    setFormProgress(0);
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject, e: React.MouseEvent) => {
    e.preventDefault(); // stop linking to details page
    setEditingSubject(sub);
    setFormName(sub.name);
    setFormCode(sub.code);
    setFormColor(sub.color);
    setFormProgress(sub.progress);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // stop navigation
    if (confirm('Are you sure you want to delete this subject? All generated notes and plans for this subject will be removed.')) {
      deleteSubject(id);
    }
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: formName,
        code: formCode,
        color: formColor,
        progress: formProgress
      });
    } else {
      addSubject({
        name: formName,
        code: formCode,
        color: formColor,
        notesCount: 0,
        quizzesCount: 0,
        flashcardsCount: 0,
        lastStudied: 'Just added',
        topics: []
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">My Subjects</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage and track your active academic curriculum</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-gradient text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Subject
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-card p-4 border border-gray-150 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by subject name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-xs transition-all focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto shrink-0 pb-1 md:pb-0">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1.5">Progress:</span>
          {([
            { id: 'All', label: 'All Courses' },
            { id: 'Low', label: '< 50%' },
            { id: 'Medium', label: '50% - 80%' },
            { id: 'High', label: '≥ 80%' }
          ] as const).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterMode(opt.id)}
              className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                filterMode === opt.id 
                  ? 'border-brand-purple bg-purple-50 dark:bg-purple-500/10 text-brand-purple' 
                  : 'border-gray-200 dark:border-border bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-600 dark:text-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <Link 
              key={sub.id} 
              href={`/subjects/${sub.id}`}
              className="bg-white dark:bg-card border border-gray-150 hover:border-purple-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 block relative overflow-hidden group"
            >
              {/* Top Accent marker bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5" 
                style={{ backgroundColor: sub.color }}
              />

              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{sub.code}</span>
                    <h3 className="font-extrabold text-base text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-brand-purple transition-colors mt-0.5">{sub.name}</h3>
                  </div>
                  {/* Action buttons overlaying link */}
                  <div className="flex items-center gap-1 shrink-0 z-10">
                    <button
                      onClick={(e) => openEditModal(sub, e)}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-brand-purple hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit subject"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSubject(sub.id, e)}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                    <span>Course Progress</span>
                    <span>{sub.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#232235] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-gradient h-full rounded-full transition-all"
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats and Study Hook */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                  <div className="flex gap-3">
                    <span>{sub.notesCount} Notes</span>
                    <span>{sub.quizzesCount} Quizzes</span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500 font-medium">Last studied: {sub.lastStudied}</span>
                </div>

                <div className="flex items-center justify-center bg-purple-50 dark:bg-purple-500/10 group-hover:bg-brand-gradient text-brand-purple group-hover:text-white py-2.5 rounded-2xl text-xs font-bold transition-all gap-1 shadow-sm">
                  Continue Learning
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-card border border-gray-150 rounded-3xl p-12 text-center shadow-sm space-y-4">
          <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-full text-brand-purple inline-block">
            <BookOpen className="h-8 w-8 animate-bounce" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-extrabold text-gray-900 dark:text-gray-50 text-base">No Subjects Found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              We couldn&apos;t find any subjects matching your filters. Add a new subject or update your query.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-brand-gradient text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Add A Subject Now
          </button>
        </div>
      )}

      {/* Add / Edit Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur clickoff */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
          />

          <div className="relative bg-white dark:bg-card border border-gray-100 dark:border-border rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#232235] rounded-lg cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-50 mb-2">
              {editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-semibold">
              Fill in course details below to build your study track.
            </p>

            <form onSubmit={handleSaveSubject} className="space-y-4.5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Subject Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Distributed Computing"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-sm focus:border-brand-purple"
                />
              </div>

              {/* Code */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Course Code</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="e.g. CS-402"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-muted border border-gray-250 rounded-xl text-sm focus:border-brand-purple"
                />
              </div>

              {/* Progress Slider (Only if editing) */}
              {editingSubject && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <span>Course Progress</span>
                    <span className="text-brand-purple text-sm font-bold">{formProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formProgress}
                    onChange={(e) => setFormProgress(parseInt(e.target.value))}
                    className="w-full accent-brand-purple h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {/* Color Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Accent Color</label>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormColor(c.value)}
                      className={`w-7 h-7 rounded-full shrink-0 border cursor-pointer flex items-center justify-center transition-transform hover:scale-110 ${
                        formColor === c.value ? 'ring-2 ring-brand-purple ring-offset-2 scale-105' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    >
                      {formColor === c.value && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-border text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Save Subject
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
