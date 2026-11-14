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
  controls.append(startLabel);

  const trail = make('ol', 'trail');
  trail.setAttribute('aria-label', 'Route so far');
  const state = make('p', 'trace-state');
  state.setAttribute('role', 'status');
  state.setAttribute('aria-atomic', 'true');
  const options = make('div', 'trace-options');
  options.setAttribute('role', 'group');
  options.setAttribute('aria-label', 'Available next transfers');
  const actions = make('div', 'trace-actions');
  const back = make('button', '', 'Back');
  const reset = make('button', '', 'Reset');
  back.type = reset.type = 'button';
  actions.append(back, reset);
  section.append(controls, trail, state, options, actions);
  element.replaceChildren(section);

  const steps = [];
  function render() {
    const visited = [startSelect.value, ...steps.map(step => step.to)];
    const current = visited[visited.length - 1];
    const next = entries.filter(entry => entry.from === current);
    const seen = new Set();
    const items = visited.map((location, index) => {
      const revisited = seen.has(location);
      seen.add(location);
      const item = make('li');
      const entryNumber = index ? 'Entry ' + steps[index - 1].id + ' · ' : '';
      item.textContent = entryNumber + location + (revisited ? ' · return' : '');
      return item;
    });
    trail.replaceChildren(...items);
    const branches = next.map(entry => {
      const button = make('button', 'trace-choice', 'Entry ' + entry.id + ' · ' + entry.to);
      button.type = 'button';
      button.addEventListener('click', () => {
        steps.push(entry);
        render();
        (options.firstElementChild || back).focus();
      });
      return button;
    });
    options.replaceChildren(...branches);
    const lastVisit = visited.slice(0, -1).lastIndexOf(current);
    const loop = lastVisit < 0 ? '' : 'Loop closed at ' + current + '. ';
    const remaining = next.length === 1 ? '1 listed exit.' : next.length + ' listed exits.';
    const latest = steps[steps.length - 1];
    const arrival = latest ? 'Entry ' + latest.id + ' reached ' + current + '. ' : 'Starting at ' + current + '. ';
    state.textContent = arrival + loop + (next.length ? remaining : 'The current list ends here.');
    back.disabled = reset.disabled = steps.length === 0;
  }

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
    render();
    startSelect.focus();
  });
  render();
}
