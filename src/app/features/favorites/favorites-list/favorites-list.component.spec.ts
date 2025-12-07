import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PhotoDto } from '../../../core/models/photo.interface';
import { FavoritesService } from '../../../core/services/favorites.service';
import { FavoritesListComponent } from './favorites-list.component';

describe('FavoritesList', () => {
  let component: FavoritesListComponent;
  let fixture: ComponentFixture<FavoritesListComponent>;
  let favoritesService: FavoritesService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesListComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesListComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state when no favorites', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const emptyState = compiled.querySelector('.empty-state');

    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No favorites yet');
  });

  it('should display favorites grid when favorites exist', () => {
    const mockPhoto: PhotoDto = {
      id: '1',
      url: 'https://picsum.photos/600/600?image=1',
      thumbnailUrl: 'https://picsum.photos/300/300?image=1',
      isFavorite: true,
    };

    favoritesService.addToFavorites(mockPhoto);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const grid = compiled.querySelector('.favorites-grid');
    const cards = compiled.querySelectorAll('.photo-card');

    expect(grid).toBeTruthy();
    expect(cards.length).toBe(1);
  });

  it('should navigate to photo detail on click', () => {
    const mockPhoto: PhotoDto = {
      id: '1',
      url: 'https://picsum.photos/600/600?image=1',
      thumbnailUrl: 'https://picsum.photos/300/300?image=1',
      isFavorite: true,
    };

    favoritesService.addToFavorites(mockPhoto);
    fixture.detectChanges();

    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onPhotoClick('1');

    expect(navigateSpy).toHaveBeenCalledWith(['/photos', '1']);
  });
});
