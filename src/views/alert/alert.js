import React, { createContext, useContext } from 'react';
import Swal from 'sweetalert2';

const AlertContext = createContext();

export const useAlert = () => {
    return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
    const showAlert = (title, text, icon, redirectTo) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        }).then(() => {
            if (redirectTo) {
                window.location.href = redirectTo;
            }
        });
    };

    return (
        <AlertContext.Provider value={showAlert}>
            {children}
        </AlertContext.Provider>
    );
};
