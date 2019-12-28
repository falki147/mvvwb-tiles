var i18n = window.mvvwbTilesI18n || {};

function TilesView(data) {
    this._data = data;
    this._selectedData = null;
    this._onSelectionChanged = [];
    this._onDataChanged = [];
}

TilesView.prototype.setSelection = function (data) {
    if (this._selectedData === data)
        return;

    this._selectedData = data;

    for (var i = 0; i < this._onSelectionChanged.length; ++i)
        this._onSelectionChanged[i](data);
};

TilesView.prototype.getSelection = function () {
    return this._selectedData;
};

TilesView.prototype.triggerChange = function () {
    for (var i = 0; i < this._onDataChanged.length; ++i)
        this._onDataChanged[i](this._data);
};

TilesView.prototype.onSelectionChanged = function (handler) {
    this._onSelectionChanged.push(handler);
};

TilesView.prototype.onDataChanged = function (handler) {
    this._onDataChanged.push(handler);
};

TilesView.prototype.getData = function () {
    return this._data;
};

function Display(element, view) {
    view.onDataChanged(this._display.bind(this));
    view.onSelectionChanged(this._select.bind(this));

    var container = document.createElement("div");
    container.classList.add("item-container");
    element.appendChild(container);

    this._colors = [
        "#2ac06d",
        "#f94a7a",
        "#4A9FF9",
        "#f9944a"
    ];

    this._container = container;
    this._view = view;

    this._display();
}

Display.prototype._select = function (data) {
    var ind = this._view.getData().indexOf(data);
    var items = this._container.getElementsByClassName("item");

    for (var i = 0; i < items.length; ++i)
        items[i].classList.remove("selected");

    if (ind >= items.length || ind < 0)
        return;

    items[ind].classList.add("selected");
};

Display.prototype._display = function () {
    var data = this._view.getData();
    var selection = this._view.getSelection();

    while (this._container.firstChild)
        this._container.removeChild(this._container.firstChild);

    var bounds = this._getBounds(data);

    for (var i = 0; i < data.length; ++i) {
        var element = document.createElement("div");
        element.classList.add("item");
        element.style.left = ((data[i].x - bounds.x) / bounds.width * 100) + "%";
        element.style.marginTop = ((data[i].y - bounds.y) / bounds.width * 100) + "%";
        element.style.width = (data[i].width / bounds.width * 100) + "%";
        element.style.paddingBottom = (data[i].height / bounds.width * 100) + "%";

        element.addEventListener("click", (function (view, data) {
            view.setSelection(data);
        }).bind(this, this._view, data[i]));

        if (data[i] === selection)
            element.classList.add("selected");

        var content = document.createElement("div");
        content.classList.add("content");
        content.style.borderColor = this._colors[i % this._colors.length];
        element.appendChild(content);

        this._container.appendChild(element);
    }

    var element = document.createElement("div");
    element.classList.add("spacer");
    element.style.paddingTop = (bounds.height / bounds.width * 100) + "%";
    this._container.appendChild(element);
};

Display.prototype._getBounds = function (data) {
    if (!data.length)
        return { x: 0, y: 0, width: 0, height: 0 };

    var x1 = Infinity;
    var y1 = Infinity;
    var x2 = -Infinity;
    var y2 = -Infinity;

    for (var i = 0; i < data.length; ++i) {
        x1 = Math.min(x1, data[i].x);
        y1 = Math.min(y1, data[i].y);
        x2 = Math.max(x2, data[i].x + data[i].width);
        y2 = Math.max(y2, data[i].y + data[i].height);
    }

    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
};

function NumberInputElement(view, name, positive) {
    view.onSelectionChanged(this._dataChanged.bind(this));
    view.onDataChanged(this._dataChanged.bind(this));

    var input = document.createElement("input");
    input.type = "text";

    input.addEventListener("change", this._onChange.bind(this));
    input.addEventListener("keyup", this._onChange.bind(this));
    input.addEventListener("keydown", this._keyDown.bind(this));

    this._view = view;
    this._input = input;
    this._name = name;
    this._positive = Boolean(positive);

    this._dataChanged();
}

NumberInputElement.prototype.getElement = function () {
    return this._input;
};

NumberInputElement.prototype._dataChanged = function () {
    this._input.classList.remove("invalid");

    if (this._view.getSelection() === null) {
        this._input.disabled = true;
        this._input.value = "";
    }
    else {
        var item = this._view.getSelection();

        this._input.disabled = false;
        this._input.value = item[this._name];
    }
};

NumberInputElement.prototype._onChange = function () {
    if (this._view.getSelection() === null)
        return;

    var value = Number(this._input.value);

    if (isNaN(value) || (this._positive && value < 0)) {
        this._input.classList.add("invalid");
        return;
    }

    this._input.classList.remove("invalid");

    if (this._view.getSelection()[this._name] == value.toString())
        return;

    this._view.getSelection()[this._name] = value;
    this._view.triggerChange();
};

