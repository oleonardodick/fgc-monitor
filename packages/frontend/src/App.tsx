import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.js";
import { router } from "./routes/index.js";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
