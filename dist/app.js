import { entries, findings, meshes, trajectory } from './atlas-data.js';
import { initTracer } from './tracer.js';

const byId = id => document.getElementById(id);
const meshNames = new Map(meshes.map(mesh => [mesh.id, mesh.title]));
const tabs = [...document.querySelectorAll('[role="tab"]')];

function node(tag, text, className) {
  const result = document.createElement(tag);
  if (text != null) result.textContent = text;
  if (className) result.className = className;
  return result;
}

function meshLabel(ids) {
  return node('p', ids.map(id => meshNames.get(id)).join('  /  '), 'mesh-label');
}

function entryRef(id) {
  const link = node('a', '#' + id, 'ref');
  link.href = '#entry-' + id;
  link.setAttribute('aria-label', 'Read entry ' + id);
  return link;
}

const findingList = node('div', null, 'finding-list');
findingList.setAttribute('aria-label', 'Emergent pattern register');
const findingCard = node('article', null, 'finding-card');
findingCard.setAttribute('aria-live', 'polite');
const findingLayout = node('div', null, 'find-grid');
findingLayout.append(findingList, findingCard);
byId('panel-findings').replaceChildren(findingLayout);

function showFinding(finding) {
  for (const button of findingList.children) {
    button.setAttribute('aria-pressed', String(button.dataset.id === String(finding.id)));
  }
  const routeList = node('ul', null, 'route-list');
  for (const route of finding.routes) {
    const item = node('li');
    const refs = node('span');
    for (const id of route.entries) refs.append(entryRef(id), ' ');
    item.append(node('span', route.label), refs);
    routeList.append(item);
  }
  findingCard.replaceChildren(meshLabel(finding.meshes), node('h3', finding.title),
    node('p', finding.description), node('p', finding.significance), routeList);
}

for (const finding of findings) {
  const button = node('button');
  button.type = 'button';
  button.dataset.id = finding.id;
  button.append(node('span', String(finding.id).padStart(2, '0'), 'entry-id'), node('span', finding.title));
  button.addEventListener('click', () => showFinding(finding));
  findingList.append(button);
}
showFinding(findings[0]);

initTracer(byId('panel-trace'));

const meshGrid = node('div', null, 'mesh-grid');
for (const mesh of meshes) {
  const article = node('article');
  article.append(node('h3', mesh.title), node('p', mesh.description), node('h4', 'What this view can hide'), node('p', mesh.selfDetection));
  meshGrid.append(article);
}
const assessment = node('article', null, 'trajectory');
assessment.append(node('h3', 'Trajectory direction declaration'), node('p', trajectory.indicators.join(', ') + ' — each is indeterminate.'), node('p', trajectory.summary));
byId('panel-meshes').append(meshGrid, assessment);

const search = node('input');
search.type = 'search';
search.placeholder = 'e.g. puddle, fruit, or 21';
const filter = node('select');
filter.append(new Option('All surfaces', ''));
meshes.forEach(mesh => filter.append(new Option(mesh.title, mesh.id)));
const filterBar = node('div', null, 'filters');
function labeledControl(label, control) {
  const wrap = node('label', label + ' ');
  wrap.append(control);
  return wrap;
}
filterBar.append(labeledControl('Search entries', search), labeledControl('Surface', filter));
const registerCount = node('p', null, 'mesh-label');
registerCount.setAttribute('role', 'status');
const register = node('div');
byId('panel-register').append(filterBar, registerCount, register);

function showEntries() {
  const query = search.value.trim().toLowerCase();
  const matches = entries.filter(entry => {
    if (filter.value && !entry.meshes.includes(filter.value)) return false;
    if (/^#?\d+$/.test(query)) return entry.id === Number(query.replace('#', ''));
    return [entry.from, entry.to, entry.description].join(' ').toLowerCase().includes(query);
  });
  registerCount.textContent = matches.length + ' of ' + entries.length + ' entries';
  const rows = matches.map(entry => {
    const row = node('article', null, 'entry-row');
    row.id = 'row-' + entry.id;
    row.tabIndex = -1;
    row.append(node('span', String(entry.id).padStart(2, '0'), 'entry-id'), node('span', entry.description), meshLabel(entry.meshes));
    return row;
  });
  register.replaceChildren(...rows);
  if (!rows.length) register.append(node('p', 'No entries match. Try a different word or surface.'));
}
search.addEventListener('input', showEntries);
filter.addEventListener('change', showEntries);
showEntries();

function activateTab(id) {
  for (const tab of tabs) {
    const active = tab.id === 'tab-' + id;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    byId(tab.getAttribute('aria-controls')).hidden = !active;
  }
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => {
    activateTab(tab.id.slice(4));
    history.replaceState(null, '', '#view-' + tab.id.slice(4));
  });
  tab.addEventListener('keydown', event => {
    const next = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1}[event.key];
    if (next == null) return;
    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  });
}
function openReference() {
  const entry = /^#entry-(\d+)$/.exec(location.hash);
  if (entry && entries.some(item => item.id === Number(entry[1]))) {
    activateTab('register');
    filter.value = search.value = '';
    showEntries();
    const row = byId('row-' + Number(entry[1]));
    row.focus({preventScroll:true});
    row.scrollIntoView({block:'center'});
    return;
  }
  const view = /^#view-(findings|trace|register|meshes)$/.exec(location.hash);
  if (view) {
    activateTab(view[1]);
    byId('atlas').scrollIntoView();
  }
}
window.addEventListener('hashchange', openReference);
openReference();
