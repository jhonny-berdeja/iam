import { NextResponse, type NextRequest } from "next/server";

const REQUEST_TIMEOUT_MS = 10_000;

const CREATED_STATUS = { status: 201 } as const;
const BAD_REQUEST_STATUS = { status: 400 } as const;
const NOT_FOUND_STATUS = { status: 404 } as const;
const SERVICE_UNAVAILABLE_STATUS = { status: 500 } as const;

const API_URL_MISSING_MESSAGE = {
  message: "El servicio de roles no está disponible en este momento.",
} as const;
const BACKEND_UNREACHABLE_MESSAGE = {
  message: "No se pudo conectar con el servicio de roles. Intentá de nuevo.",
} as const;
const INVALID_BODY_MESSAGE = {
  message: "Cuerpo de la petición inválido.",
} as const;
const APPLICATION_NOT_FOUND_MESSAGE = {
  message: "La aplicación seleccionada no existe.",
} as const;
const BACKEND_ERROR_MESSAGE = {
  message: "El servicio de roles tuvo un problema. Intentá de nuevo.",
} as const;
const MISSING_APPLICATION_ID_MESSAGE = {
  message: "Falta indicar la aplicación.",
} as const;

export async function GET(request: NextRequest) {
  const apiUrl = process.env.AUTH_API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      API_URL_MISSING_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  const applicationId = request.nextUrl.searchParams.get("applicationId");
  if (!applicationId) {
    return NextResponse.json(
      MISSING_APPLICATION_ID_MESSAGE,
      BAD_REQUEST_STATUS,
    );
  }

  const apiResponse = await listRolesFromBackend(apiUrl, applicationId);
  if (!apiResponse) {
    return NextResponse.json(
      BACKEND_UNREACHABLE_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  if (isApplicationNotFound(apiResponse)) {
    return NextResponse.json(APPLICATION_NOT_FOUND_MESSAGE, NOT_FOUND_STATUS);
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

  const apiResponse = await createRoleInBackend(apiUrl, body);
  if (!apiResponse) {
    return NextResponse.json(
      BACKEND_UNREACHABLE_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  if (isApplicationNotFound(apiResponse)) {
    return NextResponse.json(APPLICATION_NOT_FOUND_MESSAGE, NOT_FOUND_STATUS);
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
    console.error("Failed to parse roles request body", error);
    return null;
  }
}

async function createRoleInBackend(
  apiUrl: string,
  body: unknown,
): Promise<Response | null> {
  try {
    return await fetch(`${apiUrl}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Failed to reach auth-api to create a role", error);
    return null;
  }
}

async function listRolesFromBackend(
  apiUrl: string,
  applicationId: string,
): Promise<Response | null> {
  try {
    return await fetch(
      `${apiUrl}/roles?applicationId=${encodeURIComponent(applicationId)}`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
    );
  } catch (error) {
    console.error("Failed to reach auth-api for the role list", error);
    return null;
  }
}

async function forwardBackendResponse(
  apiResponse: Response,
): Promise<NextResponse> {
  const body: unknown = await apiResponse.json().catch(() => null);
  return NextResponse.json(body, { status: apiResponse.status });
}

function isApplicationNotFound(apiResponse: Response): boolean {
  return apiResponse.status === 404;
}

function isClientError(apiResponse: Response): boolean {
  return apiResponse.status >= 400 && apiResponse.status < 500;
}

function isServerError(apiResponse: Response): boolean {
  return apiResponse.status >= 500;
}
