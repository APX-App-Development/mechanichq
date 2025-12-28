import AffiliateStats from './pages/AffiliateStats';
import DevPanel from './pages/DevPanel';
import Home from './pages/Home';
import MyGarage from './pages/MyGarage';
import MyJobs from './pages/MyJobs';
import PartsList from './pages/PartsList';
import SavedParts from './pages/SavedParts';
import SearchHistory from './pages/SearchHistory';
import PartsCatalog from './pages/PartsCatalog';
import SearchResults from './pages/SearchResults';
import QuickJobs from './pages/QuickJobs';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AffiliateStats": AffiliateStats,
    "DevPanel": DevPanel,
    "Home": Home,
    "MyGarage": MyGarage,
    "MyJobs": MyJobs,
    "PartsList": PartsList,
    "SavedParts": SavedParts,
    "SearchHistory": SearchHistory,
    "PartsCatalog": PartsCatalog,
    "SearchResults": SearchResults,
    "QuickJobs": QuickJobs,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};