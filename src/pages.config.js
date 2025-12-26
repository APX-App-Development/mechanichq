import Home from './pages/Home';
import MyGarage from './pages/MyGarage';
import MyJobs from './pages/MyJobs';
import PartsCatalog from './pages/PartsCatalog';
import PartsList from './pages/PartsList';
import SavedParts from './pages/SavedParts';
import SearchHistory from './pages/SearchHistory';
import SearchResults from './pages/SearchResults';
import DevPanel from './pages/DevPanel';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "MyGarage": MyGarage,
    "MyJobs": MyJobs,
    "PartsCatalog": PartsCatalog,
    "PartsList": PartsList,
    "SavedParts": SavedParts,
    "SearchHistory": SearchHistory,
    "SearchResults": SearchResults,
    "DevPanel": DevPanel,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};