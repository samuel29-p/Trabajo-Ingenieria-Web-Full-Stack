//indicador de carga que se muestra mientras llega la respuesta del backend
function Loading({ texto }) {
  return (
    <div className="flex items-center gap-3 py-8 text-app-muted">
      <span className="w-5 h-5 border-2 border-ember-accent border-t-transparent rounded-pill animate-spin"></span>
      <p>{texto || "Loading..."}</p>
    </div>
  );
}

export default Loading;
