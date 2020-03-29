import React from 'react';
import { shallow } from 'enzyme';
import StarRating from './StarRating';

describe('Given StarRating', () => {
  let wrapper;

  function getStarCover(number) {
    return wrapper.find('.rating-star-cover').at(number);
  }

  beforeEach(() => {
    wrapper = shallow(<StarRating rating={0.75} />);
  });

  test.each([[0, '100%'], [1, '100%'], [2, '100%'], [3, '75%'], [4, '0%']])
  ('Then star cover no %# should have %s width', (i, expectedWidth) => {
    expect(getStarCover(i)).toHaveStyle({width: expectedWidth});
  });
});