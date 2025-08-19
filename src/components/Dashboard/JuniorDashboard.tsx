import React, { useState, useEffect } from 'react';
import { Megaphone, Github, Linkedin, Twitter, Instagram, Users } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Event, Announcement } from '../../types';
import AnnouncementCard from './AnnouncementCard';
import EventCard from './EventCard';
import ResourcesSection from './ResourcesSection';
import happyPic from '../../assets/happy.jpg';
import yuvrajPic from '../../assets/yuvraj.jpg';
import abhishekPic from '../../assets/abhishek.jpg';
import pulkitPic from '../../assets/pulkit.jpg';

const JuniorDashboard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const teamMembers = [
    {
      name: 'Happy Singh Rajpurohit',
      role: 'Frontend + Design + Backend',
      image: happyPic,
      social: {
        github: 'https://github.com/Happy-Singh-Rajpurohit',
        linkedin: 'https://www.linkedin.com/in/happy-singh-rajpurohit/',
        instagram: 'https://www.instagram.com/HappyRajpurohit10/'
      }
    },
    {
      name: 'Pulkit Sareen',
      role: 'Frontend + Design + Task Section',
      image: pulkitPic,
      social: {
        github: 'https://github.com/Pulkit-Sareen',
        linkedin: 'https://in.linkedin.com/in/pulkit-sareen-96350b25b',
        instagram: 'https://www.instagram.com/pulkit.sareen.31/'
      }
    },
    {
      name: 'Yuvraj Jasuja',
      role: 'Resource Section',
      image: yuvrajPic,
      social: {
        github: 'https://github.com/YuvrajJasuja',
        linkedin: 'https://www.linkedin.com/in/yuvraj-jasuja-0b2b04318/',
        instagram: 'https://www.instagram.com/yuvrajjasuja/'
      }
    },
    {
      name: 'Abhishek Chopra',
      role: 'Design + Ideation',
      image: abhishekPic,
      social: {
        linkedin: 'http://www.linkedin.com/in/abhishek-chopra-b58144322',
        github: 'https://github.com/Abhishek240514',
        instagram: 'https://www.instagram.com/abhishek___chopra18/'
      }
    }
  ];

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const announcementList: Announcement[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      }));
      // Sort by priority after fetching to avoid composite index requirement
      const sortedAnnouncements = announcementList.sort((a, b) => {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        return bPriority - aPriority;
      });
      setAnnouncements(sortedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const eventList: Event[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate()
      }));
      setEvents(eventList);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Announcements Section */}
        <section className="mb-12 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6 px-2 sm:px-0">
            <Megaphone className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white text-gray-900">Latest Announcements</h2>
          </div>
          
          <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-xl p-4 sm:p-6 shadow-2xl border border-gray-700 dark:border-gray-700 border-gray-200 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white dark:text-white text-gray-900">Recent Updates</h3>
              <span className="text-sm text-gray-400 dark:text-gray-400 text-gray-600">{announcements.length} announcements</span>
            </div>
            
            {announcements.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-gray-400 dark:text-gray-400 text-gray-600">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No announcements yet.</p>
              </div>
            ) : (
              <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 dark:scrollbar-thumb-gray-600 scrollbar-thumb-gray-400 scrollbar-track-gray-800 dark:scrollbar-track-gray-800 scrollbar-track-gray-100 pr-2">
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="transform transition-all duration-200">
                      <AnnouncementCard 
                        announcement={announcement} 
                        canEdit={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Resources Section */}
        <div className="animate-fade-in-up animation-delay-200">
          <ResourcesSection />
        </div>

        {/* Built By Section */}
        <section className="mb-12 animate-fade-in-up animation-delay-400">
          <div className="text-center mb-8 sm:mb-12 px-2 sm:px-0">
            <h2 className="text-2xl sm:text-4xl font-bold text-white dark:text-white text-gray-900 mb-4">Built By Our Amazing Team</h2>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm sm:text-lg">Meet the talented individuals who made this project possible</p>
          </div>
          <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto px-2 sm:px-0">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="group relative bg-gray-800 dark:bg-gray-800 bg-white rounded-2xl p-4 sm:p-6 hover:bg-gray-750 dark:hover:bg-gray-750 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent dark:border-transparent border-gray-200 hover:border-blue-300 dark:hover:border-blue-500"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0 mb-4">
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-blue-500 group-hover:ring-purple-500 transition-all duration-300"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-white dark:text-white text-gray-900 group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm sm:text-base">{member.role}</p>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-start space-x-3">
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 hover:bg-gray-300 transition-colors group-hover:scale-110 transform"
                    >
                      <Github className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-lg hover:bg-blue-600 transition-colors group-hover:scale-110 transform"
                    >
                      <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white" />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-lg hover:bg-pink-600 transition-colors group-hover:scale-110 transform"
                    >
                      <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 dark:text-gray-300 text-gray-600 hover:text-white" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events Section */}
        {/* Task Management Section */}
        <section className="mb-12 animate-fade-in-up animation-delay-600">
          <div className="text-center mb-6 sm:mb-8 px-2 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white text-gray-900 mb-4">Task Management</h2>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600">View assigned tasks and progress</p>
          </div>
          <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-xl p-4 sm:p-6 mx-2 sm:mx-0 border border-transparent dark:border-transparent border-gray-200 transition-colors duration-300">
            <div className="text-center">
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-4">Check your assigned tasks and deadlines</p>
              <a
                href="/tasks"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                View Tasks
              </a>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="mb-12 animate-fade-in-up animation-delay-800">
          <div className="text-center mb-6 sm:mb-8 px-2 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white text-gray-900 mb-4">Event Feedback</h2>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600">Share your experience and suggestions</p>
          </div>
          <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-xl p-4 sm:p-6 mx-2 sm:mx-0 border border-transparent dark:border-transparent border-gray-200 transition-colors duration-300">
            <div className="text-center">
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-4">Help us improve by providing feedback on events</p>
              <a
                href="/feedback"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Give Feedback
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-800 bg-white rounded-xl p-4 sm:p-8 mt-12 mx-2 sm:mx-0 border border-transparent dark:border-transparent border-gray-200 transition-colors duration-300 animate-fade-in-up animation-delay-1000">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <Users className="h-8 w-8 text-blue-500" />
              <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-white text-gray-900">Society Sphere</h3>
            </div>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Empowering student societies with modern organization tools</p>
            <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-full hover:bg-gray-600 dark:hover:bg-gray-600 hover:bg-gray-300 transition-colors"
              >
                <Github className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-white text-gray-600" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-white text-gray-600" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-full hover:bg-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-white text-gray-600" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-full hover:bg-pink-600 transition-colors"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-white text-gray-600" />
              </a>
            </div>
            <div className="border-t border-gray-700 dark:border-gray-700 border-gray-200 pt-4">
              <p className="text-gray-500 dark:text-gray-500 text-gray-400 text-xs sm:text-sm">
                © 2025 Society Organiser. All rights reserved. Built with ❤️ by Happy | Pulkit | Yuvraj | Abhishek.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default JuniorDashboard;