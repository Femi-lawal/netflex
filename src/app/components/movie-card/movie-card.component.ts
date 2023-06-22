import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="movie-card" (mouseenter)="isHovered = true" (mouseleave)="isHovered = false">
      <div class="card-poster">
        <img [src]="getPosterUrl()" [alt]="movie.title || movie.name" loading="lazy">
        <div class="card-overlay" [class.visible]="isHovered">
          <div class="card-actions">
            <button class="action-btn primary" aria-label="Play">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
            <button class="action-btn" aria-label="Add to list">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button class="action-btn" aria-label="Like">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
            </button>
          </div>
          <div class="card-meta">
            <span class="rating" [class.good]="movie.vote_average >= 7" [class.average]="movie.vote_average >= 5 && movie.vote_average < 7">
              {{ (movie.vote_average * 10).toFixed(0) }}% Match
            </span>
            <span class="year">{{ getYear() }}</span>
          </div>
          <h4 class="card-title">{{ movie.title || movie.name }}</h4>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      position: relative;
      flex-shrink: 0;
      width: 200px;
      border-radius: var(--radius-md);
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-normal), z-index 0s;
    }

    .movie-card:hover {
      transform: scale(1.3);
      z-index: 10;
      transition: transform var(--transition-normal), z-index 0s var(--transition-normal);
    }

    .card-poster {
      position: relative;
      width: 100%;
      aspect-ratio: 2/3;
      background-color: var(--color-surface);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .card-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: var(--spacing-md);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    .card-overlay.visible {
      opacity: 1;
    }

    .card-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--color-text-secondary);
      background: rgba(20, 20, 20, 0.8);
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .action-btn:hover {
      border-color: var(--color-text-primary);
      background: var(--color-text-primary);
      color: var(--color-background);
    }

    .action-btn.primary {
      background: var(--color-text-primary);
      color: var(--color-background);
      border-color: var(--color-text-primary);
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xs);
    }

    .rating {
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--color-text-muted);
    }

    .rating.good {
      color: #46d369;
    }

    .rating.average {
      color: #ffc107;
    }

    .year {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .card-title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .movie-card {
        width: 140px;
      }

      .movie-card:hover {
        transform: scale(1.1);
      }
    }
  `]
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  isHovered = false;

  constructor(private tmdbService: TmdbService) {}

  getPosterUrl(): string {
    return this.tmdbService.getImageUrl(this.movie.poster_path, 'w342');
  }

  getYear(): string {
    const date = this.movie.release_date || this.movie.first_air_date;
    return date ? date.split('-')[0] : '';
  }
}
