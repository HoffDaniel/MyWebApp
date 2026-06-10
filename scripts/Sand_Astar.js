/*==========================================  ==========================================*/
/*==========================================  A* Pathfinding (clean renderer)  =========*/
/*==========================================  ==========================================*/

// Elements & CSS vars
const Astar_grid = document.getElementById("Astar_grid");
const gridStyle   = getComputedStyle(Astar_grid);

let grid = [];                  // 2D array of nodes ({ r,c, el, g,h,f,parent, obstacle, state })
let grid_Size   = parseInt(gridStyle.getPropertyValue('--grid_Size'));
let rand_Value  = parseFloat(gridStyle.getPropertyValue('--rand_Value'));
let animation_delay = parseFloat(gridStyle.getPropertyValue('--animation_Delay'));

let openSet = [];               // array (you can swap to a binary heap later)
let closed  = new Set();        // Set of "r,c" strings
const idOf  = (r,c) => `${r},${c}`;

// UI state
let mouse_down = false;
let coursor_state = "obstacle";     // "start" | "goal" | "obstacle"
let h_state = "Euclidean";          // "Euclidean" | "Manhattan" | "Diagonal" (Octile)
let algorithm = "Astar";          // "Dijkstra" | "Astar" | "Greedy"
let movement = "8way";              // "4way" | "8way"

// Stats
let stepsTaken = 0;
let startTime = 0;
let endTime = 0;
let path_count = 0;

// Mouse helpers
document.body.onmousedown = () => { mouse_down = true;  };
document.body.onmouseup   = () => { mouse_down = false; };

// ==== Controls: sliders (optional presence-safe) ======================================
const speedWrap   = document.querySelector('#slider_Speed');
const speedInput  = speedWrap?.querySelector('#slider_Input');
const speedValue  = speedWrap?.querySelector('#slider_Value');
if (speedInput && speedValue) {
  if (!Number.isFinite(animation_delay)) animation_delay = 0;
  speedInput.value = animation_delay;
  speedValue.textContent = `Speed: ${animation_delay} ms`;
  speedInput.oninput = function(){
    animation_delay = +this.value;
    speedValue.textContent = `Speed: ${animation_delay} ms`;
  };
}

const randWrap   = document.querySelector('#slider_Random');
const randInput  = randWrap?.querySelector('#slider_Input');
const randValue  = randWrap?.querySelector('#slider_Value');
if (randInput && randValue) {
  randInput.value = rand_Value;
  randValue.textContent = `Random Obstacles: ${rand_Value}`;
  randInput.oninput = function(){
    rand_Value = +this.value;
    randValue.textContent = `Random Obstacles: ${rand_Value}`;
  };
}

const gridWrap   = document.querySelector('#slider_Grid');
const gridInput  = gridWrap?.querySelector('#slider_Input');
const gridValue  = gridWrap?.querySelector('#slider_Value');
if (gridInput && gridValue) {
  gridInput.value = grid_Size;
  gridValue.textContent = `Grid Size: ${grid_Size} x ${grid_Size}`;
  gridInput.oninput = function(){
    grid_Size = +this.value;
    gridValue.textContent = `Grid Size: ${grid_Size} x ${grid_Size}`;
    document.documentElement.style.setProperty('--grid_Size', grid_Size);
    update_Grid(grid_Size);
    document.getElementById("slider_Random")?.click();
  };
}

// ==== Build / Update Grid ==============================================================
make_Grid();

function make_Grid(){
  // reset containers
  openSet = [];
  closed  = new Set();
  grid = [];

  // clear DOM children
  while (Astar_grid.firstChild) Astar_grid.removeChild(Astar_grid.firstChild);

  // build with a fragment (fast)
  const frag = document.createDocumentFragment();

  for (let r = 0; r < grid_Size; r++) {
    const row = [];
    for (let c = 0; c < grid_Size; c++) {
      const el = document.createElement('div');
      el.className = 'Astar_cell';
      if (r === 0 && c === 0) el.id = 'start';
      if (r === grid_Size - 1 && c === grid_Size - 1) el.id = 'goal';

      el.dataset.row = r;
      el.dataset.col = c;

      const node = {
        r, c, el,
        g: Infinity,
        h: 0,
        f: Infinity,
        parent: null,
        obstacle: false,
        state: ""    // "", "open", "visited", "current", "path"
      };

      // input handlers
      el.addEventListener('click',   (e) => handleCellClick(node, e));
      el.addEventListener('mouseover', () => { if (mouse_down) toggleObstacle(node); });

      frag.appendChild(el);
      row.push(node);
    }
    grid.push(row);
  }

  Astar_grid.appendChild(frag);
}

