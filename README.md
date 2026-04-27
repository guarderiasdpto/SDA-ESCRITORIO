# SDA — Sistema de Administración de Documentos
Sistema de monitoreo y control de expedientes para el Departamento de Guarderías.

## ¿Qué hace?
SDA centraliza los expedientes de cada guardería, calcula la vigencia de cada documento y muestra un semáforo (verde/amarillo/rojo) para prevenir vencimientos. Además, envía alertas por correo automáticamente.

Criterios del semáforo: Verde = vigente, Amarillo = por vencer en menos de 30 días, Rojo = vencido.

## Tecnologías
Node.js, Electron, Express, PostgreSQL, ExcelJS, Nodemailer, node-cron, node-windows.

## Requisitos previos
- Node.js >= 18.0.0
- PostgreSQL accesible
- (Opcional) Cuenta Gmail con contraseña de aplicación

## Instalación y primer arranque
1. Instalar dependencias:
```bash
npm install
```
2. Configurar entorno:
   Copiar `.env.example` a `.env` y configurar las variables de conexión y correo.
3. Inicializar base de datos:
```bash
npm run init-db
```
4. Cargar datos maestros:
```bash
npm run seed
```
5. Iniciar la aplicación:
```bash
npm run dev
```

## Scripts disponibles

| Script | Qué hace |
| :--- | :--- |
| `start` | Lanza la aplicación en modo Electron |
| `dev` | Alias de start para entorno de desarrollo |
| `electron` | Ejecución directa del binario de Electron |
| `build:win` | Genera el instalador ejecutable para Windows |
| `init-db` | Crea la base de datos y esquema inicial |
| `seed` | Carga los datos maestros de guarderías y documentos |
| `seed:pc` | Carga datos específicos de Protección Civil |
| `seed:extintores` | Carga el catálogo base de equipos contra incendios |
| `migrate-cvmsg` | Realiza migraciones de esquema para campos de mensajes |
| `service:install` | Registra el servidor como un servicio de Windows |
| `service:uninstall` | Elimina el servicio de Windows registrado |

Nota: Usa npm run dev durante el desarrollo; start y electron son alias del mismo comando.

## Variables de entorno
El detalle de configuración se encuentra en `.env.example`. Las variables requeridas son:
- `DATABASE_URL`
- `JWT_SECRET`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `PORT`
- `PG_DUMP_PATH`

## Estructura del proyecto
- `backups/`: Copias de seguridad de la base de datos PostgreSQL.
- `build/`: Recursos gráficos y metadatos para la compilación del instalador.
- `dist/`: Paquetes ejecutables generados para distribución.
- `public/`: Interfaz de usuario (HTML, CSS y JS del lado del cliente).
- `server/`: Código fuente del backend y lógica de negocio.
  - `server/cron/`: Tareas programadas para el envío automático de alertas.
  - `server/db/`: Scripts de inicialización, esquema y carga de datos.
  - `server/routes/`: Definiciones de los puntos de acceso de la API.
  - `server/utils/`: Utilidades para cálculos de semáforo y manejo de fechas.
  - `server/scripts/`: Herramientas para la gestión del servidor como servicio.

## Autor
Oscar Alberto Valenzuela Osuna
IMSS · OOAD Sinaloa · Departamento de Guarderías · 2026
