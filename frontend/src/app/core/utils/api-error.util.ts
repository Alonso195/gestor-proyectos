import { HttpErrorResponse } from '@angular/common/http';

/**
 * Recolecta todos los mensajes útiles del cuerpo de error HTTP (API propia, ProblemDetails, validación MVC).
 */
export function collectApiErrorMessages(err: HttpErrorResponse): string[] {
  const out: string[] = [];
  const body = err.error;

  const push = (msg: string | null | undefined) => {
    const t = (msg ?? '').trim();
    if (t && !out.includes(t)) out.push(t);
  };

  if (body == null || body === '') {
    push(err.message);
    return out.length ? out : ['No se recibió detalle del error.'];
  }

  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as Record<string, unknown>;
      collectFromObject(parsed, push);
    } catch {
      push(body);
    }
    if (!out.length) push(err.message);
    return out.length ? out : ['Error desconocido.'];
  }

  if (typeof body === 'object') {
    collectFromObject(body as Record<string, unknown>, push);
  }

  if (!out.length) push(err.message);
  return out.length ? out : ['Error desconocido.'];
}

function collectFromObject(o: Record<string, unknown>, push: (msg: string | null | undefined) => void): void {
  const msg = o['message'] ?? o['Message'];
  if (typeof msg === 'string') push(msg);

  const title = o['title'] ?? o['Title'];
  if (typeof title === 'string') push(title);

  const detail = o['detail'] ?? o['Detail'];
  if (typeof detail === 'string') push(detail);

  const errors = o['errors'] ?? o['Errors'];
  if (errors != null && typeof errors === 'object' && !Array.isArray(errors)) {
    for (const val of Object.values(errors as Record<string, unknown>)) {
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string') push(item);
        }
      } else if (typeof val === 'string') {
        push(val);
      }
    }
  }
}

/** Une mensajes para mostrar en UI (cada uno en su línea). */
export function formatApiErrorMessages(messages: string[]): string {
  return messages.filter(Boolean).join('\n');
}

/** Texto listo para snackbar / banner a partir de HttpErrorResponse. */
export function formatHttpApiError(err: HttpErrorResponse): string {
  return formatApiErrorMessages(collectApiErrorMessages(err));
}
