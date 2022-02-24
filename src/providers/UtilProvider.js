import {createContext, useState} from 'react'

export const UtilContext = createContext();

export const UtilProvider = ({children}) => {
    const [bottomSheet, setBottomSheet] = useState(false);

    const closeTheSheet = () => {
        setBottomSheet(false)
    }
    return (
        <UtilContext.Provider value={closeTheSheet, bottomSheet}>
            {children}
        </UtilContext.Provider>
    )
}