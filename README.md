# iam

## ¿Para qué es este proyecto?

`iam` es el frontend Next.js desde el cual se gestionan los accesos del
ecosistema jtagram. Permite administrar tanto usuarios internos (las
personas que operan las herramientas de jtagram) como usuarios de
aplicación (credenciales que usan las aplicaciones del ecosistema para
autenticarse entre sí), además de las aplicaciones y los roles que se les
pueden asignar a unos y otros. El acceso a este panel requiere iniciar
sesión como administrador; toda la gestión ocurre detrás de ese login,
consumiendo la API de `auth-api` a través de los Route Handlers propios de
`iam` (`app/api/**/route.ts`).

## ¿Qué hace cada página?

### Acceso

- **`app/login/page.tsx`**: formulario de inicio de sesión para la cuenta
  de administrador. Envía las credenciales al Route Handler
  `app/api/login/route.ts`, que valida contra `auth-api` y, si el login es
  correcto, deja seteada una cookie httpOnly con el token de acceso.
- **`app/home/page.tsx`**: landing del panel una vez logueado. Es solo un
  mensaje de bienvenida; no hace fetching ni contiene lógica — las
  acciones disponibles (crear aplicaciones, roles y usuarios) viven en el
  header de esa sección.
- **`app/page.tsx`**: es la ruta raíz (`/`) del proyecto, pero todavía
  conserva el scaffold por defecto que genera `create-next-app`. No fue
  personalizada y no forma parte del flujo real de la aplicación.

### Roles

- **`app/home/roles/list/page.tsx`**: lista los roles de aplicaciones
  existentes en una tabla.
- **`app/home/roles/create/page.tsx`**: formulario para crear un nuevo rol
  de aplicación.

### Aplicaciones

- **`app/home/applications/list/page.tsx`**: lista las aplicaciones
  registradas en el ecosistema en una tabla.
- **`app/home/applications/create/page.tsx`**: formulario para registrar
  una nueva aplicación.

### Usuarios de aplicación

- **`app/home/apps-users/list/page.tsx`**: lista los usuarios de
  aplicación existentes en una tabla.
- **`app/home/apps-users/create/page.tsx`**: formulario para crear un
  nuevo usuario de aplicación.
- **`app/home/apps-users/assign-role/page.tsx`**: formulario para asignar
  un rol a un usuario de aplicación.
- **`app/home/apps-users/assign-application/page.tsx`**: formulario para
  asignar una aplicación a un usuario de aplicación.

### Usuarios internos

- **`app/home/internal-users/list/page.tsx`**: lista los usuarios internos
  existentes en una tabla.
- **`app/home/internal-users/create/page.tsx`**: formulario para crear un
  nuevo usuario interno.
- **`app/home/internal-users/assign-role/page.tsx`**: formulario para
  asignar un rol a un usuario interno.
- **`app/home/internal-users/assign-application/page.tsx`**: formulario
  para asignar una aplicación a un usuario interno.

## ¿Qué variables de entorno necesito?

### Variables para el pipeline de GitHub Actions

El único workflow del repositorio es
[`release-iam.yml`](.github/workflows/release-iam.yml). Usa tres secrets,
todos documentados en detalle en
[`obtain-secrets.md`](.github/workflows/obtain-secrets.md):

- **`DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN`**: credenciales de Docker Hub
  usadas para publicar la imagen de `iam` y, más adelante en el mismo
  workflow, para borrar los tags viejos tras cada release. `USERNAME` es
  la cuenta u organización de Docker Hub dueña del repositorio de
  imágenes; `TOKEN` es un access token de esa cuenta con permisos **Read,
  Write, Delete** (no alcanza con "Read & Write" porque también se usa
  para borrar tags). Ambos se generan desde Docker Hub, en Account
  Settings > Security.
- **`INFRA_HUB_DISPATCH_TOKEN`**: token fine-grained de GitHub usado para
  disparar el workflow de deploy en `infra-hub` y luego consultar el
  estado de esa corrida. Se genera como Personal Access Token
  fine-grained, con acceso solo al repositorio `infra-hub` y permisos
  `Actions: Read and write` + `Contents: Read-only`, y se guarda como
  secret en **este** repositorio (no en `infra-hub`).

### Variables para el funcionamiento de la app

El proyecto no tiene un archivo de validación de entorno dedicado: las
variables se leen directamente vía `process.env` dentro de los Route
Handlers (`app/api/**/route.ts`). Localmente se definen copiando
[`.env.example`](.env.example) a `.env`; en producción las define
directamente el manifiesto de despliegue en `infra-hub`
(`infra-hub/apps/iam/deployment.yaml`).

- **`AUTH_API_URL`**: URL base de `auth-api`, contra la que pegan todos
  los Route Handlers de `iam` para leer y escribir usuarios, roles y
  aplicaciones. En producción no es un secreto: se fija en
  `deployment.yaml` con el nombre DNS interno del cluster
  (`http://iam-api.iam-api.svc.cluster.local:3000`), porque `iam` corre
  como Pod en el mismo namespace que `iam-api`.
- **`IAM_APPLICATION_NAME`**: el nombre de aplicación que `auth-api`
  verifica contra la cuenta que inicia sesión en `iam` — debe coincidir
  con un registro existente en la tabla `applications` de `iam-api`. En
  producción viene de un Secret de Kubernetes (`iam-credentials`), creado
  a partir de `infra-hub/apps/iam/secret.example.yaml`; nunca se
  hardcodea.
- **`IAM_COOKIE_SECURE`**: controla si la cookie de sesión (`iam-token`)
  se marca como `secure` (solo viaja por HTTPS). En producción se fija en
  `"false"` directamente en `deployment.yaml`, porque hoy no hay
  Ingress/TLS configurado para esta app.

## ¿Cómo se ejecuta la app?

`iam` no se ejecuta desde una máquina local en producción: corre como Pod
en el cluster microk8s del servidor `pcbox`. Para desplegar una nueva
versión hay que ir a la pestaña Actions de este repositorio y ejecutar
manualmente el workflow **"Release iam"**
([`release-iam.yml`](.github/workflows/release-iam.yml), disparado por
`workflow_dispatch`), completando dos inputs:

- **`previous_stable_tag`** ("Tag that stays as the last known-good stable
  version"): el tag que se conserva como última versión estable conocida,
  por si hace falta volver atrás. El workflow valida que ese tag ya exista
  como git tag y como tag en Docker Hub.
- **`new_tag`** ("New version tag to build, publish, and deploy"): el tag
  de la nueva versión a construir, publicar y desplegar. El workflow
  valida que todavía no exista ni como git tag ni en Docker Hub.

Con esos dos valores, el workflow: valida los secrets y los tags
(`validate`); construye la imagen Docker, la publica en Docker Hub y crea
el git tag `new_tag` (`build-and-push`); pide aprobación manual del
ambiente `production` y, una vez aprobado, dispara (vía
`INFRA_HUB_DISPATCH_TOKEN`) el workflow `deploy-iam.yml` del repositorio
`infra-hub` — que es quien realmente aplica los manifiestos de Kubernetes
y actualiza el Deployment en el microk8s de `pcbox` con la nueva imagen —
y espera a que esa corrida termine (`approve-and-deploy`); y finalmente
borra en Docker Hub todos los tags de `iam` excepto `previous_stable_tag`
y `new_tag` (`cleanup-tags`). El repositorio `iam` nunca contiene
manifiestos de Kubernetes ni credenciales del cluster: esos viven
centralizados en `infra-hub`, bajo `apps/iam/`.
