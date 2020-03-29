import React from 'react';
import DatePicker from './DatePicker';
import StarRating from './StarRating';
import './VisitPeriodPicker.css';

class VisitPeriodPicker extends React.Component {

  static MESSAGE_PAST = 'Choose date not in the past';
  static MESSAGE_SOME_RESERVED = 'Some dates reserved. Choose continous period';
  static MESSAGE_RESERVED = 'Reserved. Choose diffrent date';
  static MESSAGE_BEFORE_CHECK_OUT = 'Choose date before check out date';
  static MESSAGE_AFTER_CHECK_IN = 'Choose date after check in date';

  constructor(props) {
    super(props);
    this.state = {
      checkInDatePickerHidden: true,
      checkOutDatePickerHidden: true,
      checkInDate: null,
      checkOutDate: null
    };
  };

  clear() {
    this.setState({
      checkInDate: null,
      checkOutDate: null,
      showError: false
    });
  }

  save() {
    if (this.state.checkInDate != null && this.state.checkOutDate != null) {
      this.setState({showError: false});
      this.props.onSave(this.state.checkInDate, this.state.checkOutDate);
    } else {
      this.setState({showError: true});
    };
  }

  toggleCheckInDatePicker() {
    this.setState(state => ({
      checkInDatePickerHidden: !state.checkInDatePickerHidden
    }));
  }

  toggleCheckOutDatePicker() {
    this.setState(state => ({
      checkOutDatePickerHidden: !state.checkOutDatePickerHidden
    }));
  }

  onCheckInDateChange(checkInDate) {
    this.setState({
      checkInDate,
      checkInDatePickerHidden: true,
      showError: false
    });
  }

  onCheckOutDateChange(checkOutDate) {
    this.setState({
      checkOutDate,
      checkOutDatePickerHidden: true,
      showError: false
    });
  }

  getMinCheckOutDateAndMessage() {
    if (this.state.checkInDate == null) {
      return {
        date: new Date(),
        message: VisitPeriodPicker.MESSAGE_PAST
      }
    } else {
      return {
        date: this.state.checkInDate,
        message: VisitPeriodPicker.MESSAGE_AFTER_CHECK_IN
      };
    }
  }

  getMinCheckInDateAndMessage() {
    const minCheckInDateByBlacklist = this.getMinCheckInDateByBlacklist();
    const now = new Date();
    if (minCheckInDateByBlacklist != null && minCheckInDateByBlacklist > now) {
      return {
        date: minCheckInDateByBlacklist,
        message: VisitPeriodPicker.MESSAGE_SOME_RESERVED
      }
    } else {
      return {
        date: now,
        message: VisitPeriodPicker.MESSAGE_PAST
      }
    }
  }

  getMaxCheckOutDateByBlacklist() {
    return this.getDateByBlacklist(this.state.checkInDate, (date1, date2) => date1 > date2 );
  }


  getMinCheckInDateByBlacklist() {
    return this.getDateByBlacklist(this.state.checkOutDate, (date1, date2) => date1 < date2 );
  }

  getDateByBlacklist(date, comparator) {
    if (date != null && this.props.blacklist != null) {
      return this.props.blacklist.reduce((accumulator, value) => {
        if ((accumulator == null && comparator(value, date)) || (accumulator != null && comparator(value, date) && comparator(accumulator, value))) {
          return value;
        } else {
          return accumulator;
        }
      }, null);
    }
  }

  formatDate(date) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  }

  render() {
    const checkInMessage = this.state.checkInDate == null ? 'Check in' : this.formatDate(this.state.checkInDate);
    const checkOutMessage = this.state.checkOutDate == null ? 'Check out' : this.formatDate(this.state.checkOutDate);
    const minCheckOutDateAndMessage = this.getMinCheckOutDateAndMessage();
    const minCheckInDateAndMessage = this.getMinCheckInDateAndMessage();
    const error = this.state.showError ? <div className="section text-error">Please enter both dates</div> : null;
    return (
      <div className="card">
        <section className="section">
          <h2 className="card__header">
            {this.props.price} zł <small className="small">per night
            </small>
          </h2>
          <StarRating rating={this.props.averageRating}></StarRating>
          {this.props.numberOfRatings}
        </section>
        <hr className="section hr"></hr>
        <div className="label">Dates</div>
        <div className="dropdown-anchor border">
          <button className={`button button--grow${this.state.checkInDatePickerHidden ? '' : ' button--active'}`} onClick={() => {this.toggleCheckInDatePicker()}}>{checkInMessage}</button>
          <div className="arrow"></div>
          <button className={`button button--grow${this.state.checkOutDatePickerHidden ? '' : ' button--active'}`} onClick={() => {this.toggleCheckOutDatePicker()}}>{checkOutMessage}</button>
          <DatePicker hide={this.state.checkInDatePickerHidden}
                      date={this.state.checkInDate}
                      onDateChange={date => this.onCheckInDateChange(date)}
                      onClickOutside={() => this.toggleCheckInDatePicker()}
                      updated={this.props.updated}
                      min={minCheckInDateAndMessage.date}
                      max={this.state.checkOutDate}
                      blacklist={this.props.blacklist}
                      messages={{blacklist: VisitPeriodPicker.MESSAGE_RESERVED, min: minCheckInDateAndMessage.message, max: VisitPeriodPicker.MESSAGE_BEFORE_CHECK_OUT}}>
          </DatePicker>
          <DatePicker hide={this.state.checkOutDatePickerHidden}
                      date={this.state.checkOutDate}
                      onDateChange={date => this.onCheckOutDateChange(date)}
                      onClickOutside={() => this.toggleCheckOutDatePicker()}
                      updated={this.props.updated}
                      min={minCheckOutDateAndMessage.date}
                      max={this.getMaxCheckOutDateByBlacklist()}
                      blacklist={this.props.blacklist}
                      messages={{blacklist: VisitPeriodPicker.MESSAGE_RESERVED, min: minCheckOutDateAndMessage.message, max: VisitPeriodPicker.MESSAGE_SOME_RESERVED}}>
          </DatePicker>
        </div>
        {error}
        <div className="section">
          <button type="button" className="button border" onClick={() => this.clear()}>Clear</button> <button type="button" className="button border" onClick={() => this.save()}>Save</button>
        </div>
      </div>
    );
  }
}

export default VisitPeriodPicker;