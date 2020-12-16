import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab2amiPage } from './tab2ami.page';

describe('Tab2amiPage', () => {
  let component: Tab2amiPage;
  let fixture: ComponentFixture<Tab2amiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab2amiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2amiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
