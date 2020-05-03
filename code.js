var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getImage(paint) {
    return __awaiter(this, void 0, void 0, function* () {
        const bytes = yield paint.exportAsync();
        figma.showUI(__html__, { height: 500 });
        figma.ui.postMessage(bytes);
        figma.ui.onmessage = (message) => {
            if (message.error != null) {
                figma.notify(message.error);
            }
            else {
                placeText(message);
            }
            figma.closePlugin();
        };
    });
}
function placeText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        figma.ui.hide();
        yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        const nodes = [];
        for (let i = 0; i < text.ParsedResults[0].TextOverlay.Lines["length"]; i++) {
            const rect = figma.createText();
            rect.characters = text.ParsedResults[0].TextOverlay.Lines[i].LineText;
            figma.currentPage.selection.map((selected) => {
                rect.x =
                    selected.width +
                        selected.x +
                        text.ParsedResults[0].TextOverlay.Lines[i].Words[0].Left;
            });
            figma.currentPage.selection.map((selected) => {
                rect.y =
                    selected.y + text.ParsedResults[0].TextOverlay.Lines[i].Words[0].Top;
            });
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    });
}
if (figma.currentPage.selection.length > 0) {
    figma.currentPage.selection.map((selected) => {
        getImage(selected);
    });
}
else {
    figma.notify("Select anything with text");
    figma.closePlugin();
}
