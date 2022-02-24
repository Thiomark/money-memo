import React from "react";
import { AuthProvider } from "./AuthProvider";
import { DeductionProvider } from './DeductionProvider';
import { BudgetProvider } from './BudgetProvider';
import Routes  from "./Routes";

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
