import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = environment.tmdb.apiKey;
  private baseUrl = environment.tmdb.baseUrl;
  private imageBaseUrl = environment.tmdb.imageBaseUrl;

  // Fallback data with Picsum.photos CC0 licensed placeholder images
  private fallbackMovies: Movie[] = [
    {
      id: 1,
      title: 'Stranger Things',
      name: 'Stranger Things',
      overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      poster_path: 'PICSUM:1015',
      backdrop_path: 'PICSUM_BACKDROP:1015',
      vote_average: 8.6,
      first_air_date: '2016-07-15',
      genre_ids: [18, 10765, 9648]
    },
    {
      id: 2,
      title: 'The Crown',
      name: 'The Crown',
      overview: 'This drama follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
      poster_path: 'PICSUM:1019',
      backdrop_path: 'PICSUM_BACKDROP:1019',
      vote_average: 8.2,
      first_air_date: '2016-11-04',
      genre_ids: [18]
    },
    {
      id: 3,
      title: 'Wednesday',
      name: 'Wednesday',
      overview: 'Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic ability.',
      poster_path: 'PICSUM:1021',
      backdrop_path: 'PICSUM_BACKDROP:1021',
      vote_average: 8.1,
      first_air_date: '2022-11-23',
      genre_ids: [10765, 9648, 35]
    },
    {
      id: 4,
      title: 'Squid Game',
      name: 'Squid Game',
      overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.',
      poster_path: 'PICSUM:1024',
      backdrop_path: 'PICSUM_BACKDROP:1024',
      vote_average: 7.8,
      first_air_date: '2021-09-17',
      genre_ids: [10759, 9648, 18]
    },
    {
      id: 5,
      title: 'Money Heist',
      name: 'Money Heist',
      overview: 'Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.',
      poster_path: 'PICSUM:1029',
      backdrop_path: 'PICSUM_BACKDROP:1029',
      vote_average: 8.3,
      first_air_date: '2017-05-02',
      genre_ids: [80, 18]
    },
    {
      id: 6,
      title: 'Breaking Bad',
      name: 'Breaking Bad',
      overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.',
      poster_path: 'PICSUM:1035',
      backdrop_path: 'PICSUM_BACKDROP:1035',
      vote_average: 9.5,
      first_air_date: '2008-01-20',
      genre_ids: [18, 80]
    },
    {
      id: 7,
      title: 'Dark',
      name: 'Dark',
      overview: 'A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes relationships among four families.',
      poster_path: 'PICSUM:1036',
      backdrop_path: 'PICSUM_BACKDROP:1036',
      vote_average: 8.7,
      first_air_date: '2017-12-01',
      genre_ids: [18, 9648, 10765]
    },
    {
      id: 8,
      title: 'The Witcher',
      name: 'The Witcher',
      overview: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
      poster_path: 'PICSUM:1039',
      backdrop_path: 'PICSUM_BACKDROP:1039',
      vote_average: 8.0,
      first_air_date: '2019-12-20',
      genre_ids: [10759, 10765, 18]
    },
    {
      id: 9,
      title: 'Ozark',
      name: 'Ozark',
      overview: 'A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.',
      poster_path: 'PICSUM:1040',
      backdrop_path: 'PICSUM_BACKDROP:1040',
      vote_average: 8.4,
      first_air_date: '2017-07-21',
      genre_ids: [80, 18]
    },
    {
      id: 10,
      title: 'Peaky Blinders',
      name: 'Peaky Blinders',
      overview: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.',
      poster_path: 'PICSUM:1041',
      backdrop_path: 'PICSUM_BACKDROP:1041',
      vote_average: 8.8,
      first_air_date: '2013-09-12',
      genre_ids: [80, 18]
    },
    {
      id: 11,
      title: 'Narcos',
      name: 'Narcos',
      overview: 'A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar and the DEA agents who sought to bring him down.',
      poster_path: 'PICSUM:1042',
      backdrop_path: 'PICSUM_BACKDROP:1042',
      vote_average: 8.5,
      first_air_date: '2015-08-28',
      genre_ids: [80, 18]
    },
    {
      id: 12,
      title: 'House of Cards',
      name: 'House of Cards',
      overview: 'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.',
      poster_path: 'PICSUM:1043',
      backdrop_path: 'PICSUM_BACKDROP:1043',
      vote_average: 8.1,
      first_air_date: '2013-02-01',
      genre_ids: [18]
    }
  ];

  constructor(private http: HttpClient) {}

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return this.getPlaceholderImage();
    }
    
    // Handle Picsum placeholder markers (CC0 licensed images)
    if (path.startsWith('PICSUM:')) {
      const id = path.split(':')[1];
      // Return a portrait-oriented image for posters (300x450)
      return `https://picsum.photos/id/${id}/300/450`;
    }
    if (path.startsWith('PICSUM_BACKDROP:')) {
      const id = path.split(':')[1];
      // Return a landscape-oriented image for backdrops (1280x720)
      return `https://picsum.photos/id/${id}/1280/720`;
    }
    
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  getPlaceholderImage(): string {
    // Return a random picsum image when no specific image is provided
    return 'https://picsum.photos/300/450?grayscale';
  }

  getBackdropPlaceholder(): string {
    return 'data:image/svg+xml,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e"/>
            <stop offset="100%" style="stop-color:#16213e"/>
          </linearGradient>
        </defs>
        <rect fill="url(#grad)" width="1920" height="1080"/>
        <text fill="#e50914" font-family="Inter, sans-serif" font-size="120" font-weight="800" text-anchor="middle" x="960" y="500">NETFLEX</text>
        <text fill="#666" font-family="Inter, sans-serif" font-size="32" text-anchor="middle" x="960" y="580">Stream Unlimited Movies & Shows</text>
      </svg>
    `);
  }

  private getFallbackData(): Observable<MovieResponse> {
    return of({
      page: 1,
      results: this.fallbackMovies,
      total_pages: 1,
      total_results: this.fallbackMovies.length
    });
  }

  private makeRequest(endpoint: string): Observable<MovieResponse> {
    if (this.apiKey === 'YOUR_TMDB_API_KEY') {
      return this.getFallbackData();
    }
    
    return this.http.get<MovieResponse>(`${this.baseUrl}${endpoint}`, {
      params: {
        api_key: this.apiKey,
        language: 'en-US'
      }
    }).pipe(
      catchError(() => this.getFallbackData())
    );
  }

  getTrending(): Observable<MovieResponse> {
    return this.makeRequest('/trending/all/week');
  }

  getPopularMovies(): Observable<MovieResponse> {
    return this.makeRequest('/movie/popular');
  }

  getTopRatedMovies(): Observable<MovieResponse> {
    return this.makeRequest('/movie/top_rated');
  }

  getUpcomingMovies(): Observable<MovieResponse> {
    return this.makeRequest('/movie/upcoming');
  }

  getPopularTVShows(): Observable<MovieResponse> {
    return this.makeRequest('/tv/popular');
  }

  getTopRatedTVShows(): Observable<MovieResponse> {
    return this.makeRequest('/tv/top_rated');
  }

  getNetflixOriginals(): Observable<MovieResponse> {
    // Netflix provider ID is 8
    return this.makeRequest('/discover/tv?with_networks=213');
  }

  getActionMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=28');
  }

  getComedyMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=35');
  }

  getHorrorMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=27');
  }

  getRomanceMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=10749');
  }

  getDocumentaries(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=99');
  }
}
