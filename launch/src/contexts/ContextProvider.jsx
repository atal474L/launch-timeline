import { createContext, useContext, useState } from "react";

// de lege waarden zijn voor autocomlationa als constructur
const StateContext = createContext({
  currentUser: {},
  userToken: null,
  setCurrentUser: () => {},
  setUserToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
  });
  const [userToken, setUserToken] = useState("hh");

  return (
    // de tweede {} geeft aan dat dit een object is bij value
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const userStateContext = () => useContext(StateContext);
