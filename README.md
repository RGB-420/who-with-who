# Comi Lios

Comi Lios es una app para crear un mapa visual de personas y relaciones usando un diagrama interactivo. La idea es poder añadir personas, conectarlas entre si y navegar facilmente por el grafo para saber quien se ha liado con quien.

## Funcionalidades

- Crear, editar y eliminar personas.
- Crear y eliminar relaciones entre personas.
- Mover personas por el canvas y guardar su posicion.
- Buscar personas por nombre y centrar el diagrama en el resultado.
- Ver estadisticas basicas de personas y relaciones.
- Interfaz optimizada para movil y escritorio.
- Carga inicial con indicador visual.
- Actualizaciones optimistas para que la app responda rapido aunque la base de datos tarde.

## Stack

- Frontend: React, TypeScript, Vite, React Flow, Tailwind CSS y Lucide React.
- Backend: FastAPI, SQLAlchemy y Pydantic.
- Base de datos: SQLite en local por defecto o PostgreSQL/Neon usando `DATABASE_URL`.

## Estructura

```text
who-with-who/
  backend/
    main.py
    models.py
    schemas.py
    database.py
    requirements.txt
  frontend/
    src/
    public/
    package.json
```

## Variables De Entorno

Backend (`backend/.env`):

```env
DATABASE_URL=sqlite:///./test.db
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8000
```

Hay ejemplos en:

- `backend/.env.example`
- `frontend/.env.example`

## Arrancar En Local

Backend:

```powershell
cd backend
uvicorn main:app --reload
```

Si usas entorno virtual desde la raiz:

```powershell
.venv\Scripts\activate
cd backend
uvicorn main:app --reload
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Si PowerShell bloquea scripts de npm, usa:

```powershell
npm.cmd run dev
```

## Build Y Comprobaciones

Frontend:

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
```

Backend:

```powershell
cd backend
uvicorn main:app --reload
```

La API expone los endpoints principales:

- `GET /persons`
- `POST /persons`
- `PUT /persons/{id}`
- `DELETE /persons/{id}`
- `PUT /persons/{id}/position`
- `GET /relations`
- `POST /relations`
- `DELETE /relations/{id}`

## Logo

El logo usado en el header esta en:

```text
frontend/public/brand-logo.png
```

Si quieres cambiarlo, sustituye ese archivo manteniendo el mismo nombre.

## Notas Para Despliegue

- Configura `DATABASE_URL` en el backend con la URL de la base de datos real.
- Configura `VITE_API_URL` en el frontend apuntando a la URL publica de la API.
- En produccion conviene limitar el CORS del backend al dominio real del frontend.
- La app esta pensada para funcionar bien en Docker/VPS separando frontend, backend y base de datos.
