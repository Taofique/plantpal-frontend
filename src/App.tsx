import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import AuthRoutes from "./routes/AuthRoutes";

function RouterSelector() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return token ? <AppRoutes /> : <AuthRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="min-h-screen">
          <RouterSelector />
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
