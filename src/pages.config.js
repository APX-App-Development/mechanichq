import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import MyGarage from './pages/MyGarage';
import SavedParts from './pages/SavedParts';
import SearchHistory from './pages/SearchHistory';
import MyJobs from './pages/MyJobs';
import PartsList from './pages/PartsList';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SearchResults": SearchResults,
    "MyGarage": MyGarage,
    "SavedParts": SavedParts,
    "SearchHistory": SearchHistory,
    "MyJobs": MyJobs,
    "PartsList": PartsList,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};