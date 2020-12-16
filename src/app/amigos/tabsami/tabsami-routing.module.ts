import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsamiPage } from './tabsami.page';

const routes: Routes = [
  {
    path: '',
    component: TabsamiPage,
    children:[
      {
        path: 'tab1ami',
        loadChildren: () => import('./../../amigos/tab1ami/tab1ami.module').then( m => m.Tab1amiPageModule)
      },
      {
        path: 'tab2ami',
        loadChildren: () => import('./../../amigos/tab2ami/tab2ami.module').then( m => m.Tab2amiPageModule)
      },
      {
        path: '',
        redirectTo: '/tabsami/tab1ami',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsamiPageRoutingModule {}
