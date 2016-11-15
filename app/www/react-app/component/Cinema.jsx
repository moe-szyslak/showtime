/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';

import store from '../redux/store';
import { poster } from '../redux/action/showtime';
import containsFidel from '../util/containsFidel';

const placeholderPoster = 'data:image/png;base64,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';
const certifiedFresh = '';
const freshTomato = '';
const rotten = '';

const posterUrls = Object.create(null); // unrelated state update will trigger poster action

class Cinema extends Component {
  constructor(props) {
    super(props);

    const state = store.getState();
    this.state = {
      poster: state.poster,
      show: state.showtime.show,
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.setState({
        poster: state.poster,
        show: state.showtime.show,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * given posterUrl, requests poster API if not found in LF
   *
   * @param  {String} posterUrl
   */
  poster(posterUrl) {
    if (Object.prototype.hasOwnProperty.call(posterUrls, posterUrl) === false) {
      posterUrls[posterUrl] = posterUrl; // blocking _other_ sate update calls
      poster(posterUrl);
    }

    return placeholderPoster;
  }

  render() {
    return (
      <div className="view-showtime-list">
        {
          this.state.show[this.props.params.cinema].map((movie, index) =>
            <Link key={index} to={`/show/${this.props.params.cinema}/${index}`} className="movie-container">
              <div className="poster-container">
                <img
                  className="img-poster"
                  src={encodeURI(this.state.poster[movie.poster] || this.poster(movie.poster))}
                  alt={movie.title}
                />
              </div>

              <div className="info-container">
                <div className={`movie-title ${containsFidel(movie.title) ? '_am_' : ''}`}>{ movie.title }</div>
                <div className="movie-showtime _am_">{movie.time}</div>
                {
                  movie.omdb && !Number.isNaN(Number(movie.omdb.tomatoMeter)) ?
                    <div className="movie-score-container">
                      <img
                        className="movie-score-img"
                        alt="tomato meter"
                        src={`./react-app/static/image/${Number(movie.omdb.tomatoMeter) > 70 ? 'cfresh' : Number(movie.omdb.tomatoMeter) > 59 ? 'fresh' : 'rotten'}.png`}
                      />
                      <span className="movie-score">{movie.omdb.tomatoMeter}</span>
                    </div>
                    : <span />
                }
              </div>
            </Link>
          )
        }

        <ReactCSSTransitionGroup
          component="div"
          transitionName="fadeInUp-fadeOutDown"
          transitionEnterTimeout={750}
          transitionLeaveTimeout={500}
        >
          { React.cloneElement(this.props.children || <div />, { key: this.props.location.pathname || 'root' }) }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Cinema.propTypes = {
  children: PropTypes.element,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  params: PropTypes.shape({
    cinema: PropTypes.string.isRequired,
  }).isRequired,
};

Cinema.defaultProps = {};

module.exports = Cinema;
