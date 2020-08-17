async function getImage(paint) {
  const bytes = await paint.exportAsync();

  figma.showUI(__html__, { height: 480 });

  figma.ui.postMessage(bytes);

  figma.ui.onmessage = (message) => {
    if (message.error != null) {
      figma.notify(message.error);
    } else {
      placeText(message);
    }
    figma.closePlugin();
  };
}

async function placeText(text) {
  figma.ui.hide();

  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  const nodes = [];

  for (let line of text.ParsedResults[0].TextOverlay.Lines) {
    console.log(line);
    const rect = figma.createText();

    rect.characters = line.LineText;

    figma.currentPage.selection.map((selected) => {
      rect.x = selected.width + selected.x + line.Words[0].Left;
    });

    figma.currentPage.selection.map((selected) => {
      rect.y = selected.y + line.Words[0].Top;
    });

    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

if (figma.currentPage.selection.length > 0) {
  figma.currentPage.selection.map((selected) => {
    getImage(selected);
  });
} else {
  figma.notify("Select anything with text");
  figma.closePlugin();
}
