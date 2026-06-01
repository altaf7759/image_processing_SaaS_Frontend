import {
      createContext,
      useContext,
      useEffect,
      useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
      const [user, setUser] = useState(null);

      useEffect(() => {
            const savedUser =
                  localStorage.getItem("user");

            if (savedUser) {
                  setUser(JSON.parse(savedUser));
            }
      }, []);

      return (
            <AuthContext.Provider
                  value={{
                        user,
                        setUser
                  }}
            >
                  {children}
            </AuthContext.Provider>
      );
}

export function useAuth() {
      return useContext(AuthContext);
}