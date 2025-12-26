import DevPanel from './pages/DevPanel';
import Home from './pages/Home';
import MyGarage from './pages/MyGarage';
import MyJobs from './pages/MyJobs';
import PartsCatalog from './pages/PartsCatalog';
import PartsList from './pages/PartsList';
import SavedParts from './pages/SavedParts';
import SearchHistory from './pages/SearchHistory';
import SearchResults from './pages/SearchResults';
import AffiliateStats from './pages/AffiliateStats';
import __Layout from './Layout.jsx';


export const PAGES = {
    "DevPanel": DevPanel,
    "Home": Home,
    "MyGarage": MyGarage,
    "MyJobs": MyJobs,
    "PartsCatalog": PartsCatalog,
    "PartsList": PartsList,
    "SavedParts": SavedParts,
    "SearchHistory": SearchHistory,
    "SearchResults": SearchResults,
    "AffiliateStats": AffiliateStats,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};