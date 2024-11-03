import { createContext, useState, ReactNode } from 'react';

// Define the types for the context value
interface GlobalContextType {
  emailAddressGlobal: string | null;
  setEmailAddressGlobal: React.Dispatch<React.SetStateAction<string | null>>;
 
}

// Create the context with a default value
export const GlobalContext = createContext<GlobalContextType>({
  emailAddressGlobal: null,
  setEmailAddressGlobal: () => {},
 
});

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [emailAddressGlobal, setEmailAddressGlobal] = useState<string | null>(null);
  

  return (
    <GlobalContext.Provider value={{ emailAddressGlobal, setEmailAddressGlobal}}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
