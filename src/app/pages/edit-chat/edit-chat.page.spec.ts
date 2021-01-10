import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditChatPage } from './edit-chat.page';

describe('EditChatPage', () => {
  let component: EditChatPage;
  let fixture: ComponentFixture<EditChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
