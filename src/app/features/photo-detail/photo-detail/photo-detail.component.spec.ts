import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetail } from './photo-detail';

describe('PhotoDetail', () => {
  let component: PhotoDetail;
  let fixture: ComponentFixture<PhotoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
