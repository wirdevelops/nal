import { useState } from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  Users, 
  FolderOpen, 
  PiggyBank, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'timeline', label: 'Timeline', icon: Timer },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'assets', label: 'Assets & Documents', icon: FolderOpen },
  { id: 'budget', label: 'Budget', icon: PiggyBank },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm mt-6">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span>Menu</span>
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="container">
          <div className="flex flex-col md:flex-row -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    inline-flex items-center px-4 py-3 text-sm font-medium border-b-2 
                    ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
