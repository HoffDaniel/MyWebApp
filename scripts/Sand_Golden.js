const items = [
  { element: document.getElementById("item-a"), cx: 1, cy: 1 },
  { element: document.getElementById("item-b"), cx: 0, cy: 1 },
  { element: document.getElementById("item-c"), cx: 0, cy: 0 },
  { element: document.getElementById("item-d"), cx: 1, cy: 0 },
  { element: document.getElementById("item-e"), cx: 1, cy: 1 },
  { element: document.getElementById("item-f"), cx: 0, cy: 1 },
  { element: document.getElementById("item-g"), cx: 0, cy: 0 }
];

function updateEllipse(item) {
  const itemWidth = item.element.clientWidth;
  const itemHeight = item.element.clientHeight;
  const cx = itemWidth * item.cx;
  const cy = itemHeight * item.cy;

  item.ellipse.setAttribute("cx", cx);
  item.ellipse.setAttribute("cy", cy);
  item.ellipse.setAttribute("rx", itemWidth);
  item.ellipse.setAttribute("ry", itemHeight);
}

function createEllipse(item) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  item.element.appendChild(svg);

  const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  ellipse.setAttribute("stroke", "var(--Colour-800)");
  ellipse.setAttribute("fill", "none");
  ellipse.setAttribute("stroke-width", "42");
  svg.appendChild(ellipse);

  item.ellipse = ellipse;
  updateEllipse(item);
}

items.forEach(createEllipse);

window.addEventListener("resize", () => {
  items.forEach(updateEllipse);
});

