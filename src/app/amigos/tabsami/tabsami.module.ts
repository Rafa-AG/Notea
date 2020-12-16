import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsamiPageRoutingModule } from './tabsami-routing.module';

import { TabsamiPage } from './tabsami.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsamiPageRoutingModule
  ],
  declarations: [TabsamiPage]
})
export class TabsamiPageModule {}
