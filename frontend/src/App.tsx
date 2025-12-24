import { HeaderComponent } from "./components/header/HeaderComponent";
import { FormPage } from "./page/FormPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent />
      <FormPage />
      <Toaster />
    </div>
  );
}

export default App;
