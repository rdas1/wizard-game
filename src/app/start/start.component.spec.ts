import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpgComponent } from './start.component';

describe('RpgComponent', () => {
  let component: RpgComponent;
  let fixture: ComponentFixture<RpgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RpgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
