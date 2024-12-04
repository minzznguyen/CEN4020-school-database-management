import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';

// Create the context
const UserContext = createContext();

// UserProvider component to wrap your app and provide user context
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? user : null); // Set the user when authentication state changes
        });

        return () => unsubscribe(); // Clean up when the component unmounts
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use user context
export const useUser = () => useContext(UserContext);
