import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '../config/environment.config';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: ENVIRONMENT,
          useValue: { production: false, apiUrl: 'https://picsum.photos/v2/list' },
        },
      ],
    });
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
