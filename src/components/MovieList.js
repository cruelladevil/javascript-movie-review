import { Store } from '..';
import { getPopularMovies, searchMovies } from '../service/movie';
import MovieCard from './MovieCard';

export default class MovieList {
  constructor($parent) {
    this.$parent = $parent;
    this.renderMode = 'popular';
  }

  template() {
    return `
      <main>
        <section class="item-view">
          <h2 id="js-movie-list-title">지금 인기 있는 영화</h2>
          <ul id="js-movie-list" class="item-list"></ul>
        </section>
        <button id="js-more-movie-button" class="btn primary full-width">더 보기</button>
        <p id='js-last-page-notify'>마지막 페이지입니다</p>
      </main>
    `;
  }

  skeletonTemplate() {
    return `
      <li class='skeleton-li'>
        <a href="#">
          <div class="item-card">
            <div class="item-thumbnail skeleton"></div>
            <div class="item-title skeleton"></div>
            <div class="item-score skeleton"></div>
          </div>
        </a>
      </li>
    `;
  }

  init() {
    this.$parent.insertAdjacentHTML('beforeend', this.template());
    this.$title = this.$parent.querySelector('#js-movie-list-title');
    this.$movieItemList = this.$parent.querySelector('#js-movie-list');
    this.$moreMovieButton = this.$parent.querySelector('#js-more-movie-button');
    this.$lastPageNotify = this.$parent.querySelector('#js-last-page-notify');
    this.$skeletonDiv = this.$parent.querySelector('#js-movie-list-skeleton');

    return this;
  }

  bindEvent() {
    const handleMoreMovieButton = async () => {
      Store.page += 1;

      if (this.renderMode === 'popular') {
        this.toggleSkeleton();
        const { results, total_pages } = await getPopularMovies({ page: Store.page });
        this.toggleSkeleton();
        this.renderMovieCards(results, total_pages);
      }

      if (this.renderMode === 'search') {
        this.toggleSkeleton();
        const { results, total_pages } = await searchMovies({
          page: Store.page,
          text: Store.keyword,
        });
        this.toggleSkeleton();
        this.renderMovieCards(results, total_pages);
      }
    };

    this.$moreMovieButton?.addEventListener('click', handleMoreMovieButton);
  }

  renderTitle(title) {
    this.$title.textContent = title;
  }

  renderMovieCards(results, totalPages) {
    results.forEach((movie) => {
      new MovieCard(this.$movieItemList, movie).render();
    });

    this.$moreMovieButton.style.display = totalPages > Store.page ? 'block' : 'none';
    this.$lastPageNotify.style.display = totalPages > Store.page ? 'none' : 'block';
  }

  removeMovieCards() {
    this.$movieItemList.innerHTML = '';
  }

  toggleSkeleton() {
    const $skeletonLists = this.$movieItemList.querySelectorAll('.skeleton-li');

    console.log($skeletonLists);
    if ($skeletonLists.length > 0) {
      $skeletonLists.forEach(($skeletonList) => $skeletonList.remove());
    } else {
      this.$movieItemList.insertAdjacentHTML('beforeend', this.skeletonTemplate().repeat(20));
    }
  }
}
