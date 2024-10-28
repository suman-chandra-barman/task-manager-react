import React from "react";

export const themes = {
    light: {
        foreground: "#000",
        background: "#fff"
    },
    dark: {
        foreground: "#fff",
        background: "#000"
    }
};

export const ThemeContext = React.createContext(themes);