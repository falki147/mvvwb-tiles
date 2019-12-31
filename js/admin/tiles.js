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

function NumberInputElement() {
    var element = document.createElement("input");
    element.type = "text";
    element.value = "0";

    element.addEventListener("change", this._inputChanged.bind(this));
    element.addEventListener("keyup", this._inputChanged.bind(this));
    element.addEventListener("keydown", this._keyDown.bind(this));

    Object.defineProperty(this, "value", {
        get: function() { return this._value; },
        set: this._setValue
    });

    Object.defineProperty(this, "disabled", {
        get: function() { return this.element.disabled; },
        set: this._setDisabled
    });

    this.element = element;
    this.validator = function () { return true };

    this._value = 0;
    this._onChange = [];
}

NumberInputElement.prototype.onChange = function (cb) {
    this._onChange.push(cb);
};

NumberInputElement.prototype._setValue = function (value) {
    if (this._value !== value) {
        this._value = value;
        this.element.value = value.toString();
        this._validate();
    }
};

NumberInputElement.prototype._setDisabled = function (disabled) {
    if (this.element.disabled !== disabled) {
        this.element.disabled = disabled;

        if (disabled) {
            this.element.value = "";
            this.element.classList.remove("invalid");
        }
        else {
            this.element.value = this.value.toString();
            this._validate();
        }
    }
};

NumberInputElement.prototype._validate = function () {
    this.element.classList.remove("invalid");

    if (isNaN(this.element.value) || !this.validator(Number(this.element.value))) {
        this.element.classList.add("invalid");
        return false;
    }

    return true;
};

NumberInputElement.prototype._inputChanged = function () {
    if (this._validate()) {
        this._value = Number(this.element.value);
        this._triggerChange();
    }
};

NumberInputElement.prototype._triggerChange = function () {
    for (var i = 0; i < this._onChange.length; ++i)
        this._onChange[i].call(this);
};

NumberInputElement.prototype._keyDown = function (ev) {
    var value = Number(this.element.value);

    if (isNaN(value))
        return;

    switch (ev.key) {
    case "ArrowUp":
        ++value;
        break;
    case "ArrowDown":
        --value;
        break;
    default:
        return;
    }

    if (!this.validator(value))
        return;

    this.element.value = value.toString();
    this._inputChanged();
};

function TextInputElement() {
    var element = document.createElement("input");
    element.type = "text";
    element.value = "";

    element.addEventListener("change", this._inputChanged.bind(this));
    element.addEventListener("keyup", this._inputChanged.bind(this));

    Object.defineProperty(this, "value", {
        get: function() { return this._value; },
        set: this._setValue
    });

    Object.defineProperty(this, "disabled", {
        get: function() { return this.element.disabled; },
        set: this._setDisabled
    });

    this.element = element;
    this.validator = function () { return true };

    this._value = "";
    this._onChange = [];
}

TextInputElement.prototype.onChange = function (cb) {
    this._onChange.push(cb);
};

TextInputElement.prototype._setValue = function (value) {
    if (this._value !== value) {
        this._value = value;
        this.element.value = value.toString();
        this._validate();
    }
};

TextInputElement.prototype._setDisabled = function (disabled) {
    if (this.element.disabled !== disabled) {
        this.element.disabled = disabled;

        if (disabled) {
            this.element.value = "";
            this.element.classList.remove("invalid");
        }
        else {
            this.element.value = this.value.toString();
            this._validate();
        }
    }
};

TextInputElement.prototype._validate = function () {
    this.element.classList.remove("invalid");

    if (!this.validator(this.element.value)) {
        this.element.classList.add("invalid");
        return false;
    }

    return true;
};

TextInputElement.prototype._inputChanged = function () {
    if (this._validate()) {
        this._value = this.element.value;
        this._triggerChange();
    }
};

TextInputElement.prototype._triggerChange = function () {
    for (var i = 0; i < this._onChange.length; ++i)
        this._onChange[i].call(this);
};

function SelectElement(options) {
    var element = document.createElement("select");
    var keys = Object.keys(options);

    for (var i = 0; i < keys.length; ++i) {
        if (options.hasOwnProperty(keys[i])) {
            var option = document.createElement("option");
            option.text = options[keys[i]];
            option.value = keys[i];
            element.options.add(option);
        }
    }

    element.addEventListener("change", this._selectChanged.bind(this));

    Object.defineProperty(this, "value", {
        get: function() { return this._value; },
        set: this._setValue
    });

    Object.defineProperty(this, "disabled", {
        get: function() { return this.element.disabled; },
        set: this._setDisabled
    });

    this.element = element;

    this._value = "";
    this._onChange = [];
}

SelectElement.prototype.onChange = function (cb) {
    this._onChange.push(cb);
};

