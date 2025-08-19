import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  canEdit?: boolean;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcementId: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, canEdit, onEdit, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg border border-gray-600 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-100 dark:text-gray-200 mb-2 leading-tight">
            {announcement.title}
          </h3>
        </div>
        <div className="flex items-center space-x-2 ml-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)} whitespace-nowrap`}>
            {announcement.priority}
          </span>
          {canEdit && (
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit?.(announcement)}
                className="p-1.5 text-gray-400 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-900/20 dark:hover:bg-blue-800/20 rounded-md"
                title="Edit announcement"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete?.(announcement.id)}
                className="p-1.5 text-gray-400 dark:text-gray-300 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-900/20 dark:hover:bg-red-800/20 rounded-md"
                title="Delete announcement"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Details
          </h4>
          <div className="text-gray-300 dark:text-gray-400 text-sm sm:text-base leading-relaxed space-y-2">
            <p><span className="font-medium">Title:</span> {announcement.title}</p>
            <p><span className="font-medium">Description:</span> {announcement.content}</p>
            <p>
              <span className="font-medium">Date:</span> {announcement.createdAt.toLocaleDateString()}
              <span className="ml-6 font-medium">Venue:</span> {announcement.venue || 'Not specified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;