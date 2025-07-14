# Show Me My Money! 📈

Una aplicación web para gestionar tu portfolio de inversiones en el mercado argentino. Seguí tus inversiones, realizá operaciones y mantené un registro de tu patrimonio de manera simple y efectiva.

![Dashboard Preview](./docs/images/dashboard.png)

## 🌟 Características principales

- 💰 **Seguimiento de efectivo**: Mantené el control de tu dinero disponible
- 📊 **Portfolio en tiempo real**: Visualizá tus posiciones actualizadas
- 🔄 **Operaciones**: Comprá y vendé acciones y bonos fácilmente
- 📱 **Diseño responsive**: Accedé desde cualquier dispositivo
- 🌓 **Modo oscuro**: Elegí el tema que prefieras
- 💾 **Almacenamiento flexible**: Guardá tus datos en memoria, localStorage o base de datos

### Screenshots

#### Dashboard
![Dashboard](./docs/images/dashboard.png)
*Vista principal con resumen del portfolio*

#### Operaciones
![Operaciones](./docs/images/operaciones.png)
*Pantalla de carga de operaciones*

#### Preferencias
![Preferencias](./docs/images/preferencias.png)
*Configuración de la aplicación*

## 🚀 Comenzando

### Requisitos previos
- Node.js 20 o superior
- pnpm (recomendado) o npm

### Instalación

1. Cloná el repositorio:
```bash
git clone https://github.com/tuuser/showmemymoney.git
cd showmemymoney
```

2. Instalá las dependencias:
```bash
pnpm install
```

3. Iniciá la aplicación en modo desarrollo:
```bash
pnpm dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- API: http://localhost:3001

## 🛠️ Tecnologías utilizadas

### Frontend
- React 18 con TypeScript
- Vite para desarrollo
- Material-UI para componentes
- TailwindCSS para estilos
- Zustand para estado global

### Backend
- Express con TypeScript
- Validación con Zod
- Almacenamiento flexible (memoria/localStorage/PostgreSQL)

## 📝 Configuración

### Variables de entorno
Creá un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001
```

## 🔄 Modos de almacenamiento

La aplicación soporta tres modos de almacenamiento:

### En memoria (temporal)
- Perfecto para pruebas
- Los datos se pierden al reiniciar
- No requiere configuración

### LocalStorage (persistente)
- Los datos se guardan en el navegador
- Persiste entre reinicios
- Ideal para uso personal

### PostgreSQL (base de datos)
- Almacenamiento profesional
- Requiere configuración adicional
- En desarrollo

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si querés colaborar:

1. Hacé un fork del repositorio
2. Creá una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commiteá tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Pusheá a la rama (`git push origin feature/AmazingFeature`)
5. Abrí un Pull Request

## 📋 Por hacer

- [ ] Integración con PostgreSQL
- [ ] Gráficos históricos
- [ ] Análisis de rendimiento
- [ ] Actualizaciones en tiempo real
- [ ] Autenticación de usuarios
- [ ] Soporte multi-moneda

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mirá el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

Si encontrás un bug o tenés una sugerencia, por favor abrí un issue en GitHub.

---

Hecho con ❤️ en Argentina