function update_Grid(size){
  // Only re-template cols/rows and rebuild once
  Astar_grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  Astar_grid.style.gridTemplateRows    = `repeat(${size}, 1fr)`;
  make_Grid();
}

// ==== Renderer ========================================================================
function setCellState(node, state){
  node.state = state || "";
  const el = node.el;
  el.classList.remove("open","visited","current","path");
  if (node.state) el.classList.add(node.state);
  el.classList.toggle("obstacle", node.obstacle);
}

// ==== UI Helpers ======================================================================
function showInfo(text){
  const info = document.getElementById("info");
  if (!info) return;
  info.style.display = "block";
  info.style.opacity = "1";
  info.innerText = text;
  setTimeout(() => {
    info.style.opacity = '0';
    setTimeout(() => { info.style.display = 'none'; }, 500);
  }, 2000);
}

// Called by your buttons (unchanged signatures)
function cellSelectionClick(event, state){
  const btn = event.target;
  // toggle selected styling
  const group = document.getElementById('cell-group');
  group.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  coursor_state = state;   // "start" | "goal" | "obstacle"
}

function heuristicSelectionClick(event, state){
  const btn = event.target;
  // toggle selected styling
  const group = document.getElementById('heuristic-group');
  group.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // map UI choice
  h_state = state; // "Euclidean" | "Manhattan" | "Diagonal"
  // choose movement model: Manhattan => 4way, others => 8way
  movement = (h_state === 'Manhattan') ? '4way' : '8way';
  showInfo(h_state);
}

function algorithmSelectionClick(event, name){
  const btn = event.target;
  // toggle selected styling
  const group = document.getElementById('algorithm-group');
  group.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  algorithm = name; // 'Astar', 'Dijkstra', 'Greedy'
  const heurGroup = document.getElementById('heuristic-group');
  const setHeuristicsEnabled = (enabled) => {
    heurGroup.querySelectorAll('button').forEach(b => {
      b.disabled = !enabled;
      b.classList.toggle('disabled', !enabled);
    });
  };

  switch (algorithm) {
    case 'Dijkstra':
      setHeuristicsEnabled(false);      // no heuristic for Dijkstra
      showInfo('Dijkstra selected (no heuristic)');
      break;

    case 'Astar':
      setHeuristicsEnabled(true);
      showInfo('A* selected');
      break;

    case 'Greedy':
      setHeuristicsEnabled(true);
      showInfo('Greedy selected');
      break;

    default:
      showInfo(`No algorithm selected? (${algorithm})`);
      break;
  }
}

// Click on grid cells
function handleCellClick(node, evt){
  if (coursor_state === "obstacle") return toggleObstacle(node);

  // move start/goal ID
  if (coursor_state === "start" || coursor_state === "goal"){
    const old = Astar_grid.querySelector(`#${coursor_state}`);
    if (old){
      old.removeAttribute("id");
      const r = +old.dataset.row, c = +old.dataset.col;
      setCellState(grid[r][c], grid[r][c].state);
    }
    node.el.id = coursor_state;
    setCellState(node, node.state);
  }
}

function toggleObstacle(node){
  if (node.el.id === 'start' || node.el.id === 'goal') return;
  node.obstacle = !node.obstacle;
  setCellState(node, node.state);
}

function setObstacle(node, value){
  if (node.el.id === 'start' || node.el.id === 'goal') return;
  node.obstacle = !!value;
  setCellState(node, node.state);
}

function nodesByRing(center){
  const rings = new Map();
  let maxK = 0;
  for (const row of grid){
    for (const n of row){
      if (n.el.closest('#Astar_menu')) continue;
      if (n.el.id === 'start' || n.el.id === 'goal') continue;
      const d = Math.hypot(n.r - center.r, n.c - center.c);
      const k = Math.floor(d);         // integer ring index
      if (!rings.has(k)) rings.set(k, []);
      rings.get(k).push(n);
      if (k > maxK) maxK = k;
    }
  }
  return { rings, maxK };
}

// --- helpers: clamp + map pointer -> nearest cell ---
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function cellNearestToPointer(clientX, clientY) {
  const rect = Astar_grid.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  // clamp to grid rect so it's "nearest" even if the mouse is outside
  const x = clamp(clientX, rect.left, rect.right);
  const y = clamp(clientY, rect.top, rect.bottom);

  const col = clamp(Math.floor(((x - rect.left) / rect.width)  * grid_Size), 0, grid_Size - 1);
  const row = clamp(Math.floor(((y - rect.top)  / rect.height) * grid_Size), 0, grid_Size - 1);

  return grid[row]?.[col] ?? null;
}

// --- remember last pointer position ---
let lastPointer = null;
window.addEventListener('pointermove', (e) => {
  lastPointer = { x: e.clientX, y: e.clientY };
}, { passive: true });

