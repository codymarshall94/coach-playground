// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";

// type UserContextType = {
//   user: any;
//   loading: boolean;
//   refreshUser: () => Promise<void>;
// };

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const supabase = createClient();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const refreshUser = async () => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     setUser(user ?? null);
//   };

//   useEffect(() => {
//     // Initial load
//     refreshUser().finally(() => setLoading(false));

//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//       }
//     );

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, loading, refreshUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUserContext() {
//   const context = useContext(UserContext);
//   if (!context)
//     throw new Error("useUserContext must be used within a UserProvider");
//   return context;
// }
