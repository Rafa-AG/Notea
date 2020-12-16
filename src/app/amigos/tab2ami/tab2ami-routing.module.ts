import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab2amiPage } from './tab2ami.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2amiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab2amiPageRoutingModule {}
