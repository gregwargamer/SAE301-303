import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { RestApiService } from './services/rest-api.service';
import { PanierService } from './services/panier.service';

class RestApiServiceStub {
  getProducts() {
    return of([]);
  }
}

class PanierServiceStub {
  panier$ = of([]);
  addItem() {
    return Promise.resolve();
  }
  removeItem() {
    return Promise.resolve();
  }
  updateQuantity() {
    return Promise.resolve();
  }
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: RestApiService, useClass: RestApiServiceStub },
        { provide: PanierService, useClass: PanierServiceStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Eishi sushi');
  });
});
