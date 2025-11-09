import React, { useState, useRef } from 'react';
import { User as UserIcon, Mail, Shield, Calendar, Camera, Save, X, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, uploadProfilePhoto } from '../../lib/supabase';

const ProfileSection: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let photoUrl = currentUser.photoUrl;

      if (photoFile) {
        const uploadedUrl = await uploadProfilePhoto(currentUser.uid, photoFile);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload photo');
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: name.trim(),
          photo_url: photoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.uid);

      if (error) throw error;

      await updateUserProfile({ name: name.trim(), photoUrl });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);

      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(currentUser.name);
    setPhotoFile(null);
    setPhotoPreview(null);
    setMessage(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'EB': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'EC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Core': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Member': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const displayPhoto = photoPreview || currentUser.photoUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-6">
        <UserIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900">My Profile</h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900
                      rounded-xl shadow-lg border border-gray-700 dark:border-gray-700 p-6 sm:p-8">

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500 shadow-xl">
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700
                           text-white rounded-full shadow-lg transition-colors group-hover:scale-110
                           transform duration-200"
                title="Change photo"
              >
                <Camera className="h-5 w-5" />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          {photoFile && (
            <p className="text-sm text-gray-400 dark:text-gray-400 mt-2">
              New photo selected: {photoFile.name}
            </p>
          )}
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
              <UserIcon className="h-4 w-4" />
              <span>Name</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 dark:bg-gray-700 border border-gray-600 dark:border-gray-600
                           rounded-lg text-white dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-700/50 dark:bg-gray-700/50 rounded-lg text-white dark:text-white">
                {currentUser.name}
              </div>
            )}
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </label>
            <div className="px-4 py-3 bg-gray-700/30 dark:bg-gray-700/30 rounded-lg text-gray-400 dark:text-gray-400 border border-gray-600 dark:border-gray-600">
              {currentUser.email}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Email cannot be changed (used for tracking)
            </p>
          </div>

          {/* Role Field (Read-only) */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
              <Shield className="h-4 w-4" />
              <span>Role</span>
            </label>
            <div className="inline-flex">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getRoleColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Member Since</span>
            </label>
            <div className="px-4 py-3 bg-gray-700/30 dark:bg-gray-700/30 rounded-lg text-gray-400 dark:text-gray-400 border border-gray-600 dark:border-gray-600">
              {currentUser.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3
                           border border-gray-600 dark:border-gray-600 text-gray-300 dark:text-gray-300
                           rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3
                           bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3
                         bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Info Notice */}
        <div className="mt-6 p-4 bg-blue-900/20 dark:bg-blue-900/20 border border-blue-700 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300 dark:text-blue-300">
            <strong>Note:</strong> Your email is used to track your tasks and attendance.
            Changing your name will update it everywhere while maintaining your progress history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
