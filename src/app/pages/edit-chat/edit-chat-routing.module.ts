import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditChatPage } from './edit-chat.page';

const routes: Routes = [
  {
    path: '',
    component: EditChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditChatPageRoutingModule {}
