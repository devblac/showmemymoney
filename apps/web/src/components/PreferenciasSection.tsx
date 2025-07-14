import { useState, useEffect } from 'react';
import { settingsApi } from '../services/api';
import type { MarketDataConfig } from '../types/api';
import { useNotification } from '../hooks/useNotification';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { StorageType } from '../types/api';
import { localStorageService } from '../services/localStorageService';
import { portfolioApi } from '../services/api';
import { StorageConfig } from '../types/api';

const SUPPORTED_BROKERS = [
  { id: 12, name: 'Buenos Aires Valores S.A.' },
  { id: 20, name: 'Proficio Investment S.A.' },
  { id: 81, name: 'Tomar Inversiones S.A.' },
  { id: 88, name: 'Bell Investments S.A.' },
  { id: 91, name: 'RIG Valores S.A.' },
  { id: 94, name: 'Soluciones Financieras S.A.' },
  { id: 127, name: 'Maestro y Huerres S.A.' },
  { id: 153, name: 'Bolsa de Comercio del Chaco' },
  { id: 164, name: 'Prosecurities S.A.' },
  { id: 186, name: 'Servente y Cia. S.A.' },
  { id: 201, name: 'Alfy Inversiones S.A.' },
  { id: 203, name: 'Invertir en Bolsa S.A.' },
  { id: 209, name: 'Futuro Bursátil S.A.' },
  { id: 233, name: 'Sailing S.A.' },
  { id: 265, name: 'Negocios Financieros y Bursátiles S.A. (Cocos Capital)' },
  { id: 284, name: 'Veta Capital S.A.' },
];

