import React from 'react';
import { Calendar, User, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  canEdit?: boolean;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcementId: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  canEdit,
  onEdit,
  onDelete,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
            {announcement.title}
          </h3>
        </div>
        <div className="flex items-center space-x-2 ml-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
              announcement.priority
            )} whitespace-nowrap`}
          >
            {announcement.priority}
          </span>
          {canEdit && (
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit?.(announcement)}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all duration-200"
                title="Edit announcement"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete?.(announcement.id)}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
                title="Delete announcement"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Description */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Description
          </h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            {announcement.content}
          </p>
        </div>

        {/* NEW LINE: Event Date, Time & Venue entered by user */}
        {(announcement.eventDate || announcement.eventTime || announcement.venue) && (
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 space-x-2">
            {announcement.eventDate && (
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span>{announcement.eventDate}</span>
              </span>
            )}
            {announcement.eventTime && (
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span>{announcement.eventTime}</span>
              </span>
            )}
            {announcement.venue && (
              <span className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span>{announcement.venue}</span>
              </span>
            )}
          </div>
        )}

        {/* Footer with Posted By & Created Date (kept same as before) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Posted by
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {announcement.createdBy}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Created At
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {announcement.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
