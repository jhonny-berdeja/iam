import { NextResponse, type NextRequest } from "next/server";

const REQUEST_TIMEOUT_MS = 10_000;

const BAD_REQUEST_STATUS = { status: 400 } as const;
const SERVICE_UNAVAILABLE_STATUS = { status: 500 } as const;

const API_URL_MISSING_MESSAGE = {
  message:
    "El servicio de usuarios de aplicación no está disponible en este momento.",
} as const;
const BACKEND_UNREACHABLE_MESSAGE = {
  message:
    "No se pudo conectar con el servicio de usuarios de aplicación. Intentá de nuevo.",
} as const;
const INVALID_BODY_MESSAGE = {
  message: "Cuerpo de la petición inválido.",
} as const;

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

  const apiResponse = await createAppUserInBackend(apiUrl, body);
  if (!apiResponse) {
    return NextResponse.json(
      BACKEND_UNREACHABLE_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  return forwardBackendResponse(apiResponse);
}

async function parseRequestBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    console.error("Failed to parse apps-users request body", error);
    return null;
  }
}

async function createAppUserInBackend(
  apiUrl: string,
  body: unknown,
): Promise<Response | null> {
  try {
    return await fetch(`${apiUrl}/apps-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error(
      "Failed to reach auth-api to create an application user",
      error,
    );
    return null;
  }
}

async function forwardBackendResponse(
  apiResponse: Response,
): Promise<NextResponse> {
  const body: unknown = await apiResponse.json().catch(() => null);
  return NextResponse.json(body, { status: apiResponse.status });
}
