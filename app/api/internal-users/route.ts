import { NextResponse, type NextRequest } from "next/server";

const REQUEST_TIMEOUT_MS = 10_000;

const CREATED_STATUS = { status: 201 } as const;
const BAD_REQUEST_STATUS = { status: 400 } as const;
const CONFLICT_STATUS = { status: 409 } as const;
const SERVICE_UNAVAILABLE_STATUS = { status: 500 } as const;

const API_URL_MISSING_MESSAGE = {
  message:
    "El servicio de usuarios internos no está disponible en este momento.",
} as const;
const BACKEND_UNREACHABLE_MESSAGE = {
  message:
    "No se pudo conectar con el servicio de usuarios internos. Intentá de nuevo.",
} as const;
const INVALID_BODY_MESSAGE = {
  message: "Cuerpo de la petición inválido.",
} as const;
const EMAIL_ALREADY_IN_USE_MESSAGE = {
  message: "Ya existe un usuario interno con ese email.",
} as const;
const BACKEND_ERROR_MESSAGE = {
  message: "El servicio de usuarios internos tuvo un problema. Intentá de nuevo.",
} as const;

/** GET /internal-users returns a plain array (unwrapped), unlike applications/apps-users/roles -- forwarded as-is. */
export async function GET() {
  const apiUrl = process.env.AUTH_API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      API_URL_MISSING_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  const apiResponse = await listInternalUsersFromBackend(apiUrl);
  if (!apiResponse) {
    return NextResponse.json(
      BACKEND_UNREACHABLE_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  return forwardBackendResponse(apiResponse);
}

export async function POST(request: NextRequest) {
  const apiUrl = process.env.AUTH_API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      API_URL_MISSING_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  const body = await parseRequestBody(request);
  if (!body) {
    return NextResponse.json(INVALID_BODY_MESSAGE, BAD_REQUEST_STATUS);
  }

  const apiResponse = await createInternalUserInBackend(apiUrl, body);
  if (!apiResponse) {
    return NextResponse.json(
      BACKEND_UNREACHABLE_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  if (isEmailConflict(apiResponse)) {
    return NextResponse.json(EMAIL_ALREADY_IN_USE_MESSAGE, CONFLICT_STATUS);
  }

  if (isClientError(apiResponse)) {
    return NextResponse.json(INVALID_BODY_MESSAGE, BAD_REQUEST_STATUS);
  }

  if (isServerError(apiResponse)) {
    return NextResponse.json(
      BACKEND_ERROR_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  const responseBody: unknown = await apiResponse.json().catch(() => null);
  return NextResponse.json(responseBody, CREATED_STATUS);
}

async function parseRequestBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    console.error("Failed to parse internal-users request body", error);
    return null;
  }
}

async function listInternalUsersFromBackend(
  apiUrl: string,
): Promise<Response | null> {
  try {
    return await fetch(`${apiUrl}/internal-users`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error(
      "Failed to reach auth-api for the internal user list",
      error,
    );
    return null;
  }
}

async function createInternalUserInBackend(
  apiUrl: string,
  body: unknown,
): Promise<Response | null> {
  try {
    return await fetch(`${apiUrl}/internal-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error(
      "Failed to reach auth-api to create an internal user",
      error,
    );
    return null;
  }
}

function isEmailConflict(apiResponse: Response): boolean {
  return apiResponse.status === 409;
}

function isClientError(apiResponse: Response): boolean {
  return apiResponse.status >= 400 && apiResponse.status < 500;
}

function isServerError(apiResponse: Response): boolean {
  return apiResponse.status >= 500;
}

async function forwardBackendResponse(
  apiResponse: Response,
): Promise<NextResponse> {
  const body: unknown = await apiResponse.json().catch(() => null);
  return NextResponse.json(body, { status: apiResponse.status });
}
