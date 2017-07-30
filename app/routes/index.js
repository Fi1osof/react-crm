

import {
  MainApp,
  MainPage,
} from "modules/ReactCRM";

// console.log('AppB', AppB);

// App.contextTypes = { store: React.PropTypes.object };

export default {
  path: "/",
  component: MainApp,
  indexRoute: { component: MainPage },
  childRoutes: [
    // {
    //   path: "/",
    //   name: "/",
    //   component: Page52
    // },
    {
      path: "*",
      name: "notfound",
      component: MainPage
    }
  ]
};
