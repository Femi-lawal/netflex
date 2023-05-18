import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero" [style.background-image]="'url(' + getBackdropUrl() + ')'">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ movie?.title || movie?.name || 'Welcome to Netflex' }}</h1>
        <p class="hero-description">{{ getDescription() }}</p>
        <div class="hero-buttons">
          <button class="btn btn-primary btn-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Play
          </button>
          <button class="btn btn-secondary btn-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            More Info
          </button>
        </div>
      </div>
      <div class="hero-fade"></div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      width: 100%;
      height: 85vh;
      min-height: 500px;
      max-height: 900px;
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to right,
        rgba(20, 20, 20, 0.95) 0%,
        rgba(20, 20, 20, 0.6) 40%,
        rgba(20, 20, 20, 0.2) 60%,
        transparent 100%
      );
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 0 var(--content-padding);
      max-width: 600px;
      animation: fadeInUp var(--transition-slow) ease forwards;
    }

    .hero-title {
      font-size: var(--font-size-6xl);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: var(--spacing-lg);
      text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
    }

    .hero-description {
      font-size: var(--font-size-lg);
      line-height: 1.5;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xl);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .hero-buttons {
      display: flex;
      gap: var(--spacing-md);
    }

    .hero-fade {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(to top, var(--color-background) 0%, transparent 100%);
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .hero {
        height: 70vh;
        min-height: 400px;
      }

      .hero-title {
        font-size: var(--font-size-4xl);
      }

      .hero-description {
        font-size: var(--font-size-base);
        -webkit-line-clamp: 2;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .hero-buttons .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HeroBannerComponent {
  @Input() movie: Movie | null = null;

  constructor(private tmdbService: TmdbService) {}

  getBackdropUrl(): string {
    if (this.movie?.backdrop_path) {
      return this.tmdbService.getImageUrl(this.movie.backdrop_path, 'original');
    }
    return this.tmdbService.getBackdropPlaceholder();
  }

  getDescription(): string {
    if (this.movie?.overview) {
      return this.movie.overview;
    }
    return 'Discover thousands of movies and TV shows. Stream anytime, anywhere on your favorite devices.';
  }
}
