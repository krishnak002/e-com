export default function Toast({ message }) {
  return message ? <div className="toast-message">✓ {message}</div> : null;
}
