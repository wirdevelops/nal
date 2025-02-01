import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

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

const teamData: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Director',
    title: 'Director',
    department: 'Leadership',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    contact: {
      phone: '555-123-4567',
      email: 'sarah.director@example.com',
      location: 'Los Angeles, CA'
    },
    subordinates: ['2', '3', '4']
  },
  {
    id: '2',
    name: 'Mike Producer',
    title: 'Producer',
    department: 'Production',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
    contact: {
      phone: '555-987-6543',
      email: 'mike.producer@example.com',
      location: 'New York, NY'
    },
    subordinates: ['5', '6']
  },
  {
    id: '3',
    name: 'Alex Writer',
    title: 'Lead Writer',
    department: 'Creative',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    contact: {
      phone: '555-234-5678',
      email: 'alex.writer@example.com',
      location: 'London, UK'
    },
    subordinates: ['7', '8']
  },
  {
    id: '4',
    name: 'Emily Art',
    title: 'Art Director',
    department: 'Art',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d67492d?w=100',
    contact: {
      phone: '555-345-6789',
      email: 'emily.art@example.com',
      location: 'Paris, France'
    },
    subordinates: ['9', '10']
  },
  {
    id: '5',
    name: 'John Camera',
    title: 'Camera Operator',
    department: 'Production',
    avatar: 'https://images.unsplash.com/photo-1539571696350-5a94020c3da4?w=100',
    contact: {
      phone: '555-456-7890',
      email: 'john.camera@example.com',
      location: 'Los Angeles, CA'
    }
  },
  {
    id: '6',
    name: 'Jane Sound',
    title: 'Sound Engineer',
    department: 'Production',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936e7e?w=100',
    contact: {
      phone: '555-567-8901',
      email: 'jane.sound@example.com',
      location: 'New York, NY'
    }
  },
  {
    id: '7',
    name: 'Chris Script',
    title: 'Script Supervisor',
    department: 'Creative',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a4?w=100',
    contact: {
      phone: '555-678-9012',
      email: 'chris.script@example.com',
      location: 'London, UK'
    }
  },
  {
    id: '8',
    name: 'Anna Story',
    title: 'Story Editor',
    department: 'Creative',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d67492d?w=100',
    contact: {
      phone: '555-789-0123',
      email: 'anna.story@example.com',
      location: 'Paris, France'
    }
  },
  {
    id: '9',
    name: 'David Set',
    title: 'Set Designer',
    department: 'Art',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d67492d?w=100',
    contact: {
      phone: '555-890-1234',
      email: 'david.set@example.com',
      location: 'Los Angeles, CA'
    }
  },
  {
    id: '10',
    name: 'Laura Costume',
    title: 'Costume Designer',
    department: 'Art',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d67492d?w=100',
    contact: {
      phone: '555-901-2345',
      email: 'laura.costume@example.com',
      location: 'New York, NY'
    }
  }
];

function MemberCard({ member }: { member: TeamMember }) {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-20 h-20 rounded-full mb-2 object-cover"
      />
      <h3 className="text-lg font-semibold text-center">{member.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{member.title}</p>
      <button
        onClick={() => setShowContact(!showContact)}
        className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {showContact ? 'Hide Contact' : 'Show Contact'}
      </button>
      {showContact && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>{member.contact.phone}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>{member.contact.email}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{member.contact.location}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DepartmentGroup({ department, members }: { department: string; members: TeamMember[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{department}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function OrgChart({ team }: { team: TeamMember[] }) {
  const leadership = team.filter(member => member.department === 'Leadership');
  const production = team.filter(member => member.department === 'Production');
  const creative = team.filter(member => member.department === 'Creative');
  const art = team.filter(member => member.department === 'Art');

  return (
    <div className="space-y-8">
      {leadership.map(leader => (
        <div key={leader.id} className="space-y-4">
          <MemberCard member={leader} />
          <div className="ml-8 space-y-4">
            <DepartmentGroup department="Production" members={production} />
            <DepartmentGroup department="Creative" members={creative} />
            <DepartmentGroup department="Art" members={art} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TeamOrgChart() {
  return (
    <div className="p-6">
      <OrgChart team={teamData} />
    </div>
  );
}
