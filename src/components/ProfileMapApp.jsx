import { useState } from 'react';
import { Search, User, Plus, X, Loader } from 'lucide-react';
import ProfileCard from './ProfileCard';
import MapComponent from './MapComponent';
import ProfileForm from './ProfileForm';
import ProfileDetails from './ProfileDetails';

const ProfileMapApp = () => {
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: "Anil Sonawane",
      photo: "https://images3.alphacoders.com/131/1310203.png",
      description: "Software engineer passionate about AI and machine learning",
      address: "Jalgaon, Maharashtra, India",
      coordinates: { lat: 21.004194, lng: 75.563942 },
      phone: "1234567890",
      email: "anil@email.com",
      interests: ["Web Development", "Photography", "Hiking"],
      dateJoined: "2023-01-15"
    },
    {
      id: 2,
      name: "John Doe",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "UX designer with a focus on creating intuitive user experiences",
      address: "New York, USA",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      phone: "987654321",
      email: "john@email.com",
      interests: ["Design", "Music", "Travel"],
      dateJoined: "2022-11-20"
    },
    {
      id: 3,
      name: "Jahn Doe",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "Marketing strategist helping brands connect with their audience",
      address: "Beijing, China",
      coordinates: { lat: 39.916668, lng: 116.383331 },
      phone: "5657657678",
      email: "jahn@email.com",
      interests: ["Marketing", "Yoga", "Cooking"],
      dateJoined: "2023-03-10"
    },
    {
      id: 4,
      name: "Monkey D. Luffy",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Data scientist turning complex data into actionable insights",
      address: "Tokyo, Japan",
      coordinates: { lat: 35.6764, lng: 139.6500 },
      phone: "+1 (555) 321-0987",
      email: "luffy@email.com",
      interests: ["Data Science", "Gaming", "Basketball"],
      dateJoined: "2022-08-05"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowSummary = async (profile) => {
    setIsLoading(true);
    setSelectedProfile(profile);
    
    setTimeout(() => {
      setShowMap(true);
      setIsLoading(false);
    }, 800);
  };

  const handleDeleteProfile = (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleEditProfile = (profile) => {
    setEditingProfile({ ...profile });
  };

  const handleSaveProfile = (updatedProfile) => {
    if (updatedProfile.id) {
      setProfiles(profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    } else {
      const newProfile = {
        ...updatedProfile,
        id: Math.max(...profiles.map(p => p.id)) + 1,
        coordinates: { lat: 37.7749, lng: -122.4194 },
        dateJoined: new Date().toISOString().split('T')[0]
      };
      setProfiles([...profiles, newProfile]);
    }
    setEditingProfile(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Explorer</h1>
            </div>
            
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showAdmin 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {showAdmin ? 'Exit Admin' : 'Admin Panel'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {showAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Profile
              </button>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProfiles.length} of {profiles.length} profiles
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl text-center">
              <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg font-semibold">Loading map...</p>
            </div>
          </div>
        )}

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              showAdmin={showAdmin}
              onShowSummary={handleShowSummary}
              onShowDetails={(p) => {
                setSelectedProfile(p);
                setShowProfileDetails(true);
              }}
              onEdit={handleEditProfile}
              onDelete={handleDeleteProfile}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No profiles found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {showMap && selectedProfile && (
        <MapComponent 
          profile={selectedProfile} 
          onClose={() => {
            setShowMap(false);
            setSelectedProfile(null);
          }} 
        />
      )}
      
      {showProfileDetails && selectedProfile && (
        <ProfileDetails 
          profile={selectedProfile} 
          onClose={() => setShowProfileDetails(false)}
        />
      )}
      
      {editingProfile && (
        <ProfileForm
          profile={editingProfile}
          onSave={handleSaveProfile}
          onCancel={() => setEditingProfile(null)}
        />
      )}
      
      {showAddForm && (
        <ProfileForm
          onSave={handleSaveProfile}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default ProfileMapApp;