// --- trigger ripple: at load (if pos known) OR on first move ---
let splashDone = false;

window.addEventListener('load', () => {
    // try immediately if we already saw a pointermove (e.g., user moved in header)
    if (lastPointer) {
      const n = cellNearestToPointer(lastPointer.x, lastPointer.y);
      if (n) {
        splashDone = true;
        introRipple({ center: [n.r, n.c], stepDelay: 42, tail: 6, thickness: 2 });
      }
    }

    // otherwise do it on the first pointer move after load
    if (!splashDone) {
      const once = (e) => {
        if (splashDone) return;
        const n = cellNearestToPointer(e.clientX, e.clientY);
        if (n) {
          splashDone = true;
          introRipple({ center: [n.r, n.c], stepDelay: 42, tail: 6, thickness: 2 });
        }
      };
      window.addEventListener('pointermove', once, { once: true, passive: true });
    }
});

// Just for fun, trying some drop effect
// overlapped ripple: expanding wave with a trailing tail
async function introRipple(opts = {}){
  const {
    center = 'middle',              // 'start' | 'goal' | 'middle' | [r,c] | 'centre'
    stepDelay = 24,                 // ms between rings
    tail = 6,                       // how many rings stay visible behind the front
    thickness = 1,                  // widen the ring (merge this many neighboring rings)
    cleanAtEnd = true               // clear leftover obstacles at the end
  } = opts;

  // start from a clean board (keeps start/goal)
  document.getElementById('button_Clear')?.click();

  // choose center node
  let cNode;
  const label = (center === 'centre') ? 'middle' : center;
  if (label === 'start') {
    const el = Astar_grid.querySelector('#start'); cNode = grid[+el.dataset.row][+el.dataset.col];
  } else if (label === 'goal') {
    const el = Astar_grid.querySelector('#goal');  cNode = grid[+el.dataset.row][+el.dataset.col];
  } else if (Array.isArray(label)) {
    cNode = grid[label[0]][label[1]];
  } else { // middle
    cNode = grid[Math.floor(grid_Size/2)][Math.floor(grid_Size/2)];
  }

  const { rings, maxK } = nodesByRing(cNode);

  // helper to get a "thick" ring by merging neighbors
  const mergedRing = (k) => {
    const nodes = [];
    for (let i = k; i < k + thickness; i++){
      const r = rings.get(i);
      if (r) nodes.push(...r);
    }
    return nodes;
  };

  // schedule ON and OFF with overlap
  const jobs = [];
  for (let k = 0; k <= maxK; k++){
    const nodes = mergedRing(k);
    if (!nodes.length) continue;

    // ON at k*stepDelay
    jobs.push(sleep(k * stepDelay).then(() => nodes.forEach(n => setObstacle(n, true))));
    // OFF at (k+tail)*stepDelay
    jobs.push(sleep((k + tail) * stepDelay).then(() => nodes.forEach(n => setObstacle(n, false))));
  }

  await Promise.all(jobs);

  // ensure fully clean if requested
  if (cleanAtEnd){
    for (const row of grid) for (const n of row){
      if (n.obstacle) setObstacle(n, false);
    }
  }
}

// ==== A* Core ========================================================================
const DIRS_4 = [[-1,0],[1,0],[0,-1],[0,1]];
const DIRS_8 = [...DIRS_4, [-1,-1],[-1,1],[1,-1],[1,1]];

function neighborsOf(node){
  const dirs = (movement === '8way') ? DIRS_8 : DIRS_4;
  const out = [];
  for (const [dr,dc] of dirs){
    const r = node.r + dr, c = node.c + dc;
    if (r>=0 && c>=0 && r<grid_Size && c<grid_Size) out.push(grid[r][c]);
  }
  return out;
}

function stepCost(a, b){
  const diag = (a.r !== b.r && a.c !== b.c);
  return diag ? Math.SQRT2 : 1;
}

function hScore(a, goal){
  if (algorithm === 'Dijkstra') return 0;
  const dr = Math.abs(goal.r - a.r);
  const dc = Math.abs(goal.c - a.c);
  switch (h_state) {
    case 'Manhattan': return dr + dc;
    case 'Diagonal':  return (dr>dc) ? (dr-dc) + dc*Math.SQRT2 : (dc-dr) + dr*Math.SQRT2; // Octile
    case 'Euclidean': return Math.hypot(dr, dc); // Euclidean
    default:          return Math.hypot(dr, dc); // Euclidean
  }
}

function priority(n){
  if (algorithm === 'Dijkstra') return n.g;
  if (algorithm === 'Greedy')   return n.h;
  return n.f; // astar
}

function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