NumberInputElement.prototype._keyDown = function (ev) {
    switch (ev.key) {
    case "ArrowUp":
        if (this._view.getSelection() === null)
            break;

        var value = Number(this._input.value) + 1;

        if (isNaN(value) || (this._positive && value < 0))
            break;

        this._input.value = value;
        this._view.getSelection()[this._name] = value;
        this._view.triggerChange();
        break;
    case "ArrowDown":
        if (this._view.getSelection() === null)
            break;

        var value = Number(this._input.value) - 1;

        if (isNaN(value) || (this._positive && value < 0))
            break;

        this._input.value = value;
        this._view.getSelection()[this._name] = value;
        this._view.triggerChange();
        break;
    }
};

function TextInputElement(view, name) {
    view.onSelectionChanged(this._dataChanged.bind(this));
    view.onDataChanged(this._dataChanged.bind(this));

    var input = document.createElement("input");
    input.type = "text";

    input.addEventListener("change", this._onChange.bind(this));

    this._view = view;
    this._input = input;
    this._name = name;

    this._dataChanged();
}

TextInputElement.prototype.getElement = function () {
    return this._input;
};

TextInputElement.prototype._dataChanged = function () {
    if (this._view.getSelection() === null) {
        this._input.disabled = true;
        this._input.value = "";
    }
    else {
        var item = this._view.getSelection();

        this._input.disabled = false;
        this._input.value = item[this._name];
    }
};

TextInputElement.prototype._onChange = function () {
    if (this._view.getSelection()[this._name] === this._input.value)
        return;

    this._view.getSelection()[this._name] = this._input.value;
    this._view.triggerChange();
};

function SelectInputElement(view, name, options) {
    view.onSelectionChanged(this._dataChanged.bind(this));
    view.onDataChanged(this._dataChanged.bind(this));

    var select = document.createElement("select");

    for (var i = 0; i < options.length; ++i) {
        var option = document.createElement("option");
        option.text = options[i].name;
        option.value = options[i].value;
        select.options.add(option);
    }

    select.addEventListener("change", this._onChange.bind(this));

    this._view = view;
    this._select = select;
    this._name = name;

    this._dataChanged();
}

SelectInputElement.prototype.getElement = function () {
    return this._select;
};

SelectInputElement.prototype._dataChanged = function () {
    if (this._view.getSelection() === null) {
        this._select.selectedIndex = -1;
        this._select.disabled = true;
    }
    else {
        var value = this._view.getSelection()[this._name];

        this._select.selectedIndex = -1;

        for (var i = 0; i < this._select.options.length; ++i) {
            if (this._select.options[i].value === value) {
                this._select.selectedIndex = i;
                break;
            }
        }

        this._select.disabled = false;
    }
};

SelectInputElement.prototype._onChange = function () {
    if (this._view.getSelection() === null)
        return;

    if (this._select.selectedOptions.length < 1)
        return;

    var value = this._select.selectedOptions[0].value;

    if (this._view.getSelection()[this._name] == value)
        return;

    this._view.getSelection()[this._name] = value;
    this._view.triggerChange();
};

function RowElement(view, text, element, types) {
    if (types !== undefined && types.length > 0) {
        view.onSelectionChanged(this._dataChanged.bind(this));
        view.onDataChanged(this._dataChanged.bind(this));
    }

    var row = document.createElement("div");
    row.classList.add("row");

    var cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = text;
    row.appendChild(cell);

    var elementCell = document.createElement("div");
    elementCell.classList.add("cell");
    elementCell.appendChild(element);
    row.appendChild(elementCell);

    this._row = row;
    this._view = view;
    this._types = types;

    if (types !== undefined && types.length > 0)
        this._dataChanged();
}

RowElement.prototype.getElement = function () {
    return this._row;
};

RowElement.prototype._dataChanged = function () {
    this._row.style.display = "none";

    if (this._view.getSelection() === null)
        return;

    if (this._types.indexOf(this._view.getSelection().type) < 0)
        return;

    this._row.style.display = "table-row";
};

function ButtonRowElement(view) {
    view.onSelectionChanged(this._onSelectionChanged.bind(this));

    var row = document.createElement("div");
    row.classList.add("row", "button-row");

    var cell = document.createElement("div");
    cell.classList.add("cell");
    row.appendChild(cell);

    var deleteButton = document.createElement("button");
    deleteButton.classList.add("button");
    deleteButton.type = "button";
    deleteButton.innerText = i18n.delete || "Delete";
    deleteButton.addEventListener("click", this._delete.bind(this));

    var addButton = document.createElement("button");
    addButton.classList.add("button");
    addButton.type = "button";
    addButton.innerText = i18n.add || "Add";
    addButton.addEventListener("click", this._add.bind(this));

    var addCell = document.createElement("div");
    addCell.classList.add("cell");
    addCell.appendChild(deleteButton);
    addCell.appendChild(addButton);
    row.appendChild(addCell);

    this._row = row;
    this._view = view;
    this._deleteButton = deleteButton;

    this._onSelectionChanged(view.getSelection());
}

