import { User, Phone, Mail, MapPin } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  subordinates?: string[];
}

interface TeamProfileProps {
  member: TeamMember;
}

export function TeamProfile({ member }: TeamProfileProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />
      <h2 className="text-2xl font-semibold mb-2">{member.name}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{member.title}</p>
      <div className="text-gray-700 dark:text-gray-300 space-y-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>{member.department}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>{member.contact.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>{member.contact.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{member.contact.location}</span>
        </div>
      </div>
    </div>
  );
}
