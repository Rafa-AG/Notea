import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab1amiPage } from './tab1ami.page';

describe('Tab1amiPage', () => {
  let component: Tab1amiPage;
  let fixture: ComponentFixture<Tab1amiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab1amiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1amiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
