<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Sistema de Gestión Inmobiliaria con Next.js y Supabase</h1>
</a>

<p align="center">
 Una aplicación web para gestionar propiedades inmobiliarias con Next.js y Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Características

- Aplicación completa para inmobiliarias basada en [Next.js](https://nextjs.org) App Router
- Backend con Supabase (base de datos PostgreSQL y autenticación)
- API RESTful para gestión de propiedades e imágenes
- Sistema de autenticación para agentes inmobiliarios
- Gestión de propiedades con imágenes múltiples
- Almacenamiento de imágenes en Supabase Storage
- Validación de datos con Zod

## Configuración

Sigue estos pasos para configurar el proyecto:

1. Crea un proyecto en Supabase desde [el dashboard de Supabase](https://database.new)

2. Ejecuta este SQL en el editor SQL de Supabase para crear las tablas necesarias:

   ```sql
   -- Copia y pega aquí el contenido de lib/supabase/schema.sql
   ```

3. Configura las variables de entorno:

   - Copia `.env.example` a `.env.local`
   - Actualiza con tus credenciales de Supabase:
     ```
     NEXT_PUBLIC_SUPABASE_URL=[URL de tu proyecto Supabase]
     NEXT_PUBLIC_SUPABASE_ANON_KEY=[API ANON KEY de tu proyecto Supabase]
     ```

4. Instala las dependencias:

   ```bash
   pnpm install
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

La aplicación estará disponible en [localhost:3000](http://localhost:3000/).

## API Endpoints

### Propiedades

- `GET /api/properties` - Listar propiedades con filtros opcionales
- `POST /api/properties` - Crear nueva propiedad
- `GET /api/properties/:id` - Obtener detalles de una propiedad
- `PUT /api/properties/:id` - Actualizar una propiedad
- `DELETE /api/properties/:id` - Eliminar una propiedad

### Imágenes

- `POST /api/properties/:id/images` - Subir una imagen a una propiedad
- `GET /api/properties/:id/images` - Obtener todas las imágenes de una propiedad
- `PATCH /api/properties/:id/images/:imageId` - Establecer como imagen principal
- `DELETE /api/properties/:id/images/:imageId` - Eliminar una imagen

### Agentes

- `GET /api/agents` - Listar todos los agentes
- `POST /api/agents` - Crear perfil de agente
- `GET /api/agents/profile` - Obtener perfil del agente autenticado
- `PUT /api/agents/profile` - Actualizar perfil del agente autenticado

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo agente

## Estructura del Backend

- `/lib/supabase/` - Configuración y clientes de Supabase
- `/lib/types.ts` - Tipos de TypeScript y esquemas de Zod
- `/app/api/` - API endpoints (App Router)

## Seguridad

El sistema implementa seguridad a través de:

- Autenticación con Supabase Auth
- Row Level Security (RLS) para proteger datos en la base de datos
- Validación de datos con Zod
- Middleware para verificar autenticación en rutas API

## Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue antes de enviar una pull request.

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
