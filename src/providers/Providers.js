import React from "react";
import { AuthProvider } from "./AuthProvider";
import { DeductionProvider } from './DeductionProvider';
import { BudgetProvider } from './BudgetProvider';
import Routes  from "./Routes";
import firebase from '../../firebase';
import { initializeApp } from 'firebase/app';

initializeApp(firebase);

export const Providers = () => {
    return (
        <AuthProvider>
            <BudgetProvider>
                <DeductionProvider>
                    <Routes />
                </DeductionProvider>
            </BudgetProvider>
        </AuthProvider>
    );
};
