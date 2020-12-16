import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab1amiPage } from './tab1ami.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1amiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1amiPageRoutingModule {}
