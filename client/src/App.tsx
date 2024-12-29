import { HashRouter as Router, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthPage from "./pages/AuthPage";
import ProtectedPage from "./pages/ProtectedPage";

function App() {
  return (
    <Router>
      <AuthPage>
        <Routes>
          <Route path='/' element={(
            <ProtectedPage>
              <ChatPage/>
            </ProtectedPage>
          )}/>
          <Route path='login' element={<LoginPage/>}/>
          <Route path='signup' element={<SignUpPage/>}/>
        </Routes>
      </AuthPage>
    </Router>
  );
}

export default App;
