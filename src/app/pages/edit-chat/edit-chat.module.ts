import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditChatPageRoutingModule } from './edit-chat-routing.module';

import { EditChatPage } from './edit-chat.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    EditChatPageRoutingModule
  ],
  declarations: [EditChatPage]
})
export class EditChatPageModule {}