// ==== Run Button =====================================================================
document.getElementById("button_Run")?.addEventListener("click", async () => {
  showInfo("Running A*...");
  // Reset states (keep obstacles)
  document.getElementById("button_Reset")?.click();
  let run_button = document.getElementById("button_Run");
  // // Soft reset of states (not obstacles or start/goal)
  // for (const row of grid) for (const n of row){
  //   n.g = Infinity; n.h = 0; n.f = Infinity; n.parent = null;
  //   if (!n.obstacle) setCellState(n, "");
  //   else setCellState(n, ""); // still show obstacle via toggle
  // }
  //openSet = [];
  //closed  = new Set();
  stepsTaken = 0;
  path_count = 0;
  startTime = performance.now();

  // Resolve start/goal inside the grid scope only
  const startEl = Astar_grid.querySelector("#start");
  const goalEl  = Astar_grid.querySelector("#goal");
  if (!startEl || !goalEl) { showInfo("Define start & goal"); return; }

  run_button.disabled = true;
  run_button.classList.add('disabled');

  const start = grid[+startEl.dataset.row][+startEl.dataset.col];
  const goal  = grid[+goalEl.dataset.row][+goalEl.dataset.col];

  start.g = 0;
  start.h = hScore(start, goal);
  start.f = start.h;

  openSet.push(start);
  setCellState(start, "open");

  while (openSet.length) {
    // get node with min f (linear scan)
    let best = 0;
    for (let i=1;i<openSet.length;i++) if (priority(openSet[i]) < priority(openSet[best])) best = i;
    const current = openSet.splice(best,1)[0];

    setCellState(current, "current");

    // goal check
    if (current === goal){
      await build_Path(current, start);
      break;
    }

    closed.add(idOf(current.r,current.c));
    setCellState(current, "visited");

    // expand
    for (const nb of neighborsOf(current)){
      if (nb.obstacle) continue;
      if (closed.has(idOf(nb.r, nb.c))) continue;

      const tentative = current.g + stepCost(current, nb);
      if (tentative < nb.g){
        nb.parent = current;
        nb.g = tentative;
        nb.h = hScore(nb, goal);
        nb.f = nb.g + nb.h;
        if (!openSet.includes(nb)){
          openSet.push(nb);
          setCellState(nb, "open");
        }
      }
    }

    stepsTaken++;
    await sleep(animation_delay);
  }

  run_button.disabled = false;
  run_button.classList.remove('disabled');

  endTime = performance.now();
  const duration = (endTime - startTime).toFixed(1);
  const pathText = (path_count > 0) ? `${path_count}` : "NO PATH FOUND";

  const stats = `Steps: ${stepsTaken} • Time: ${duration} ms • Path Lenght: ${pathText}`;
  const statsEl = document.getElementById("runtime-stats");
  if (statsEl) statsEl.innerText = stats;
});

// Build path (paint from goal back to start)
async function build_Path(goalNode, startNode){
  showInfo("Building Path...");
  let n = goalNode;
  while (n && n !== startNode){
    setCellState(n, "path");
    n = n.parent;
    path_count++
    //await sleep(42);
  }
  setCellState(startNode, "path");
  showInfo("Path found!");
}

// ==== Random Obstacles Button =========================================================
document.getElementById("slider_Random")?.addEventListener("click", () => {
  // Reset states (dont keep obstacles)
  document.getElementById("button_Clear")?.click();

  showInfo("Randomising obstacles...");
  for (const row of grid) for (const n of row) {
    // skip menu overlay, start, goal
    if (n.el.closest('#Astar_menu')) continue;
    if (n.el.id === 'start' || n.el.id === 'goal') continue;

    if (Math.random() < rand_Value) {
      n.obstacle = !n.obstacle;   // toggle for some variability
      setCellState(n, n.state);
    }
  }
});

// ==== Reset & Clear Buttons ===========================================================
document.getElementById("button_Reset")?.addEventListener("click", () => {
  showInfo("Reset path");
  for (const row of grid) for (const n of row){
    n.g = Infinity; n.h = 0; n.f = Infinity; n.parent = null;
    // keep obstacles & start/goal — just clear search state
    if (!n.obstacle) setCellState(n, "");
    else setCellState(n, ""); // obstacle remains via toggle
  }
  openSet = [];
  closed  = new Set();
});

document.getElementById("button_Clear")?.addEventListener("click", () => {
  showInfo("Clear all");
  for (const row of grid) for (const n of row){
    n.obstacle = false;
    n.parent = null;
    n.el.removeAttribute("id");
    setCellState(n, "");
  }
  // put default start/goal back
  grid[0][0].el.id = 'start';
  grid[grid_Size-1][grid_Size-1].el.id = 'goal';
});

// ===== Utility (kept from your version) ===============================================
function maxNum(){ return grid_Size - 1; }
function minNum(){ return 0; }
