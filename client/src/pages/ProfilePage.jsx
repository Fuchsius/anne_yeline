import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/colors';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Call the user update API here
      // await userService.updateProfile(profileForm);
      
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Call the password update API here
      // await userService.updatePassword(passwordForm);
      
      setSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Failed to update password. Please check your current password and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* French flag inspired decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 w-1/3 h-full bg-blue-600" />
            <div className="absolute left-1/3 top-0 w-1/3 h-full bg-white" />
            <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-800 relative">Access Required</h2>
          <p className="text-gray-600 mb-6 relative">Please sign in to view your profile</p>
          <Link 
            to={ROUTES.LOGIN} 
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 text-white font-medium hover:from-blue-700 hover:via-blue-600 hover:to-red-600 transition-all transform hover:-translate-y-0.5 hover:shadow-lg relative"
          >
            Sign In
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 relative">
      {/* French-inspired background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-blue-600" />
        <div className="absolute left-1/3 top-0 w-1/3 h-full bg-white" />
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="relative">
            <div className="w-28 h-28 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-white to-red-600 animate-pulse opacity-50"></div>
              <div className="absolute inset-1 rounded-full bg-white"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-red-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-4">
            {user.firstName ? `${user.firstName} ${user.lastName}` : 'Welcome'}
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
        >
          {/* Decorative header strip */}
          <div className="h-2 w-full flex">
            <div className="w-1/3 bg-blue-600" />
            <div className="w-1/3 bg-white" />
            <div className="w-1/3 bg-red-600" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {['profile', 'password'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-gradient-to-r from-blue-50 via-white to-red-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Success Message */}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-green-50 to-red-50 border-l-4 border-green-500 text-green-700 rounded-md"
              >
                {success}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 rounded-md"
              >
                {error}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  {!editing ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 rounded-lg transition-colors"
                    >
                      Edit Profile
                    </motion.button>
                  ) : null}
                </div>

                {editing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          name="firstName"
                          type="text"
                          value={profileForm.firstName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          name="lastName"
                          type="text"
                          value={profileForm.lastName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-red-500 text-white hover:from-blue-700 hover:to-red-600 transition-colors"
                      >
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard label="First Name" value={user.firstName} color="blue" />
                    <InfoCard label="Last Name" value={user.lastName} color="red" />
                    <InfoCard label="Email" value={user.email} color="blue" />
                    <InfoCard label="Phone" value={user.phone || 'Not set'} color="red" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-red-500 text-white hover:from-blue-700 hover:to-red-600 transition-colors"
                  >
                    {submitting ? 'Updating...' : 'Update Password'}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, color }) => (
  <div className={`p-4 rounded-lg bg-gradient-to-r ${
    color === 'blue' 
      ? 'from-blue-50 to-white' 
      : 'from-white to-red-50'
  } border border-gray-100 hover:shadow-md transition-shadow`}>
    <p className={`text-sm font-medium ${
      color === 'blue' ? 'text-blue-600' : 'text-red-600'
    } mb-1`}>
      {label}
    </p>
    <p className="text-gray-900">{value}</p>
  </div>
); 