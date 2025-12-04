import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MenuComponent } from './menu-component';
import { RestApiService } from '../services/rest-api.service';
import { PanierService } from '../services/panier.service';

class RestApiServiceStub {
  getProducts() {
    return of([]);
  }
}

class PanierServiceStub {
  addItem() {
    return Promise.resolve();
  }
}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: RestApiService, useClass: RestApiServiceStub },
        { provide: PanierService, useClass: PanierServiceStub },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
