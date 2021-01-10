import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1amiPageRoutingModule } from './tab1ami-routing.module';

import { Tab1amiPage } from './tab1ami.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    Tab1amiPageRoutingModule
  ],
  declarations: [Tab1amiPage]
})
export class Tab1amiPageModule {}
