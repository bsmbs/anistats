import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesPopupComponent } from './series-popup.component';

describe('SeriesPopupComponent', () => {
  let component: SeriesPopupComponent;
  let fixture: ComponentFixture<SeriesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
