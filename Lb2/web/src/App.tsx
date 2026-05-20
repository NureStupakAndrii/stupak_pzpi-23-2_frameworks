import type { ReactElement } from "react";
import { AuthProvider } from "./components/AuthProvider";
import { AppRouter } from "./components/Router";

function App(): ReactElement {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
