import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ENVIRONMENT } from '../../../core/config/environment.config';
import { PhotoDto } from '../../../core/models/photo.interface';
import { FavoritesService } from '../../../core/services/favorites.service';
import { PhotoService } from '../../../core/services/photo.service';
import { PhotosListComponent } from './photos-list.component';

describe('PhotosListComponent', () => {
  let component: PhotosListComponent;
  let fixture: ComponentFixture<PhotosListComponent>;
  let photoService: PhotoService;
  let favoritesService: FavoritesService;
  let snackBar: MatSnackBar;

  const mockPhotos: PhotoDto[] = [
    {
      id: '1',
      url: 'https://picsum.photos/600/600?image=1',
      thumbnailUrl: 'https://picsum.photos/300/300?image=1',
      isFavorite: false,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosListComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ENVIRONMENT,
          useValue: { production: false, apiUrl: 'https://picsum.photos' },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotosListComponent);
    component = fixture.componentInstance;
    photoService = TestBed.inject(PhotoService);
    favoritesService = TestBed.inject(FavoritesService);
    snackBar = TestBed.inject(MatSnackBar);

    // Mock to prevent initial API call
    vi.spyOn(photoService, 'getPhotos').mockReturnValue(of([]));

    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photos successfully', async () => {
    vi.mocked(photoService.getPhotos).mockReturnValue(of(mockPhotos));

    component.loadPhotos();
    await vi.waitFor(() => {
      expect(component.photos().length).toBe(1);
    });

    expect(component.loading()).toBe(false);
  });

  it('should handle load error', async () => {
    vi.mocked(photoService.getPhotos).mockReturnValue(throwError(() => new Error('Failed')));

    component.loadPhotos();
    await vi.waitFor(() => {
      expect(component.error()).toBe('Failed to load photos. Please try again.');
    });

    expect(component.loading()).toBe(false);
  });
  it('should add photo to favorites', () => {
    const addSpy = vi.spyOn(favoritesService, 'addToFavorites');

    component.addToFavorites(mockPhotos[0]);

    expect(addSpy).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it('should not add duplicate favorite', () => {
    vi.spyOn(favoritesService, 'isFavorite').mockReturnValue(true);
    const addSpy = vi.spyOn(favoritesService, 'addToFavorites');

    component.addToFavorites(mockPhotos[0]);

    expect(addSpy).not.toHaveBeenCalled();
  });

  it('should display error message', () => {
    component.error.set('Test error');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorDiv = compiled.querySelector('.error-message');

    expect(errorDiv).toBeTruthy();
    expect(errorDiv.textContent).toContain('Test error');
  });

  it('should display photos grid', () => {
    component.photos.set(mockPhotos);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const grid = compiled.querySelector('.photos-grid');
    const cards = compiled.querySelectorAll('.photo-card');

    expect(grid).toBeTruthy();
    expect(cards.length).toBe(1);
  });

  it('should display loading spinner', () => {
    component.loading.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const loadingDiv = compiled.querySelector('.loading');
    const spinner = compiled.querySelector('mat-spinner');

    expect(loadingDiv).toBeTruthy();
    expect(spinner).toBeTruthy();
  });

  it('should setup scroll listener', () => {
    const addEventListenerSpy = vi.fn();
    const mockContainer = {
      addEventListener: addEventListenerSpy,
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500,
    };

    vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer as any);

    component['setupScrollListener']();

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should return early if already loading', () => {
    component.loading.set(true);
    const currentPage = component.currentPage();

    component.loadPhotos();

    expect(component.currentPage()).toBe(currentPage);
  });
});
