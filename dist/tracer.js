import { entries } from './atlas-data.js';

const locations = [...new Set(entries.flatMap(({ from, to }) => [from, to]))]
  .sort((left, right) => left.localeCompare(right));

export function initTracer(element) {
  const doc = element.ownerDocument;
  function make(tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  const section = make('section');
  section.setAttribute('aria-label', 'Trace a water route');
  const controls = make('div', 'tracer-controls');
  const startLabel = make('label', '', 'Start location ');
  const startSelect = make('select');
  locations.forEach(location => {
    const option = make('option', '', location);
    option.value = location;
    startSelect.append(option);
  });
  startSelect.value = 'Puddle';
  startLabel.append(startSelect);

  const directionLabel = make('label', '', 'Look for ');
  const directionSelect = make('select');
  for (const [value, label] of [
    ['departures', 'Departures · where water can go'],
    ['arrivals', 'Arrivals · where water can come from']
  ]) {
    const option = make('option', '', label);
    option.value = value;
    directionSelect.append(option);
  }
  directionSelect.value = 'departures';
  directionLabel.append(directionSelect);
  controls.append(startLabel, directionLabel);

  const trail = make('ol', 'trail');
  trail.setAttribute('aria-label', 'Route so far');
  const state = make('p', 'trace-state');
  state.setAttribute('role', 'status');
  state.setAttribute('aria-atomic', 'true');
  const options = make('div', 'trace-options');
  options.setAttribute('role', 'group');
  options.setAttribute('aria-label', 'Available transfers');
  const actions = make('div', 'trace-actions');
  const back = make('button', '', 'Back');
  const reset = make('button', '', 'Reset');
  back.type = reset.type = 'button';
  actions.append(back, reset);
  section.append(controls, trail, state, options, actions);
  element.replaceChildren(section);

  const steps = [];
  function recordStep(entry, upstream) {
    const current = upstream ? entry.from : entry.to;
    const previous = steps[steps.length - 1];
    let note = '';
    if (previous && previous.upstream !== upstream && previous.entry.id === entry.id) {
      note = 'Retraced entry ' + entry.id + '.';
    } else {
      // A water loop must close along an uninterrupted run in one reading direction.
      for (let i = steps.length - 1; i >= 0 && steps[i].upstream === upstream; i--) {
        const startOfStep = upstream ? steps[i].entry.to : steps[i].entry.from;
        if (startOfStep === current) {
          note = 'Loop closed at ' + current + '.';
          break;
        }
      }
    }
    steps.push({ entry, current, upstream, note });
  }

  function render() {
    const latest = steps[steps.length - 1];
    const current = latest ? latest.current : startSelect.value;
    const upstream = directionSelect.value === 'arrivals';
    const next = entries.filter(entry => (upstream ? entry.to : entry.from) === current);
    const items = steps.map(step => {
      const { entry } = step;
      const transfer = 'Entry ' + entry.id + ' · ' + entry.from + ' → ' + entry.to;
      const reading = step.upstream ? ' · read upstream to ' + entry.from : '';
      return make('li', '', transfer + reading + (step.note ? ' · ' + step.note : ''));
    });
    trail.replaceChildren(make('li', '', startSelect.value), ...items);
    const branches = next.map(entry => {
      const label = upstream ? 'from ' + entry.from : entry.to;
      const button = make('button', 'trace-choice', 'Entry ' + entry.id + ' · ' + label);
      button.type = 'button';
      button.addEventListener('click', () => {
        recordStep(entry, upstream);
        render();
        (options.firstElementChild || directionSelect).focus();
      });
      return button;
    });
    options.replaceChildren(...branches);

    let position = 'Starting at ' + current + '.';
    if (latest) {
      position = latest.upstream
        ? 'Read entry ' + latest.entry.id + ' upstream to ' + current + '.'
        : 'Entry ' + latest.entry.id + ' reached ' + current + '.';
    }
    let remaining;
    if (upstream) {
      remaining = next.length === 1 ? '1 listed arrival.' : next.length + ' listed arrivals.';
    } else {
      remaining = next.length === 1 ? '1 listed exit.' : next.length + ' listed exits.';
    }
    state.textContent = [position, latest?.note, remaining].filter(Boolean).join(' ');
    back.disabled = steps.length === 0;
    reset.disabled = steps.length === 0 && !upstream;
  }

  directionSelect.addEventListener('change', render);
  startSelect.addEventListener('change', () => {
    steps.length = 0;
    render();
  });
  back.addEventListener('click', () => {
    steps.pop();
    render();
    if (back.disabled) (options.firstElementChild || startSelect).focus();
  });
  reset.addEventListener('click', () => {
    steps.length = 0;
    directionSelect.value = 'departures';
    render();
    startSelect.focus();
  });
  render();
}
