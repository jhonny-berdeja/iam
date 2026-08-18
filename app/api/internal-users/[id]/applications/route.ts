import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "iam-token";
const REQUEST_TIMEOUT_MS = 10_000;

const CREATED_STATUS = { status: 201 } as const;
const BAD_REQUEST_STATUS = { status: 400 } as const;
const UNAUTHENTICATED_STATUS = { status: 401 } as const;
const NOT_FOUND_STATUS = { status: 404 } as const;
const CONFLICT_STATUS = { status: 409 } as const;
const SERVICE_UNAVAILABLE_STATUS = { status: 500 } as const;

const NOT_AUTHENTICATED_MESSAGE = {
  message: "No autenticado.",
} as const;
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
const NOT_FOUND_MESSAGE = {
  message: "El usuario interno o la aplicación seleccionada no existen.",
} as const;
const ALREADY_ASSIGNED_MESSAGE = {
  message: "Esa aplicación ya está asignada a este usuario.",
} as const;
const BACKEND_ERROR_MESSAGE = {
  message: "El servicio de usuarios internos tuvo un problema. Intentá de nuevo.",
} as const;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const apiUrl = process.env.AUTH_API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      API_URL_MISSING_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  const token = await readAuthToken();
  if (!token) {
    return NextResponse.json(NOT_AUTHENTICATED_MESSAGE, UNAUTHENTICATED_STATUS);
  }

  const { id } = await params;

  const body = await parseRequestBody(request);
  if (!body) {
    return NextResponse.json(INVALID_BODY_MESSAGE, BAD_REQUEST_STATUS);
  }

  const apiResponse = await assignApplicationInBackend(apiUrl, token, id, body);
  if (!apiResponse) {
    return NextResponse.json(
      BACKEND_UNREACHABLE_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  if (isNotFound(apiResponse)) {
    return NextResponse.json(NOT_FOUND_MESSAGE, NOT_FOUND_STATUS);
  }

  if (isConflict(apiResponse)) {
    return NextResponse.json(ALREADY_ASSIGNED_MESSAGE, CONFLICT_STATUS);
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
    console.error(
      "Failed to parse internal-users application assignment request body",
      error,
    );
    return null;
  }
}

async function readAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

async function assignApplicationInBackend(
  apiUrl: string,
  token: string,
  internalUserId: string,
  body: unknown,
): Promise<Response | null> {
  try {
    return await fetch(
      `${apiUrl}/internal-users/${internalUserId}/applications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );
  } catch (error) {
    console.error(
      "Failed to reach auth-api to assign an application to an internal user",
      error,
    );
    return null;
  }
}

function isNotFound(apiResponse: Response): boolean {
  return apiResponse.status === 404;
}

function isConflict(apiResponse: Response): boolean {
  return apiResponse.status === 409;
}

function isClientError(apiResponse: Response): boolean {
  return apiResponse.status >= 400 && apiResponse.status < 500;
}

function isServerError(apiResponse: Response): boolean {
  return apiResponse.status >= 500;
}
