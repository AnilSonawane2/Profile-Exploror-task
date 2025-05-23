import { MapPin, User, Edit, Trash2 } from 'lucide-react';

const ProfileCard = ({ profile, showAdmin, onShowSummary, onShowDetails, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 h-48 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">{profile.name}</h3>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">{profile.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{profile.address}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onShowSummary(profile)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Summary
          </button>
          
          <button
            onClick={() => onShowDetails(profile)}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Details
          </button>
        </div>
        
        {showAdmin && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(profile)}
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            
            <button
              onClick={() => onDelete(profile.id)}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;