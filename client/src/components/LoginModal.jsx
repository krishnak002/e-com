import { useState } from "react";

export default function LoginModal({ open, close, authenticate }) {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      await authenticate(mode, data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to connect to the server",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="login-modal">
        <div className="login-side">
          <h2>{mode === "login" ? "Login" : "Register"}</h2>
          <p>Access your orders, wishlist and recommendations.</p>
          <span>🛍️</span>
        </div>
        <form onSubmit={submit}>
          <button type="button" className="close" onClick={close}>
            ×
          </button>
          <h3>{mode === "login" ? "Welcome back" : "Create your account"}</h3>
          {mode === "register" && (
            <label>
              Your name
              <input name="name" required placeholder="Enter your name" />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              minLength="8"
              required
              placeholder="Minimum 8 characters"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="login-submit" disabled={loading}>
            {loading
              ? "PLEASE WAIT..."
              : mode === "login"
                ? "LOGIN"
                : "REGISTER"}
          </button>
          <button
            type="button"
            className="auth-switch btn btn-link"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login"
              ? "New here? Create an account"
              : "Already registered? Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
