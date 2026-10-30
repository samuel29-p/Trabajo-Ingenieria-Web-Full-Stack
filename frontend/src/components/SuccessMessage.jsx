//caja verde para avisar que algo salio bien, si no hay mensaje no dibuja nada
function SuccessMessage({ mensaje }) {
  if (!mensaje) return null;
  return (
    <div className="bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-button px-4 py-3 my-3">
      <p>{mensaje}</p>
    </div>
  );
}

export default SuccessMessage;
