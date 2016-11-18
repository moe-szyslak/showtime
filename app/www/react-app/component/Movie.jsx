/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import anime from 'animejs';

import history from '../config/history';
import store from '../redux/store';
import i18n from '../config/i18n';
import amClass from '../util/amClass';
import containsFidel from '../util/containsFidel';

class Movie extends Component {
  constructor(props) {
    super(props);

    const state = store.getState();
    const { cinema, movie } = this.props.params;

    this.state = {
      poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : ''],
      movie: state.showtime.show[cinema][movie] || Object.create(null),
      showVideo: false, // for an even smoother animation
      language: state.language,
    };
  }

  componentWillMount() {
    const header = window.document.querySelector('.showtime-header');
    if (header) {
      header.classList.add('_collapsed_');
      header.style.borderBottomStyle = 'hidden';
    }

    const menu = window.document.querySelector('.showtime-menu');
    if (menu) {
      menu.classList.add('_collapsed_');
      menu.style.borderTopStyle = 'hidden';
    }

    const showtimeView = window.document.querySelector('.showtime-view');
    if (showtimeView) {
      showtimeView.style.overflowY = 'hidden';
    }

    const viewShowtimeList = window.document.querySelector('.view-showtime-list');
    if (viewShowtimeList) {
      viewShowtimeList.scrollIntoView();
    }

    setTimeout(() => {
      if (window.StatusBar !== undefined) {
        window.StatusBar.hide();
      }
    }, 250);
  }

  componentDidMount() {
    const complete = () => {
      window.document.querySelector('.close-button').style.opacity = '1';
      window.document.querySelector('.poster-box').style.backgroundAttachment = 'fixed';
      window.document.querySelector('.view-movie').style.overflowY = 'scroll';
      this.setState({ showVideo: true });
    };

    anime({
      targets: '.view-movie',
      top: ['100vh', '0'],
      direction: 'normal',
      easing: 'easeOutElastic',
      duration: 750,
      elasticity: 100,
      complete, // I'm keeping `this` 😎
    });

    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const { cinema, movie } = this.props.params;

      this.setState({
        poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : ''],
        movie: state.showtime.show[cinema][movie] || Object.create(null),
        language: state.language,
      });
    });
  }

  componentWillUnmount() {
    const header = window.document.querySelector('.showtime-header');
    if (header !== null) {
      header.classList.remove('_collapsed_');
      header.style.borderBottomStyle = 'solid';
    }

    const menu = window.document.querySelector('.showtime-menu');
    if (menu) {
      menu.classList.remove('_collapsed_');
      menu.style.borderTopStyle = 'solid';
    }

    setTimeout(() => {
      if (window.StatusBar !== undefined) {
        window.StatusBar.show();
      }

      const showtimeView = window.document.querySelector('.showtime-view');
      if (showtimeView) {
        showtimeView.style.overflowY = 'scroll';
      }
    }, 250);

    this.unsubscribe();
  }

  openWebsite(url) {
    if (url !== 'N/A' && window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(encodeURI(url), '_system');
    }
  }

  goBack() {
    this.setState({ showVideo: false });
    window.document.querySelector('.close-button').style.opacity = '0';

    anime({
      targets: '.view-movie',
      direction: 'normal',
      duration: Math.floor(window.document.querySelector('.view-movie').scrollTop * 0.75),
      scrollTop: '0',
      easing: 'linear',
      complete() {
        window.document.querySelector('.poster-box').style.backgroundAttachment = 'scroll';

        anime({
          targets: '.view-movie',
          translateY: ['0', '100vh'],
          direction: 'linear',
          duration: 250,
          easing: 'linear',
          complete() {
            history.goBack();
          },
        });
      },
    });
  }

  render() {
    return (
      <div className="view-movie">
        <button className="close-button" onClick={() => this.goBack()}>
          <i className="icon-close" />
        </button>

        <div className="poster-box" style={{ backgroundImage: `url(${encodeURI(this.state.poster)})` }} />

        <div className="movie-411">
          <h2 className={`light-font-weight movie-title ${containsFidel(this.state.movie.title) ? '_am_' : ''}`}>{ this.state.movie.title }</h2>
          <p className="movie-showtime _am_">{this.state.movie.time}</p>
          <p className="movie-description">
            { this.state.movie.omdb ? <span>{ this.state.movie.omdb.Plot }</span> : <span /> }
          </p>
          {
            this.state.movie.omdb ? <h3 className={`movie-information ${amClass(this.state.language)}`}>
              <table>
                <caption>{i18n[this.state.language].INFORMATION}</caption>
                <tbody>
                  <tr>
                    <td>Rated</td>
                    <td>{ this.state.movie.omdb.Rated }</td>
                  </tr>

                  <tr>
                    <td>Released</td>
                    <td>{ this.state.movie.omdb.Released }</td>
                  </tr>

                  <tr>
                    <td>Genre</td>
                    <td>{ this.state.movie.omdb.Genre }</td>
                  </tr>

                  <tr>
                    <td>Director</td>
                    <td>{ this.state.movie.omdb.Director }</td>
                  </tr>

                  <tr>
                    <td>Cast</td>
                    <td>{ this.state.movie.omdb.Actors }</td>
                  </tr>

                  <tr>
                    <td>Run Time</td>
                    <td>{ this.state.movie.omdb.Runtime }</td>
                  </tr>

                  <tr>
                    <td>Website</td>
                    <td
                      className={`${this.state.movie.omdb.Website === 'N/A' ? '' : 'movie-website'}`}
                      onClick={() => this.openWebsite(this.state.movie.omdb.Website)}
                    >
                      <span>{ this.state.movie.omdb.Website.substring(0, 24) }</span>
                      { this.state.movie.omdb.Website.length > 24 ? <span>...</span> : <span /> }
                    </td>
                  </tr>
                </tbody>
              </table>
            </h3> : <span />
          }
          {
            (this.state.showVideo && this.state.movie.video) ? <div>
              <div className={`video-label ${amClass(this.state.language)}>{i18n[this.state.language].VIDEO}`}>
                {i18n[this.state.language].VIDEO}
              </div>

              <div className="video-container">
                <iframe
                  src={this.state.movie.video}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div> : <span />
          }
        </div>
      </div>
    );
  }
}

Movie.propTypes = {
  params: PropTypes.shape({
    movie: PropTypes.string.isRequired,
    cinema: PropTypes.string.isRequired,
  }).isRequired,
};

module.exports = Movie;
