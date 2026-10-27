
import { Routes } from '@angular/router';
import { Events } from './pages/events/events';
import { Admin } from './pages/admin/admin';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [

  {
    path: 'events',
    component: Events,
    title: 'Events | DevSynk',
  },

{
  path: 'admin',
  component: Admin,
  title: 'Admin Studio | DevSynk'
},

{
  path: 'dashboard',
  component: Dashboard,
  title: 'Developer Dashboard | DevSynk',
},

];
