
# 🚀 PrevIA - Backend API

Backend oficial de **PrevIA**, una plataforma digital integral para el seguimiento de hábitos de salud y recomendaciones de bienestar. Desarrollado con una arquitectura sólida utilizando Node.js y un enfoque de base de datos híbrida (MySQL + MongoDB).

## 🛠️ Tecnologías Principales
* **Entorno:** Node.js + Express.js
* **Bases de Datos:** MySQL (Relacional para usuarios/roles) y MongoDB (No relacional para registros de hábitos).
* **Seguridad:** JWT (JSON Web Tokens) para autenticación y Bcrypt para encriptación de contraseñas.
* **Mailing:** Nodemailer (Configurado con Mailtrap para recuperación de contraseñas).
* **Calidad de Código:** ESLint configurado bajo los estándares de la industria.

---

## ⚙️ Requisitos Previos
Antes de iniciar, asegúrate de tener instalado en tu máquina:
* [Node.js](https://nodejs.org/) (v16 o superior)
* MySQL Server (o XAMPP/WAMP)
* MongoDB (Local o Atlas)

---

## 📦 Instalación y Configuración

1. **Clonar el repositorio:**
   \`\`\`bash
   git clone <url-de-repositorio>
   cd prevIA_backend
   \`\`\`

2. **Instalar dependencias:**
   Ejecuta el siguiente comando para instalar todos los módulos necesarios (usamos `--legacy-peer-deps` para evitar conflictos de versiones con el linter de desarrollo):
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

3. **Configurar Variables de Entorno:**
   Crea un archivo llamado `.env` en la raíz del proyecto y agrega las siguientes variables (reemplaza con tus datos locales):

   \`\`\`env
   # Configuración del Servidor
   PORT=3000
   FRONTEND_URL=http://localhost:5173

   # Base de Datos Relacional (MySQL)
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=previa_db

   # Base de Datos No Relacional (MongoDB)
   MONGO_URI=mongodb://localhost:27017/previa_mongo

   # Seguridad
   JWT_SECRET=tu_super_secreto_jwt

   # Mailing (Mailtrap para testing)
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=tu_usuario_mailtrap
   EMAIL_PASS=tu_password_mailtrap
   \`\`\`

---

## 🚀 Inicialización del Proyecto

Para iniciar el servidor en **modo desarrollo** (con recarga automática mediante Nodemon):
\`\`\`bash
npm run dev
\`\`\`

Para iniciar el servidor en **modo producción**:
\`\`\`bash
npm start
\`\`\`

Si la conexión es exitosa, verás en la consola mensajes confirmando que el servidor está corriendo y las bases de datos (MySQL y MongoDB) se han conectado correctamente.

---

## 🛡️ Estructura de Seguridad Implementada
* **Autenticación:** Rutas protegidas mediante validación de tokens JWT.
* **Control de Acceso Basado en Roles (RBAC):** Middleware `roleAuth` para restringir operaciones críticas solo a administradores (`admin_previa`).
* **Recuperación de Acceso:** Flujo completo de "Olvidé mi contraseña" con generación de tokens temporales de 15 minutos y envío de correos HTML personalizados.
