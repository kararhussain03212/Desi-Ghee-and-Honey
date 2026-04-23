import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProductList from "./pages/product/ProductList";
import ProductForm from "./pages/product/ProductForm";
import ServiceList from "./pages/service/ServiceList";
import ServiceForm from "./pages/service/ServiceForm";
import SliderList from "./pages/slider/SliderList";
import SliderForm from "./pages/slider/SliderForm";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  const basename =
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin")
      ? "/admin"
      : undefined;

  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedPage>
                <ProductList />
              </ProtectedPage>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedPage>
                <ProductForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedPage>
                <ProductForm />
              </ProtectedPage>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedPage>
                <ServiceList />
              </ProtectedPage>
            }
          />
          <Route
            path="/services/new"
            element={
              <ProtectedPage>
                <ServiceForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/services/edit/:id"
            element={
              <ProtectedPage>
                <ServiceForm />
              </ProtectedPage>
            }
          />

          <Route
            path="/sliders"
            element={
              <ProtectedPage>
                <SliderList />
              </ProtectedPage>
            }
          />
          <Route
            path="/sliders/new"
            element={
              <ProtectedPage>
                <SliderForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/sliders/edit/:id"
            element={
              <ProtectedPage>
                <SliderForm />
              </ProtectedPage>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Admin />
              </ProtectedPage>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
