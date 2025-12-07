import { computed, Injectable, signal } from '@angular/core';
import { PhotoDto } from '../models/photo.interface';

const STORAGE_KEY = 'photo-library-favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  // Private signal - only this service can modify
  private favoritesSignal = signal<PhotoDto[]>([]);

  // Public read-only signal - components can read
  favorites = this.favoritesSignal.asReadonly();

  // Computed signal - auto-updates when favorites change
  favoritesCount = computed(() => this.favoritesSignal().length);

  constructor() {
    // Load favorites on app start
    this.loadFromLocalStorage();
  }

  /**
   * Add photo to favorites
   */
  addToFavorites(photo: PhotoDto): void {
    const current = this.favoritesSignal();

    // Add to array
    const updated = [...current, { ...photo, isFavorite: true }];
    this.favoritesSignal.set(updated);

    // Save to localStorage
    this.saveToLocalStorage();
  }

  /**
   * Remove photo from favorites
   */
  removeFromFavorites(photoId: string): void {
    const current = this.favoritesSignal();

    // Filter out the photo
    const updated = current.filter((p) => p.id !== photoId);
    this.favoritesSignal.set(updated);

    // Save to localStorage
    this.saveToLocalStorage();
  }

  /**
   * Check if photo is in favorites
   */
  isFavorite(photoId: string): boolean {
    return this.favoritesSignal().some((p) => p.id === photoId);
  }

  /**
   * Load favorites from localStorage
   */
  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const favorites = JSON.parse(stored) as PhotoDto[];
      this.favoritesSignal.set(favorites);
    }
  }

  /**
   * Save favorites to localStorage
   */
  private saveToLocalStorage(): void {
    const favorites = this.favoritesSignal();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}
