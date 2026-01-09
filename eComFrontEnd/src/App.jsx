import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import ProtectedRoute from "./pages/routes/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import OrderPage from "./pages/OrderPage.jsx"
import Login from "./pages/Login";
import TenantManageProducts from "./pages/tenant/TenantManageProducts";
import AdminTenants from "./pages/admin/AdminTenants";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />}/>
        <Route path="/order" element={<OrderPage />} />
        <Route path="/admin" element={ <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
          </ProtectedRoute>
        }
        />

        <Route path="/admin/tenants"
          element={ 
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTenants />
            </ProtectedRoute>
        }
        />

        <Route path="/tenant"
          element={
            <ProtectedRoute allowedRoles={["tenant"]}>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/:tenant/cart"
          element={
            <ProtectedRoute allowedRoles={["user", "tenant"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route path="/:tenant/products"
          element={
            <ProtectedRoute allowedRoles={["user", "tenant", "admin"]}>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route path="/:tenant/manage/products"
          element={
            <ProtectedRoute allowedRoles={["tenant"]}>
              <TenantManageProducts />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Pagenotfound />} />

        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;