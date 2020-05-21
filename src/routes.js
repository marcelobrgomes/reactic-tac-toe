/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "./views/Dashboard.js";
import { faUser, faUserFriends, faPeopleArrows } from '@fortawesome/free-solid-svg-icons'

var routes = [
  {
    path: "/singlePlayer",
    name: "Singleplayer",
    icon: faUser,
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/localMultiPlayer",
    name: "Local Multiplayer",
    icon: faUserFriends,
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/onlineMultiPlayer",
    name: "Online Multiplayer",
    icon: faPeopleArrows,
    component: Dashboard,
    layout: "/admin"
  }
];
export default routes;
