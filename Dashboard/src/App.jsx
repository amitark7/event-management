import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Fund from "./pages/Fund";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      localStorage.setItem("auth", JSON.stringify(currentUser));
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route for Login */}

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="members" element={<Members />} />
          <Route path="funds" element={<Fund />} />
          <Route path="expenses" element={<Expense />} />
        </Route>
        <Route
          path="login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
