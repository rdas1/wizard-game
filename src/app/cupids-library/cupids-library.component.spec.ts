import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupidsLibraryComponent } from './cupids-library.component';

describe('CupidsLibraryComponent', () => {
  let component: CupidsLibraryComponent;
  let fixture: ComponentFixture<CupidsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupidsLibraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CupidsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
