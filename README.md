# RecAll
![RecAll logo]()

Monorepo for RecAll web application.

## Description and features
RecAll is a spaced-repetition service with additional features for comfortable and universal usage

### Vast markdown support
It's including
1. LaTeX
2. Audios
3. Videos
4. Syntax-highlighted codeblocks

![Formats]()

Also it has pretty rich markdown editor with hotkeys:

![Editor]()

### Imrpoved learning pipeline
1. FSRS space-repetition scheduler (basic implementation - [fsrs4anki](https://github.com/open-spaced-repetition/fsrs4anki)) with per-user adaptation
2. Flexible training calendar

![FSRS efficency chart]()
![Calendar]()

### Own files storage
So your files can be stored safe and private

![Files controls]()

## How to use
### Our site
*Soon*

### Self-hosted
RecAll is completely self-hosted web application so you can deploy it almost everywhere using `docker` with `docker compose` feature:
- Firstly, you need domain with IP which is available through the internet
- Specify env vars for root folder, `frontend/` and `backend/`
  - If you don't have SSL-sertificates you can use our [certbot wrapper](./config/certbot/)
- Run `docker compose up --build`
- **Enjoy!**

## Stack and implementation
RecAll consists of frontend and backend modules

### Frontend
Frontend is implemented as a `React` single-page application with:
- `wouter` for routing
- `zustand` sliced-store for state management
- `vite` for running and building
- `react-query` for backend communication
  - Requests function are auto-generated using `OpenAPI` specs
- `markdown-it` for markdown rendering
- Self-written text-editor supporting
  - Hotkeys
  - Smart-paste
  - History

Production build are distributed through lightweight `nginx` docker contatiner

See more in [`frontend/`](./frontend/)

### Backend
Backend consist of couple services:
- `FastAPI` python core with
  - Authentication
  - FSRS cheduling layer
  - Repositories for dedicated business logic's parts
- `PostgreSQL` database (core uses `SQLAlchemy` to work with it)
- `MinIO` S3-compatible object-storage
- `ollama` for processing text answers (*currently disabled*)

All services are connected through docker compose layer

See more in [`backend/`](./backend/)

### Infrastructure
Frontend and backend are conntected through `nginx` proxy

All services are packed in [`./compose.yaml`](./compose.yaml) for `docker compose` - it uncludes dedicated frontend and backend composes (also they can be run independently)

## Authors
RecAll was created by [Kozlov Kirill](https://github.com/KozlovKV) and [Tsoy Anton](https://github.com/AntonTsoy) during their studies at [NSU - Novosibirsk State University](https://www.nsu.ru/n/) (team development disciplines and graduation bachalour works).

### Responsibilities
#### Kozlov Kirill
-

#### Tsoy Anton
-

