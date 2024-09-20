import { useState, useEffect } from "react";

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        if(mediaQuery.matches !== matches) {
            setMatches(mediaQuery.matches);
        }

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        mediaQuery.addEventListener("change", listener);

        return () => mediaQuery.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}