import { NavLink } from 'react-router-dom';

export interface NavigationMenuProps {
  currentSection?: 'posicion' | 'inversiones';
  onSectionChange?: (section: 'posicion' | 'inversiones') => void;
}

export function NavigationMenu({ currentSection, onSectionChange }: NavigationMenuProps) {
  return (
    <nav className="bg-gray-800 dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold">ShowMeMyMoney</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-gray-900 dark:bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                  onClick={() => onSectionChange?.('posicion')}
                >
                  POSICIÓN CONSOLIDADA
                </NavLink>
                <NavLink
                  to="/inversiones"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-gray-900 dark:bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                  onClick={() => onSectionChange?.('inversiones')}
                >
                  INVERSIONES
                </NavLink>
                <NavLink
                  to="/preferencias"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-gray-900 dark:bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  PREFERENCIAS
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 