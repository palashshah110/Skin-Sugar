import { useContext, useEffect } from "react";
import { AppContext } from "../../App";

export default function ScrollToTop() {
  const { currentPage } = useContext(AppContext);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  return null;
}