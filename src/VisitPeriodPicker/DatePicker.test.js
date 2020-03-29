import React from 'react';
import { shallow } from 'enzyme';
import MockDate from '../MockDate';
import DatePicker from './DatePicker';

describe('Given DatePicker', () => {
  let wrapper;
  let RealDate;
  let now;
  let updated;
  let messages;
  let dateChangeCallback;

  function getUpdated() {
    return wrapper.find('p');
  }

  function getGridIndent() {
    return wrapper.find('.grid-container > div').first();
  }

  function getDay(dayNumber) {
    return wrapper.find('.grid-container button').at(dayNumber - 1);
  }

  function getNextMonth() {
    return wrapper.find('.grid-header button').at(1);
  }

  beforeEach(() => {
    RealDate = Date;
    MockDate.getDate = () => new RealDate(2020, 3, 13, 11, 11);
    now = MockDate.getDate();
    global.Date = MockDate;
    updated = new RealDate(2020, 1, 23);
    messages = {min: 'a', max: 'b', blacklist: 'c'}
    dateChangeCallback = jest.fn();
    wrapper = shallow(
      <DatePicker updated={updated}
                  min={new RealDate(2020, 3, 4)}
                  max={new RealDate(2020, 3, 28)}
                  blacklist={[new RealDate(2020, 3, 10)]}
                  messages={messages}
                  onDateChange={dateChangeCallback} />);
  });

  test('Then should have been updated 50 days ago', () => {
    expect(getUpdated()).toIncludeText('50');
  });

  test('Then should have 3 days indentation', () => {
    expect(getGridIndent()).toHaveStyle({width: 'calc(100% / 7 * 3)'});
  });

  test.each([1, 2, 3])
  ('Then should have disabled day number %i with min message', (dayNumber) => {
    const dayWrapper = getDay(dayNumber);
    expect(dayWrapper).toBeDisabled();
    expect(dayWrapper.prop('title')).toEqual(messages.min);
  });

  test.each([4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28])
  ('Then should have day number %i enabled without title', (dayNumber) => {
    const dayWrapper = getDay(dayNumber);
    expect(dayWrapper).not.toBeDisabled();
    expect(dayWrapper.prop('title')).toBeUndefined();
  });

  test('Then should have disabled day number 10 with blacklist message', () => {
    const dayWrapper = getDay(10);
    expect(dayWrapper).toBeDisabled();
    expect(dayWrapper.prop('title')).toEqual(messages.blacklist);
  });

  test.each([29, 30])
  ('Then should have disabled day number %i with max message', (dayNumber) => {
    const dayWrapper = getDay(dayNumber);
    expect(dayWrapper).toBeDisabled();
    expect(dayWrapper.prop('title')).toEqual(messages.max);
  });

  test('Then should have bold today day', () => {
    expect(getDay(13).find('span')).toHaveClassName('text-bold');
  });

  test('When next month is clicked and day 3 is clicked Then should return proper date', () => {
    getNextMonth().simulate('click');
    getDay(3).simulate('click');
    expect(dateChangeCallback).toHaveBeenCalledWith(new RealDate(2020, 4, 3))
  });

  afterEach(() => global.Date = RealDate);
});