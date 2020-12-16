import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsamiPage } from './tabsami.page';

describe('TabsamiPage', () => {
  let component: TabsamiPage;
  let fixture: ComponentFixture<TabsamiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsamiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsamiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
