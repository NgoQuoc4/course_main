import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import MainContextProvider from "./context/MainContext";
import AppRoutes from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tránh refetch lại mỗi khi focus trình duyệt
      retry: 1, // Số lần thử lại nếu API lỗi
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainContextProvider>
          <AuthContextProvider>
            <AppRoutes />
          </AuthContextProvider>
        </MainContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
