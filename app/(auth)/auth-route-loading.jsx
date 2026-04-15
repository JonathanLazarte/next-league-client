/**
 * Pantalla de carga para rutas bajo (auth).
 * El archivo debe existir en: public/LOADING.webm
 */
export default function AuthRouteLoading() {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-black">
      <video
        src="/LOADING.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="max-h-[min(90vh,720px)] w-auto max-w-[min(100%,420px)] object-contain"
        aria-label="Cargando"
      />
    </div>
  );
}
