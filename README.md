<div align="center">
  <img src="/imagenes/Logo.jpeg" alt="PrevIA Logo" width="120" />
  <h1>⬢ PrevIA - Plataforma de Bienestar Inteligente</h1>
  <p><strong>Cierra la brecha entre la intención y la acción en tu camino hacia una vida saludable</strong></p>
</div>

---

## 📋 Descripción del Proyecto

**PrevIA** es una solución digital diseñada para motivar y acompañar a los usuarios en la mejora continua de sus hábitos de salud. Mediante inteligencia artificial, la plataforma transforma registros diarios en interpretaciones accionables para prevenir enfermedades crónicas no transmitibles como obesidad, diabetes e hipertensión.

---

## 🎯 Objetivos

### 🎪 Objetivo General
Diseñar una plataforma digital que motive a mejorar los hábitos de las personas día a día, utilizando inteligencia artificial para registrar datos de salud, dar seguimiento al avance y proporcionar recomendaciones personalizadas.

### 📌 Objetivos Específicos
- **Registro Simplificado:** Facilitar el registro inicial de datos básicos (peso, estatura, edad, hábitos)
- **Seguimiento Evolutivo:** Guardar y mostrar la evolución del usuario en el tiempo
- **Visualización de Datos:** Gráficos para comparar cambios semanales en sueño, ejercicio y alimentación
- **IA Personalizada:** Recomendaciones inteligentes basadas en el historial personal
- **Prevención Activa:** Impulsar la conciencia y mejora progresiva de hábitos cotidianos

---

## 💻 Tecnologías Utilizadas

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
</div>

### 🔧 Stack Tecnológico

| Componente | Tecnología | Descripción |
|-----------|-----------|-----------|
| **Backend** | Node.js + Express.js | API REST escalable y eficiente |
| **Base de Datos** | MongoDB | Almacenamiento de registros dinámicos de salud |
| **Gestión de Usuarios** | MySQL | Base de datos relacional para usuarios y roles |
| **Autenticación** | JWT + Bcrypt | Tokens seguros y encriptación de contraseñas |
| **Notificaciones** | Nodemailer | Servicios de email para recuperación de cuenta |
| **Calidad de Código** | ESLint | Estándares y linting automático |

---

## 🗄️ Arquitectura de Datos

PrevIA implementa un enfoque **híbrido de bases de datos** para garantizar integridad referencial y flexibilidad en la gestión de datos dinámicos.

### 📊 Modelo Entidad-Relación Extendido (MEER)

> [!NOTE]
> MongoDB se utiliza para datos dinámicos, por lo que la estructura MEER se limita a la sección relacional.

<div align="center">
  <img src="/imagenes/image.png" alt="Modelo Entidad Relación Extendido - PrevIA"/>
</div>

### 📚 Colecciones de MongoDB

El sistema persiste datos de salud y hábitos en las siguientes **6 colecciones principales**:

| Colección | Propósito |
|-----------|-----------|
| **HistorialRachas** | Registro de rachas y cumplimiento de objetivos |
| **RecomendacionIA** | Recomendaciones personalizadas generadas por IA |
| **RegistroActividadFisica** | Datos de ejercicio y actividad física diaria |
| **RegistroAlimentacion** | Registro de comidas y información nutricional |
| **RegistroBienestar** | Métricas de bienestar emocional y mental |
| **RegistroSueno** | Datos de calidad y duración del sueño |

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone <url-de-repositorio>
cd prevIA_backend
```

### 2️⃣ Instalar Dependencias

```bash
npm install --legacy-peer-deps
```

### 3️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
# Servidor
PORT=3000
FRONTEND_URL=http://localhost:5173

# MySQL - Gestión de Usuarios
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=previa_db

# MongoDB - Registros de Salud
MONGO_URI=mongodb://localhost:27017/previa_mongo

# Seguridad
JWT_SECRET=tu_firma_secreta

# Correo (Ejemplo con Mailtrap)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu_usuario
EMAIL_PASS=tu_password
```

### 4️⃣ Ejecutar la Aplicación

**Desarrollo (con Nodemon):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

---

## 🔐 Seguridad y Control de Acceso

- **RBAC (Role Based Access Control):** El middleware `roleAuth` gestiona permisos específicos, asegurando que solo usuarios con perfil `admin_previa` realicen cambios críticos.
- **Tokens Temporales:** Los flujos de recuperación de contraseña generan tokens con validez máxima de **15 minutos**.
- **Encriptación:** Implementación de **Bcrypt** para almacenamiento seguro de contraseñas.
- **JWT:** Autenticación basada en tokens seguros y con expiración configurable.

---

## 👥 Equipo de Desarrollo

> PrevIA es desarrollado colaborativamente por un equipo multidisciplinario de 4 integrantes:

| Integrante | Rol |
|-----------|-----|
| **Ángel de Jesús Rufino Mendoza** | Desarrollador Backend |
| **Abril Guzmán Barrera** | Desarrollador Frontend |
| **Esther González Peralta** | Bases de Datos |
| **Carlos Isaac Fosado Escudero** | Documentación |

---

<div align="center">
  <p><strong>✨ PrevIA - Transformando hábitos, mejorando vidas ✨</strong></p>
  <p>2025 - 2026 © Todos los derechos reservados</p>
</div>