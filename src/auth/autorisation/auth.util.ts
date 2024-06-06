// auth.util.ts
export const hasAdmin = (user: any): boolean => {
    // Vérifie si l'utilisateur existe et a le rôle d'administrateur
    return user && user.role === 'admin';
  };
  
  export const hasUser = (user: any): boolean => {
    // Vérifie si l'utilisateur existe et a le rôle d'utilisateur
    return user && user.role === 'user';
  };
  