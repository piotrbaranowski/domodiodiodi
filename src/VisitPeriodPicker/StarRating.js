import React from 'react';
import './StarRating.css';

class StarRating extends React.Component {

  getStars() {
    const ratingTimesStarNumber =  this.props.rating * 5;
    return new Array(5).fill(0).map((zero, index) => {
      const ratingAdjusted = (ratingTimesStarNumber - index) * 100;
      const width = ratingAdjusted < 0 ? 0 : ratingAdjusted > 100 ? 100 : ratingAdjusted;
      return <div key={index} className="rating-star"><div className="rating-star-cover" style={{width: `${width}%`}}></div></div>;
    });
  }

  render() {
    return (
      <div>
        {this.getStars()}
      </div>
    );
  }
}

export default StarRating;