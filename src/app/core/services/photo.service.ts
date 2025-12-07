import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { ENVIRONMENT } from '../config/environment.config';
import { PhotoDto } from '../models/photo.interface';
import { PicsumPhoto } from '../models/piscum-photo.interface';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private http = inject(HttpClient);
  private env = inject(ENVIRONMENT);

  getPhotos(page: number, limit: number = 6): Observable<PhotoDto[]> {
    const apiUrl = `${this.env.apiUrl}/v2/list?page=${page}&limit=${limit}`;

    return this.http.get<PicsumPhoto[]>(apiUrl).pipe(
      map((picsumPhotos) => this.mapToPhotoDtos(picsumPhotos)),
      delay(250 + Math.random() * 100)
    );
  }

  /**
   * Convert array of Picsum photos to our PhotoDto format
   */
  private mapToPhotoDtos(picsumPhotos: PicsumPhoto[]): PhotoDto[] {
    return picsumPhotos.map((p) => ({
      id: `photo-${p.id}`,
      url: `${this.env.apiUrl}/id/${p.id}/600/600`, // Full size
      thumbnailUrl: `${this.env.apiUrl}/id/${p.id}/300/300`, // Thumbnail
      isFavorite: false,
    }));
  }
}
