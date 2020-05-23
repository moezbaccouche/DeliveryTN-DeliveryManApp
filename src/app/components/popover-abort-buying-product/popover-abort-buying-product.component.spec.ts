import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAbortBuyingProductComponent } from './popover-abort-buying-product.component';

describe('PopoverAbortBuyingProductComponent', () => {
  let component: PopoverAbortBuyingProductComponent;
  let fixture: ComponentFixture<PopoverAbortBuyingProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAbortBuyingProductComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAbortBuyingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
