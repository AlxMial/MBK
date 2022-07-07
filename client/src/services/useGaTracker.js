import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const useGaTracker = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!window.location.href.includes("mbk-whale.web.app")) {
        ReactGA.initialize("G-89M60GX4GB");
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
        ReactGA.pageview(location.pathname + location.search);
        }
    }, [initialized, location]);
};

export default useGaTracker;