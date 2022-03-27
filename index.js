import 'alpinejs';

Alpine.data('appData', () => ({
  state: {
    filters: [],
    maxHour: 24,
    minHour: 0,
    datePattern: '2022-07-02  (\\d+)',
  },
  messagesText: `2022-07-02 04:52:39 DEBUG HelloExample:19 - This is debug : don't worry, be happy
2022-07-02 10:52:39 INFO  HelloExample:23 - This is info : don't worry, be happy
2022-07-02 18:52:39 WARN  HelloExample:26 - This is warn : don't worry, be happy
2022-07-02 22:52:39 ERROR HelloExample:27 - This is error : don't worry, be happy
2022-07-02 23:52:39 FATAL HelloExample:28 - This is fatal : don't worry, be happy`,
  hasRegexError: false,

  get messagesList() {
    return this.messagesText.split('\n');
  },
  get filteredMessagesList() {
    let hourRegex = null;
    try {
      hourRegex = new RegExp(this.state.datePattern, '');
      this.hasRegexError = false;
    } catch (e) {
      console.error(e);
      this.hasRegexError = true;
    }
    return this.messagesList.filter((text) => {
      let isHidden = false;

      isHidden = this.state.filters.some((x) => {
        if (text.indexOf(x) > -1) {
          return true;
        }
        return false;
      });

      let hourMatch = text.match(hourRegex);
      let hour = hourMatch && hourMatch[1];
      console.log(hourMatch);

      if (hour && Number(hour) > this.state.maxHour) {
        isHidden = true;
      }

      if (hour && Number(hour) < this.state.minHour) {
        isHidden = true;
      }

      return !isHidden;
    });
  },

  init() {
    let savedState = localStorage.getItem('filer-app-state');
    if (savedState) {
      try {
        let oldState = JSON.parse(savedState);
        Object.assign(this.state, oldState);
      } catch (e) {
        console.error(e);
      }
    }

    this.$watch('state', this.handleStateUpdate.bind(this));
  },

  handleAddFilter(filterInput) {
    let val = filterInput.value;

    if (!val) {
      return;
    }

    this.state.filters.push(val);

    filterInput.value = '';
  },

  removeFilter(index) {
    this.state.filters.splice(index, 1);
  },

  padNumber(val) {
    return ('0' + val).slice(-2);
  },

  handleStateUpdate() {
    localStorage.setItem('filer-app-state', JSON.stringify(this.state));
  },
}));
