import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "iam-token";
const REQUEST_TIMEOUT_MS = 10_000;

const BAD_REQUEST_STATUS = { status: 400 } as const;
const UNAUTHENTICATED_STATUS = { status: 401 } as const;
const SERVICE_UNAVAILABLE_STATUS = { status: 500 } as const;

const API_URL_MISSING_MESSAGE = {
  message: "El servicio de aplicaciones no está disponible en este momento.",
} as const;
const NOT_AUTHENTICATED_MESSAGE = {
  message: "No autenticado.",
} as const;
const BACKEND_UNREACHABLE_MESSAGE = {
  message:
    "No se pudo conectar con el servicio de aplicaciones. Intentá de nuevo.",
} as const;
const INVALID_BODY_MESSAGE = {
  message: "Cuerpo de la petición inválido.",
} as const;

export async function GET() {
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

  const apiResponse = await listApplicationsFromBackend(apiUrl, token);
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

  const token = await readAuthToken();
  if (!token) {
    return NextResponse.json(NOT_AUTHENTICATED_MESSAGE, UNAUTHENTICATED_STATUS);
  }

  const body = await parseRequestBody(request);
  if (!body) {
    return NextResponse.json(INVALID_BODY_MESSAGE, BAD_REQUEST_STATUS);
  }

  const apiResponse = await createApplicationInBackend(apiUrl, token, body);
  if (!apiResponse) {
    return NextResponse.json(
      BACKEND_UNREACHABLE_MESSAGE,
      SERVICE_UNAVAILABLE_STATUS,
    );
  }

  return forwardBackendResponse(apiResponse);
}

async function readAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

async function parseRequestBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    console.error("Failed to parse applications request body", error);
    return null;
  }
}

async function listApplicationsFromBackend(
  apiUrl: string,
  token: string,
): Promise<Response | null> {
  try {
    return await fetch(`${apiUrl}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Failed to reach auth-api for the application list", error);
    return null;
  }
}

async function createApplicationInBackend(
  apiUrl: string,
  token: string,
  body: unknown,
): Promise<Response | null> {
  try {
    return await fetch(`${apiUrl}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Failed to reach auth-api to create an application", error);
    return null;
  }
}

async function forwardBackendResponse(
  apiResponse: Response,
): Promise<NextResponse> {
  const body: unknown = await apiResponse.json().catch(() => null);
  return NextResponse.json(body, { status: apiResponse.status });
}
