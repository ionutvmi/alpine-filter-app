import 'alpinejs';

Alpine.data('appData', () => ({
  state: {
    filters: [],
    maxHour: 24,
    minHour: 0,
    datePattern: '2022 (\\d{2})',
  },
  messagesText: 'Initial data row 1\nInitial data row 2',

  get messagesList() {
    return this.messagesText.split('\n');
  },
  get filteredMessagesList() {
    let hourRegex = new RegExp(this.state.datePattern, 'g');

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
