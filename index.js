import 'alpinejs';

Alpine.data('appData', () => ({
  state: {
    filters: [],
    maxHour: 24,
    minHour: 0,
  },
  messagesList: [],
  filteredMessagesList: [],

  init() {
    let msgData = this.$el.querySelectorAll('.js_bd_data');
    let msgList = [];

    for (let msg of msgData) {
      msgList.push(msg.innerText);
    }
    this.messagesList = msgList;

    let savedState = localStorage.getItem('filer-app-state');
    if (savedState) {
      try {
        let oldState = JSON.parse(savedState);
        Object.assign(this.state, oldState);
      } catch (e) {
        console.error(e);
      }
    }

    this.filteredMessagesList = this.getFilteredMessages();

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

  getFilteredMessages() {
    return this.messagesList.filter((text) => {
      let isHidden = false;

      isHidden = this.state.filters.some((x) => {
        if (text.indexOf(x) > -1) {
          return true;
        }
        return false;
      });

      let hour = text.match(/2022 (\d{2})/)[1];

      if (hour && Number(hour) > this.state.maxHour) {
        isHidden = true;
      }
      
      if (hour && Number(hour) < this.state.minHour) {
        isHidden = true;
      }

      return !isHidden;
    });
  },

  handleStateUpdate() {
    this.filteredMessagesList = this.getFilteredMessages();

    localStorage.setItem('filer-app-state', JSON.stringify(this.state));
  },
}));
