import { createContext, useState } from "react";
const ResultsContext = createContext();

const ResultsContextProvider = ({ children }) => {
    const [results, setResults] = useState([]);
    return (
        <ResultsContext.Provider value={{ results, setResults }}>
            {children}
        </ResultsContext.Provider>
    );
}

export { ResultsContext, ResultsContextProvider };