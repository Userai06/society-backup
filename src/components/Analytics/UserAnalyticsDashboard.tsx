import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  CheckSquare,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Calendar,
  Award,
  Activity
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Task, Feedback, Attendance } from '../../types';
import CircularProgress from './CircularProgress';
import StatCard from './StatCard';

interface UserAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalAttendance: number;
  attendedEvents: number;
  totalFeedbacks: number;
  taskCompletionRate: number;
  attendanceRate: number;
}

const UserAnalyticsDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalAttendance: 0,
    attendedEvents: 0,
    totalFeedbacks: 0,
    taskCompletionRate: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserAnalytics();
    }
  }, [currentUser]);

  const fetchUserAnalytics = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', currentUser.name)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks: Task[] = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
        createdAt: doc.data().createdAt.toDate()
      }));

      const completedTasks = tasks.filter(task => task.status === 'Completed').length;
      const pendingTasks = tasks.filter(task => task.status !== 'Completed').length;
      const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('userId', '==', currentUser.uid)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      const attendanceRecords: Attendance[] = attendanceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        markedAt: doc.data().markedAt.toDate()
      }));

      const attendedEvents = attendanceRecords.filter(record => record.status === 'Present').length;
      const totalAttendance = attendanceRecords.length;
      const attendanceRate = totalAttendance > 0 ? (attendedEvents / totalAttendance) * 100 : 0;

      const feedbackQuery = query(
        collection(db, 'feedback'),
        where('userId', '==', currentUser.uid)
      );
      const feedbackSnapshot = await getDocs(feedbackQuery);
      const totalFeedbacks = feedbackSnapshot.size;

      setAnalytics({
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        totalAttendance,
        attendedEvents,
        totalFeedbacks,
        taskCompletionRate,
        attendanceRate
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
    }
    setLoading(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'EB': return 'bg-purple-600';
      case 'EC': return 'bg-blue-600';
      case 'Core': return 'bg-green-600';
      case 'Member': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading your analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-white dark:text-white">My Analytics Dashboard</h1>
        </div>
        <p className="text-gray-400 dark:text-gray-400">Track your progress and performance</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900
                      rounded-xl shadow-lg border border-gray-700 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white dark:text-white mb-2">{currentUser?.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getRoleColor(currentUser?.role || 'Member')}`}>
                {currentUser?.role}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                {currentUser?.email}
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Member since {currentUser?.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          icon={CheckSquare}
          color="bg-blue-600"
          subtitle={`${analytics.pendingTasks} pending`}
        />
        <StatCard
          title="Completed Tasks"
          value={analytics.completedTasks}
          icon={Award}
          color="bg-green-600"
          subtitle={`${analytics.totalTasks - analytics.completedTasks} remaining`}
        />
        <StatCard
          title="Events Attended"
          value={`${analytics.attendedEvents}/${analytics.totalAttendance}`}
          icon={UserCheck}
          color="bg-purple-600"
          subtitle={analytics.totalAttendance > 0 ? `${Math.round(analytics.attendanceRate)}% attendance` : 'No events yet'}
        />
        <StatCard
          title="Feedback Given"
          value={analytics.totalFeedbacks}
          icon={MessageSquare}
          color="bg-orange-600"
          subtitle="Total submissions"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900
                        rounded-xl shadow-lg border border-gray-700 dark:border-gray-700 p-6
                        hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500
                        transition-all duration-300">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white dark:text-white">Task Completion Rate</h3>
          </div>
          <div className="flex items-center justify-center">
            <CircularProgress
              percentage={analytics.taskCompletionRate}
              size={150}
              strokeWidth={10}
              color="#3b82f6"
              backgroundColor="#1f2937"
            />
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {analytics.completedTasks} completed out of {analytics.totalTasks} total tasks
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900
                        rounded-xl shadow-lg border border-gray-700 dark:border-gray-700 p-6
                        hover:shadow-xl hover:border-purple-500 dark:hover:border-purple-500
                        transition-all duration-300">
          <div className="flex items-center space-x-2 mb-6">
            <UserCheck className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-white dark:text-white">Attendance Rate</h3>
          </div>
          <div className="flex items-center justify-center">
            <CircularProgress
              percentage={analytics.attendanceRate}
              size={150}
              strokeWidth={10}
              color="#a855f7"
              backgroundColor="#1f2937"
            />
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {analytics.attendedEvents} attended out of {analytics.totalAttendance} total events
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900
                      rounded-xl shadow-lg border border-gray-700 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white dark:text-white mb-4">Performance Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <span className="text-gray-300">Task Performance</span>
            <span className={`font-semibold ${analytics.taskCompletionRate >= 75 ? 'text-green-400' : analytics.taskCompletionRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {analytics.taskCompletionRate >= 75 ? 'Excellent' : analytics.taskCompletionRate >= 50 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <span className="text-gray-300">Attendance Performance</span>
            <span className={`font-semibold ${analytics.attendanceRate >= 80 ? 'text-green-400' : analytics.attendanceRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {analytics.attendanceRate >= 80 ? 'Excellent' : analytics.attendanceRate >= 60 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <span className="text-gray-300">Feedback Contributions</span>
            <span className={`font-semibold ${analytics.totalFeedbacks >= 5 ? 'text-green-400' : analytics.totalFeedbacks >= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
              {analytics.totalFeedbacks >= 5 ? 'Active' : analytics.totalFeedbacks >= 3 ? 'Moderate' : 'Low'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsDashboard;