ButtonRowElement.prototype.getElement = function () {
    return this._row;
};

ButtonRowElement.prototype._add = function () {
    var pos = this._getNewTilePosition();

    this._view.getData().push({
        x: pos.x,
        y: pos.y,
        width: 1,
        height: 1,
        postid: 0,
        url: '',
        icon: '',
        type: 'post'
    });

    this._view.triggerChange();
};

ButtonRowElement.prototype._getNewTilePosition = function () {
    var data = this._view.getData();

    if (!data.length)
        return { x: 0, y: 0 };

    var x = Infinity;
    var y = -Infinity;

    for (var i = 0; i < data.length; ++i) {
        x = Math.min(x, data[i].x);
        y = Math.max(y, data[i].y + data[i].height);
    }

    return { x: x, y: y };
};

ButtonRowElement.prototype._delete = function () {
    if (this._view.getSelection() === null)
        return;

    var ind = this._view.getData().indexOf(this._view.getSelection());

    if (ind >= 0) {
        this._view.getData().splice(ind, 1);
        this._view.triggerChange();
        this._view.setSelection(null);
    }
};

ButtonRowElement.prototype._onSelectionChanged = function (data) {
    this._deleteButton.disabled = data === null;
};

function Tiles(element) {
    element.classList.add("initialized");

    var input = element.getElementsByClassName("data")[0];
    var iconInput = element.getElementsByClassName("data-icons")[0];

    var view = new TilesView(JSON.parse(input.value));
    view.onDataChanged(this._onChange.bind(this));

    new Display(element, view);

    this._view = view;
    this._input = input;

    this._createFrom(element, JSON.parse(iconInput.value));
}

Tiles.prototype._createFrom = function (element, icons) {
    var form = document.createElement("div");
    form.classList.add("item-data");

    var iconEntries = [];

    for (var key in icons)
        iconEntries.push({
            name: icons[key],
            value: key
        });

    var type = new SelectInputElement(this._view, "type", [
        { "name": "Post", "value": "post" },
        { "name": "URL", "value": "url" }
    ]);

    var icon = new SelectInputElement(this._view, "icon", iconEntries);

    var x = new NumberInputElement(this._view, "x");
    var y = new NumberInputElement(this._view, "y");
    var w = new NumberInputElement(this._view, "width", true);
    var h = new NumberInputElement(this._view, "height", true);
    var title = new TextInputElement(this._view, "title");
    var postid = new NumberInputElement(this._view, "postid");
    var url = new TextInputElement(this._view, "url");

    var rows = [
        new RowElement(this._view, (i18n.type || "Type") + ":", type.getElement()),
        new RowElement(this._view, (i18n.x || "X") + ":", x.getElement()),
        new RowElement(this._view, (i18n.y || "Y") + ":", y.getElement()),
        new RowElement(this._view, (i18n.width || "Width") + ":", w.getElement()),
        new RowElement(this._view, (i18n.height || "Height") + ":", h.getElement()),
        new RowElement(this._view, (i18n.title || "Title") + ":", title.getElement()),
        new RowElement(this._view, (i18n.post || "Post ID") + ":", postid.getElement(), [ "post" ]),
        new RowElement(this._view, (i18n.url || "URL") + ":", url.getElement(), [ "url" ]),
        new RowElement(this._view, (i18n.icon || "Icon") + ":", icon.getElement(), [ "url" ]),
        new ButtonRowElement(this._view)
    ];

    for (var i = 0; i < rows.length; ++i)
        form.appendChild(rows[i].getElement());

    element.appendChild(form);
};

Tiles.prototype._onChange = function () {
    this._input.value = JSON.stringify(this._view.getData());

    // Fire change event to trigger save button
    var event = document.createEvent("HTMLEvents");
    event.initEvent("change", true, false);
    this._input.dispatchEvent(event);
};

Tiles.initialize = function () {
    function initializeAll(root) {
        var elements = root.getElementsByClassName("mvvwb-tiles");

        for (var i = 0; i < elements.length; ++i)
            if (!elements[i].classList.contains("initialized"))
                new Tiles(elements[i]);
    }

    initializeAll(document);

    if (this._initializedCallback)
        return;

    this._initializedCallback = true;
    window.addEventListener("load", initializeAll.bind(this, document));
};

Tiles.initialize();
