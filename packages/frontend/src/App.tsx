import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.js";
import { router } from "./routes/index.js";

export default function App() {
  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-6">
        <RouterProvider router={router} />
      </main>
    </AuthProvider>
  );
}
