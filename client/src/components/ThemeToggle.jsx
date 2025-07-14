import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function ThemeToggle(){
    const [dark, setDark] = useState (
        () => localStorage.getItem("theme") === "dark"// we see the state ofthe browser//"Was the last saved theme 'dark'? If yes, set dark to true, else false."
    );


    useEffect(() => {
        const root = window.document.documentElement;//This gets a reference to the <html> element of the page.

        if(dark){///if dark is true
            root.classList.add("dark");///Adds the class "dark" to the <html> element, enabling Tailwind's dark mode styles.
            localStorage.setItem("theme", "dark");//Saves "dark" in the browser's localStorage so the theme preference is remembered even after refreshing or reopening the browser.
        } else{
            root.classList.remove("dark"); //Removes the "dark" class from <html>, switching back to light mode
            localStorage.setItem("theme", "light");//sets light theme
        }
    }, [dark]);//triggerse when you mount dark theme//"Only run this effect if the value of dark has changed since last time."


    return(
        <Button variant="ghost" size="icon" aria-label="toggle theme" onClick={() => setDark(!dark)}>
            {/* default of dark theme above */}
            {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
    )
}