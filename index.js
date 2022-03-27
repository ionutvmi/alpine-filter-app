import 'alpinejs';

Alpine.data('appData', () => ({
  state: {
    filters: [],
    maxHour: 24,
    minHour: 0,
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

    this.$watch('state', this.saveState.bind(this));
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

  saveState() {
    localStorage.setItem('filer-app-state', JSON.stringify(this.state));
  },

  updateVisibility(element, textElement, state) {
    this.$nextTick(() => {
      let text = textElement.innerText;
      let isHidden = false;

      isHidden = this.state.filters.some((x) => {
        if (text.indexOf(x) > -1) {
          return true;
        }
        return false;
      });

      if (isHidden) {
        element.style.display = 'none';
      } else {
        element.style.display = 'block';
      }
    });
  },
}));
