import React from 'react';
import { shallow } from 'enzyme';
import MockDate from '../MockDate';
import VisitPeriodPicker from './VisitPeriodPicker';
import DatePicker from './DatePicker';

describe('Given VisitPeriodPicker', () => {
  let onSaveFunction;
  let now;
  let RealDate;
  let wrapper;

  function getSaveButton() {
    return wrapper.find('.section > button').at(1);
  }
  
  function getError() {
    return wrapper.find('.text-error');
  }
  
  function getCheckInDatePicker() {
    return wrapper.find(DatePicker).at(0);
  }
  
  function getCheckOutDatePicker() {
    return wrapper.find(DatePicker).at(1);
  }
  
  function getCheckInButton() {
    return wrapper.find('.dropdown-anchor button').at(0);
  }
  
  beforeEach(() => {
    RealDate = Date;
    MockDate.getDate = () => new RealDate(2020, 2, 13, 11, 11);
    now = MockDate.getDate();
    global.Date = MockDate;

    onSaveFunction = jest.fn();
    wrapper = shallow(<VisitPeriodPicker onSave={onSaveFunction}/>);
  });

  test('Then should not show error', () => {
    expect(getError()).not.toExist();
  });

  test('When save without dates Then should show error and not call save callback', () => {
    getSaveButton().simulate('click');
    expect(getError()).toIncludeText('Please enter both dates');
    expect(onSaveFunction).not.toHaveBeenCalled();
  });

  test('Then should have check out min date and message not in the past', () => {
    const checkOutDatepickerProps = getCheckOutDatePicker().props();
    expect(checkOutDatepickerProps.min.getTime()).toEqual(now.getTime());
    expect(checkOutDatepickerProps.messages.min).toEqual(VisitPeriodPicker.MESSAGE_PAST);
  });

  test('Then should have check in min date and message not in the past', () => {
    const checkInDatepickerProps = getCheckInDatePicker().props();
    expect(checkInDatepickerProps.min.getTime()).toEqual(now.getTime());
    expect(checkInDatepickerProps.messages.min).toEqual(VisitPeriodPicker.MESSAGE_PAST);
  });

  describe('And date in the future is in blacklist', () => {
    beforeEach(() => {
      wrapper.setProps({blacklist: [new RealDate(2020, 2, 15)]});
    });

    test('Then should have check in min date and message not in the past', () => {
      const checkInDatepickerProps = getCheckInDatePicker().props();
      expect(checkInDatepickerProps.min.getTime()).toEqual(now.getTime());
      expect(checkInDatepickerProps.messages.min).toEqual(VisitPeriodPicker.MESSAGE_PAST);
    });
  
    test('Then should not have check out max date', () => {
      const checkOutDatepickerProps = getCheckOutDatePicker().props();
      expect(checkOutDatepickerProps.max).toBeUndefined();
    });
  })

  describe('When check in and check out date are set', () => {
    let checkInCheckOutDate;

    beforeEach(() => {
      checkInCheckOutDate = new RealDate(2020, 3, 30);
      getCheckInDatePicker().simulate('dateChange', checkInCheckOutDate);
      getCheckOutDatePicker().simulate('dateChange', checkInCheckOutDate);
    });

    test('Then should have check in date formatted', () => {
      expect(getCheckInButton()).toIncludeText('30-4-2020');
    });

    test('And save is clicked Then should not show error and call save callback with proper dates', () => {
      getSaveButton().simulate('click');
      expect(getError()).not.toExist();
      expect(onSaveFunction).toHaveBeenCalledWith(checkInCheckOutDate, checkInCheckOutDate);
    });    

    test('Then should have check out min date and message after check in', () => {
      const checkOutDatepickerProps = getCheckOutDatePicker().props();
      expect(checkOutDatepickerProps.min.getTime()).toEqual(checkInCheckOutDate.getTime());
      expect(checkOutDatepickerProps.messages.min).toEqual(VisitPeriodPicker.MESSAGE_AFTER_CHECK_IN);
    });

    test('And date in the past is in blacklist Then should have check in min date and message not in the past', () => {
      wrapper.setProps({blacklist: [new RealDate(2020, 1, 15)]});
      const checkInDatepickerProps = getCheckInDatePicker().props();
      expect(checkInDatepickerProps.min.getTime()).toEqual(now.getTime());
      expect(checkInDatepickerProps.messages.min).toEqual(VisitPeriodPicker.MESSAGE_PAST);
    });

    describe('And date in the future is in blacklist', () => {
      let blacklistDate;

      beforeEach(() => {
        blacklistDate = new RealDate(2020, 2, 15);
        wrapper.setProps({blacklist: [blacklistDate, new RealDate(2020, 2, 14)]});
      });

      test('Then should have check in min date and message some reserved', () => {
        const checkInDatepickerProps = getCheckInDatePicker().props();
        expect(checkInDatepickerProps.min.getTime()).toEqual(blacklistDate.getTime());
        expect(checkInDatepickerProps.messages.min).toEqual(VisitPeriodPicker.MESSAGE_SOME_RESERVED);
      });

      test('Then should have check out max date and message some reserved', () => {
        const checkOutDatepickerProps = getCheckOutDatePicker().props();
        expect(checkOutDatepickerProps.max).toBe(null);
      });
    });

    test('And date after check in is in blacklist Then should have check in max date and message some reserved', () => {
      const blacklistDate = new RealDate(2020, 7, 15);
      wrapper.setProps({blacklist: [blacklistDate]});
      const checkOutDatepickerProps = getCheckOutDatePicker().props();
      expect(checkOutDatepickerProps.max.getTime()).toEqual(blacklistDate.getTime());
      expect(checkOutDatepickerProps.messages.max).toEqual(VisitPeriodPicker.MESSAGE_SOME_RESERVED);
    });
  });

  afterEach(() => global.Date = RealDate);
});