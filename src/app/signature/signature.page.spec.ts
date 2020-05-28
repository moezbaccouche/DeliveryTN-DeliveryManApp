import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignaturePage } from './signature.page';

describe('SignaturePage', () => {
  let component: SignaturePage;
  let fixture: ComponentFixture<SignaturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignaturePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignaturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
