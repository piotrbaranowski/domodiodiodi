import React from 'react';
import './DatePicker.css';

class DatePicker extends React.Component {

  static DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  static MONTHS_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  static DAY_IN_MILISECONDS = 86400000;

  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date()
    };
    this.onDocumentClicked = event => this.handleDocumentClicked(event);
  };

  getDateZeroTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  previousMonth() {
    this.offsetMonth(-1);
  }

  nextMonth() {
    this.offsetMonth(1);
  }
  
  offsetMonth(offset) {
    this.setState(oldState => {
      const newCurrentDate = new Date(oldState.currentDate);
      newCurrentDate.setMonth(newCurrentDate.getMonth() + offset)
      return {currentDate: newCurrentDate};
    });
  }

  selectDay(dayDate) {
    this.props.onDateChange(dayDate);
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClicked, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClicked, true);
  }

  handleDocumentClicked(event) {
    if (!this.props.hide && this.wrapperRef != null && !this.wrapperRef.contains(event.target)) {
      this.props.onClickOutside();
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  getDaysOfMonth() {
    const lastDayOfMonth = new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1, 0)
    const numberOfDaysInMonth = lastDayOfMonth.getDate();
    return [...Array(numberOfDaysInMonth).keys()].map(dayNumber => dayNumber + 1);
  }

  getFirstDayOfMonthDay() {
    const firstDayOfMonth = new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), 1);
    return firstDayOfMonth.getDay();
  }

  getDisabledMessage(dayDate) {
    if (!(this.props.min == null ||
        dayDate >= this.getDateZeroTime(this.props.min))) {
      return this.props.messages.min;
    }

    if (!(this.props.max == null ||
        dayDate <= this.getDateZeroTime(this.props.max))) {
      return this.props.messages.max;
    }

    if (this.props.blacklist != null && this.props.blacklist.some(blacklistedDate => blacklistedDate.getTime() === dayDate.getTime())) {
      return this.props.messages.blacklist;
    }
  }

  isToday(dayDate) {
    const now = new Date();
    return dayDate.getTime() === this.getDateZeroTime(now).getTime();
  }

  isActive(dayDate) {
    return this.props.date != null && dayDate.getTime() === this.props.date.getTime();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hide === true && this.props.hide === false) {
      if (this.props.date == null) {
        this.setState({
          currentDate: new Date()
        });
      } else {
        this.setState({
          currentDate: this.props.date
        });
      }
    }
  }

  getUpdatedInDays() {
    return Math.floor((new Date().getTime() - this.props.updated.getTime()) / DatePicker.DAY_IN_MILISECONDS);
  }

  getDayDate(dayNumber) {
    return new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), dayNumber);
  }

  render() {
    if (this.props.hide) {
      return null;
    }
    
    const calendarGrid = this.getDaysOfMonth().map(day => {
      const dayDate = this.getDayDate(day);
      return (
      <button type="button"
              key={day.toString()}
              disabled={this.getDisabledMessage(dayDate) != null}
              className={`grid-cell center-container button button--no-border-radius button--outline${this.isActive(dayDate) ? ' button--active' : ''}`}
              onClick={() => this.selectDay(dayDate)}
              title={this.getDisabledMessage(dayDate)}>
        <span className={this.isToday(dayDate) ? 'text-bold': ''}>{day}</span>
      </button>);
    });

    const daysOfWeek = DatePicker.DAYS_OF_WEEK.map(day => <span key={day}>{day}</span>);
    
    return (
    <div className="dropdown border" ref={node => this.setWrapperRef(node)}>
      <div className="grid-header section">
        <button className="button button--outline" onClick={() => this.previousMonth()}><div className="arrow arrow--left arrow--tight"></div></button>
        <span>
          {DatePicker.MONTHS_NAMES[this.state.currentDate.getMonth()]} {this.state.currentDate.getFullYear()}
        </span>
        <button className="button button--outline" onClick={() => this.nextMonth()}><div className="arrow arrow--tight"></div></button>
      </div>
      <section className="section">
        <div className="center-container margin-bottom-small">{daysOfWeek}</div>
        <div className="grid-container">
          <div style={{width: `calc(100% / 7 * ${this.getFirstDayOfMonthDay()})`}}></div>
          {calendarGrid}
        </div>
      </section>
      <p className="section">
        Minimum stay varies<br/>
        Updated {this.getUpdatedInDays()} days ago
      </p>
    </div>
    );
  }
}

export default DatePicker;