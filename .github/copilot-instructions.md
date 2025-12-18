# Propósito
Este documento recoge la información mínima y accionable que necesita un asistente IA o un desarrollador para ser productivo rápidamente en este repositorio Expo (React Native + Expo Router + TypeScript).

## Resumen del proyecto (qué necesita saber un ayudante IA)
- App: Expo React Native con Expo Router (file-based routing) y TypeScript (strict).
- Entradas principales:
  - `app/_layout.tsx` — layout raíz, AuthProvider y navegación drawer.
  - `app/index.tsx` — lógica de redirección inicial.
- Autenticación: centralizada en `context/AuthContext.tsx`. Tokens y usuario se guardan en `expo-secure-store` con las claves:
  - `userToken`
  - `user`
  - Usa `useAuthContext()` para acceder a estado y helpers de auth.
- Llamadas a API: usar el wrapper `constants/api` (ver `constants/api.tsx`). Para endpoints protegidos usa el header `Authorization: Bearer <token>` según patrones existentes.
- UI y rutas:
  - El árbol de pantallas está en `app/` (pantallas por archivo y carpetas como `(tabs)`, `(auth)`, `(app)`).
  - Componentes reutilizables en `components/` (por features: `common`, `cuotas`, `financier`, `home`, `login`, etc.).
- Hooks: la lógica reutilizable vive en `hooks/` (ej.: `hooks/useHome.tsx`). Prefiere crear hooks para lógica que se usa en varias pantallas.

## Flujo de trabajo y comandos
- Instalar dependencias: `npm install`
- Scripts útiles:
  - `npm start` → `expo start`
  - `npm run android` → Android
  - `npm run ios` → iOS
  - `npm run web` → Web
  - `npm run lint` → `expo lint`
  - `npm run reset-project` → `./scripts/reset-project.js`
- Para dev builds con `expo-dev-client`: usar `npx expo start` o `npm start` y seguir prompts de Expo.

## Convenciones y reglas del proyecto (obligatorias)
- Tipado: TypeScript con `strict: true`. Añade interfaces/tipos cuando sea necesario.
- Código limpio: regla obligatoria — no incluir comentarios dentro del código fuente. Explicaciones, decisiones o contexto van fuera del código (ej. descripción del PR o issue).
- Rutas y pantallas:
  - File-based routing: añade nuevas pantallas bajo `app/` respetando la estructura.
  - Para exponer una entrada en el drawer añade un `Drawer.Screen` en `app/_layout.tsx` (revisar sintaxis de los existentes).
- Auth gating:
  - `AuthProvider` envuelve la app en `app/_layout.tsx`.
  - No bypassear `useAuthContext()`; usar `isAuthenticated`, `user` y `customerDetails` para decisiones de navegación.
  - Redirecciones iniciales en `app/index.tsx` y `app/_layout.tsx`.
- Persistencia segura:
  - Usa `expo-secure-store` con las claves `userToken` y `user`. Mantener compatibilidad con las shapes definidas en `context/AuthContext.tsx` (`AppUser`, `CustomerDetails`).
- API:
  - Usa el `api` importado desde `constants/api` (centraliza baseURL y configuración de axios).
  - Para peticiones protegidas añade `Authorization: Bearer <token>`.
- Hooks:
  - Crear hooks en `hooks/` (ej.: `hooks/useHome.tsx`) para lógica de negocio y llamadas a API.
