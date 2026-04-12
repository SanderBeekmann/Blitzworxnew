import type { AuditIssue } from './seo-checks';

export interface SecuritySignals {
  httpsEnabled: boolean;
  hsts: boolean;
  csp: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  referrerPolicy: boolean;
  permissionsPolicy: boolean;
}

export interface SecurityCheckResult {
  issues: AuditIssue[];
  signals: SecuritySignals;
  passedCount: number;
  totalChecks: number;
}

function addIssue(issues: AuditIssue[], title: string, description: string, score = 0.4) {
  issues.push({ title, description, score });
}

export function runSecurityChecks(headers: Headers | null, finalUrl: string): SecurityCheckResult {
  const issues: AuditIssue[] = [];
  const httpsEnabled = finalUrl.startsWith('https://');

  if (!httpsEnabled) {
    addIssue(
      issues,
      'Website draait niet op HTTPS',
      'Zonder HTTPS zien bezoekers een waarschuwing in hun browser. Google rankt HTTP sites lager en weigert sommige features.',
      0.1
    );
  }

  if (!headers) {
    return {
      issues,
      signals: {
        httpsEnabled,
        hsts: false,
        csp: false,
        xFrameOptions: false,
        xContentTypeOptions: false,
        referrerPolicy: false,
        permissionsPolicy: false,
      },
      passedCount: httpsEnabled ? 1 : 0,
      totalChecks: 7,
    };
  }

  const hsts = !!headers.get('strict-transport-security');
  if (!hsts && httpsEnabled) {
    addIssue(
      issues,
      'HSTS header ontbreekt',
      'Strict-Transport-Security forceert HTTPS voor toekomstige bezoeken. Zonder HSTS kunnen man-in-the-middle attacks je site downgraden naar HTTP.',
      0.5
    );
  }

  const cspHeader = headers.get('content-security-policy');
  const csp = !!cspHeader;
  if (!csp) {
    addIssue(
      issues,
      'Geen Content-Security-Policy header',
      'CSP beschermt je site tegen XSS-aanvallen door te definieren welke scripts en bronnen geladen mogen worden. Een van de belangrijkste moderne security headers.',
      0.4
    );
  }

  const xFrame = headers.get('x-frame-options');
  const hasFrameAncestors = cspHeader?.toLowerCase().includes('frame-ancestors') ?? false;
  const xFrameOptions = !!xFrame || hasFrameAncestors;
  if (!xFrameOptions) {
    addIssue(
      issues,
      'Geen clickjacking bescherming',
      'Zonder X-Frame-Options of CSP frame-ancestors kan je site in een iframe worden geladen door kwaadwillende partijen (clickjacking attack).',
      0.6
    );
  }

  const xContentTypeOptions = headers.get('x-content-type-options')?.toLowerCase() === 'nosniff';
  if (!xContentTypeOptions) {
    addIssue(
      issues,
      'X-Content-Type-Options: nosniff ontbreekt',
      'Deze header voorkomt dat browsers de content-type van bestanden "raden". Zonder deze header kunnen aanvallers proberen bestanden als iets anders uit te voeren.',
      0.6
    );
  }

  const referrerPolicy = !!headers.get('referrer-policy');
  if (!referrerPolicy) {
    addIssue(
      issues,
      'Geen Referrer-Policy ingesteld',
      'Referrer-Policy bepaalt welke info naar andere sites wordt gestuurd als een bezoeker op een link klikt. Belangrijk voor privacy van gebruikers.',
      0.7
    );
  }

  const permissionsPolicy = !!headers.get('permissions-policy') || !!headers.get('feature-policy');
  if (!permissionsPolicy) {
    addIssue(
      issues,
      'Geen Permissions-Policy header',
      'Permissions-Policy bepaalt welke browser-features je site mag gebruiken (camera, microfoon, geolocatie). Voorkomt misbruik als je site ooit gecompromitteerd raakt.',
      0.7
    );
  }

  const signals: SecuritySignals = {
    httpsEnabled,
    hsts,
    csp,
    xFrameOptions,
    xContentTypeOptions,
    referrerPolicy,
    permissionsPolicy,
  };

  const passedCount = Object.values(signals).filter(Boolean).length;

  return { issues, signals, passedCount, totalChecks: 7 };
}
