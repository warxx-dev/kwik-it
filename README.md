# 🔗 Kwik-it

Una aplicación web फुल-stack (Full-Stack) diseñada para acortar, gestionar y organizar URLs de manera eficiente. Proporciona un sistema seguro de autenticación de usuarios y paneles de control intuitivos para la gestión de los enlaces acortados.

## 🚀 Funcionalidades Principales

- **Acortador de Enlaces:** Transforma URLs largas en enlaces cortos, rastreables y más fáciles de compartir.
- **Gestión de Enlaces (CRUD):** Visualiza, edita (actualización de destino) y elimina URLs generadas desde un panel de control interactivo mediante vistas en tabla.
- **Autenticación y Autorización:**
  - Registro e inicio de sesión seguro con JWT (JSON Web Tokens).
  - Integración de inicio de sesión social mediante **Google OAuth2**.
  - Protección de rutas tanto en cliente como en servidor para salvaguardar la información del usuario.
- **Diseño Reactivo e Interactivo:** Interfaz de usuario (UI) moderna y fluida con animaciones y adaptabilidad total para dispositivos móviles y de escritorio.
- **Manejo de Estados Complejos:** Uso de Context API para abstraer el estado global (Alertas, Autenticación, Enlaces, Modales).
- **Sistema de Modales y Validaciones:** Interacciones sin recarga mediante modales contextuales (Acceso, Edición, Eliminación) y validación de tipos e inputs de usuario utilizando _Zod_ y _Class-Validator_.

## 🛠️ Tecnologías y Herramientas Empleadas

El proyecto está estructurado estratégicamente separando el Cliente (Frontend) y la API (Backend), utilizando las tecnologías más fuertes del ecosistema JavaScript/TypeScript.

### Frontend (`/Client`)

- **Librería Principal:** React 19
- **Build Tool/Bundler:** Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Framer Motion
- **Enrutamiento:** React Router v7
- **Validaciones:** Zod
- **Iconos:** Lucide React & React Icons
- **Autenticación OAuth:** `@react-oauth/google`

### Backend (`/API`)

- **Framework:** NestJS 11
- **Lenguaje:** TypeScript
- **ORM:** Prisma (Integrado con adaptadores para base de datos SQLite/PostgreSQL)
- **Autenticación:** Passport.js (Estrategias: Local, JWT, Google y GitHub)
- **Seguridad:** bcryptjs (hash de contraseñas), protección mediante Guards y validación estricta de DTOs con `class-validator` y `class-transformer`.
- **Gestión de Cookies:** cookie-parser (para manejo seguro del JWT vía cookies HttpOnly).
- **Despliegue:** Preparado para Vercel (`vercel.json` y build options integradas).

## 💡 Habilidades y Competencias Demostradas

- **Arquitectura Full-Stack:** Implementación de un patrón backend MVC modular escalable (gracias a NestJS) separado de una SPA de alto rendimiento (React + Vite).
- **Seguridad de Aplicaciones:** Experiencia con encriptación de datos, almacenamiento seguro de sesión (estrategias de Passport.js y JWT), mitigación de vulnerabilidades y validación de datos a nivel backend y frontend.
- **Diseño de Bases de Datos:** Modelado de datos relacionales eficiente e interacción a través del ORM Prisma y servicios en la nube como LibSQL.
- **Interfaz de Usuario Avanzada:** Construcción sólida de componentes limpios y reutilizables en React, integrando utilidades atómicas de Tailwind y micro-interacciones (Framer Motion).
- **Desarrollo Tipado:** Rigurosa adopción de TypeScript end-to-end, compartiendo consistencia e interfaces seguras entre servicios.
