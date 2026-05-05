// Nuclear-Kill-Switch: Wenn die zuletzt beobachtete Build-ID sich
// geändert hat, alte Service-Worker + Caches einmalig löschen.
// Nur bei tatsächlichem Versionswechsel — kein Effekt im Steady-State.
// Liegt als externe Datei vor, damit CSP ohne 'unsafe-inline' für script-src auskommt.
(function () {
  try {
    var meta = document.querySelector('meta[name="app-build-id"]');
    var current = meta && meta.getAttribute('content');
    if (!current || current === '__BUILD_ID__') return;
    var KEY = 'app_build_id';
    var last = localStorage.getItem(KEY);
    if (last === current) return;
    localStorage.setItem(KEY, current);
    if (last !== null && 'caches' in window) {
      caches.keys().then(function (names) {
        names.forEach(function (n) { caches.delete(n); });
      });
    }
  } catch (e) { /* niemals Boot blockieren */ }
})();
