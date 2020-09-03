import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesContainerComponent } from './series-container.component';

describe('SeriesContainerComponent', () => {
  let component: SeriesContainerComponent;
  let fixture: ComponentFixture<SeriesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
