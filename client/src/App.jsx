import { Toaster } from "react-hot-toast";
import { AppRoutes } from "@routes";
import { AuthProvider } from "@config";

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
