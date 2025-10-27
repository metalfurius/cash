# 💰 Gestor de Gastos Mensuales

Una aplicación web moderna y elegante para gestionar tus gastos mensuales con Firebase.

## ✨ Características Principales

- 🔐 **Autenticación segura** con Firebase Authentication
- 📊 **Visualización de datos** con gráficos interactivos (Chart.js)
- 💳 **Categorización de gastos**: Personales, Caprichos, Necesarios, Otros
- 📈 **Estadísticas en tiempo real**: Total mensual, número de gastos, promedio
- 📅 **Período personalizable**: Configura tu ciclo de gastos (ej: del 25 al 25)
- ✏️ **Edición y eliminación** de gastos de forma intuitiva
- 📱 **Diseño responsive** optimizado para pantallas 1920x1080
- 🎨 **UI moderna** con gradientes, sombras y animaciones suaves

## 🎨 Mejoras de Diseño

### Página de Login
- Diseño centrado con emojis grandes
- Formularios con bordes redondeados y efectos hover
- Fondo con gradiente morado atractivo
- Animaciones de entrada suaves

### Dashboard
- **Layout en Grid**: Optimizado para ver todo de un vistazo
- **Tarjetas de estadísticas**: Resumen visual del mes actual
- **Lista de gastos**: Scroll personalizado con badges de categorías
- **Gráfico circular**: Visualización clara de gastos por categoría
- **Formulario mejorado**: Con fecha por defecto y botón cancelar
- **Colores modernos**: Paleta basada en Tailwind CSS
- **Tipografía Inter**: Fuente moderna de Google Fonts

## 🚀 Características Técnicas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Firestore + Authentication)
- **Gráficos**: Chart.js
- **Fuentes**: Google Fonts (Inter)

## 📋 Categorías de Gastos

- 💼 **Gastos Personales** (Azul)
- 🎁 **Caprichos** (Rosa)
- 🏠 **Necesarios** (Verde)
- 📦 **Otros** (Índigo)

## 🎯 Funcionalidades

1. **Añadir gastos**: Descripción, monto, fecha y categoría
2. **Editar gastos**: Modificar cualquier gasto existente
3. **Eliminar gastos**: Borrar gastos no deseados
4. **Configurar período**: Establece el día de inicio de tu ciclo mensual (ej: día 25)
5. **Ver estadísticas**: Total del período, número de gastos y promedio
6. **Visualizar distribución**: Gráfico circular por categorías del período actual
7. **Filtrado automático**: Estadísticas calculadas según tu período personalizado

## 💡 Mejoras Implementadas

- ✅ Layout en grid optimizado para 1920x1080
- ✅ Paleta de colores moderna (Primary: #6366f1)
- ✅ Sombras y efectos de profundidad
- ✅ Transiciones y animaciones suaves
- ✅ Iconos emoji para mejor UX
- ✅ Badges de categorías con colores
- ✅ Scrollbar personalizado
- ✅ Estados vacíos informativos
- ✅ Botón de cancelar en edición
- ✅ Fecha actual por defecto
- ✅ **Período personalizable** (del 1 al 28 del mes)
- ✅ **Modal de configuración** elegante
- ✅ **Estadísticas dinámicas** según período configurado
- ✅ Responsive design

## 🔧 Uso

1. Abre `index.html` en tu navegador
2. Regístrate o inicia sesión
3. **Configura tu período mensual** (⚙️ botón en el header)
   - Selecciona el día de inicio (ej: día 25 si cobras el 25)
   - Las estadísticas se calcularán del 25 de un mes al 24 del siguiente
4. Comienza a añadir tus gastos
5. Visualiza tus estadísticas en tiempo real según tu período

### 📅 Configuración del Período

La funcionalidad de período personalizable te permite:
- Establecer cualquier día del mes como inicio (1, 5, 10, 15, 20, 25, 28)
- Ver estadísticas calculadas según tu ciclo de cobro
- El gráfico mostrará solo los gastos del período actual
- Perfecto para personas que cobran a mitad de mes

---

**Desarrollado con ❤️ para una mejor gestión financiera personal**