export default function PreferenciasSection() {
  const { showNotification } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<number | ''>('');
  const [dni, setDni] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // Inicializamos con el valor de localStorage
  const [storageType, setStorageType] = useState<StorageType>(
    localStorageService.getStoragePreference()
  );
  const [postgresConfig, setPostgresConfig] = useState({
    host: 'localhost',
    port: 5432,
    database: 'showmemymoney',
    user: 'postgres',
    password: '',
  });
  const [copyToLocalStorage, setCopyToLocalStorage] = useState(true);
  const [showCopyOption, setShowCopyOption] = useState(false);

  // Efecto para controlar cuándo mostrar la opción de copia
  useEffect(() => {
    const currentStorage = localStorageService.getStoragePreference();

    // Solo mostrar la opción cuando:
    // 1. Estamos actualmente en Memory
    // 2. El usuario ha seleccionado LocalStorage
    // 3. No hemos completado la transición aún
    setShowCopyOption(
      currentStorage === StorageType.MEMORY && storageType === StorageType.LOCAL_STORAGE
    );
  }, [storageType]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsApi.getSettings();
      setIsOnline(settings.marketData.source === 'online');
      if (settings.marketData.broker) {
        setSelectedBroker(settings.marketData.broker.id);
        setDni(settings.marketData.broker.dni);
        setUser(settings.marketData.broker.user);
        setPassword(settings.marketData.broker.password);
      }

      // Actualizamos el storage type solo si es diferente al de localStorage
      const localStoragePreference = localStorageService.getStoragePreference();
      if (settings.storage.type !== localStoragePreference) {
        // Si hay discrepancia, preferimos el valor de localStorage
        const storageConfig: StorageConfig = {
          type: localStoragePreference,
          postgresql:
            localStoragePreference === StorageType.POSTGRESQL ? postgresConfig : undefined,
        };
        await settingsApi.updateStorageConfig(storageConfig);
      }
      setStorageType(localStoragePreference);

      if (settings.storage.postgresql) {
        setPostgresConfig(settings.storage.postgresql);
      }
    } catch (error) {
      showNotification('Error al cargar las preferencias', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Si estamos cambiando a localStorage y el usuario quiere copiar los datos
      if (storageType === StorageType.LOCAL_STORAGE && copyToLocalStorage) {
        try {
          // Obtener el estado actual del backend
          const portfolio = await portfolioApi.getPortfolio();
          const settings = await settingsApi.getSettings();

          // Guardar en localStorage
          localStorageService.saveState({
            ...portfolio,
            settings: {
              theme,
              storage: { type: StorageType.LOCAL_STORAGE },
              marketData: {
                source: isOnline ? 'online' : 'hardcoded',
                broker: isOnline
                  ? {
                      id: Number(selectedBroker),
                      dni,
                      user,
                      password,
                    }
                  : undefined,
              },
            },
          });
          console.log('Estado copiado a localStorage');
        } catch (error) {
          console.error('Error copiando estado a localStorage:', error);
          throw new Error('Error al copiar el estado actual a localStorage');
        }
      }

      // Actualizar configuraciones
      const marketDataConfig: MarketDataConfig = {
        source: isOnline ? 'online' : 'hardcoded',
        broker: isOnline
          ? {
              id: Number(selectedBroker),
              dni,
              user,
              password,
            }
          : undefined,
      };

      const storageConfig: StorageConfig = {
        type: storageType,
        postgresql: storageType === StorageType.POSTGRESQL ? postgresConfig : undefined,
      };

      // Primero actualizamos la preferencia de almacenamiento local
      localStorageService.setStoragePreference(storageType);

      // Luego actualizamos las configuraciones en el backend
      await settingsApi.updateMarketDataConfig(marketDataConfig);
      await settingsApi.updateStorageConfig(storageConfig);

      // Después de guardar exitosamente, ocultamos la opción de copia
      setShowCopyOption(false);

      showNotification('Preferencias actualizadas con éxito', 'success');
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      showNotification(
        error instanceof Error ? error.message : 'Error al actualizar las preferencias',
        'error'
      );
    }
  };

  const handleSnapshotDebug = async () => {
    try {
      if (storageType === StorageType.LOCAL_STORAGE) {
        const state = localStorageService.getState();
        console.log('📊 LocalStorage Database Snapshot:', state);
        showNotification('Snapshot del estado actual disponible en la consola (F12)', 'success');
      } else {
        await settingsApi.getDebugSnapshot();
        showNotification('Snapshot del estado actual disponible en la consola (F12)', 'success');
      }
    } catch (error) {
      showNotification('Error al obtener el snapshot del estado', 'error');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Preferencias</h2>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        {/* 1. Sección de Tema */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg font-medium dark:text-white">Tema:</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <SunIcon className="w-5 h-5 text-amber-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-indigo-400" />
              )}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {theme === 'light' ? 'Modo claro' : 'Modo oscuro'}
            </span>
          </div>
        </div>

        {/* 2. Sección de Almacenamiento */}
        <div className="mb-6">
          <span className="text-lg font-medium dark:text-white">Almacenamiento:</span>
          <div className="mt-2">
            <select
              value={storageType}
              onChange={e => setStorageType(e.target.value as StorageType)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white sm:text-sm"
            >
              <option value="memory">En memoria (temporal)</option>
              <option value="localStorage">Local Storage (persistente)</option>
              <option value="postgresql">PostgreSQL (base de datos)</option>
            </select>
          </div>

          {/* Checkbox y mensajes de copia */}
          {/* La opción de copia solo se muestra durante la transición */}
          {showCopyOption && (
            <div className="mt-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="copyToLocalStorage"
                  checked={copyToLocalStorage}
                  onChange={e => setCopyToLocalStorage(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="copyToLocalStorage"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                >
                  Copiar datos actuales a Local Storage
                </label>
              </div>
              {localStorageService.hasState() && (
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ Ya existen datos en Local Storage. Si copias los datos actuales, se
                  sobrescribirán los existentes.
                </p>
              )}
              {!localStorageService.hasState() && !copyToLocalStorage && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  ℹ️ Si no copias los datos, comenzarás con un estado vacío en Local Storage.
                </p>
              )}
            </div>
          )}

          {/* Configuración PostgreSQL */}
          {storageType === StorageType.POSTGRESQL && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Host
                </label>
                <input
                  type="text"
                  value={postgresConfig.host}
                  onChange={e => setPostgresConfig({ ...postgresConfig, host: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white sm:text-sm"
                />
              </div>
              {/* Otros campos de PostgreSQL */}
            </div>
          )}
        </div>

        {/* 3. Sección de Fuente de datos y sus campos relacionados */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium dark:text-white">Fuente de datos:</span>
            <button
              type="button"
              role="switch"
              aria-checked={isOnline}
              onClick={() => setIsOnline(!isOnline)}
              className="toggle-switch"
              data-checked={isOnline}
            >
              <span className="toggle-switch-thumb" />
              <span className="sr-only">Toggle data source</span>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isOnline ? 'Online (BYMA)' : 'Datos locales'}
            </span>
          </div>

          {isOnline && (
            <>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Conecta con BYMA a través de tu broker para obtener datos en tiempo real.
              </p>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Broker
                  </label>
                  <select
                    value={selectedBroker}
                    onChange={e => setSelectedBroker(e.target.value ? Number(e.target.value) : '')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white sm:text-sm"
                  >
                    <option value="">Seleccione un broker</option>
                    {SUPPORTED_BROKERS.map(broker => (
                      <option key={broker.id} value={broker.id}>
                        {broker.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    DNI
                  </label>
                  <input
                    type="text"
                    value={dni}
                    onChange={e => setDni(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Usuario
                  </label>
                  <input
                    type="text"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleSnapshotDebug}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Ver DB Snapshot
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
