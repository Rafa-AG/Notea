import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab2amiPageRoutingModule } from './tab2ami-routing.module';

import { Tab2amiPage } from './tab2ami.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    Tab2amiPageRoutingModule
  ],
  declarations: [Tab2amiPage]
})
export class Tab2amiPageModule {}
