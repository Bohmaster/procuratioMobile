import { VisitsPage } from "./visits/visits";
import { ContactPage } from "./contacts/contacts";
import { BudgetPage } from "./budget/budget";
import { CalendarPage } from "./calendar/calendar";
import { TabsPage } from "./tabs/tabs";
import { LoginCustomPage } from "./custom/login";
import { HomePage } from "./home/home";
import { ContactsDetailPage } from "./contacts-detail/contacts";
import {ProxyPage} from "./proxy/proxy";



// The page the user lands on after opening the app and without a session
export const FirstRunPage = ProxyPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = HomePage;
export const Tab2Root = ContactPage;
export const Tab3Root = CalendarPage;
export const Tab4Root = VisitsPage;
export const Tab5Root = BudgetPage;
