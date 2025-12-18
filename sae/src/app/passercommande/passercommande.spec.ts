import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Passercommande } from './passercommande';

describe('Passercommande', () => {
  let component: Passercommande;
  let fixture: ComponentFixture<Passercommande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Passercommande]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Passercommande);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
