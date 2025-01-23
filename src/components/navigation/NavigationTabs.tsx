interface NavigationTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
  }
  
  export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'projects', label: 'Projects' },
      { id: 'team', label: 'Team' },
      { id: 'assets', label: 'Assets' },
      { id: 'reports', label: 'Reports' },
    ];
  
    return (
      <nav className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-3 py-2 text-sm font-medium
                ${activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    );
  }
  