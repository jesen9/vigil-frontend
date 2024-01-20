import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from '@mui/icons-material/History';
import StorageIcon from '@mui/icons-material/Storage';

export const Routes = [
  {
    path: "/",
    menu: "Home",
    icon: <DashboardIcon />,
  },

  {
    path: "/cve",
    menu: "CVE Search",

  },
  // {
  //   path: "/cwe",
  //   menu: "CWE",

  // },
  // {
  //   path: "/cpe",
  //   menu: "CPE",

  // },
  {
    path: "/advancedSearch",
    menu: "Advanced Search",

  },
  {
    path: "/historyNotes",
    menu: "History Notes",
    icon:<HistoryIcon/>,

  },
  // {
  //   path: "/updateDatabase",
  //   menu: "Update Database",
  //   icon:<StorageIcon/>,

  // },
];
