export interface User {
  uid: string;
  email: string;
  role: 'EB' | 'EC' | 'Core' | 'Member';
  name: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Workshop' | 'Hackathon' | 'Meet' | 'Event';
  createdBy: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  eventId: string;
  domain: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Upcoming' | 'Today' | 'Completed';
  assignedTo?: string;
  dueDate: Date;
  createdBy: string;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comments: string;
  createdAt: Date;
}

export interface Attendance {
  id: string;
  eventId: string;
  userId: string;
  status: 'Present' | 'Absent';
  markedBy: string;
  markedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  department: 'Tech' | 'Marketing' | 'Content' | 'Media';
  createdBy: string;
  createdAt: Date;
}

export interface AcademicMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'PYQ' | 'Solution' | 'Material';
  subject?: string;
  semester?: string;
  year?: string;
  createdBy: string;
  createdAt: Date;
}