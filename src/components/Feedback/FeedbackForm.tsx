import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../types';

const FeedbackForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedEventId || rating === 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        eventId: selectedEventId,
        userId: currentUser.uid,
        rating,
        comments,
        createdAt: new Date()
      });

      setSuccess(true);
      setSelectedEventId('');
      setRating(0);
      setComments('');

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 
                      rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6 
                      hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 
                      transition-all duration-300 group">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Event Feedback</h1>

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 
                          text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
            Thank you for your feedback! It has been submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 dark:text-gray-200 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose an event to review</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} - {event.date.toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  } hover:text-yellow-400`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {rating === 0 ? 'Click to rate' : `${rating} star${rating !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 dark:text-gray-200 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your thoughts about the event..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0 || !selectedEventId}
            className="w-full flex items-center justify-center space-x-2 
                       bg-blue-600 text-white py-3 px-4 rounded-lg 
                       hover:bg-blue-700 transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
            <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