- UX/headers:
  - Para entender el estilo general de pantallas toma como referencia:
    - Ejemplo de pantalla principal/subscreen de pagos: 
      - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\(app)\(pagos-subscreens)\pagar.tsx`
    - Ejemplo de header que uso en pantallas:
      - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\components\history\PaymentHeader.tsx`
  - La infraestructura de pantallas:
    - Carpeta raíz de pantallas: `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app`
    - Pantallas de autenticación (antes de login, registro, recuperar contraseña, verificar): 
      - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\(auth)`
    - Pantallas principales y subscreens:
      - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\(app)` define pantallas principales.
      - Ejemplo de pantalla principal en tabs:
        - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\(app)\(tabs)\pagos.tsx`
      - Ejemplo de estructura de subscreens para “pagos”:
        - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\(app)\(pagos-subscreens)\_layout.tsx`
        - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\(app)\(pagos-subscreens)\detallepago.tsx`
        - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\(app)\(pagos-subscreens)\pagar.tsx`
    - Pantallas que no son principales (screens generales):
      - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\screens`
      - Ejemplo de estructura de perfil:
        - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\screens\profile\_layout.tsx`
        - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\screens\profile\index.tsx`
        - `C:\Users\JorgeDanielMartínezR\Desktop\app-movil\app\screens\profile\settings.tsx`
- Estilo visual:
  - Sigue los patrones de las pantallas de referencia (PaymentHeader y pagar.tsx). Mantén consistencia en spacing, tipografías y componentes comunes.
- Testing y mocks:
  - Cuando crees mocks o pruebas, respeta la asignación de `customerDetails` y el default avatar si falta `profile_picture` (como hace `AuthContext`).

## Checklist para añadir una nueva pantalla (paso a paso)
1. Crear hook en `hooks/` para la lógica del dominio (ej.: `use<Feature>.ts(x)`), usar `api` desde `constants/api`.
2. Crear componentes reutilizables en `components/<Feature>` (tabla/lista, formulario/modal) si aplica.
3. Crear la página en la ruta correcta dentro de `app/` siguiendo la estructura del proyecto (ej. si es subscreen de pagos, ponerla en `(pagos-subscreens)`).
4. Para exponer en drawer, añadir `Drawer.Screen` en `app/_layout.tsx`.
5. Usar `useAuthContext()` cuando la pantalla dependa de auth; respetar keys `userToken` y `user` en SecureStore.
6. Añadir tipos/ interfaces TypeScript y ejecutar `npm run lint`.
7. Probar en Expo (Android/iOS/web) con `npm start` y validar navegación y datos.
8. Código limpio: no incluir comments en los archivos fuente.

## Ejemplos de patrones y llamadas API
- Uso del wrapper API:
  - Importar: `import api from 'constants/api';`
  - Llamada protegida: `await api.get('/endpoint', { headers: { Authorization: \`Bearer ${token}\` } });`
- Crear un hook típico (estructura esperada):
  - `hooks/useHome.tsx` sirve como referencia del patrón: separa la lógica de estado, llamadas a la API y efectos; exporta funciones y estados que consume la pantalla.

## CI / lint / tipo
- Ejecutar `npm run lint` (expo lint) antes de abrir PR.
- TypeScript strict obliga a declarar tipos; añadir interfaces en `types/` o cerca del hook/pantalla si hace falta.

## Puntos de cuidado (gotchas)
- `customerDetails` puede ser `null` después de auth; tratar ese caso como loading/distinto de autenticación faltante.
- No asumir que `profile_picture` exista; `AuthContext` asigna un avatar por defecto.
- Mantener compatibilidad con las claves `userToken` y `user` en SecureStore cuando cambies el flujo de auth.

## Dónde buscar contexto adicional
- `app/_layout.tsx` — layout y Drawer
- `app/index.tsx` — redirecciones
- `context/AuthContext.tsx` — auth, shapes y SecureStore keys
- `constants/api.tsx` — wrapper de axios
- `components/` — componentes reutilizables
- `hooks/` — hooks existentes (ej.: `hooks/useHome.tsx`)

## Notas finales (reglas obligatorias resumidas)
- Usa `constants/api` para llamadas HTTP.
- Usa `useAuthContext()` y respeta `userToken`/`user` en `expo-secure-store`.
- Crea hooks para lógica de negocio reutilizable.
- Mantén el estilo de pantallas según `PaymentHeader.tsx` y las pantallas de `pagos-subscreens`.
- No pongas comentarios dentro del código (código limpio) no quiero líneas comentadas.