SelectElement.prototype._setValue = function (value) {
    if (this._value !== value) {
        this._value = value;
        this.element.value = value;
    }
};

SelectElement.prototype._setDisabled = function (disabled) {
    if (this.element.disabled !== disabled) {
        this.element.disabled = disabled;

        if (disabled)
            this.element.selectedIndex = -1;
        else
            this.element.value = this.value;
    }
};

SelectElement.prototype._selectChanged = function () {
    this._value = this.element.value;
    this._triggerChange();
};

SelectElement.prototype._triggerChange = function () {
    for (var i = 0; i < this._onChange.length; ++i)
        this._onChange[i].call(this);
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
        url: "",
        icon: "",
        type: "post",
        title: ""
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

    var view = new TilesView(this._cleanData(JSON.parse(input.value)));
    view.onDataChanged(this._onChange.bind(this));

    new Display(element, view);

    this._view = view;
    this._input = input;

    this._createFrom(element, JSON.parse(iconInput.value));
}

Tiles.prototype._createFrom = function (element, icons) {
    var form = document.createElement("div");
    form.classList.add("item-data");

    var type = new SelectElement({ "post": "Post", "url": "URL" });
    var x = new NumberInputElement();
    var y = new NumberInputElement();
    var w = new NumberInputElement();
    var h = new NumberInputElement();
    var title = new TextInputElement();
    var postid = new NumberInputElement();
    var url = new TextInputElement();
    var icon = new SelectElement(icons);

    w.validator = h.validator = function (n) {
        return n >= 0;
    };

    this._bind(type, "type");
    this._bind(x, "x");
    this._bind(y, "y");
    this._bind(w, "width");
    this._bind(h, "height");
    this._bind(title, "title");
    this._bind(postid, "postid");
    this._bind(url, "url");
    this._bind(icon, "icon");

    form.appendChild(this._createRow((i18n.type || "Type") + ":", type));
    form.appendChild(this._createRow((i18n.x || "X") + ":", x));
    form.appendChild(this._createRow((i18n.y || "Y") + ":", y));
    form.appendChild(this._createRow((i18n.width || "Width") + ":", w));
    form.appendChild(this._createRow((i18n.height || "Height") + ":", h));
    form.appendChild(this._createRow((i18n.title || "Title") + ":", title));
    form.appendChild(this._createRow((i18n.post || "Post ID") + ":", postid));
    form.appendChild(this._createRow((i18n.url || "URL") + ":", url));
    form.appendChild(this._createRow((i18n.icon || "Icon") + ":", icon));
    form.appendChild((new ButtonRowElement(this._view)).getElement());

    element.appendChild(form);
};

Tiles.prototype._bind = function (element, field) {
    var _this = this;

    element.onChange(function () {
        if (_this._view.getSelection()) {
            _this._view.getSelection()[field] = this.value;
            _this._view.triggerChange();
        }
    });

    function fieldEnabled(type, field) {
        switch (field) {
        case "postid":
            return type === "post";
        case "url":
        case "icon":
            return type === "url";
        }

        return true;
    }

    function update() {
        var selection = _this._view.getSelection();

        if (selection) {
            element.value = selection[field];
            element.disabled = !fieldEnabled(selection.type, field);
        }
        else
            element.disabled = true;
    }

    this._view.onDataChanged(update);
    this._view.onSelectionChanged(update);
    update();
};

Tiles.prototype._createRow = function (title, element) {
    // Create HTML elements
    var row = document.createElement("div");
    row.classList.add("row");

    var cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = title;
    row.appendChild(cell);

    var elementCell = document.createElement("div");
    elementCell.classList.add("cell");
    elementCell.appendChild(element.element);
    row.appendChild(elementCell);

    function update() {
        if (element.disabled)
            row.classList.add("disabled");
        else
            row.classList.remove("disabled");
    }

    this._view.onDataChanged(update);
    this._view.onSelectionChanged(update);

    return row;
};

Tiles.prototype._onChange = function () {
    this._input.value = JSON.stringify(this._view.getData());
};

Tiles.prototype._cleanData = function (data) {
    return data.map(function (tile) {
        return {
            type: typeof tile.type === "undefined" ? "" : tile.type.toString(),
            x: isNaN(tile.x) ? 0 : Number(tile.x),
            y: isNaN(tile.y) ? 0 : Number(tile.y),
            width: isNaN(tile.width) ? 0 : Number(tile.width),
            height: isNaN(tile.height) ? 0 : Number(tile.height),
            title: typeof tile.title === "undefined" ? "" : tile.title.toString(),
            postid: isNaN(tile.postid) ? 0 : Number(tile.postid),
            url: typeof tile.url === "undefined" ? "" : tile.url.toString(),
            icon: typeof tile.icon === "undefined" ? "" : tile.icon.toString()
        };
    });
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
