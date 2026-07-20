export default function Header({
  query,
  setQuery,
  user,
  count,
  openLogin,
  openCart,
  openAdmin,
  logout,
}) {
  return (
    <div className="container">
      <header
        className="topbar justify-content-center"
        aria-label="Top navigation bar"
      >
        <a className="brand" href="#top">
          <span>Shop</span>Kart<small>Explore Plus ✦</small>
        </a>
        <div className="search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Products, Brands and More"
          />
        </div>
        {!user && (
          <button className="header-btn" onClick={openLogin}>
            👤 Login
          </button>
        )}
        {user && (
          <button
            className="header-btn"
            onClick={user.role === "admin" ? openAdmin : undefined}
          >
            👤 {user.name}
            {user.role === "admin" ? " · Dashboard" : ""}
          </button>
        )}
        {user && (
          <button className="header-btn" onClick={logout}>
            Logout
          </button>
        )}
        {user?.role !== "admin" && (
          <button className="header-btn" onClick={openCart}>
            🛒 Cart {count > 0 && <b>{count}</b>}
          </button>
        )}
      </header>
    </div>
  );
}
