import { Toaster } from "react-hot-toast";
import { Paths } from "./routes";
import { AuthProvider } from "./config/contextStore";

function App() {
  return (
    <>
      <AuthProvider>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Paths />
      </AuthProvider>
    </>
  );
}

export default App;
