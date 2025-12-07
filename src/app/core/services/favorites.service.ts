import { Injectable, signal } from '@angular/core';
import { PhotoDto } from '../models/photo.interface';

const STORAGE_KEY = 'photo-library-favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  // Internal state - writable only by service
  private favoritesSignal = signal<PhotoDto[]>([]);
  // Public readonly signal
  favorites = this.favoritesSignal.asReadonly();

  constructor() {
    this.loadFromLocalStorage();
  }

  addToFavorites(photo: PhotoDto): void {
    const current = this.favoritesSignal();
    const updated = [...current, { ...photo, isFavorite: true }];
    this.favoritesSignal.set(updated);
    this.saveToLocalStorage();
  }

  removeFromFavorites(photoId: string): void {
    const current = this.favoritesSignal();
    const updated = current.filter((p) => p.id !== photoId);
    this.favoritesSignal.set(updated);
    this.saveToLocalStorage();
  }

  isFavorite(photoId: string): boolean {
    return this.favoritesSignal().some((p) => p.id === photoId);
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored) as PhotoDto[];
        this.favoritesSignal.set(favorites);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      this.favoritesSignal.set([]);
    }
  }

  private saveToLocalStorage(): void {
    const favorites = this.favoritesSignal();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}
