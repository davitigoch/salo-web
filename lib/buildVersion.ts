export const SALO_WEB_BUILD_VERSION =
  process.env.NEXT_PUBLIC_SALO_WEB_BUILD_VERSION || 'dev';

export function logSaloWebBuildVersion() {
  console.log('[SALO WEB] build version', SALO_WEB_BUILD_VERSION);
}
