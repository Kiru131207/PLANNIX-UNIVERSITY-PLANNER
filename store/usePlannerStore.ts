import { useState, useEffect } from 'react';
import { Subject, Assignment, ScheduleItem, Settings } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'uniflow_subjects_v2',
  ASSIGNMENTS: 'uniflow_assignments_v2',
  SCHEDULE: 'uniflow_schedule_v2',
  SETTINGS: 'uniflow_settings_v2',
};

export const usePlannerStore = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ notificationsEnabled: false, themeMode: 'dark' });
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
        const storedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
        const storedSchedule = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
        const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

        if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
        if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
        if (storedSchedule) setSchedule(JSON.parse(storedSchedule));
        if (storedSettings) setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error("Failed to load data from storage", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Persistence Effects
  useEffect(() => { if (!loading) localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects)); }, [subjects, loading]);
  useEffect(() => { if (!loading) localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments)); }, [assignments, loading]);
  useEffect(() => { if (!loading) localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule)); }, [schedule, loading]);
  useEffect(() => { if (!loading) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings, loading]);

  // Subject Actions
  const addSubject = (subject: Omit<Subject, 'id' | 'classesConducted' | 'classesAttended'>) => {
    const newSubject: Subject = {
      ...subject,
      id: crypto.randomUUID(),
      classesConducted: 0,
      classesAttended: 0,
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setAssignments(prev => prev.filter(a => a.subjectId !== id));
    setSchedule(prev => prev.filter(s => s.subjectId !== id));
  };

  const updateAttendance = (id: string, type: 'conducted' | 'attended', increment: boolean) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== id) return s;
      
      let newConducted = s.classesConducted;
      let newAttended = s.classesAttended;

      if (type === 'conducted') {
        newConducted = increment ? s.classesConducted + 1 : Math.max(0, s.classesConducted - 1);
        if (newConducted < newAttended) newAttended = newConducted;
      } else {
        newAttended = increment ? s.classesAttended + 1 : Math.max(0, s.classesAttended - 1);
        if (newAttended > newConducted) newConducted = newAttended;
      }

      return { ...s, classesConducted: newConducted, classesAttended: newAttended };
    }));
  };

  // Assignment Actions
  const addAssignment = (assignment: Omit<Assignment, 'id' | 'isCompleted'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
      isCompleted: false,
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const toggleAssignment = (id: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, isCompleted: !a.isCompleted } : a
    ));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // Schedule Actions
  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    setSchedule(prev => [...prev, newItem]);
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  // Settings Actions
  const toggleNotifications = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, notificationsEnabled: enabled }));
  };

  return {
    subjects,
    assignments,
    schedule,
    settings,
    loading,
    addSubject,
    deleteSubject,
    updateAttendance,
    addAssignment,
    toggleAssignment,
    deleteAssignment,
    addScheduleItem,
    deleteScheduleItem,
    toggleNotifications
  };
};