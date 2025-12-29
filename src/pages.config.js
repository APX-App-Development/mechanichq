import AffiliateStats from './pages/AffiliateStats';
import DevPanel from './pages/DevPanel';
import Home from './pages/Home';
import MyGarage from './pages/MyGarage';
import MyJobs from './pages/MyJobs';
import PartsCatalog from './pages/PartsCatalog';
import PartsList from './pages/PartsList';
import Profile from './pages/Profile';
import QuickJobs from './pages/QuickJobs';
import SavedParts from './pages/SavedParts';
import SearchHistory from './pages/SearchHistory';
import SearchResults from './pages/SearchResults';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AffiliateStats": AffiliateStats,
    "DevPanel": DevPanel,
    "Home": Home,
    "MyGarage": MyGarage,
    "MyJobs": MyJobs,
    "PartsCatalog": PartsCatalog,
    "PartsList": PartsList,
    "Profile": Profile,
    "QuickJobs": QuickJobs,
    "SavedParts": SavedParts,
    "SearchHistory": SearchHistory,
    "SearchResults": SearchResults,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};