import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides access to auth context with additional helpers
 */
export const useAuth = () => {
  const auth = useAuthContext();

  return {
    ...auth,
    // Aliases for common checks
    isLoggedIn: auth.isAuthenticated,
    currentUser: auth.user,
    // Additional helpers
    hasRole: (role) => auth.user?.role === role,
    isGuest: !auth.user,
  };
};

export default useAuth;