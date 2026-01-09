import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

const Layout = ({ children }) => {
  const { keycloak } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="font-bold text-xl">E-Commerce</h1>

        <div className="space-x-4">
          <Link to="/user" className="text-blue-600">
            Home
          </Link>

          <button
            onClick={() => keycloak.logout()}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
