import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import MyGarage from './pages/MyGarage';
import SavedParts from './pages/SavedParts';
import SearchHistory from './pages/SearchHistory';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SearchResults": SearchResults,
    "MyGarage": MyGarage,
    "SavedParts": SavedParts,
    "SearchHistory": SearchHistory,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};