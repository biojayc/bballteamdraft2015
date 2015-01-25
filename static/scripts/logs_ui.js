var ui = ui || {};

ui.FILTERTYPES = {};
ui.FILTERTYPES.WHITE = 1;
ui.FILTERTYPES.BLACK = 2;
ui.FILTERS = {};
ui.FILTERS.DATE = 1;
ui.FILTERS.TIME = 2;
ui.FILTERS.METHOD = 3;
ui.FILTERS.URL = 4;
ui.FILTERS.IP_ADDRESS = 5;
ui.FILTERS.USER_AGENT = 6;

ui.state = {};
ui.state.rows = [];
ui.state.whiteFilters = {};
ui.state.blackFilters = {};
ui.state.currentFilterType = ui.FILTERTYPES.WHITE;

ui.init = function(logs) {
  ui.buildTable(logs);

  // set up event stuff
  ui.filterEvent = new Event('filterEvent');
  ui.eventDiv = document.createElement("DIV");
  document.body.appendChild(ui.eventDiv);
  ui.eventDiv.addEventListener('filterEvent', ui.eventHandler, false);
  window.addEventListener("hashchange", ui.loadFiltersFromHash, false);

  ui.loadFiltersFromHash();
  ui.updateHash();
}

ui.buildTable = function(logs) {
  var table = document.getElementById('logtable');
  for (var i = 0; i < logs.length; i++) {
    var log = logs[i];
    var tr = ui.makeRowFromLog(log);
    ui.state.rows.push({
      log: logs[i],
      tr: tr,
    });
    table.appendChild(tr);
  }
}

ui.makeRowFromLog = function(log) {
  var tr = document.createElement("TR");
  tr.appendChild(ui.makeTD(log.date, function() { ui.addFilter(ui.FILTERS.DATE, log.date); }));
  tr.appendChild(ui.makeTD(log.time, function() { ui.addFilter(ui.FILTERS.TIME, log.time); }));
  tr.appendChild(ui.makeTD(log.method, function() { ui.addFilter(ui.FILTERS.METHOD, log.method); }));
  tr.appendChild(ui.makeTD(log.url, function() { ui.addFilter(ui.FILTERS.URL, log.url); }));
  tr.appendChild(ui.makeTD(log.ip_address, function() { ui.addFilter(ui.FILTERS.IP_ADDRESS, log.ip_address); }));
  tr.appendChild(ui.makeTD(log.user_agent, function() { ui.addFilter(ui.FILTERS.USER_AGENT, log.user_agent); }));
  return tr;
}

ui.makeTD = function(text, click) {
  var td = document.createElement("TD");
  var textNode= document.createTextNode(text);
  if (click) {
    var a = document.createElement("A");
    a.addEventListener("click", click, true);
    a.appendChild(textNode);
    td.appendChild(a);
  } else {
    td.appendChild(textNode);
  }
  return td;
}

ui.loadFiltersFromHash = function() {
  var hash = window.location.hash;
  if (hash.length > 1) {
    var objstring = hash.substr(1, hash.length-1);
    var obj = eval('(' + decodeURIComponent(objstring) + ')');
    if (obj.w) {
      ui.state.whiteFilters = obj.w;
      var fire = true;
    }
    if (obj.b) {
      ui.state.blackFilters = obj.b;
      var fire = true;
    }
    if (fire) {
      ui.fireFilterEvent();
    }
  }
}

ui.clearFilters = function() {
  console.log("clearing filters");
  ui.state.whiteFilters = {};
  ui.state.blackFilters = {};
  ui.fireFilterEvent();
  updateHash();
}

ui.eventHandler = function(e) {
  // console.log('eventhandler called');

  // make all visible
  ui.foreach(ui.state.rows, function(row) { ui.showRow(row); });

  //now apply white filters.
  ui.applyWhiteFilter(ui.FILTERS.DATE, ui.state.rows, 'date');
  ui.applyWhiteFilter(ui.FILTERS.TIME, ui.state.rows, 'time');
  ui.applyWhiteFilter(ui.FILTERS.METHOD, ui.state.rows, 'method');
  ui.applyWhiteFilter(ui.FILTERS.URL, ui.state.rows, 'url');
  ui.applyWhiteFilter(ui.FILTERS.IP_ADDRESS, ui.state.rows, 'ip_address');
  ui.applyWhiteFilter(ui.FILTERS.USER_AGENT, ui.state.rows, 'user_agent');
  
  //apply black filters.
  ui.applyBlackFilter(ui.FILTERS.DATE, ui.state.rows, 'date');
  ui.applyBlackFilter(ui.FILTERS.TIME, ui.state.rows, 'time');
  ui.applyBlackFilter(ui.FILTERS.METHOD, ui.state.rows, 'method');
  ui.applyBlackFilter(ui.FILTERS.URL, ui.state.rows, 'url');
  ui.applyBlackFilter(ui.FILTERS.IP_ADDRESS, ui.state.rows, 'ip_address');
  ui.applyBlackFilter(ui.FILTERS.USER_AGENT, ui.state.rows, 'user_agent');

  // update hash
  ui.updateHash();
}

ui.updateHash = function() {
  var obj = {
    w: ui.state.whiteFilters,
    b: ui.state.blackFilters,
  };
  var filtersString=encodeURIComponent(JSON.stringify(obj));
  window.location.hash = filtersString;
}

ui.applyWhiteFilter = function(type, rows, field) {
  if (ui.state.whiteFilters[type]) {
    var val = ui.state.whiteFilters[type];
    ui.foreach(rows, function(row) {
      if (row.log[field] !== val) {
        ui.hideRow(row);
      }
    });
  }
}

ui.applyBlackFilter = function (type, rows, field) {
  if (ui.state.blackFilters[type]) {
    var arr = ui.state.blackFilters[type];
    ui.foreach(rows, function (row) {
      ui.foreach(arr, function (arrslot) {
        if (row.log[field] === arrslot) {
          ui.hideRow(row);
        }
      });
    });
  }
}

ui.foreach = function(arr, func) {
  for (var i = 0; i < arr.length; i++) {
    func(arr[i]);
  }
}

ui.updateFilterType = function() {
  var filtertype = parseInt(document.getElementById('filtertype').value);
  ui.state.currentFilterType = filtertype;
}

ui.addFilter = function(type, value) {
  if (ui.state.currentFilterType === ui.FILTERTYPES.WHITE) {
    ui.addWhiteFilter(type, value);
  } else if (ui.state.currentFilterType === ui.FILTERTYPES.BLACK) {
    ui.addBlackFilter(type, value);
  }
}

ui.addWhiteFilter = function(type, value) {
  ui.state.whiteFilters[type] = value;
  ui.fireFilterEvent();
}
ui.addBlackFilter = function(type, value) {
  if (!ui.state.blackFilters[type]) {
    ui.state.blackFilters[type] = [];
  }
  ui.state.blackFilters[type].push(value);
  ui.fireFilterEvent();
}

ui.fireFilterEvent = function() {
  ui.eventDiv.dispatchEvent(ui.filterEvent);
}

ui.hideRow = function(row) {
  row.tr.style.display = 'none';
}

ui.showRow = function(row) {
  row.tr.style.display = 'table-row';
}