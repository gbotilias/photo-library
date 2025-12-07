import { TestBed } from '@angular/core/testing';
import { PhotoDto } from '../models/photo.interface';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const mockPhoto: PhotoDto = {
    id: 'photo-1',
    url: 'test1.jpg',
    thumbnailUrl: 'thumb1.jpg',
    isFavorite: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add photo to favorites', () => {
    service.addToFavorites(mockPhoto);
    expect(service.isFavorite('photo-1')).toBe(true);
  });

  it('should remove photo from favorites', () => {
    service.addToFavorites(mockPhoto);
    service.removeFromFavorites('photo-1');
    expect(service.isFavorite('photo-1')).toBe(false);
  });

  it('should load favorites from localStorage on init', () => {
    localStorage.setItem('photo-library-favorites', JSON.stringify([mockPhoto]));

    // Create fresh TestBed to trigger constructor
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(FavoritesService);

    expect(newService.isFavorite('photo-1')).toBe(true);
  });

  it('should handle corrupted localStorage data', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('photo-library-favorites', 'invalid{json');

    // Create fresh service to trigger loadFromLocalStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(FavoritesService);

    // Should start with empty favorites
    expect(newService.favorites().length).toBe(0);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
