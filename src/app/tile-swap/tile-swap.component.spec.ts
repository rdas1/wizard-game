import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileSwapComponent } from './tile-swap.component';

describe('TileSwapComponent', () => {
  let component: TileSwapComponent;
  let fixture: ComponentFixture<TileSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileSwapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TileSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
