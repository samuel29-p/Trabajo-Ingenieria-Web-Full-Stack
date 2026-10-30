//caja roja con el mensaje de error, si no hay mensaje no dibuja nada
function ErrorMessage({ mensaje }) {
  if (!mensaje) return null;
  return (
    <div className="bg-blood-soft border border-blood-accent text-blood-accent rounded-button px-4 py-3 my-3">
      <p>{mensaje}</p>
    </div>
  );
}

export default ErrorMessage;
