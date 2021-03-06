/*
 jqGrid  4.1.1  - jQuery Grid
 Copyright (c) 2008, Tony Tomov, tony@trirand.com
 Dual licensed under the MIT and GPL licenses
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl-2.0.html
 Date: 2011-06-19
*/
/// <reference path="../jquery-1.4.1.min.js" />

(function (a) {
    a.jgrid = a.jgrid || {};
    a.extend(a.jgrid, {
        htmlDecode: function (d) {
            if (d && (d == "&nbsp;" || d == "&#160;" || d.length == 1 && d.charCodeAt(0) == 160)) return "";
            return !d ? d : String(d).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"')
        },
        htmlEncode: function (d) {
            return !d ? d : String(d).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\"/g, "&quot;")
        },
        format: function (d) {
            var e = a.makeArray(arguments).slice(1);
            if (d === undefined) d = "";
            return d.replace(/\{(\d+)\}/g,
            function (c, f) {
                return e[f]
            })
        },
        getCellIndex: function (d) {
            d = a(d);
            if (d.is("tr")) return -1;
            d = (!d.is("td") && !d.is("th") ? d.closest("td,th") : d)[0];
            if (a.browser.msie) return a.inArray(d, d.parentNode.cells);
            return d.cellIndex
        },
        stripHtml: function (d) {
            d += "";
            var e = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            if (d) return (d = d.replace(e, "")) && d !== "&nbsp;" && d !== "&#160;" ? d.replace(/\"/g, "'") : "";
            else return d
        },
        stringToDoc: function (d) {
            var e;
            if (typeof d !== "string") return d;
            try {
                e = (new DOMParser).parseFromString(d, "text/xml")
            } catch (c) {
                e = new ActiveXObject("Microsoft.XMLDOM");
                e.async = false;
                e.loadXML(d)
            }
            return e && e.documentElement && e.documentElement.tagName != "parsererror" ? e : null
        },
        parse: function (d) {
            if (d.substr(0, 9) == "while(1);") d = d.substr(9);
            if (d.substr(0, 2) == "/*") d = d.substr(2, d.length - 4);
            d || (d = "{}");
            return a.jgrid.useJSON === true && typeof JSON === "object" && typeof JSON.parse === "function" ? JSON.parse(d) : eval("(" + d + ")")
        },
        parseDate: function (d, e) {
            var c = {
                m: 1,
                d: 1,
                y: 1970,
                h: 0,
                i: 0,
                s: 0
            },
            f,
            g,
            h;
            f = /[\\\/:_;.,\t\T\s-]/;
            if (e && e !== null && e !== undefined) {
                e = a.trim(e);
                e = e.split(f);
                d = d.split(f);
                var j = a.jgrid.formatter.date.monthNames,
                b = a.jgrid.formatter.date.AmPm,
                m = function (l, n) {
                    if (l === 0) {
                        if (n == 12) n = 0
                    } else if (n != 12) n += 12;
                    return n
                };
                f = 0;
                for (g = d.length; f < g; f++) {
                    if (d[f] == "M") {
                        h = a.inArray(e[f], j);
                        if (h !== -1 && h < 12) e[f] = h + 1
                    }
                    if (d[f] == "F") {
                        h = a.inArray(e[f], j);
                        if (h !== -1 && h > 11) e[f] = h + 1 - 12
                    }
                    if (d[f] == "a") {
                        h = a.inArray(e[f], b);
                        if (h !== -1 && h < 2 && e[f] == b[h]) {
                            e[f] = h;
                            c.h = m(e[f], c.h)
                        }
                    }
                    if (d[f] == "A") {
                        h = a.inArray(e[f], b);
                        if (h !== -1 && h > 1 && e[f] == b[h]) {
                            e[f] = h - 2;
                            c.h = m(e[f], c.h)
                        }
                    }
                    if (e[f] !== undefined) c[d[f].toLowerCase()] = parseInt(e[f], 10)
                }
                c.m = parseInt(c.m, 10) - 1;
                f = c.y;
                if (f >= 70 && f <= 99) c.y = 1900 + c.y;
                else if (f >= 0 && f <= 69) c.y = 2E3 + c.y
            }
            return new Date(c.y, c.m, c.d, c.h, c.i, c.s, 0)
        },
        jqID: function (d) {
            return String(d).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&")
        },
        guid: 1,
        uidPref: "jqg",
        randId: function (d) {
            return (d ? d : a.jgrid.uidPref) + a.jgrid.guid++
        },
        getAccessor: function (d, e) {
            var c, f, g = [],
            h;
            if (typeof e === "function") return e(d);
            c = d[e];
            if (c === undefined) try {
                if (typeof e === "string") g = e.split(".");
                if (h = g.length) for (c = d; c && h--; ) {
                    f = g.shift();
                    c = c[f]
                }
            } catch (j) { }
            return c
        },
        ajaxOptions: {},
        from: function (d) {
            return new 
            function (e, c) {
                if (typeof e == "string") e = a.data(e);
                var f = this,
                g = e,
                h = true,
                j = false,
                b = c,
                m = /[\$,%]/g,
                l = null,
                n = null,
                k = false,
                p = "",
                o = [],
                v = true;
                if (typeof e == "object" && e.push) {
                    if (e.length > 0) v = typeof e[0] != "object" ? false : true
                } else throw "data provides is not an array";
                this._hasData = function () {
                    return g === null ? false : g.length === 0 ? false : true
                };
                this._getStr = function (q) {
                    var r = [];
                    j && r.push("jQuery.trim(");
                    r.push("String(" + q + ")");
                    j && r.push(")");
                    h || r.push(".toLowerCase()");
                    return r.join("")
                };
                this._strComp = function (q) {
                    return typeof q == "string" ? ".toString()" : ""
                };
                this._group = function (q, r) {
                    return {
                        field: q.toString(),
                        unique: r,
                        items: []
                    }
                };
                this._toStr = function (q) {
                    if (j) q = a.trim(q);
                    h || (q = q.toLowerCase());
                    return q = q.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"')
                };
                this._funcLoop = function (q) {
                    var r = [];
                    a.each(g,
                    function (s, x) {
                        r.push(q(x))
                    });
                    return r
                };
                this._append = function (q) {
                    if (b === null) b = "";
                    else b += p === "" ? " && " : p;
                    if (k) b += "!";
                    b += "(" + q + ")";
                    k = false;
                    p = ""
                };
                this._setCommand = function (q, r) {
                    l = q;
                    n = r
                };
                this._resetNegate = function () {
                    k = false
                };
                this._repeatCommand = function (q, r) {
                    if (l === null) return f;
                    if (q !== null && r !== null) return l(q, r);
                    if (n === null) return l(q);
                    if (!v) return l(q);
                    return l(n, q)
                };
                this._equals = function (q, r) {
                    return f._compare(q, r, 1) === 0
                };
                this._compare = function (q, r, s) {
                    if (s === undefined) s = 1;
                    if (q === undefined) q = null;
                    if (r === undefined) r = null;
                    if (q === null && r === null) return 0;
                    if (q === null && r !== null) return 1;
                    if (q !== null && r === null) return -1;
                    if (!h && typeof q !== "number" && typeof r !== "number") {
                        q = String(q).toLowerCase();
                        r = String(r).toLowerCase()
                    }
                    if (q < r) return -s;
                    if (q > r) return s;
                    return 0
                };
                this._performSort = function () {
                    if (o.length !== 0) g = f._doSort(g, 0)
                };
                this._doSort = function (q, r) {
                    var s = o[r].by,
                    x = o[r].dir,
                    A = o[r].type,
                    B = o[r].datefmt;
                    if (r == o.length - 1) return f._getOrder(q, s, x, A, B);
                    r++;
                    s = f._getGroup(q, s, x, A, B);
                    x = [];
                    for (A = 0; A < s.length; A++) {
                        B = f._doSort(s[A].items, r);
                        for (var F = 0; F < B.length; F++) x.push(B[F])
                    }
                    return x
                };
                this._getOrder = function (q, r, s, x, A) {
                    var B = [],
                    F = [],
                    y = s == "a" ? 1 : -1,
                    G,
                    S;
                    if (x === undefined) x = "text";
                    S = x == "float" || x == "number" || x == "currency" || x == "numeric" ?
                    function (R) {
                        R = parseFloat(String(R).replace(m, ""));
                        return isNaN(R) ? 0 : R
                    } : x == "int" || x == "integer" ?
                    function (R) {
                        return R ? parseFloat(String(R).replace(m, "")) : 0
                    } : x == "date" || x == "datetime" ?
                    function (R) {
                        return a.jgrid.parseDate(A, R).getTime()
                    } : a.isFunction(x) ? x : function (R) {
                        R || (R = "");
                        return a.trim(String(R).toUpperCase())
                    };
                    a.each(q,
                    function (R, ca) {
                        G = r !== "" ? a.jgrid.getAccessor(ca, r) : ca;
                        if (G === undefined) G = "";
                        G = S(G, ca);
                        F.push({
                            vSort: G,
                            index: R
                        })
                    });
                    F.sort(function (R, ca) {
                        R = R.vSort;
                        ca = ca.vSort;
                        return f._compare(R, ca, y)
                    });
                    x = 0;
                    for (var C = q.length; x < C; ) {
                        s = F[x].index;
                        B.push(q[s]);
                        x++
                    }
                    return B
                };
                this._getGroup = function (q, r, s, x, A) {
                    var B = [],
                    F = null,
                    y = null,
                    G;
                    a.each(f._getOrder(q, r, s, x, A),
                    function (S, C) {
                        G = a.jgrid.getAccessor(C, r);
                        if (G === undefined) G = "";
                        if (!f._equals(y, G)) {
                            y = G;
                            F !== null && B.push(F);
                            F = f._group(r, G)
                        }
                        F.items.push(C)
                    });
                    F !== null && B.push(F);
                    return B
                };
                this.ignoreCase = function () {
                    h = false;
                    return f
                };
                this.useCase = function () {
                    h = true;
                    return f
                };
                this.trim = function () {
                    j = true;
                    return f
                };
                this.noTrim = function () {
                    j = false;
                    return f
                };
                this.execute = function () {
                    var q = b,
                    r = [];
                    if (q === null) return f;
                    a.each(g,
                    function () {
                        eval(q) && r.push(this)
                    });
                    g = r;
                    return f
                };
                this.data = function () {
                    return g
                };
                this.select = function (q) {
                    f._performSort();
                    if (!f._hasData()) return [];
                    f.execute();
                    if (a.isFunction(q)) {
                        var r = [];
                        a.each(g,
                        function (s, x) {
                            r.push(q(x))
                        });
                        return r
                    }
                    return g
                };
                this.hasMatch = function () {
                    if (!f._hasData()) return false;
                    f.execute();
                    return g.length > 0
                };
                this.andNot = function (q, r, s) {
                    k = !k;
                    return f.and(q, r, s)
                };
                this.orNot = function (q, r, s) {
                    k = !k;
                    return f.or(q, r, s)
                };
                this.not = function (q, r, s) {
                    return f.andNot(q, r, s)
                };
                this.and = function (q, r, s) {
                    p = " && ";
                    if (q === undefined) return f;
                    return f._repeatCommand(q, r, s)
                };
                this.or = function (q, r, s) {
                    p = " || ";
                    if (q === undefined) return f;
                    return f._repeatCommand(q, r, s)
                };
                this.isNot = function (q) {
                    k = !k;
                    return f.is(q)
                };
                this.is = function (q) {
                    f._append("this." + q);
                    f._resetNegate();
                    return f
                };
                this._compareValues = function (q, r, s, x, A) {
                    var B;
                    B = v ? "jQuery.jgrid.getAccessor(this,'" + r + "')" : "this";
                    if (s === undefined) s = null;
                    var F = s,
                    y = A.stype === undefined ? "text" : A.stype;
                    if (s !== null) switch (y) {
                        case "int":
                        case "integer":
                            F = isNaN(Number(F)) || F === "" ? "0" : F;
                            B = "parseInt(" + B + ",10)";
                            F = "parseInt(" + F + ",10)";
                            break;
                        case "float":
                        case "number":
                        case "numeric":
                            F = String(F).replace(m, "");
                            F = isNaN(Number(F)) || F === "" ? "0" : F;
                            B = "parseFloat(" + B + ")";
                            F = "parseFloat(" + F + ")";
                            break;
                        case "date":
                        case "datetime":
                            F = String(a.jgrid.parseDate(A.newfmt || "Y-m-d", F).getTime());
                            B = 'jQuery.jgrid.parseDate("' + A.srcfmt + '",' + B + ").getTime()";
                            break;
                        default:
                            B = f._getStr(B);
                            F = f._getStr('"' + f._toStr(F) + '"')
                    }
                    f._append(B + " " + x + " " + F);
                    f._setCommand(q, r);
                    f._resetNegate();
                    return f
                };
                this.equals = function (q, r, s) {
                    return f._compareValues(f.equals, q, r, "==", s)
                };
                this.notEquals = function (q, r, s) {
                    return f._compareValues(f.equals, q, r, "!==", s)
                };
                this.isNull = function (q, r, s) {
                    return f._compareValues(f.equals, q, null, "===", s)
                };
                this.greater = function (q, r, s) {
                    return f._compareValues(f.greater, q, r, ">", s)
                };
                this.less = function (q, r, s) {
                    return f._compareValues(f.less, q, r, "<", s)
                };
                this.greaterOrEquals = function (q, r, s) {
                    return f._compareValues(f.greaterOrEquals, q, r, ">=", s)
                };
                this.lessOrEquals = function (q, r, s) {
                    return f._compareValues(f.lessOrEquals, q, r, "<=", s)
                };
                this.startsWith = function (q, r) {
                    var s = r === undefined || r === null ? q : r;
                    s = j ? a.trim(s.toString()).length : s.toString().length;
                    if (v) f._append(f._getStr("jQuery.jgrid.getAccessor(this,'" + q + "')") + ".substr(0," + s + ") == " + f._getStr('"' + f._toStr(r) + '"'));
                    else {
                        s = j ? a.trim(r.toString()).length : r.toString().length;
                        f._append(f._getStr("this") + ".substr(0," + s + ") == " + f._getStr('"' + f._toStr(q) + '"'))
                    }
                    f._setCommand(f.startsWith, q);
                    f._resetNegate();
                    return f
                };
                this.endsWith = function (q, r) {
                    var s = r === undefined || r === null ? q : r;
                    s = j ? a.trim(s.toString()).length : s.toString().length;
                    v ? f._append(f._getStr("jQuery.jgrid.getAccessor(this,'" + q + "')") + ".substr(" + f._getStr("jQuery.jgrid.getAccessor(this,'" + q + "')") + ".length-" + s + "," + s + ') == "' + f._toStr(r) + '"') : f._append(f._getStr("this") + ".substr(" + f._getStr("this") + '.length-"' + f._toStr(q) + '".length,"' + f._toStr(q) + '".length) == "' + f._toStr(q) + '"');
                    f._setCommand(f.endsWith, q);
                    f._resetNegate();
                    return f
                };
                this.contains = function (q, r) {
                    v ? f._append(f._getStr("jQuery.jgrid.getAccessor(this,'" + q + "')") + '.indexOf("' + f._toStr(r) + '",0) > -1') : f._append(f._getStr("this") + '.indexOf("' + f._toStr(q) + '",0) > -1');
                    f._setCommand(f.contains, q);
                    f._resetNegate();
                    return f
                };
                this.groupBy = function (q, r, s, x) {
                    if (!f._hasData()) return null;
                    return f._getGroup(g, q, r, s, x)
                };
                this.orderBy = function (q, r, s, x) {
                    r = r === undefined || r === null ? "a" : a.trim(r.toString().toLowerCase());
                    if (s === null || s === undefined) s = "text";
                    if (x === null || x === undefined) x = "Y-m-d";
                    if (r == "desc" || r == "descending") r = "d";
                    if (r == "asc" || r == "ascending") r = "a";
                    o.push({
                        by: q,
                        dir: r,
                        type: s,
                        datefmt: x
                    });
                    return f
                };
                return f
            } (d, null)
        },
        extend: function (d) {
            a.extend(a.fn.jqGrid, d);
            this.no_legacy_api || a.fn.extend(d)
        }
    });
    a.fn.jqGrid = function (d) {
        if (typeof d == "string") {
            var e = a.jgrid.getAccessor(a.fn.jqGrid, d);
            if (!e) throw "jqGrid - No such method: " + d;
            var c = a.makeArray(arguments).slice(1);
            return e.apply(this, c)
        }
        return this.each(function () {
            if (!this.grid) {
                var f = a.extend(true, {
                    url: "",
                    height: 150,
                    page: 1,
                    rowNum: 20,
                    rowTotal: null,
                    records: 0,
                    pager: "",
                    pgbuttons: true,
                    pginput: true,
                    colModel: [],
                    rowList: [],
                    colNames: [],
                    sortorder: "asc",
                    sortname: "",
                    datatype: "xml",
                    mtype: "GET",
                    altRows: false,
                    selarrrow: [],
                    savedRow: [],
                    shrinkToFit: true,
                    xmlReader: {},
                    jsonReader: {},
                    subGrid: false,
                    subGridModel: [],
                    reccount: 0,
                    lastpage: 0,
                    lastsort: 0,
                    selrow: null,
                    beforeSelectRow: null,
                    onSelectRow: null,
                    onSortCol: null,
                    ondblClickRow: null,
                    onRightClickRow: null,
                    onPaging: null,
                    onSelectAll: null,
                    loadComplete: null,
                    gridComplete: null,
                    loadError: null,
                    loadBeforeSend: null,
                    afterInsertRow: null,
                    beforeRequest: null,
                    onHeaderClick: null,
                    viewrecords: false,
                    loadonce: false,
                    multiselect: false,
                    multikey: false,
                    editurl: null,
                    search: false,
                    caption: "",
                    hidegrid: true,
                    hiddengrid: false,
                    postData: {},
                    userData: {},
                    treeGrid: false,
                    treeGridModel: "nested",
                    treeReader: {},
                    treeANode: -1,
                    ExpandColumn: null,
                    tree_root_level: 0,
                    prmNames: {
                        page: "page",
                        rows: "rows",
                        sort: "sidx",
                        order: "sord",
                        search: "_search",
                        nd: "nd",
                        id: "id",
                        oper: "oper",
                        editoper: "edit",
                        addoper: "add",
                        deloper: "del",
                        subgridid: "id",
                        npage: null,
                        totalrows: "totalrows"
                    },
                    forceFit: false,
                    gridstate: "visible",
                    cellEdit: false,
                    cellsubmit: "remote",
                    nv: 0,
                    loadui: "enable",
                    toolbar: [false, ""],
                    scroll: false,
                    multiboxonly: false,
                    deselectAfterSort: true,
                    scrollrows: false,
                    autowidth: false,
                    scrollOffset: 18,
                    cellLayout: 5,
                    subGridWidth: 20,
                    multiselectWidth: 20,
                    gridview: false,
                    rownumWidth: 25,
                    rownumbers: false,
                    pagerpos: "center",
                    recordpos: "right",
                    footerrow: false,
                    userDataOnFooter: false,
                    hoverrows: true,
                    altclass: "ui-priority-secondary",
                    viewsortcols: [false, "vertical", true],
                    resizeclass: "",
                    autoencode: false,
                    remapColumns: [],
                    ajaxGridOptions: {},
                    direction: "ltr",
                    toppager: false,
                    headertitles: false,
                    scrollTimeout: 40,
                    data: [],
                    _index: {},
                    grouping: false,
                    groupingView: {
                        groupField: [],
                        groupOrder: [],
                        groupText: [],
                        groupColumnShow: [],
                        groupSummary: [],
                        showSummaryOnHide: false,
                        sortitems: [],
                        sortnames: [],
                        groupDataSorted: false,
                        summary: [],
                        summaryval: [],
                        plusicon: "ui-icon-circlesmall-plus",
                        minusicon: "ui-icon-circlesmall-minus"
                    },
                    ignoreCase: false,
                    cmTemplate: {}
                },
                a.jgrid.defaults, d || {}),
                g = {
                    headers: [],
                    cols: [],
                    footers: [],
                    dragStart: function (u, t, w) {
                        this.resizing = {
                            idx: u,
                            startX: t.clientX,
                            sOL: w[0]
                        };
                        this.hDiv.style.cursor = "col-resize";
                        this.curGbox = a("#rs_m" + a.jgrid.jqID(f.id), "#gbox_" + a.jgrid.jqID(f.id));
                        this.curGbox.css({
                            display: "block",
                            left: w[0],
                            top: w[1],
                            height: w[2]
                        });
                        a.isFunction(f.resizeStart) && f.resizeStart.call(this, t, u);
                        document.onselectstart = function () {
                            return false
                        }
                    },
                    dragMove: function (u) {
                        if (this.resizing) {
                            var t = u.clientX - this.resizing.startX;
                            u = this.headers[this.resizing.idx];
                            var w = f.direction === "ltr" ? u.width + t : u.width - t,
                            z;
                            if (w > 33) {
                                this.curGbox.css({
                                    left: this.resizing.sOL + t
                                });
                                if (f.forceFit === true) {
                                    z = this.headers[this.resizing.idx + f.nv];
                                    t = f.direction === "ltr" ? z.width - t : z.width + t;
                                    if (t > 33) {
                                        u.newWidth = w;
                                        z.newWidth = t
                                    }
                                } else {
                                    this.newWidth = f.direction === "ltr" ? f.tblwidth + t : f.tblwidth - t;
                                    u.newWidth = w
                                }
                            }
                        }
                    },
                    dragEnd: function () {
                        this.hDiv.style.cursor = "default";
                        if (this.resizing) {
                            var u = this.resizing.idx,
                            t = this.headers[u].newWidth || this.headers[u].width;
                            t = parseInt(t, 10);
                            this.resizing = false;
                            a("#rs_m" + a.jgrid.jqID(f.id)).css("display", "none");
                            f.colModel[u].width = t;
                            this.headers[u].width = t;
                            this.headers[u].el.style.width = t + "px";
                            this.cols[u].style.width = t + "px";
                            if (this.footers.length > 0) this.footers[u].style.width = t + "px";
                            if (f.forceFit === true) {
                                t = this.headers[u + f.nv].newWidth || this.headers[u + f.nv].width;
                                this.headers[u + f.nv].width = t;
                                this.headers[u + f.nv].el.style.width = t + "px";
                                this.cols[u + f.nv].style.width = t + "px";
                                if (this.footers.length > 0) this.footers[u + f.nv].style.width = t + "px";
                                f.colModel[u + f.nv].width = t
                            } else {
                                f.tblwidth = this.newWidth || f.tblwidth;
                                a("table:first", this.bDiv).css("width", f.tblwidth + "px");
                                a("table:first", this.hDiv).css("width", f.tblwidth + "px");
                                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                                if (f.footerrow) {
                                    a("table:first", this.sDiv).css("width", f.tblwidth + "px");
                                    this.sDiv.scrollLeft = this.bDiv.scrollLeft
                                }
                            }
                            a.isFunction(f.resizeStop) && f.resizeStop.call(this, t, u)
                        }
                        this.curGbox = null;
                        document.onselectstart = function () {
                            return true
                        }
                    },
                    populateVisible: function () {
                        g.timer && clearTimeout(g.timer);
                        g.timer = null;
                        var u = a(g.bDiv).height();
                        if (u) {
                            var t = a("table:first", g.bDiv),
                            w,
                            z;
                            if (t[0].rows.length) try {
                                z = (w = t[0].rows[1]) ? a(w).outerHeight() || g.prevRowHeight : g.prevRowHeight
                            } catch (D) {
                                z = g.prevRowHeight
                            }
                            if (z) {
                                g.prevRowHeight = z;
                                var P = f.rowNum;
                                w = g.scrollTop = g.bDiv.scrollTop;
                                var I = Math.round(t.position().top) - w,
                                W = I + t.height();
                                z *= P;
                                var J, O, L;
                                if (W < u && I <= 0 && (f.lastpage === undefined || parseInt((W + w + z - 1) / z, 10) <= f.lastpage)) {
                                    O = parseInt((u - W + z - 1) / z, 10);
                                    if (W >= 0 || O < 2 || f.scroll === true) {
                                        J = Math.round((W + w) / z) + 1;
                                        I = -1
                                    } else I = 1
                                }
                                if (I > 0) {
                                    J = parseInt(w / z, 10) + 1;
                                    O = parseInt((w + u) / z, 10) + 2 - J;
                                    L = true
                                }
                                if (O) if (!(f.lastpage && J > f.lastpage || f.lastpage == 1 || J === f.page && J === f.lastpage)) if (g.hDiv.loading) g.timer = setTimeout(g.populateVisible, f.scrollTimeout);
                                else {
                                    f.page = J;
                                    if (L) {
                                        g.selectionPreserver(t[0]);
                                        g.emptyRows(g.bDiv, false, false)
                                    }
                                    g.populate(O)
                                }
                            }
                        }
                    },
                    scrollGrid: function (u) {
                        if (f.scroll) {
                            var t = g.bDiv.scrollTop;
                            if (g.scrollTop === undefined) g.scrollTop = 0;
                            if (t != g.scrollTop) {
                                g.scrollTop = t;
                                g.timer && clearTimeout(g.timer);
                                g.timer = setTimeout(g.populateVisible, f.scrollTimeout)
                            }
                        }
                        g.hDiv.scrollLeft = g.bDiv.scrollLeft;
                        if (f.footerrow) g.sDiv.scrollLeft = g.bDiv.scrollLeft;
                        u && u.stopPropagation()
                    },
                    selectionPreserver: function (u) {
                        var t = u.p,
                        w = t.selrow,
                        z = t.selarrrow ? a.makeArray(t.selarrrow) : null,
                        D = u.grid.bDiv.scrollLeft,
                        P = t.gridComplete;
                        t.gridComplete = function () {
                            t.selrow = null;
                            t.selarrrow = [];
                            if (t.multiselect && z && z.length > 0) for (var I = 0; I < z.length; I++) z[I] != w && a(u).jqGrid("setSelection", z[I], false);
                            w && a(u).jqGrid("setSelection", w, false);
                            u.grid.bDiv.scrollLeft = D;
                            t.gridComplete = P;
                            t.gridComplete && P()
                        }
                    }
                };
                if (this.tagName.toUpperCase() != "TABLE") alert("Element is not a table");
                else {
                    a(this).empty().attr("tabindex", "1");
                    this.p = f;
                    var h, j, b;
                    if (this.p.colNames.length === 0) for (h = 0; h < this.p.colModel.length; h++) this.p.colNames[h] = this.p.colModel[h].label || this.p.colModel[h].name;
                    if (this.p.colNames.length !== this.p.colModel.length) alert(a.jgrid.errors.model);
                    else {
                        var m = a("<div class='ui-jqgrid-view'></div>"),
                        l,
                        n = a.browser.msie ? true : false,
                        k = a.browser.webkit || a.browser.safari ? true : false;
                        b = this;
                        b.p.direction = a.trim(b.p.direction.toLowerCase());
                        if (a.inArray(b.p.direction, ["ltr", "rtl"]) == -1) b.p.direction = "ltr";
                        j = b.p.direction;
                        a(m).insertBefore(this);
                        a(this).appendTo(m).removeClass("scroll");
                        var p = a("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
                        a(p).insertBefore(m).attr({
                            id: "gbox_" + this.id,
                            dir: j
                        });
                        a(m).appendTo(p).attr("id", "gview_" + this.id);
                        l = n && a.browser.version <= 6 ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>' : "";
                        a("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").append(l).insertBefore(m);
                        a("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(m);
                        a(this).attr({
                            cellspacing: "0",
                            cellpadding: "0",
                            border: "0",
                            role: "grid",
                            "aria-multiselectable": !!this.p.multiselect,
                            "aria-labelledby": "gbox_" + this.id
                        });
                        var o = function (u, t) {
                            u = parseInt(u, 10);
                            return isNaN(u) ? t ? t : 0 : u
                        },
                        v = function (u, t, w, z, D, P) {
                            var I = b.p.colModel[u],
                            W = I.align,
                            J = 'style="',
                            O = I.classes,
                            L = I.name,
                            K = [];
                            if (W) J += "text-align:" + W + ";";
                            if (I.hidden === true) J += "display:none;";
                            if (t === 0) J += "width: " + g.headers[u].width + "px;";
                            else if (I.cellattr && a.isFunction(I.cellattr)) if ((u = I.cellattr.call(b, D, w, z, I, P)) && typeof u === "string") {
                                u = u.replace(/style/i, "style").replace(/title/i, "title");
                                if (u.indexOf("title") > -1) I.title = false;
                                if (u.indexOf("class") > -1) O = undefined;
                                K = u.split("style");
                                if (K.length === 2) {
                                    K[1] = a.trim(K[1].replace("=", ""));
                                    if (K[1].indexOf("'") === 0 || K[1].indexOf('"') === 0) K[1] = K[1].substring(1);
                                    J += K[1].replace(/'/gi, '"')
                                } else J += '"'
                            }
                            if (!K.length) {
                                K[0] = "";
                                J += '"'
                            }
                            J += (O !== undefined ? ' class="' + O + '"' : "") + (I.title && w ? ' title="' + a.jgrid.stripHtml(w) + '"' : "");
                            J += ' aria-describedby="' + b.p.id + "_" + L + '"';
                            return J + K[0]
                        },
                        q = function (u) {
                            return u === undefined || u === null || u === "" ? "&#160;" : b.p.autoencode ? a.jgrid.htmlEncode(u) : u + ""
                        },
                        r = function (u, t, w, z, D) {
                            var P = b.p.colModel[w];
                            if (typeof P.formatter !== "undefined") {
                                u = {
                                    rowId: u,
                                    colModel: P,
                                    gid: b.p.id,
                                    pos: w
                                };
                                t = a.isFunction(P.formatter) ? P.formatter.call(b, t, u, z, D) : a.fmatter ? a.fn.fmatter(P.formatter, t, u, z, D) : q(t)
                            } else t = q(t);
                            return t
                        },
                        s = function (u, t, w, z, D) {
                            t = r(u, t, w, D, "add");
                            return '<td role="gridcell" ' + v(w, z, t, D, u, true) + ">" + t + "</td>"
                        },
                        x = function (u, t, w) {
                            var z = '<input role="checkbox" type="checkbox" id="jqg_' + b.p.id + "_" + u + '" class="cbox" name="jqg_' + b.p.id + "_" + u + '"/>';
                            return '<td role="gridcell" ' + v(t, w, "", null, u, true) + ">" + z + "</td>"
                        },
                        A = function (u, t, w, z) {
                            w = (parseInt(w, 10) - 1) * parseInt(z, 10) + 1 + t;
                            return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + v(u, t, w, null, t, true) + ">" + w + "</td>"
                        },
                        B = function (u) {
                            var t, w = [],
                            z = 0,
                            D;
                            for (D = 0; D < b.p.colModel.length; D++) {
                                t = b.p.colModel[D];
                                if (t.name !== "cb" && t.name !== "subgrid" && t.name !== "rn") {
                                    w[z] = u == "local" ? t.name : u == "xml" ? t.xmlmap || t.name : t.jsonmap || t.name;
                                    z++
                                }
                            }
                            return w
                        },
                        F = function (u) {
                            var t = b.p.remapColumns;
                            if (!t || !t.length) t = a.map(b.p.colModel,
                            function (w, z) {
                                return z
                            });
                            if (u) t = a.map(t,
                            function (w) {
                                return w < u ? null : w - u
                            });
                            return t
                        },
                        y = function (u, t, w) {
                            if (b.p.deepempty) a("#" + a.jgrid.jqID(b.p.id) + " tbody:first tr:gt(0)").remove();
                            else {
                                var z = a("#" + a.jgrid.jqID(b.p.id) + " tbody:first tr:first")[0];
                                a("#" + a.jgrid.jqID(b.p.id) + " tbody:first").empty().append(z)
                            }
                            if (t && b.p.scroll) {
                                a(">div:first", u).css({
                                    height: "auto"
                                }).children("div:first").css({
                                    height: 0,
                                    display: "none"
                                });
                                u.scrollTop = 0
                            }
                            if (w === true) if (b.p.treeGrid === true) {
                                b.p.data = [];
                                b.p._index = {}
                            }
                        },
                        G = function () {
                            var u = b.p.data.length,
                            t, w, z;
                            t = b.p.rownumbers === true ? 1 : 0;
                            w = b.p.multiselect === true ? 1 : 0;
                            z = b.p.subGrid === true ? 1 : 0;
                            t = b.p.keyIndex === false || b.p.loadonce === true ? b.p.localReader.id : b.p.colModel[b.p.keyIndex + w + z + t].name;
                            for (w = 0; w < u; w++) {
                                z = a.jgrid.getAccessor(b.p.data[w], t);
                                b.p._index[z] = w
                            }
                        },
                        S = function (u, t, w, z, D) {
                            var P = new Date,
                            I = b.p.datatype != "local" && b.p.loadonce || b.p.datatype == "xmlstring",
                            W = b.p.datatype == "local" ? "local" : "xml";
                            if (I) {
                                b.p.data = [];
                                b.p._index = {};
                                b.p.localReader.id = "_id_"
                            }
                            b.p.reccount = 0;
                            if (a.isXMLDoc(u)) {
                                if (b.p.treeANode === -1 && !b.p.scroll) {
                                    y(t, false, true);
                                    w = 1
                                } else w = w > 1 ? w : 1;
                                var J, O, L = 0,
                                K, X = 0,
                                ja = 0,
                                ga = 0,
                                ea, ha = [],
                                ra,
                                aa = {},
                                N,
                                T,
                                $ = [],
                                Da = b.p.altRows === true ? " " + b.p.altclass : "";
                                b.p.xmlReader.repeatitems || (ha = B(W));
                                ea = b.p.keyIndex === false ? b.p.xmlReader.id : b.p.keyIndex;
                                if (ha.length > 0 && !isNaN(ea)) {
                                    if (b.p.remapColumns && b.p.remapColumns.length) ea = a.inArray(ea, b.p.remapColumns);
                                    ea = ha[ea]
                                }
                                W = (ea + "").indexOf("[") === -1 ? ha.length ?
                                function (ya, ua) {
                                    return a(ea, ya).text() || ua
                                } : function (ya, ua) {
                                    return a(b.p.xmlReader.cell, ya).eq(ea).text() || ua
                                } : function (ya, ua) {
                                    return ya.getAttribute(ea.replace(/[\[\]]/g, "")) || ua
                                };
                                b.p.userData = {};
                                a(b.p.xmlReader.page, u).each(function () {
                                    b.p.page = this.textContent || this.text || 0
                                });
                                a(b.p.xmlReader.total, u).each(function () {
                                    b.p.lastpage = this.textContent || this.text;
                                    if (b.p.lastpage === undefined) b.p.lastpage = 1
                                });
                                a(b.p.xmlReader.records, u).each(function () {
                                    b.p.records = this.textContent || this.text || 0
                                });
                                a(b.p.xmlReader.userdata, u).each(function () {
                                    b.p.userData[this.getAttribute("name")] = this.textContent || this.text
                                }); (u = a(b.p.xmlReader.root + " " + b.p.xmlReader.row, u)) || (u = []);
                                var oa = u.length,
                                sa = 0,
                                Ea = {},
                                za;
                                if (u && oa) {
                                    za = parseInt(b.p.rowNum, 10);
                                    var Ga = b.p.scroll ? a.jgrid.randId() : 1;
                                    if (D) za *= D + 1;
                                    D = a.isFunction(b.p.afterInsertRow);
                                    var Fa = "";
                                    if (b.p.grouping && b.p.groupingView.groupCollapse === true) Fa = ' style="display:none;"';
                                    for (; sa < oa; ) {
                                        N = u[sa];
                                        T = W(N, Ga + sa);
                                        J = w === 0 ? 0 : w + 1;
                                        J = (J + sa) % 2 == 1 ? Da : "";
                                        $.push("<tr" + Fa + ' id="' + T + '" tabindex="-1" role="row" class ="ui-widget-content jqgrow ui-row-' + b.p.direction + "" + J + '">');
                                        if (b.p.rownumbers === true) {
                                            $.push(A(0, sa, b.p.page, b.p.rowNum));
                                            ga = 1
                                        }
                                        if (b.p.multiselect === true) {
                                            $.push(x(T, ga, sa));
                                            X = 1
                                        }
                                        if (b.p.subGrid === true) {
                                            $.push(a(b).jqGrid("addSubGridCell", X + ga, sa + w));
                                            ja = 1
                                        }
                                        if (b.p.xmlReader.repeatitems) {
                                            ra || (ra = F(X + ja + ga));
                                            var Ja = a(b.p.xmlReader.cell, N);
                                            a.each(ra,
                                            function (ya) {
                                                var ua = Ja[this];
                                                if (!ua) return false;
                                                K = ua.textContent || ua.text;
                                                aa[b.p.colModel[ya + X + ja + ga].name] = K;
                                                $.push(s(T, K, ya + X + ja + ga, sa + w, N))
                                            })
                                        } else for (J = 0; J < ha.length; J++) {
                                            K = a(ha[J], N).text();
                                            aa[b.p.colModel[J + X + ja + ga].name] = K;
                                            $.push(s(T, K, J + X + ja + ga, sa + w, N))
                                        }
                                        $.push("</tr>");
                                        if (b.p.grouping) {
                                            J = b.p.groupingView.groupField.length;
                                            for (var Ha = [], Ia = 0; Ia < J; Ia++) Ha.push(aa[b.p.groupingView.groupField[Ia]]);
                                            Ea = a(b).jqGrid("groupingPrepare", $, Ha, Ea, aa);
                                            $ = []
                                        }
                                        if (I || b.p.treeGrid === true) {
                                            aa._id_ = T;
                                            b.p.data.push(aa);
                                            b.p._index[T] = b.p.data.length - 1
                                        }
                                        if (b.p.gridview === false) {
                                            a("tbody:first", t).append($.join(""));
                                            D && b.p.afterInsertRow.call(b, T, aa, N);
                                            $ = []
                                        }
                                        aa = {};
                                        L++;
                                        sa++;
                                        if (L == za) break
                                    }
                                }
                                if (b.p.gridview === true) {
                                    O = b.p.treeANode > -1 ? b.p.treeANode : 0;
                                    if (b.p.grouping) {
                                        a(b).jqGrid("groupingRender", Ea, b.p.colModel.length);
                                        Ea = null
                                    } else b.p.treeGrid === true && O > 0 ? a(b.rows[O]).after($.join("")) : a("tbody:first", t).append($.join(""))
                                }
                                if (b.p.subGrid === true) try {
                                    a(b).jqGrid("addSubGrid", X + ga)
                                } catch (La) { }
                                b.p.totaltime = new Date - P;
                                if (L > 0) if (b.p.records === 0) b.p.records = oa;
                                $ = null;
                                if (b.p.treeGrid === true) try {
                                    a(b).jqGrid("setTreeNode", O + 1, L + O + 1)
                                } catch (Ma) { }
                                if (!b.p.treeGrid && !b.p.scroll) b.grid.bDiv.scrollTop = 0;
                                b.p.reccount = L;
                                b.p.treeANode = -1;
                                b.p.userDataOnFooter && a(b).jqGrid("footerData", "set", b.p.userData, true);
                                if (I) {
                                    b.p.records = oa;
                                    b.p.lastpage = Math.ceil(oa / za)
                                }
                                z || b.updatepager(false, true);
                                if (I) for (; L < oa; ) {
                                    N = u[L];
                                    T = W(N, L);
                                    if (b.p.xmlReader.repeatitems) {
                                        ra || (ra = F(X + ja + ga));
                                        var Ka = a(b.p.xmlReader.cell, N);
                                        a.each(ra,
                                        function (ya) {
                                            var ua = Ka[this];
                                            if (!ua) return false;
                                            K = ua.textContent || ua.text;
                                            aa[b.p.colModel[ya + X + ja + ga].name] = K
                                        })
                                    } else for (J = 0; J < ha.length; J++) {
                                        K = a(ha[J], N).text();
                                        aa[b.p.colModel[J + X + ja + ga].name] = K
                                    }
                                    aa._id_ = T;
                                    b.p.data.push(aa);
                                    b.p._index[T] = b.p.data.length - 1;
                                    aa = {};
                                    L++
                                }
                            }
                        },
                        C = function (u, t, w, z, D) {
                            var P = new Date;
                            if (u) {
                                if (b.p.treeANode === -1 && !b.p.scroll) {
                                    y(t, false, true);
                                    w = 1
                                } else w = w > 1 ? w : 1;
                                var I, W = b.p.datatype != "local" && b.p.loadonce || b.p.datatype == "jsonstring";
                                if (W) {
                                    b.p.data = [];
                                    b.p._index = {};
                                    b.p.localReader.id = "_id_"
                                }
                                b.p.reccount = 0;
                                if (b.p.datatype == "local") {
                                    t = b.p.localReader;
                                    I = "local"
                                } else {
                                    t = b.p.jsonReader;
                                    I = "json"
                                }
                                var J = 0,
                                O, L, K = [],
                                X,
                                ja = 0,
                                ga = 0,
                                ea = 0,
                                ha,
                                ra,
                                aa = {},
                                N,
                                T,
                                $ = [],
                                Da = b.p.altRows === true ? " " + b.p.altclass : "";
                                b.p.page = a.jgrid.getAccessor(u, t.page) || 0;
                                ha = a.jgrid.getAccessor(u, t.total);
                                b.p.lastpage = ha === undefined ? 1 : ha;
                                b.p.records = a.jgrid.getAccessor(u, t.records) || 0;
                                b.p.userData = a.jgrid.getAccessor(u, t.userdata) || {};
                                t.repeatitems || (X = K = B(I));
                                I = b.p.keyIndex === false ? t.id : b.p.keyIndex;
                                if (K.length > 0 && !isNaN(I)) {
                                    if (b.p.remapColumns && b.p.remapColumns.length) I = a.inArray(I, b.p.remapColumns);
                                    I = K[I]
                                } (ra = a.jgrid.getAccessor(u, t.root)) || (ra = []);
                                ha = ra.length;
                                u = 0;
                                var oa = parseInt(b.p.rowNum, 10),
                                sa = b.p.scroll ? a.jgrid.randId() : 1;
                                if (D) oa *= D + 1;
                                var Ea = a.isFunction(b.p.afterInsertRow),
                                za = {},
                                Ga = "";
                                if (b.p.grouping && b.p.groupingView.groupCollapse === true) Ga = ' style="display:none;"';
                                for (; u < ha; ) {
                                    D = ra[u];
                                    T = a.jgrid.getAccessor(D, I);
                                    if (T === undefined) {
                                        T = sa + u;
                                        if (K.length === 0) if (t.cell) T = a.jgrid.getAccessor(D, t.cell)[I] || T
                                    }
                                    O = w === 1 ? 0 : w;
                                    O = (O + u) % 2 == 1 ? Da : "";
                                    $.push("<tr" + Ga + ' id="' + T + '" tabindex="-1" role="row" class= "ui-widget-content jqgrow ui-row-' + b.p.direction + "" + O + '">');
                                    if (b.p.rownumbers === true) {
                                        $.push(A(0, u, b.p.page, b.p.rowNum));
                                        ea = 1
                                    }
                                    if (b.p.multiselect) {
                                        $.push(x(T, ea, u));
                                        ja = 1
                                    }
                                    if (b.p.subGrid) {
                                        $.push(a(b).jqGrid("addSubGridCell", ja + ea, u + w));
                                        ga = 1
                                    }
                                    if (t.repeatitems) {
                                        if (t.cell) D = a.jgrid.getAccessor(D, t.cell);
                                        X || (X = F(ja + ga + ea))
                                    }
                                    for (L = 0; L < X.length; L++) {
                                        O = a.jgrid.getAccessor(D, X[L]);
                                        $.push(s(T, O, L + ja + ga + ea, u + w, D));
                                        aa[b.p.colModel[L + ja + ga + ea].name] = O
                                    }
                                    $.push("</tr>");
                                    if (b.p.grouping) {
                                        O = b.p.groupingView.groupField.length;
                                        L = [];
                                        for (var Fa = 0; Fa < O; Fa++) L.push(aa[b.p.groupingView.groupField[Fa]]);
                                        za = a(b).jqGrid("groupingPrepare", $, L, za, aa);
                                        $ = []
                                    }
                                    if (W || b.p.treeGrid === true) {
                                        aa._id_ = T;
                                        b.p.data.push(aa);
                                        b.p._index[T] = b.p.data.length - 1
                                    }
                                    if (b.p.gridview === false) {
                                        a("#" + a.jgrid.jqID(b.p.id) + " tbody:first").append($.join(""));
                                        Ea && b.p.afterInsertRow.call(b, T, aa, D);
                                        $ = []
                                    }
                                    aa = {};
                                    J++;
                                    u++;
                                    if (J == oa) break
                                }
                                if (b.p.gridview === true) {
                                    N = b.p.treeANode > -1 ? b.p.treeANode : 0;
                                    if (b.p.grouping) a(b).jqGrid("groupingRender", za, b.p.colModel.length);
                                    else b.p.treeGrid === true && N > 0 ? a(b.rows[N]).after($.join("")) : a("#" + a.jgrid.jqID(b.p.id) + " tbody:first").append($.join(""))
                                }
                                if (b.p.subGrid === true) try {
                                    a(b).jqGrid("addSubGrid", ja + ea)
                                } catch (Ja) { }
                                b.p.totaltime = new Date - P;
                                if (J > 0) if (b.p.records === 0) b.p.records = ha;
                                if (b.p.treeGrid === true) try {
                                    a(b).jqGrid("setTreeNode", N + 1, J + N + 1)
                                } catch (Ha) { }
                                if (!b.p.treeGrid && !b.p.scroll) b.grid.bDiv.scrollTop = 0;
                                b.p.reccount = J;
                                b.p.treeANode = -1;
                                b.p.userDataOnFooter && a(b).jqGrid("footerData", "set", b.p.userData, true);
                                if (W) {
                                    b.p.records = ha;
                                    b.p.lastpage = Math.ceil(ha / oa)
                                }
                                z || b.updatepager(false, true);
                                if (W) for (; J < ha && ra[J]; ) {
                                    D = ra[J];
                                    T = a.jgrid.getAccessor(D, I);
                                    if (T === undefined) {
                                        T = sa + J;
                                        if (K.length === 0) if (t.cell) T = a.jgrid.getAccessor(D, t.cell)[I] || T
                                    }
                                    if (D) {
                                        if (t.repeatitems) {
                                            if (t.cell) D = a.jgrid.getAccessor(D, t.cell);
                                            X || (X = F(ja + ga + ea))
                                        }
                                        for (L = 0; L < X.length; L++) {
                                            O = a.jgrid.getAccessor(D, X[L]);
                                            aa[b.p.colModel[L + ja + ga + ea].name] = O
                                        }
                                        aa._id_ = T;
                                        b.p.data.push(aa);
                                        b.p._index[T] = b.p.data.length - 1;
                                        aa = {}
                                    }
                                    J++
                                }
                            }
                        },
                        R = function () {
                            function u(N) {
                                var T = 0,
                                $, Da, oa;
                                if (N.groups !== undefined) for ($ = 0; $ < N.groups.length; $++) {
                                    try {
                                        u(N.groups[$])
                                    } catch (sa) {
                                        alert(sa)
                                    }
                                    T++
                                }
                                if (N.rules !== undefined) {
                                    if (T > 0) {
                                        var Ea = K.select();
                                        K = a.jgrid.from(Ea)
                                    }
                                    try {
                                        for ($ = 0; $ < N.rules.length; $++) {
                                            oa = N.rules[$];
                                            Da = N.groupOp.toString().toUpperCase();
                                            if (L[oa.op] && oa.field) {
                                                if (T > 0 && Da && Da === "OR") K = K.or();
                                                K = L[oa.op](K, Da)(oa.field, oa.data, z[oa.field])
                                            }
                                            T++
                                        }
                                    } catch (za) {
                                        alert(za)
                                    }
                                }
                            }
                            var t, w = false,
                            z = {},
                            D = [],
                            P = [],
                            I,
                            W,
                            J;
                            if (a.isArray(b.p.data)) {
                                var O = b.p.grouping ? b.p.groupingView : false;
                                a.each(b.p.colModel,
                                function () {
                                    W = this.sorttype || "text";
                                    if (W == "date" || W == "datetime") {
                                        if (this.formatter && typeof this.formatter === "string" && this.formatter == "date") {
                                            I = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat : a.jgrid.formatter.date.srcformat;
                                            J = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : a.jgrid.formatter.date.newformat
                                        } else I = J = this.datefmt || "Y-m-d";
                                        z[this.name] = {
                                            stype: W,
                                            srcfmt: I,
                                            newfmt: J
                                        }
                                    } else z[this.name] = {
                                        stype: W,
                                        srcfmt: "",
                                        newfmt: ""
                                    };
                                    if (b.p.grouping && this.name == O.groupField[0]) {
                                        var N = this.name;
                                        if (typeof this.index != "undefined") N = this.index;
                                        D[0] = z[N];
                                        P.push(N)
                                    }
                                    if (!w && (this.index == b.p.sortname || this.name == b.p.sortname)) {
                                        t = this.name;
                                        w = true
                                    }
                                });
                                if (b.p.treeGrid) a(b).jqGrid("SortTree", t, b.p.sortorder, z[t].stype, z[t].srcfmt);
                                else {
                                    var L = {
                                        eq: function (N) {
                                            return N.equals
                                        },
                                        ne: function (N) {
                                            return N.notEquals
                                        },
                                        lt: function (N) {
                                            return N.less
                                        },
                                        le: function (N) {
                                            return N.lessOrEquals
                                        },
                                        gt: function (N) {
                                            return N.greater
                                        },
                                        ge: function (N) {
                                            return N.greaterOrEquals
                                        },
                                        cn: function (N) {
                                            return N.contains
                                        },
                                        nc: function (N, T) {
                                            return T === "OR" ? N.orNot().contains : N.andNot().contains
                                        },
                                        bw: function (N) {
                                            return N.startsWith
                                        },
                                        bn: function (N, T) {
                                            return T === "OR" ? N.orNot().startsWith : N.andNot().startsWith
                                        },
                                        en: function (N, T) {
                                            return T === "OR" ? N.orNot().endsWith : N.andNot().endsWith
                                        },
                                        ew: function (N) {
                                            return N.endsWith
                                        },
                                        ni: function (N, T) {
                                            return T === "OR" ? N.orNot().equals : N.andNot().equals
                                        },
                                        "in": function (N) {
                                            return N.equals
                                        },
                                        nu: function (N) {
                                            return N.isNull
                                        },
                                        nn: function (N, T) {
                                            return T === "OR" ? N.orNot().isNull : N.andNot().isNull
                                        }
                                    },
                                    K = a.jgrid.from(b.p.data);
                                    if (b.p.ignoreCase) K = K.ignoreCase();
                                    if (b.p.search === true) {
                                        var X = b.p.postData.filters;
                                        if (X) {
                                            if (typeof X == "string") X = a.jgrid.parse(X);
                                            u(X)
                                        } else try {
                                            K = L[b.p.postData.searchOper](K)(b.p.postData.searchField, b.p.postData.searchString, z[b.p.postData.searchField])
                                        } catch (ja) { }
                                    }
                                    if (b.p.grouping) {
                                        K.orderBy(P, O.groupOrder[0], D[0].stype, D[0].srcfmt);
                                        O.groupDataSorted = true
                                    }
                                    if (t && b.p.sortorder && w) b.p.sortorder.toUpperCase() == "DESC" ? K.orderBy(b.p.sortname, "d", z[t].stype, z[t].srcfmt) : K.orderBy(b.p.sortname, "a", z[t].stype, z[t].srcfmt);
                                    X = K.select();
                                    var ga = parseInt(b.p.rowNum, 10),
                                    ea = X.length,
                                    ha = parseInt(b.p.page, 10),
                                    ra = Math.ceil(ea / ga),
                                    aa = {};
                                    X = X.slice((ha - 1) * ga, ha * ga);
                                    z = K = null;
                                    aa[b.p.localReader.total] = ra;
                                    aa[b.p.localReader.page] = ha;
                                    aa[b.p.localReader.records] = ea;
                                    aa[b.p.localReader.root] = X;
                                    X = null;
                                    return aa
                                }
                            }
                        },
                        ca = function () {
                            b.grid.hDiv.loading = true;
                            if (!b.p.hiddengrid) switch (b.p.loadui) {
                                case "enable":
                                    a("#load_" + a.jgrid.jqID(b.p.id)).show();
                                    break;
                                case "block":
                                    a("#lui_" + a.jgrid.jqID(b.p.id)).show();
                                    a("#load_" + a.jgrid.jqID(b.p.id)).show()
                            }
                        },
                        ka = function () {
                            b.grid.hDiv.loading = false;
                            switch (b.p.loadui) {
                                case "enable":
                                    a("#load_" + a.jgrid.jqID(b.p.id)).hide();
                                    break;
                                case "block":
                                    a("#lui_" + a.jgrid.jqID(b.p.id)).hide();
                                    a("#load_" + a.jgrid.jqID(b.p.id)).hide()
                            }
                        },
                        ia = function (u) {
                            if (!b.grid.hDiv.loading) {
                                var t = b.p.scroll && u === false,
                                w = {},
                                z, D = b.p.prmNames;
                                if (b.p.page <= 0) b.p.page = 1;
                                if (D.search !== null) w[D.search] = b.p.search;
                                if (D.nd !== null) w[D.nd] = (new Date).getTime();
                                if (D.rows !== null) w[D.rows] = b.p.rowNum;
                                if (D.page !== null) w[D.page] = b.p.page;
                                if (D.sort !== null) w[D.sort] = b.p.sortname;
                                if (D.order !== null) w[D.order] = b.p.sortorder;
                                if (b.p.rowTotal !== null && D.totalrows !== null) w[D.totalrows] = b.p.rowTotal;
                                var P = b.p.loadComplete,
                                I = a.isFunction(P);
                                I || (P = null);
                                var W = 0;
                                u = u || 1;
                                if (u > 1) if (D.npage !== null) {
                                    w[D.npage] = u;
                                    W = u - 1;
                                    u = 1
                                } else P = function (O) {
                                    b.p.page++;
                                    b.grid.hDiv.loading = false;
                                    I && b.p.loadComplete.call(b, O);
                                    ia(u - 1)
                                };
                                else D.npage !== null && delete b.p.postData[D.npage];
                                if (b.p.grouping) {
                                    a(b).jqGrid("groupingSetup");
                                    if (b.p.groupingView.groupDataSorted === true) w[D.sort] = b.p.groupingView.groupField[0] + " " + b.p.groupingView.groupOrder[0] + ", " + w[D.sort]
                                }
                                a.extend(b.p.postData, w);
                                var J = !b.p.scroll ? 1 : b.rows.length - 1;
                                if (a.isFunction(b.p.datatype)) b.p.datatype.call(b, b.p.postData, "load_" + b.p.id);
                                else {
                                    a.isFunction(b.p.beforeRequest) && b.p.beforeRequest.call(b);
                                    z = b.p.datatype.toLowerCase();
                                    switch (z) {
                                        case "json":
                                        case "jsonp":
                                        case "xml":
                                        case "script":
                                            a.ajax(a.extend({
                                                url:
                                            b.p.url,
                                                type: b.p.mtype,
                                                dataType: z,
                                                data: a.isFunction(b.p.serializeGridData) ? b.p.serializeGridData.call(b, b.p.postData) : b.p.postData,
                                                success: function (O) {
                                                    z === "xml" ? S(O, b.grid.bDiv, J, u > 1, W) : C(O, b.grid.bDiv, J, u > 1, W);
                                                    P && P.call(b, O);
                                                    t && b.grid.populateVisible();
                                                    if (b.p.loadonce || b.p.treeGrid) b.p.datatype = "local";
                                                    ka()
                                                },
                                                error: function (O, L, K) {
                                                    a.isFunction(b.p.loadError) && b.p.loadError.call(b, O, L, K);
                                                    ka()
                                                },
                                                beforeSend: function (O) {
                                                    ca();
                                                    a.isFunction(b.p.loadBeforeSend) && b.p.loadBeforeSend.call(b, O)
                                                }
                                            },
                                        a.jgrid.ajaxOptions, b.p.ajaxGridOptions));
                                            break;
                                        case "xmlstring":
                                            ca();
                                            w = a.jgrid.stringToDoc(b.p.datastr);
                                            S(w, b.grid.bDiv);
                                            I && b.p.loadComplete.call(b, w);
                                            b.p.datatype = "local";
                                            b.p.datastr = null;
                                            ka();
                                            break;
                                        case "jsonstring":
                                            ca();
                                            w = typeof b.p.datastr == "string" ? a.jgrid.parse(b.p.datastr) : b.p.datastr;
                                            C(w, b.grid.bDiv);
                                            I && b.p.loadComplete.call(b, w);
                                            b.p.datatype = "local";
                                            b.p.datastr = null;
                                            ka();
                                            break;
                                        case "local":
                                        case "clientside":
                                            ca();
                                            b.p.datatype = "local";
                                            w = R();
                                            C(w, b.grid.bDiv, J, u > 1, W);
                                            P && P.call(b, w);
                                            t && b.grid.populateVisible();
                                            ka()
                                    }
                                }
                            }
                        };
                        l = function (u, t) {
                            var w = "",
                            z = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
                            D = "",
                            P, I, W, J, O = function (L) {
                                var K;
                                if (a.isFunction(b.p.onPaging)) K = b.p.onPaging.call(b, L);
                                b.p.selrow = null;
                                if (b.p.multiselect) {
                                    b.p.selarrrow = [];
                                    a("#cb_" + a.jgrid.jqID(b.p.id), b.grid.hDiv).attr("checked", false)
                                }
                                b.p.savedRow = [];
                                if (K == "stop") return false;
                                return true
                            };
                            u = u.substr(1);
                            t += "_" + u;
                            P = "pg_" + u;
                            I = u + "_left";
                            W = u + "_center";
                            J = u + "_right";
                            a("#" + a.jgrid.jqID(u)).append("<div id='" + P + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + I + "' align='left'></td><td id='" + W + "' align='center' style='white-space:pre;'></td><td id='" + J + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
                            if (b.p.rowList.length > 0) {
                                D = "<td dir='" + j + "'>";
                                D += "<select class='ui-pg-selbox' role='listbox'>";
                                for (I = 0; I < b.p.rowList.length; I++) D += '<option role="option" value="' + b.p.rowList[I] + '"' + (b.p.rowNum == b.p.rowList[I] ? ' selected="selected"' : "") + ">" + b.p.rowList[I] + "</option>";
                                D += "</select></td>"
                            }
                            if (j == "rtl") z += D;
                            if (b.p.pginput === true) w = "<td dir='" + j + "'>" + a.jgrid.format(b.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>", "<span id='sp_1_" + a.jgrid.jqID(u) + "'></span>") + "</td>";
                            if (b.p.pgbuttons === true) {
                                I = ["first" + t, "prev" + t, "next" + t, "last" + t];
                                j == "rtl" && I.reverse();
                                z += "<td id='" + I[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
                                z += "<td id='" + I[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
                                z += w !== "" ? "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" + w + "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" : "";
                                z += "<td id='" + I[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
                                z += "<td id='" + I[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>"
                            } else if (w !== "") z += w;
                            if (j == "ltr") z += D;
                            z += "</tr></tbody></table>";
                            b.p.viewrecords === true && a("td#" + u + "_" + b.p.recordpos, "#" + P).append("<div dir='" + j + "' style='text-align:" + b.p.recordpos + "' class='ui-paging-info'></div>");
                            a("td#" + u + "_" + b.p.pagerpos, "#" + P).append(z);
                            D = a(".ui-jqgrid").css("font-size") || "11px";
                            a(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + D + ";visibility:hidden;' ></div>");
                            z = a(z).clone().appendTo("#testpg").width();
                            a("#testpg").remove();
                            if (z > 0) {
                                if (w !== "") z += 50;
                                a("td#" + u + "_" + b.p.pagerpos, "#" + P).width(z)
                            }
                            b.p._nvtd = [];
                            b.p._nvtd[0] = z ? Math.floor((b.p.width - z) / 2) : Math.floor(b.p.width / 3);
                            b.p._nvtd[1] = 0;
                            z = null;
                            a(".ui-pg-selbox", "#" + P).bind("change",
                            function () {
                                b.p.page = Math.round(b.p.rowNum * (b.p.page - 1) / this.value - 0.5) + 1;
                                b.p.rowNum = this.value;
                                if (t) a(".ui-pg-selbox", b.p.pager).val(this.value);
                                else b.p.toppager && a(".ui-pg-selbox", b.p.toppager).val(this.value);
                                if (!O("records")) return false;
                                ia();
                                return false
                            });
                            if (b.p.pgbuttons === true) {
                                a(".ui-pg-button", "#" + P).hover(function () {
                                    if (a(this).hasClass("ui-state-disabled")) this.style.cursor = "default";
                                    else {
                                        a(this).addClass("ui-state-hover");
                                        this.style.cursor = "pointer"
                                    }
                                },
                                function () {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        a(this).removeClass("ui-state-hover");
                                        this.style.cursor = "default"
                                    }
                                });
                                a("#first" + a.jgrid.jqID(t) + ", #prev" + a.jgrid.jqID(t) + ", #next" + a.jgrid.jqID(t) + ", #last" + a.jgrid.jqID(t)).click(function () {
                                    var L = o(b.p.page, 1),
                                    K = o(b.p.lastpage, 1),
                                    X = false,
                                    ja = true,
                                    ga = true,
                                    ea = true,
                                    ha = true;
                                    if (K === 0 || K === 1) ha = ea = ga = ja = false;
                                    else if (K > 1 && L >= 1) if (L === 1) ga = ja = false;
                                    else {
                                        if (!(L > 1 && L < K)) if (L === K) ha = ea = false
                                    } else if (K > 1 && L === 0) {
                                        ha = ea = false;
                                        L = K - 1
                                    }
                                    if (this.id === "first" + t && ja) {
                                        b.p.page = 1;
                                        X = true
                                    }
                                    if (this.id === "prev" + t && ga) {
                                        b.p.page = L - 1;
                                        X = true
                                    }
                                    if (this.id === "next" + t && ea) {
                                        b.p.page = L + 1;
                                        X = true
                                    }
                                    if (this.id === "last" + t && ha) {
                                        b.p.page = K;
                                        X = true
                                    }
                                    if (X) {
                                        if (!O(this.id)) return false;
                                        ia()
                                    }
                                    return false
                                })
                            }
                            b.p.pginput === true && a("input.ui-pg-input", "#" + P).keypress(function (L) {
                                if ((L.charCode ? L.charCode : L.keyCode ? L.keyCode : 0) == 13) {
                                    b.p.page = a(this).val() > 0 ? a(this).val() : b.p.page;
                                    if (!O("user")) return false;
                                    ia();
                                    return false
                                }
                                return this
                            })
                        };
                        var qa = function (u, t, w, z) {
                            if (b.p.colModel[t].sortable) if (!(b.p.savedRow.length > 0)) {
                                if (!w) {
                                    if (b.p.lastsort == t) if (b.p.sortorder == "asc") b.p.sortorder = "desc";
                                    else {
                                        if (b.p.sortorder == "desc") b.p.sortorder = "asc"
                                    } else b.p.sortorder = b.p.colModel[t].firstsortorder || "asc";
                                    b.p.page = 1
                                }
                                if (z) if (b.p.lastsort == t && b.p.sortorder == z && !w) return;
                                else b.p.sortorder = z;
                                w = a("thead:first", b.grid.hDiv).get(0);
                                //                                a("tr th:eq(" + b.p.lastsort + ")", w).????

                                a("tr th:eq(" + b.p.lastsort + ") span.ui-grid-ico-sort", w).addClass("ui-state-disabled");
                                a("tr th:eq(" + b.p.lastsort + ") span.ui-grid-ico-sort", w).hide();
                                a("tr th:eq(" + b.p.lastsort + ")", w).attr("aria-selected", "false");
                                a("tr th:eq(" + b.p.lastsort + ")", w).removeClass("ui-th-select");
                                a("tr th:eq(" + t + ") span.ui-icon-" + b.p.sortorder, w).removeClass("ui-state-disabled");
                                a("tr th:eq(" + t + ") span.ui-icon-" + b.p.sortorder, w).show();
                                a("tr th:eq(" + t + ")", w).attr("aria-selected", "true");
                                a("tr th:eq(" + t + ")", w).addClass("ui-th-select");
                                if (!b.p.viewsortcols[0]) if (b.p.lastsort != t) {
                                    a("tr th:eq(" + b.p.lastsort + ") span.s-ico", w).hide();
                                    a("tr th:eq(" + t + ") span.s-ico", w).show();
                                    $(a("tr th:eq(" + t + ") span.s-ico", w).children()[1]).hide();
                                }
                                u = u.substring(5);
                                b.p.sortname = b.p.colModel[t].index || u;
                                w = b.p.sortorder;
                                if (a.isFunction(b.p.onSortCol)) if (b.p.onSortCol.call(b, u, t, w) == "stop") {
                                    b.p.lastsort = t;
                                    return
                                }
                                if (b.p.datatype == "local") b.p.deselectAfterSort && a(b).jqGrid("resetSelection");
                                else {
                                    b.p.selrow = null;
                                    b.p.multiselect && a("#cb_" + a.jgrid.jqID(b.p.id), b.grid.hDiv).attr("checked", false);
                                    b.p.selarrrow = [];
                                    b.p.savedRow = []
                                }
                                if (b.p.scroll) {
                                    w = b.grid.bDiv.scrollLeft;
                                    y(b.grid.bDiv, true, false);
                                    b.grid.hDiv.scrollLeft = w
                                }
                                b.p.subGrid && b.p.datatype == "local" && a("td.sgexpanded", "#" + a.jgrid.jqID(b.p.id)).each(function () {
                                    a(this).trigger("click")
                                });
                                ia();
                                b.p.lastsort = t;
                                if (b.p.sortname != u && t) b.p.lastsort = t
                            }
                        },
                        xa = function (u) {
                            var t, w = {},
                            z = k ? 0 : b.p.cellLayout;
                            for (t = w[0] = w[1] = w[2] = 0; t <= u; t++) if (b.p.colModel[t].hidden === false) w[0] += b.p.colModel[t].width + z;
                            if (b.p.direction == "rtl") w[0] = b.p.width - w[0];
                            w[0] -= b.grid.bDiv.scrollLeft;
                            if (a(b.grid.cDiv).is(":visible")) w[1] += a(b.grid.cDiv).height() + parseInt(a(b.grid.cDiv).css("padding-top"), 10) + parseInt(a(b.grid.cDiv).css("padding-bottom"), 10);
                            if (b.p.toolbar[0] === true && (b.p.toolbar[1] == "top" || b.p.toolbar[1] == "both")) w[1] += a(b.grid.uDiv).height() + parseInt(a(b.grid.uDiv).css("border-top-width"), 10) + parseInt(a(b.grid.uDiv).css("border-bottom-width"), 10);
                            if (b.p.toppager) w[1] += a(b.grid.topDiv).height() + parseInt(a(b.grid.topDiv).css("border-bottom-width"), 10);
                            w[2] += a(b.grid.bDiv).height() + a(b.grid.hDiv).height();
                            return w
                        };
                        this.p.id = this.id;
                        if (a.inArray(b.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) == -1) b.p.multikey = false;
                        b.p.keyIndex = false;
                        for (h = 0; h < b.p.colModel.length; h++) {
                            b.p.colModel[h] = a.extend(true, {},
                            b.p.cmTemplate, b.p.colModel[h].template || {},
                            b.p.colModel[h]);
                            if (b.p.keyIndex === false && b.p.colModel[h].key === true) b.p.keyIndex = h
                        }
                        b.p.sortorder = b.p.sortorder.toLowerCase();
                        if (b.p.grouping === true) {
                            b.p.scroll = false;
                            b.p.rownumbers = false;
                            b.p.subGrid = false;
                            b.p.treeGrid = false;
                            b.p.gridview = true
                        }
                        if (this.p.treeGrid === true) {
                            try {
                                a(this).jqGrid("setTreeGrid")
                            } catch (Aa) { }
                            if (b.p.datatype != "local") b.p.localReader = {
                                id: "_id_"
                            }
                        }
                        if (this.p.subGrid) try {
                            a(b).jqGrid("setSubGrid")
                        } catch (Ba) { }
                        if (this.p.multiselect) {
                            this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/>");
                            this.p.colModel.unshift({
                                name: "cb",
                                width: k ? b.p.multiselectWidth + b.p.cellLayout : b.p.multiselectWidth,
                                sortable: false,
                                resizable: false,
                                hidedlg: true,
                                search: false,
                                align: "center",
                                fixed: true
                            })
                        }
                        if (this.p.rownumbers) {
                            this.p.colNames.unshift("");
                            this.p.colModel.unshift({
                                name: "rn",
                                width: b.p.rownumWidth,
                                sortable: false,
                                resizable: false,
                                hidedlg: true,
                                search: false,
                                align: "center",
                                fixed: true
                            })
                        }
                        b.p.xmlReader = a.extend(true, {
                            root: "rows",
                            row: "row",
                            page: "rows>page",
                            total: "rows>total",
                            records: "rows>records",
                            repeatitems: true,
                            cell: "cell",
                            id: "[id]",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                row: "row",
                                repeatitems: true,
                                cell: "cell"
                            }
                        },
                        b.p.xmlReader);
                        b.p.jsonReader = a.extend(true, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: true,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: true,
                                cell: "cell"
                            }
                        },
                        b.p.jsonReader);
                        b.p.localReader = a.extend(true, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: false,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: true,
                                cell: "cell"
                            }
                        },
                        b.p.localReader);
                        if (b.p.scroll) {
                            b.p.pgbuttons = false;
                            b.p.pginput = false;
                            b.p.rowList = []
                        }
                        b.p.data.length && G();
                        var pa = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
                        Ca, va, E, H, U, M, Q, Y;
                        va = Y = "";
                        if (b.p.shrinkToFit === true && b.p.forceFit === true) for (h = b.p.colModel.length - 1; h >= 0; h--) if (!b.p.colModel[h].hidden) {
                            b.p.colModel[h].resizable = false;
                            break
                        }
                        if (b.p.viewsortcols[1] == "horizontal") {
                            Y = " ui-i-asc";
                            va = " ui-i-desc"
                        }
                        Ca = n ? "class='ui-th-div-ie'" : "";
                        Y = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + Y + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + j + "'></span>";
                        Y += "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + va + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + j + "'></span></span>";
                        for (h = 0; h < this.p.colNames.length; h++) {
                            va = b.p.headertitles ? ' title="' + a.jgrid.stripHtml(b.p.colNames[h]) + '"' : "";
                            pa += "<th id='" + b.p.id + "_" + b.p.colModel[h].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + j + "'" + va + ">";
                            va = b.p.colModel[h].index || b.p.colModel[h].name;
                            pa += "<div id='jqgh_" + b.p.id + "_" + b.p.colModel[h].name + "' " + Ca + ">" + b.p.colNames[h];
                            b.p.colModel[h].width = b.p.colModel[h].width ? parseInt(b.p.colModel[h].width, 10) : 150;
                            if (typeof b.p.colModel[h].title !== "boolean") b.p.colModel[h].title = true;
                            if (va == b.p.sortname) b.p.lastsort = h;
                            pa += Y + "</div></th>"
                        }
                        pa += "</tr></thead>";
                        Y = null;
                        a(this).append(pa);
                        a("thead tr:first th", this).hover(function () {
                            a(this).addClass("ui-state-hover")
                        },
                        function () {
                            a(this).removeClass("ui-state-hover")
                        });
                        if (this.p.multiselect) {
                            var Z = [],
                            da;
                            a("#cb_" + a.jgrid.jqID(b.p.id), this).bind("click",
                            function () {
                                b.p.selarrrow = [];
                                if (this.checked) {
                                    a(b.rows).each(function (u) {
                                        if (u > 0) if (!a(this).hasClass("subgrid") && !a(this).hasClass("jqgroup") && !a(this).hasClass("ui-state-disabled")) {
                                            a("#jqg_" + a.jgrid.jqID(b.p.id) + "_" + a.jgrid.jqID(this.id)).attr("checked", "checked");
                                            a(this).addClass("ui-state-highlight").attr("aria-selected", "true");
                                            b.p.selarrrow.push(this.id);
                                            b.p.selrow = this.id
                                        }
                                    });
                                    da = true;
                                    Z = []
                                } else {
                                    a(b.rows).each(function (u) {
                                        if (u > 0) if (!a(this).hasClass("subgrid") && !a(this).hasClass("ui-state-disabled")) {
                                            a("#jqg_" + a.jgrid.jqID(b.p.id) + "_" + a.jgrid.jqID(this.id)).removeAttr("checked");
                                            a(this).removeClass("ui-state-highlight").attr("aria-selected", "false");
                                            Z.push(this.id)
                                        }
                                    });
                                    b.p.selrow = null;
                                    da = false
                                }
                                if (a.isFunction(b.p.onSelectAll)) b.p.onSelectAll.call(b, da ? b.p.selarrrow : Z, da)
                            })
                        }
                        if (b.p.autowidth === true) {
                            pa = a(p).innerWidth();
                            b.p.width = pa > 0 ? pa : "nw"
                        } (function () {
                            var u = 0,
                            t = k ? 0 : b.p.cellLayout,
                            w = 0,
                            z,
                            D = b.p.scrollOffset,
                            P,
                            I = false,
                            W,
                            J = 0,
                            O = 0,
                            L;
                            a.each(b.p.colModel,
                            function () {
                                if (typeof this.hidden === "undefined") this.hidden = false;
                                this.widthOrg = P = o(this.width, 0);
                                if (this.hidden === false) {
                                    u += P + t;
                                    if (this.fixed) J += P + t;
                                    else w++;
                                    O++
                                }
                            });
                            if (isNaN(b.p.width)) b.p.width = g.width = u;
                            else g.width = b.p.width;
                            b.p.tblwidth = u;
                            if (b.p.shrinkToFit === false && b.p.forceFit === true) b.p.forceFit = false;
                            if (b.p.shrinkToFit === true && w > 0) {
                                W = g.width - t * w - J;
                                if (!isNaN(b.p.height)) {
                                    W -= D;
                                    I = true
                                }
                                u = 0;
                                a.each(b.p.colModel,
                                function (K) {
                                    if (this.hidden === false && !this.fixed) {
                                        this.width = P = Math.round(W * this.width / (b.p.tblwidth - t * w - J));
                                        u += P;
                                        z = K
                                    }
                                });
                                L = 0;
                                if (I) {
                                    if (g.width - J - (u + t * w) !== D) L = g.width - J - (u + t * w) - D
                                } else if (!I && Math.abs(g.width - J - (u + t * w)) !== 1) L = g.width - J - (u + t * w);
                                b.p.colModel[z].width += L;
                                b.p.tblwidth = u + L + t * w + J;
                                if (b.p.tblwidth > b.p.width) {
                                    b.p.colModel[z].width -= b.p.tblwidth - parseInt(b.p.width, 10);
                                    b.p.tblwidth = b.p.width
                                }
                            }
                        })();
                        a(p).css("width", g.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" + b.p.id + "'>&#160;</div>");
                        a(m).css("width", g.width + "px");
                        pa = a("thead:first", b).get(0);
                        var V = "";
                        if (b.p.footerrow) V += "<table role='grid' style='width:" + b.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + j + "'>";
                        m = a("tr:first", pa);
                        var la = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
                        b.p.disableClick = false;
                        a("th", m).each(function (u) {
                            E = b.p.colModel[u].width;
                            if (typeof b.p.colModel[u].resizable === "undefined") b.p.colModel[u].resizable = true;
                            if (b.p.colModel[u].resizable) {
                                H = document.createElement("span");
                                a(H).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + j);
                                a.browser.opera || a(H).css("cursor", "col-resize");
                                a(this).addClass(b.p.resizeclass)
                            } else H = "";
                            a(this).css("width", E + "px").prepend(H);
                            var t = "";
                            if (b.p.colModel[u].hidden) {
                                a(this).css("display", "none");
                                t = "display:none;"
                            }
                            la += "<td role='gridcell' style='height:0px;width:" + E + "px;" + t + "'></td>";
                            g.headers[u] = {
                                width: E,
                                el: this
                            };
                            U = b.p.colModel[u].sortable;
                            if (typeof U !== "boolean") U = b.p.colModel[u].sortable = true;
                            t = b.p.colModel[u].name;
                            t == "cb" || t == "subgrid" || t == "rn" || b.p.viewsortcols[2] && a("div", this).addClass("ui-jqgrid-sortable");
                            if (U) if (b.p.viewsortcols[0]) {
                                a("div span.s-ico", this).show();
                                u == b.p.lastsort && a("div span.ui-icon-" + b.p.sortorder, this).removeClass("ui-state-disabled")
                            } else if (u == b.p.lastsort) {
                                a("div span.s-ico", this).show();
                                a("div span.ui-icon-" + b.p.sortorder, this).removeClass("ui-state-disabled")
                            }
                            if (b.p.footerrow) V += "<td role='gridcell' " + v(u, 0, "", null, "", false) + ">&#160;</td>"
                        }).mousedown(function (u) {
                            if (a(u.target).closest("th>span.ui-jqgrid-resize").length == 1) {
                                var t = a.jgrid.getCellIndex(this);
                                if (b.p.forceFit === true) {
                                    var w = b.p,
                                    z = t,
                                    D;
                                    for (D = t + 1; D < b.p.colModel.length; D++) if (b.p.colModel[D].hidden !== true) {
                                        z = D;
                                        break
                                    }
                                    w.nv = z - t
                                }
                                g.dragStart(t, u, xa(t));
                                return false
                            }
                        }).click(function (u) {
                            if (b.p.disableClick) return b.p.disableClick = false;
                            var t = "th>div.ui-jqgrid-sortable",
                            w, z;
                            b.p.viewsortcols[2] || (t = "th>div>span>span.ui-grid-ico-sort");
                            u = a(u.target).closest(t);
                            if (u.length == 1) {
                                t = a.jgrid.getCellIndex(this);
                                if (!b.p.viewsortcols[2]) {
                                    w = true;
                                    z = u.attr("sort")
                                }
                                qa(a("div", this)[0].id, t, w, z);
                                return false
                            }
                        });
                        if (b.p.sortable && a.fn.sortable) try {
                            a(b).jqGrid("sortableColumns", m)
                        } catch (fa) { }
                        if (b.p.footerrow) V += "</tr></tbody></table>";
                        la += "</tr>";
                        this.appendChild(document.createElement("tbody"));
                        a(this).addClass("ui-jqgrid-btable").append(la);
                        la = null;
                        m = a("<table class='ui-jqgrid-htable' style='width:" + b.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(pa);
                        var ma = b.p.caption && b.p.hiddengrid === true ? true : false;
                        h = a("<div class='ui-jqgrid-hbox" + (j == "rtl" ? "-rtl" : "") + "'></div>");
                        pa = null;
                        g.hDiv = document.createElement("div");
                        a(g.hDiv).css({
                            width: g.width + "px"
                        }).addClass("ui-state-default ui-jqgrid-hdiv").append(h);
                        a(h).append(m);
                        m = null;
                        ma && a(g.hDiv).hide();
                        if (b.p.pager) {
                            if (typeof b.p.pager == "string") {
                                if (b.p.pager.substr(0, 1) != "#") b.p.pager = "#" + b.p.pager
                            } else b.p.pager = "#" + a(b.p.pager).attr("id");
                            a(b.p.pager).css({
                                width: g.width + "px"
                            }).appendTo(p).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
                            ma && a(b.p.pager).hide();
                            l(b.p.pager, "")
                        }
                        b.p.cellEdit === false && b.p.hoverrows === true && a(b).bind("mouseover",
                        function (u) {
                            Q = a(u.target).closest("tr.jqgrow");
                            a(Q).attr("class") !== "subgrid" && a(Q).hasClass("ui-state-highlight") == false && a(Q).addClass("ui-state-hover");
                            return false
                        }).bind("mouseout",
                        function (u) {
                            Q = a(u.target).closest("tr.jqgrow");
                            a(Q).removeClass("ui-state-hover");
                            return false
                        });
                        var ba, ta;
                        a(b).before(g.hDiv).click(function (u) {
                            M = u.target;
                            Q = a(M, b.rows).closest("tr.jqgrow");
                            if (a(Q).length === 0 || Q[0].className.indexOf("ui-state-disabled") > -1) return this;
                            var t = a(M).hasClass("cbox"),
                            w = true;
                            if (a.isFunction(b.p.beforeSelectRow)) w = b.p.beforeSelectRow.call(b, Q[0].id, u);
                            if (M.tagName == "A" || (M.tagName == "INPUT" || M.tagName == "TEXTAREA" || M.tagName == "OPTION" || M.tagName == "SELECT") && !t) return this;
                            if (w === true) {
                                if (b.p.cellEdit === true) if (b.p.multiselect && t) a(b).jqGrid("setSelection", Q[0].id, true);
                                else {
                                    ba = Q[0].rowIndex;
                                    ta = a.jgrid.getCellIndex(M);
                                    try {
                                        a(b).jqGrid("editCell", ba, ta, true)
                                    } catch (z) { }
                                } else if (b.p.multikey) if (u[b.p.multikey]) a(b).jqGrid("setSelection", Q[0].id, true);
                                else {
                                    if (b.p.multiselect && t) {
                                        t = a("#jqg_" + a.jgrid.jqID(b.p.id) + "_" + Q[0].id).attr("checked");
                                        a("#jqg_" + a.jgrid.jqID(b.p.id) + "_" + Q[0].id).attr("checked", !t)
                                    }
                                } else {
                                    if (b.p.multiselect && b.p.multiboxonly) if (!t) {
                                        a(b.p.selarrrow).each(function (D, P) {
                                            var I = b.rows.namedItem(P);
                                            a(I).removeClass("ui-state-highlight");
                                            a("#jqg_" + a.jgrid.jqID(b.p.id) + "_" + a.jgrid.jqID(P)).attr("checked", false)
                                        });
                                        b.p.selarrrow = [];
                                        a("#cb_" + a.jgrid.jqID(b.p.id), b.grid.hDiv).attr("checked", false)
                                    }
                                    a(b).jqGrid("setSelection", Q[0].id, true)
                                }
                                if (a.isFunction(b.p.onCellSelect)) {
                                    ba = Q[0].id;
                                    ta = a.jgrid.getCellIndex(M);
                                    b.p.onCellSelect.call(b, ba, ta, a(M).html(), u)
                                }
                            }
                            return this
                        }).bind("reloadGrid",
                        function (u, t) {
                            if (b.p.treeGrid === true) b.p.datatype = b.p.treedatatype;
                            t && t.current && b.grid.selectionPreserver(b);
                            if (b.p.datatype == "local") {
                                a(b).jqGrid("resetSelection");
                                b.p.data.length && G()
                            } else if (!b.p.treeGrid) {
                                b.p.selrow = null;
                                if (b.p.multiselect) {
                                    b.p.selarrrow = [];
                                    a("#cb_" + a.jgrid.jqID(b.p.id), b.grid.hDiv).attr("checked", false)
                                }
                                b.p.savedRow = []
                            }
                            b.p.scroll && y(b.grid.bDiv, true, false);
                            if (t && t.page) {
                                var w = t.page;
                                if (w > b.p.lastpage) w = b.p.lastpage;
                                if (w < 1) w = 1;
                                b.p.page = w;
                                b.grid.bDiv.scrollTop = b.grid.prevRowHeight ? (w - 1) * b.grid.prevRowHeight * b.p.rowNum : 0
                            }
                            if (b.grid.prevRowHeight && b.p.scroll) {
                                delete b.p.lastpage;
                                b.grid.populateVisible()
                            } else b.grid.populate();
                            return false
                        });
                        a.isFunction(this.p.ondblClickRow) && a(this).dblclick(function (u) {
                            M = u.target;
                            Q = a(M, b.rows).closest("tr.jqgrow");
                            if (a(Q).length === 0) return false;
                            ba = Q[0].rowIndex;
                            ta = a.jgrid.getCellIndex(M);
                            b.p.ondblClickRow.call(b, a(Q).attr("id"), ba, ta, u);
                            return false
                        });
                        a.isFunction(this.p.onRightClickRow) && a(this).bind("contextmenu",
                        function (u) {
                            M = u.target;
                            Q = a(M, b.rows).closest("tr.jqgrow");
                            if (a(Q).length === 0) return false;
                            b.p.multiselect || a(b).jqGrid("setSelection", Q[0].id, true);
                            ba = Q[0].rowIndex;
                            ta = a.jgrid.getCellIndex(M);
                            b.p.onRightClickRow.call(b, a(Q).attr("id"), ba, ta, u);
                            return false
                        });
                        g.bDiv = document.createElement("div");
                        if (n) if (String(b.p.height).toLowerCase() === "auto") b.p.height = "100%";
                        a(g.bDiv).append(a('<div style="position:relative;' + (n && a.browser.version < 8 ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({
                            height: b.p.height + (isNaN(b.p.height) ? "" : "px"),
                            width: g.width + "px"
                        }).scroll(g.scrollGrid);
                        a("table:first", g.bDiv).css({
                            width: b.p.tblwidth + "px"
                        });
                        if (n) {
                            a("tbody", this).size() == 2 && a("tbody:gt(0)", this).remove();
                            b.p.multikey && a(g.bDiv).bind("selectstart",
                            function () {
                                return false
                            })
                        } else b.p.multikey && a(g.bDiv).bind("mousedown",
                        function () {
                            return false
                        });
                        ma && a(g.bDiv).hide();
                        g.cDiv = document.createElement("div");
                        var na = b.p.hidegrid === true ? a("<a role='link' href='javascript:void(0)'/>").addClass("ui-jqgrid-titlebar-close HeaderButton").hover(function () {
                            na.addClass("ui-state-hover")
                        },
                        function () {
                            na.removeClass("ui-state-hover")
                        }).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css(j == "rtl" ? "left" : "right", "0px") : "";
                        a(g.cDiv).append(na).append("<span class='ui-jqgrid-title" + (j == "rtl" ? "-rtl" : "") + "'>" + b.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix");
                        a(g.cDiv).insertBefore(g.hDiv);
                        if (b.p.toolbar[0]) {
                            g.uDiv = document.createElement("div");
                            if (b.p.toolbar[1] == "top") a(g.uDiv).insertBefore(g.hDiv);
                            else b.p.toolbar[1] == "bottom" && a(g.uDiv).insertAfter(g.hDiv);
                            if (b.p.toolbar[1] == "both") {
                                g.ubDiv = document.createElement("div");
                                a(g.uDiv).insertBefore(g.hDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id);
                                a(g.ubDiv).insertAfter(g.hDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id);
                                ma && a(g.ubDiv).hide()
                            } else a(g.uDiv).width(g.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id);
                            ma && a(g.uDiv).hide()
                        }
                        if (b.p.toppager) {
                            b.p.toppager = a.jgrid.jqID(b.p.id) + "_toppager";
                            g.topDiv = a("<div id='" + b.p.toppager + "'></div>")[0];
                            b.p.toppager = "#" + b.p.toppager;
                            a(g.topDiv).insertBefore(g.hDiv).addClass("ui-state-default ui-jqgrid-toppager").width(g.width);
                            l(b.p.toppager, "_t")
                        }
                        if (b.p.footerrow) {
                            g.sDiv = a("<div class='ui-jqgrid-sdiv'></div>")[0];
                            h = a("<div class='ui-jqgrid-hbox" + (j == "rtl" ? "-rtl" : "") + "'></div>");
                            a(g.sDiv).append(h).insertAfter(g.hDiv).width(g.width);
                            a(h).append(V);
                            g.footers = a(".ui-jqgrid-ftable", g.sDiv)[0].rows[0].cells;
                            if (b.p.rownumbers) g.footers[0].className = "ui-state-default jqgrid-rownum";
                            ma && a(g.sDiv).hide()
                        }
                        h = null;
                        if (b.p.caption) {
                            var wa = b.p.datatype;
                            if (b.p.hidegrid === true) {
                                a(".ui-jqgrid-titlebar-close", g.cDiv).click(function (u) {
                                    var t = a.isFunction(b.p.onHeaderClick),
                                    w = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
                                    z,
                                    D = this;
                                    if (b.p.toolbar[0] === true) {
                                        if (b.p.toolbar[1] == "both") w += ", #" + a(g.ubDiv).attr("id");
                                        w += ", #" + a(g.uDiv).attr("id")
                                    }
                                    z = a(w, "#gview_" + a.jgrid.jqID(b.p.id)).length;
                                    if (b.p.gridstate == "visible") a(w, "#gbox_" + a.jgrid.jqID(b.p.id)).slideUp("fast",
                                    function () {
                                        z--;
                                        if (z === 0) {
                                            a("span", D).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                                            b.p.gridstate = "hidden";
                                            a("#gbox_" + a.jgrid.jqID(b.p.id)).hasClass("ui-resizable") && a(".ui-resizable-handle", "#gbox_" + a.jgrid.jqID(b.p.id)).hide();
                                            if (t) ma || b.p.onHeaderClick.call(b, b.p.gridstate, u)
                                        }
                                    });
                                    else b.p.gridstate == "hidden" && a(w, "#gbox_" + a.jgrid.jqID(b.p.id)).slideDown("fast",
                                    function () {
                                        z--;
                                        if (z === 0) {
                                            a("span", D).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                                            if (ma) {
                                                b.p.datatype = wa;
                                                ia();
                                                ma = false
                                            }
                                            b.p.gridstate = "visible";
                                            a("#gbox_" + a.jgrid.jqID(b.p.id)).hasClass("ui-resizable") && a(".ui-resizable-handle", "#gbox_" + a.jgrid.jqID(b.p.id)).show();
                                            if (t) ma || b.p.onHeaderClick.call(b, b.p.gridstate, u)
                                        }
                                    });
                                    return false
                                });
                                if (ma) {
                                    b.p.datatype = "local";
                                    a(".ui-jqgrid-titlebar-close", g.cDiv).trigger("click")
                                }
                            }
                        } else a(g.cDiv).hide();
                        a(g.hDiv).after(g.bDiv).mousemove(function (u) {
                            if (g.resizing) {
                                g.dragMove(u);
                                return false
                            }
                        });
                        a(".ui-jqgrid-labels", g.hDiv).bind("selectstart",
                        function () {
                            return false
                        });
                        a(document).mouseup(function () {
                            if (g.resizing) {
                                g.dragEnd();
                                return false
                            }
                            return true
                        });
                        b.formatCol = v;
                        b.sortData = qa;
                        b.updatepager = function (u, t) {
                            var w, z, D, P, I, W, J, O = "",
                            L = b.p.pager ? "_" + a.jgrid.jqID(b.p.pager.substr(1)) : "",
                            K = b.p.toppager ? "_" + b.p.toppager.substr(1) : "";
                            D = parseInt(b.p.page, 10) - 1;
                            if (D < 0) D = 0;
                            D *= parseInt(b.p.rowNum, 10);
                            I = D + b.p.reccount;
                            if (b.p.scroll) {
                                w = a("tbody:first > tr:gt(0)", b.grid.bDiv);
                                D = I - w.length;
                                b.p.reccount = w.length;
                                if (z = w.outerHeight() || b.grid.prevRowHeight) {
                                    w = D * z;
                                    z *= parseInt(b.p.records, 10);
                                    a(">div:first", b.grid.bDiv).css({
                                        height: z
                                    }).children("div:first").css({
                                        height: w,
                                        display: w ? "" : "none"
                                    })
                                }
                                b.grid.bDiv.scrollLeft = b.grid.hDiv.scrollLeft
                            }
                            O = b.p.pager ? b.p.pager : "";
                            O += b.p.toppager ? O ? "," + b.p.toppager : b.p.toppager : "";
                            if (O) {
                                J = a.jgrid.formatter.integer || {};
                                w = o(b.p.page);
                                z = o(b.p.lastpage);
                                a(".selbox", O).attr("disabled", false);
                                if (b.p.pginput === true) {
                                    a(".ui-pg-input", O).val(b.p.page);
                                    P = b.p.toppager ? "#sp_1" + L + ",#sp_1" + K : "#sp_1" + L;
                                    a(P).html(a.fmatter ? a.fmatter.util.NumberFormat(b.p.lastpage, J) : b.p.lastpage)
                                }
                                if (b.p.viewrecords) if (b.p.reccount === 0) a(".ui-paging-info", O).html(b.p.emptyrecords);
                                else {
                                    P = D + 1;
                                    W = b.p.records;
                                    if (a.fmatter) {
                                        P = a.fmatter.util.NumberFormat(P, J);
                                        I = a.fmatter.util.NumberFormat(I, J);
                                        W = a.fmatter.util.NumberFormat(W, J)
                                    }
                                    a(".ui-paging-info", O).html(a.jgrid.format(b.p.recordtext, P, I, W))
                                }
                                if (b.p.pgbuttons === true) {
                                    if (w <= 0) w = z = 0;
                                    if (w == 1 || w === 0) {
                                        a("#first" + L + ", #prev" + L).addClass("ui-state-disabled").removeClass("ui-state-hover");
                                        b.p.toppager && a("#first_t" + K + ", #prev_t" + K).addClass("ui-state-disabled").removeClass("ui-state-hover")
                                    } else {
                                        a("#first" + L + ", #prev" + L).removeClass("ui-state-disabled");
                                        b.p.toppager && a("#first_t" + K + ", #prev_t" + K).removeClass("ui-state-disabled")
                                    }
                                    if (w == z || w === 0) {
                                        a("#next" + L + ", #last" + L).addClass("ui-state-disabled").removeClass("ui-state-hover");
                                        b.p.toppager && a("#next_t" + K + ", #last_t" + K).addClass("ui-state-disabled").removeClass("ui-state-hover")
                                    } else {
                                        a("#next" + L + ", #last" + L).removeClass("ui-state-disabled");
                                        b.p.toppager && a("#next_t" + K + ", #last_t" + K).removeClass("ui-state-disabled")
                                    }
                                }
                            }
                            u === true && b.p.rownumbers === true && a("td.jqgrid-rownum", b.rows).each(function (X) {
                                a(this).html(D + 1 + X)
                            });
                            t && b.p.jqgdnd && a(b).jqGrid("gridDnD", "updateDnD");
                            a.isFunction(b.p.gridComplete) && b.p.gridComplete.call(b)
                        };
                        b.refreshIndex = G;
                        b.formatter = function (u, t, w, z, D) {
                            return r(u, t, w, z, D)
                        };
                        a.extend(g, {
                            populate: ia,
                            emptyRows: y
                        });
                        this.grid = g;
                        b.addXmlData = function (u) {
                            S(u, b.grid.bDiv)
                        };
                        b.addJSONData = function (u) {
                            C(u, b.grid.bDiv)
                        };
                        this.grid.cols = this.rows[0].cells;
                        ia();
                        b.p.hiddengrid = false;
                        a(window).unload(function () {
                            b = null
                        })
                    }
                }
            }
        })
    };
    a.jgrid.extend({
        getGridParam: function (d) {
            var e = this[0];
            if (e && e.grid) return d ? typeof e.p[d] != "undefined" ? e.p[d] : null : e.p
        },
        setGridParam: function (d) {
            return this.each(function () {
                this.grid && typeof d === "object" && a.extend(true, this.p, d)
            })
        },
        getDataIDs: function () {
            var d = [],
            e = 0,
            c,
            f = 0;
            this.each(function () {
                if ((c = this.rows.length) && c > 0) for (; e < c; ) {
                    if (a(this.rows[e]).hasClass("jqgrow")) {
                        d[f] = this.rows[e].id;
                        f++
                    }
                    e++
                }
            });
            return d
        },
        setSelection: function (d, e) {
            return this.each(function () {
                function c(b) {
                    var m = a(f.grid.bDiv)[0].clientHeight,
                    l = a(f.grid.bDiv)[0].scrollTop,
                    n = f.rows[b].offsetTop;
                    b = f.rows[b].clientHeight;
                    if (n + b >= m + l) a(f.grid.bDiv)[0].scrollTop = n - (m + l) + b + l;
                    else if (n < m + l) if (n < l) a(f.grid.bDiv)[0].scrollTop = n
                }
                var f = this,
                g, h, j;
                if (d !== undefined) {
                    e = e === false ? false : true;
                    h = f.rows.namedItem(d + "");
                    if (!(!h || h.className.indexOf("ui-state-disabled") > -1)) {
                        if (f.p.scrollrows === true) {
                            g = f.rows.namedItem(d).rowIndex;
                            g >= 0 && c(g)
                        }
                        if (f.p.multiselect) {
                            f.p.selrow = h.id;
                            j = a.inArray(f.p.selrow, f.p.selarrrow);
                            if (j === -1) {
                                h.className !== "ui-subgrid" && a(h).addClass("ui-state-highlight").attr("aria-selected", "true") && a(h).removeClass("ui-state-hover");
                                g = true;
                                a("#jqg_" + a.jgrid.jqID(f.p.id) + "_" + a.jgrid.jqID(f.p.selrow)).attr("checked", g);
                                f.p.selarrrow.push(f.p.selrow)
                            } else {
                                h.className !== "ui-subgrid" && a(h).removeClass("ui-state-highlight").attr("aria-selected", "false");
                                g = false;
                                a("#jqg_" + a.jgrid.jqID(f.p.id) + "_" + a.jgrid.jqID(f.p.selrow)).attr("checked", g);
                                f.p.selarrrow.splice(j, 1);
                                j = f.p.selarrrow[0];
                                f.p.selrow = j === undefined ? null : j
                            }
                            f.p.onSelectRow && e && f.p.onSelectRow.call(f, h.id, g)
                        } else if (h.className !== "ui-subgrid") {
                            if (f.p.selrow != h.id) {
                                a(f.rows.namedItem(f.p.selrow)).removeClass("ui-state-highlight").attr({
                                    "aria-selected": "false",
                                    tabindex: "-1"
                                });
                                a(h).addClass("ui-state-highlight").attr({
                                    "aria-selected": true,
                                    tabindex: "0"
                                });
                                a(h).removeClass("ui-state-hover");
                                g = true
                            } else g = false;
                            f.p.selrow = h.id;
                            f.p.onSelectRow && e && f.p.onSelectRow.call(f, h.id, g)
                        }
                    }
                }
            })
        },
        resetSelection: function (d) {
            return this.each(function () {
                var e = this,
                c, f;
                if (typeof d !== "undefined") {
                    f = d === e.p.selrow ? e.p.selrow : d;
                    a("#" + a.jgrid.jqID(e.p.id) + " tbody:first tr#" + a.jgrid.jqID(f)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                    if (e.p.multiselect) {
                        a("#jqg_" + a.jgrid.jqID(e.p.id) + "_" + a.jgrid.jqID(f)).attr("checked", false);
                        a("#cb_" + a.jgrid.jqID(e.p.id)).attr("checked", false)
                    }
                    f = null
                } else if (e.p.multiselect) {
                    a(e.p.selarrrow).each(function (g, h) {
                        c = e.rows.namedItem(h);
                        a(c).removeClass("ui-state-highlight").attr("aria-selected", "false");
                        a("#jqg_" + a.jgrid.jqID(e.p.id) + "_" + a.jgrid.jqID(h)).attr("checked", false)
                    });
                    a("#cb_" + a.jgrid.jqID(e.p.id)).attr("checked", false);
                    e.p.selarrrow = []
                } else if (e.p.selrow) {
                    a("#" + a.jgrid.jqID(e.p.id) + " tbody:first tr#" + a.jgrid.jqID(e.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                    e.p.selrow = null
                }
                e.p.savedRow = []
            })
        },
        getRowData: function (d) {
            var e = {},
            c, f = false,
            g, h = 0;
            this.each(function () {
                var j = this,
                b, m;
                if (typeof d == "undefined") {
                    f = true;
                    c = [];
                    g = j.rows.length
                } else {
                    m = j.rows.namedItem(d);
                    if (!m) return e;
                    g = 2
                }
                for (; h < g; ) {
                    if (f) m = j.rows[h];
                    if (a(m).hasClass("jqgrow")) {
                        a("td", m).each(function (l) {
                            b = j.p.colModel[l].name;
                            if (b !== "cb" && b !== "subgrid" && b !== "rn") if (j.p.treeGrid === true && b == j.p.ExpandColumn) e[b] = a.jgrid.htmlDecode(a("span:first", this).html());
                            else try {
                                e[b] = a.unformat(this, {
                                    rowId: m.id,
                                    colModel: j.p.colModel[l]
                                },
                                l)
                            } catch (n) {
                                e[b] = a.jgrid.htmlDecode(a(this).html())
                            }
                        });
                        if (f) {
                            c.push(e);
                            e = {}
                        }
                    }
                    h++
                }
            });
            return c ? c : e
        },
        delRowData: function (d) {
            var e = false,
            c, f;
            this.each(function () {
                if (c = this.rows.namedItem(d)) {
                    a(c).remove();
                    this.p.records--;
                    this.p.reccount--;
                    this.updatepager(true, false);
                    e = true;
                    if (this.p.multiselect) {
                        f = a.inArray(d, this.p.selarrrow);
                        f != -1 && this.p.selarrrow.splice(f, 1)
                    }
                    if (d == this.p.selrow) this.p.selrow = null
                } else return false;
                if (this.p.datatype == "local") {
                    var g = this.p._index[d];
                    if (typeof g != "undefined") {
                        this.p.data.splice(g, 1);
                        this.refreshIndex()
                    }
                }
                if (this.p.altRows === true && e) {
                    var h = this.p.altclass;
                    a(this.rows).each(function (j) {
                        j % 2 == 1 ? a(this).addClass(h) : a(this).removeClass(h)
                    })
                }
            });
            return e
        },
        setRowData: function (d, e, c) {
            var f, g = true,
            h;
            this.each(function () {
                if (!this.grid) return false;
                var j = this,
                b, m, l = typeof c,
                n = {};
                m = j.rows.namedItem(d);
                if (!m) return false;
                if (e) try {
                    a(this.p.colModel).each(function (v) {
                        f = this.name;
                        if (e[f] !== undefined) {
                            n[f] = this.formatter && typeof this.formatter === "string" && this.formatter == "date" ? a.unformat.date(e[f], this) : e[f];
                            b = j.formatter(d, e[f], v, e, "edit");
                            h = this.title ? {
                                title: a.jgrid.stripHtml(b)
                            } : {};
                            j.p.treeGrid === true && f == j.p.ExpandColumn ? a("td:eq(" + v + ") > span:first", m).html(b).attr(h) : a("td:eq(" + v + ")", m).html(b).attr(h)
                        }
                    });
                    if (j.p.datatype == "local") {
                        var k = j.p._index[d];
                        if (j.p.treeGrid) for (var p in j.p.treeReader) n.hasOwnProperty(j.p.treeReader[p]) && delete n[j.p.treeReader[p]];
                        if (typeof k != "undefined") j.p.data[k] = a.extend(true, j.p.data[k], n);
                        n = null
                    }
                } catch (o) {
                    g = false
                }
                if (g) if (l === "string") a(m).addClass(c);
                else l === "object" && a(m).css(c)
            });
            return g
        },
        addRowData: function (d, e, c, f) {
            c || (c = "last");
            var g = false,
            h, j, b, m, l, n, k, p, o = "",
            v, q, r, s, x;
            if (e) {
                if (a.isArray(e)) {
                    v = true;
                    c = "last";
                    q = d
                } else {
                    e = [e];
                    v = false
                }
                this.each(function () {
                    var A = e.length;
                    l = this.p.rownumbers === true ? 1 : 0;
                    b = this.p.multiselect === true ? 1 : 0;
                    m = this.p.subGrid === true ? 1 : 0;
                    if (!v) if (typeof d != "undefined") d += "";
                    else {
                        d = a.jgrid.randId();
                        if (this.p.keyIndex !== false) {
                            q = this.p.colModel[this.p.keyIndex + b + m + l].name;
                            if (typeof e[0][q] != "undefined") d = e[0][q]
                        }
                    }
                    r = this.p.altclass;
                    for (var B = 0,
                    F = "",
                    y = {},
                    G = a.isFunction(this.p.afterInsertRow) ? true : false; B < A; ) {
                        s = e[B];
                        j = "";
                        if (v) {
                            try {
                                d = s[q]
                            } catch (S) {
                                d = a.jgrid.randId()
                            }
                            F = this.p.altRows === true ? (this.rows.length - 1) % 2 === 0 ? r : "" : ""
                        }
                        if (l) {
                            o = this.formatCol(0, 1, "", null, d, true);
                            j += '<td role="gridcell" aria-describedby="' + this.p.id + '_rn" class="ui-state-default jqgrid-rownum" ' + o + ">0</td>"
                        }
                        if (b) {
                            p = '<input role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + d + '" class="cbox"/>';
                            o = this.formatCol(l, 1, "", null, d, true);
                            j += '<td role="gridcell" aria-describedby="' + this.p.id + '_cb" ' + o + ">" + p + "</td>"
                        }
                        if (m) j += a(this).jqGrid("addSubGridCell", b + l, 1);
                        for (k = b + m + l; k < this.p.colModel.length; k++) {
                            x = this.p.colModel[k];
                            h = x.name;
                            y[h] = x.formatter && typeof x.formatter === "string" && x.formatter == "date" ? a.unformat.date(s[h], x) : s[h];
                            p = this.formatter(d, a.jgrid.getAccessor(s, h), k, s, "edit");
                            o = this.formatCol(k, 1, p, d, s, true);
                            j += '<td role="gridcell" aria-describedby="' + this.p.id + "_" + h + '" ' + o + ">" + p + "</td>"
                        }
                        j = '<tr id="' + d + '" role="row" tabindex="-1" class="ui-widget-content jqgrow ui-row-' + this.p.direction + " " + F + '">' + j + "</tr>";
                        if (this.rows.length === 0) a("table:first", this.grid.bDiv).append(j);
                        else switch (c) {
                            case "last":
                                a(this.rows[this.rows.length - 1]).after(j);
                                n = this.rows.length - 1;
                                break;
                            case "first":
                                a(this.rows[0]).after(j);
                                n = 1;
                                break;
                            case "after":
                                if (n = this.rows.namedItem(f)) a(this.rows[n.rowIndex + 1]).hasClass("ui-subgrid") ? a(this.rows[n.rowIndex + 1]).after(j) : a(n).after(j);
                                n++;
                                break;
                            case "before":
                                if (n = this.rows.namedItem(f)) {
                                    a(n).before(j);
                                    n = n.rowIndex
                                }
                                n--
                        }
                        this.p.subGrid === true && a(this).jqGrid("addSubGrid", b + l, n);
                        this.p.records++;
                        this.p.reccount++;
                        G && this.p.afterInsertRow.call(this, d, s, s);
                        B++;
                        if (this.p.datatype == "local") {
                            y[this.p.localReader.id] = d;
                            this.p._index[d] = this.p.data.length;
                            this.p.data.push(y);
                            y = {}
                        }
                    }
                    if (this.p.altRows === true && !v) if (c == "last") (this.rows.length - 1) % 2 == 1 && a(this.rows[this.rows.length - 1]).addClass(r);
                    else a(this.rows).each(function (C) {
                        C % 2 == 1 ? a(this).addClass(r) : a(this).removeClass(r)
                    });
                    this.updatepager(true, true);
                    g = true
                })
            }
            return g
        },
        footerData: function (d, e, c) {
            function f(m) {
                for (var l in m) if (m.hasOwnProperty(l)) return false;
                return true
            }
            var g, h = false,
            j = {},
            b;
            if (typeof d == "undefined") d = "get";
            if (typeof c != "boolean") c = true;
            d = d.toLowerCase();
            this.each(function () {
                var m = this,
                l;
                if (!m.grid || !m.p.footerrow) return false;
                if (d == "set") if (f(e)) return false;
                h = true;
                a(this.p.colModel).each(function (n) {
                    g = this.name;
                    if (d == "set") {
                        if (e[g] !== undefined) {
                            l = c ? m.formatter("", e[g], n, e, "edit") : e[g];
                            b = this.title ? {
                                title: a.jgrid.stripHtml(l)
                            } : {};
                            a("tr.footrow td:eq(" + n + ")", m.grid.sDiv).html(l).attr(b);
                            h = true
                        }
                    } else if (d == "get") j[g] = a("tr.footrow td:eq(" + n + ")", m.grid.sDiv).html()
                })
            });
            return d == "get" ? j : h
        },
        showHideCol: function (d, e) {
            return this.each(function () {
                var c = this,
                f = false,
                g = a.browser.webkit || a.browser.safari ? 0 : c.p.cellLayout,
                h;
                if (c.grid) {
                    if (typeof d === "string") d = [d];
                    e = e != "none" ? "" : "none";
                    var j = e === "" ? true : false;
                    a(this.p.colModel).each(function (b) {
                        if (a.inArray(this.name, d) !== -1 && this.hidden === j) {
                            a("tr", c.grid.hDiv).each(function () {
                                a(this).children("th:eq(" + b + ")").css("display", e)
                            });
                            a(c.rows).each(function () {
                                a(this).children("td:eq(" + b + ")").css("display", e)
                            });
                            c.p.footerrow && a("tr.footrow td:eq(" + b + ")", c.grid.sDiv).css("display", e);
                            h = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
                            if (e === "none") c.p.tblwidth -= h + g;
                            else c.p.tblwidth += h + g;
                            this.hidden = !j;
                            f = true
                        }
                    });
                    if (f === true) if (c.p.shrinkToFit === false) a(c).jqGrid("setGridWidth", c.grid.width);
                    else c.grid.width !== c.p.tblwidth && a(c).jqGrid("setGridWidth", c.p.tblwidth)
                }
            })
        },
        hideCol: function (d) {
            return this.each(function () {
                a(this).jqGrid("showHideCol", d, "none")
            })
        },
        showCol: function (d) {
            return this.each(function () {
                a(this).jqGrid("showHideCol", d, "")
            })
        },
        remapColumns: function (d, e, c) {
            function f(j) {
                var b;
                b = j.length ? a.makeArray(j) : a.extend({},
                j);
                a.each(d,
                function (m) {
                    j[m] = b[this]
                })
            }
            function g(j, b) {
                a(">tr" + (b || ""), j).each(function () {
                    var m = this,
                    l = a.makeArray(m.cells);
                    a.each(d,
                    function () {
                        var n = l[this];
                        n && m.appendChild(n)
                    })
                })
            }
            var h = this.get(0);
            f(h.p.colModel);
            f(h.p.colNames);
            f(h.grid.headers);
            g(a("thead:first", h.grid.hDiv), c && ":not(.ui-jqgrid-labels)");
            e && g(a("#" + a.jgrid.jqID(h.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
            h.p.footerrow && g(a("tbody:first", h.grid.sDiv));
            if (h.p.remapColumns) if (h.p.remapColumns.length) f(h.p.remapColumns);
            else h.p.remapColumns = a.makeArray(d);
            h.p.lastsort = a.inArray(h.p.lastsort, d);
            if (h.p.treeGrid) h.p.expColInd = a.inArray(h.p.expColInd, d)
        },
        setGridWidth: function (d, e) {
            return this.each(function () {
                if (this.grid) {
                    var c = this,
                    f, g = 0,
                    h = a.browser.webkit || a.browser.safari ? 0 : c.p.cellLayout,
                    j,
                    b = 0,
                    m = false,
                    l = c.p.scrollOffset,
                    n,
                    k = 0,
                    p = 0,
                    o;
                    if (typeof e != "boolean") e = c.p.shrinkToFit;
                    if (!isNaN(d)) {
                        d = parseInt(d, 10);
                        c.grid.width = c.p.width = d;
                        a("#gbox_" + a.jgrid.jqID(c.p.id)).css("width", d + "px");
                        a("#gview_" + a.jgrid.jqID(c.p.id)).css("width", d + "px");
                        a(c.grid.bDiv).css("width", d + "px");
                        a(c.grid.hDiv).css("width", d + "px");
                        c.p.pager && a(c.p.pager).css("width", d + "px");
                        c.p.toppager && a(c.p.toppager).css("width", d + "px");
                        if (c.p.toolbar[0] === true) {
                            a(c.grid.uDiv).css("width", d + "px");
                            c.p.toolbar[1] == "both" && a(c.grid.ubDiv).css("width", d + "px")
                        }
                        c.p.footerrow && a(c.grid.sDiv).css("width", d + "px");
                        if (e === false && c.p.forceFit === true) c.p.forceFit = false;
                        if (e === true) {
                            a.each(c.p.colModel,
                            function () {
                                if (this.hidden === false) {
                                    f = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
                                    g += f + h;
                                    if (this.fixed) k += f + h;
                                    else b++;
                                    p++
                                }
                            });
                            if (b === 0) return;
                            c.p.tblwidth = g;
                            n = d - h * b - k;
                            if (!isNaN(c.p.height)) if (a(c.grid.bDiv)[0].clientHeight < a(c.grid.bDiv)[0].scrollHeight || c.rows.length === 1) {
                                m = true;
                                n -= l
                            }
                            g = 0;
                            var v = c.grid.cols.length > 0;
                            a.each(c.p.colModel,
                            function (q) {
                                if (this.hidden === false && !this.fixed) {
                                    f = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
                                    f = Math.round(n * f / (c.p.tblwidth - h * b - k));
                                    if (!(f < 0)) {
                                        this.width = f;
                                        g += f;
                                        c.grid.headers[q].width = f;
                                        c.grid.headers[q].el.style.width = f + "px";
                                        if (c.p.footerrow) c.grid.footers[q].style.width = f + "px";
                                        if (v) c.grid.cols[q].style.width = f + "px";
                                        j = q
                                    }
                                }
                            });
                            o = 0;
                            if (m) {
                                if (d - k - (g + h * b) !== l) o = d - k - (g + h * b) - l
                            } else if (Math.abs(d - k - (g + h * b)) !== 1) o = d - k - (g + h * b);
                            c.p.colModel[j].width += o;
                            c.p.tblwidth = g + o + h * b + k;
                            if (c.p.tblwidth > d) {
                                m = c.p.tblwidth - parseInt(d, 10);
                                c.p.tblwidth = d;
                                f = c.p.colModel[j].width -= m
                            } else f = c.p.colModel[j].width;
                            c.grid.headers[j].width = f;
                            c.grid.headers[j].el.style.width = f + "px";
                            if (v) c.grid.cols[j].style.width = f + "px";
                            if (c.p.footerrow) c.grid.footers[j].style.width = f + "px"
                        }
                        if (c.p.tblwidth) {
                            a("table:first", c.grid.bDiv).css("width", c.p.tblwidth + "px");
                            a("table:first", c.grid.hDiv).css("width", c.p.tblwidth + "px");
                            c.grid.hDiv.scrollLeft = c.grid.bDiv.scrollLeft;
                            c.p.footerrow && a("table:first", c.grid.sDiv).css("width", c.p.tblwidth + "px")
                        }
                    }
                }
            })
        },
        setGridHeight: function (d) {
            return this.each(function () {
                if (this.grid) {
                    a(this.grid.bDiv).css({
                        height: d + (isNaN(d) ? "" : "px")
                    });
                    this.p.height = d;
                    this.p.scroll && this.grid.populateVisible()
                }
            })
        },
        setCaption: function (d) {
            return this.each(function () {
                this.p.caption = d;
                a("span.ui-jqgrid-title", this.grid.cDiv).html(d);
                a(this.grid.cDiv).show()
            })
        },
        setLabel: function (d, e, c, f) {
            return this.each(function () {
                var g = -1;
                if (this.grid) if (typeof d != "undefined") {
                    a(this.p.colModel).each(function (b) {
                        if (this.name == d) {
                            g = b;
                            return false
                        }
                    });
                    if (g >= 0) {
                        var h = a("tr.ui-jqgrid-labels th:eq(" + g + ")", this.grid.hDiv);
                        if (e) {
                            var j = a(".s-ico", h);
                            a("[id^=jqgh_]", h).empty().html(e).append(j);
                            this.p.colNames[g] = e
                        }
                        if (c) typeof c === "string" ? a(h).addClass(c) : a(h).css(c);
                        typeof f === "object" && a(h).attr(f)
                    }
                }
            })
        },
        setCell: function (d, e, c, f, g, h) {
            return this.each(function () {
                var j = -1,
                b, m;
                if (this.grid) {
                    if (isNaN(e)) a(this.p.colModel).each(function (n) {
                        if (this.name == e) {
                            j = n;
                            return false
                        }
                    });
                    else j = parseInt(e, 10);
                    if (j >= 0) if (b = this.rows.namedItem(d)) {
                        var l = a("td:eq(" + j + ")", b);
                        if (c !== "" || h === true) {
                            b = this.formatter(d, c, j, b, "edit");
                            m = this.p.colModel[j].title ? {
                                title: a.jgrid.stripHtml(b)
                            } : {};
                            this.p.treeGrid && a(".tree-wrap", a(l)).length > 0 ? a("span", a(l)).html(b).attr(m) : a(l).html(b).attr(m);
                            if (this.p.datatype == "local") {
                                b = this.p.colModel[j];
                                c = b.formatter && typeof b.formatter === "string" && b.formatter == "date" ? a.unformat.date(c, b) : c;
                                m = this.p._index[d];
                                if (typeof m != "undefined") this.p.data[m][b.name] = c
                            }
                        }
                        if (typeof f === "string") a(l).addClass(f);
                        else f && a(l).css(f);
                        typeof g === "object" && a(l).attr(g)
                    }
                }
            })
        },
        getCell: function (d, e) {
            var c = false;
            this.each(function () {
                var f = -1;
                if (this.grid) {
                    if (isNaN(e)) a(this.p.colModel).each(function (j) {
                        if (this.name === e) {
                            f = j;
                            return false
                        }
                    });
                    else f = parseInt(e, 10);
                    if (f >= 0) {
                        var g = this.rows.namedItem(d);
                        if (g) try {
                            c = a.unformat(a("td:eq(" + f + ")", g), {
                                rowId: g.id,
                                colModel: this.p.colModel[f]
                            },
                            f)
                        } catch (h) {
                            c = a.jgrid.htmlDecode(a("td:eq(" + f + ")", g).html())
                        }
                    }
                }
            });
            return c
        },
        getCol: function (d, e, c) {
            var f = [],
            g,
            h = 0,
            j = 0,
            b = 0,
            m;
            e = typeof e != "boolean" ? false : e;
            if (typeof c == "undefined") c = false;
            this.each(function () {
                var l = -1;
                if (this.grid) {
                    if (isNaN(d)) a(this.p.colModel).each(function (o) {
                        if (this.name === d) {
                            l = o;
                            return false
                        }
                    });
                    else l = parseInt(d, 10);
                    if (l >= 0) {
                        var n = this.rows.length,
                        k = 0;
                        if (n && n > 0) {
                            for (; k < n; ) {
                                if (a(this.rows[k]).hasClass("jqgrow")) {
                                    try {
                                        g = a.unformat(a(this.rows[k].cells[l]), {
                                            rowId: this.rows[k].id,
                                            colModel: this.p.colModel[l]
                                        },
                                        l)
                                    } catch (p) {
                                        g = a.jgrid.htmlDecode(this.rows[k].cells[l].innerHTML)
                                    }
                                    if (c) {
                                        m = parseFloat(g);
                                        h += m;
                                        j = Math.min(j, m);
                                        b = Math.max(j, m)
                                    } else e ? f.push({
                                        id: this.rows[k].id,
                                        value: g
                                    }) : f.push(g)
                                }
                                k++
                            }
                            if (c) switch (c.toLowerCase()) {
                                case "sum":
                                    f = h;
                                    break;
                                case "avg":
                                    f = h / n;
                                    break;
                                case "count":
                                    f = n;
                                    break;
                                case "min":
                                    f = j;
                                    break;
                                case "max":
                                    f = b
                            }
                        }
                    }
                }
            });
            return f
        },
        clearGridData: function (d) {
            return this.each(function () {
                if (this.grid) {
                    if (typeof d != "boolean") d = false;
                    if (this.p.deepempty) a("#" + a.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove();
                    else {
                        var e = a("#" + a.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0];
                        a("#" + a.jgrid.jqID(this.p.id) + " tbody:first").empty().append(e)
                    }
                    this.p.footerrow && d && a(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;");
                    this.p.selrow = null;
                    this.p.selarrrow = [];
                    this.p.savedRow = [];
                    this.p.records = 0;
                    this.p.page = 1;
                    this.p.lastpage = 0;
                    this.p.reccount = 0;
                    this.p.data = [];
                    this.p_index = {};
                    this.updatepager(true, false)
                }
            })
        },
        getInd: function (d, e) {
            var c = false,
            f;
            this.each(function () {
                if (f = this.rows.namedItem(d)) c = e === true ? f : f.rowIndex
            });
            return c
        },
        bindKeys: function (d) {
            var e = a.extend({
                onEnter: null,
                onSpace: null,
                onLeftKey: null,
                onRightKey: null,
                scrollingRows: true
            },
            d || {});
            return this.each(function () {
                var c = this;
                a("body").is("[role]") || a("body").attr("role", "application");
                c.p.scrollrows = e.scrollingRows;
                a(c).keydown(function (f) {
                    var g = a(c).find("tr[tabindex=0]")[0],
                    h,
                    j,
                    b,
                    m = c.p.treeReader.expanded_field;
                    if (g) {
                        b = c.p._index[g.id];
                        if (f.keyCode === 37 || f.keyCode === 38 || f.keyCode === 39 || f.keyCode === 40) {
                            if (f.keyCode === 38) {
                                j = g.previousSibling;
                                h = "";
                                if (j) if (a(j).is(":hidden")) for (; j; ) {
                                    j = j.previousSibling;
                                    if (!a(j).is(":hidden") && a(j).hasClass("jqgrow")) {
                                        h = j.id;
                                        break
                                    }
                                } else h = j.id;
                                a(c).jqGrid("setSelection", h)
                            }
                            if (f.keyCode === 40) {
                                j = g.nextSibling;
                                h = "";
                                if (j) if (a(j).is(":hidden")) for (; j; ) {
                                    j = j.nextSibling;
                                    if (!a(j).is(":hidden") && a(j).hasClass("jqgrow")) {
                                        h = j.id;
                                        break
                                    }
                                } else h = j.id;
                                a(c).jqGrid("setSelection", h)
                            }
                            if (f.keyCode === 37) {
                                c.p.treeGrid && c.p.data[b][m] && a(g).find("div.treeclick").trigger("click");
                                a.isFunction(e.onLeftKey) && e.onLeftKey.call(c, c.p.selrow)
                            }
                            if (f.keyCode === 39) {
                                c.p.treeGrid && !c.p.data[b][m] && a(g).find("div.treeclick").trigger("click");
                                a.isFunction(e.onRightKey) && e.onRightKey.call(c, c.p.selrow)
                            }
                            return false
                        } else if (f.keyCode === 13) {
                            a.isFunction(e.onEnter) && e.onEnter.call(c, c.p.selrow);
                            return false
                        } else if (f.keyCode === 32) {
                            a.isFunction(e.onSpace) && e.onSpace.call(c, c.p.selrow);
                            return false
                        }
                    }
                })
            })
        },
        unbindKeys: function () {
            return this.each(function () {
                a(this).unbind("keydown")
            })
        },
        getLocalRow: function (d) {
            var e = false,
            c;
            this.each(function () {
                if (typeof d !== "undefined") {
                    c = this.p._index[d];
                    if (c >= 0) e = this.p.data[c]
                }
            });
            return e
        }
    })
})(jQuery);             (function(a) {
    a.jgrid.extend({
        getColProp: function(d) {
            var e = {},
            c = this[0];
            if (!c.grid) return false;
            c = c.p.colModel;
            for (var f = 0; f < c.length; f++) if (c[f].name == d) {
                e = c[f];
                break
            }
            return e
        },
        setColProp: function(d, e) {
            return this.each(function() {
                if (this.grid) if (e) for (var c = this.p.colModel,
                f = 0; f < c.length; f++) if (c[f].name == d) {
                    a.extend(this.p.colModel[f], e);
                    break
                }
            })
        },
        sortGrid: function(d, e, c) {
            return this.each(function() {
                var f = -1;
                if (this.grid) {
                    if (!d) d = this.p.sortname;
                    for (var g = 0; g < this.p.colModel.length; g++) if (this.p.colModel[g].index == d || this.p.colModel[g].name == d) {
                        f = g;
                        break
                    }
                    if (f != -1) {
                        g = this.p.colModel[f].sortable;
                        if (typeof g !== "boolean") g = true;
                        if (typeof e !== "boolean") e = false;
                        g && this.sortData("jqgh_" + this.p.id + "_" + d, f, e, c)
                    }
                }
            })
        },
        GridDestroy: function() {
            return this.each(function() {
                if (this.grid) {
                    this.p.pager && a(this.p.pager).remove();
                    var d = this.id;
                    try {
                        a("#gbox_" + d).remove()
                    } catch(e) {}
                }
            })
        },
        GridUnload: function() {
            return this.each(function() {
                if (this.grid) {
                    var d = {
                        id: a(this).attr("id"),
                        cl: a(this).attr("class")
                    };
                    this.p.pager && a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
                    var e = document.createElement("table");
                    a(e).attr({
                        id: d.id
                    });
                    e.className = d.cl;
                    d = this.id;
                    a(e).removeClass("ui-jqgrid-btable");
                    if (a(this.p.pager).parents("#gbox_" + d).length === 1) {
                        a(e).insertBefore("#gbox_" + d).show();
                        a(this.p.pager).insertBefore("#gbox_" + d)
                    } else a(e).insertBefore("#gbox_" + d).show();
                    a("#gbox_" + d).remove()
                }
            })
        },
        setGridState: function(d) {
            return this.each(function() {
                if (this.grid) if (d == "hidden") {
                    a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + this.p.id).slideUp("fast");
                    this.p.pager && a(this.p.pager).slideUp("fast");
                    this.p.toppager && a(this.p.toppager).slideUp("fast");
                    if (this.p.toolbar[0] === true) {
                        this.p.toolbar[1] == "both" && a(this.grid.ubDiv).slideUp("fast");
                        a(this.grid.uDiv).slideUp("fast")
                    }
                    this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + this.p.id).slideUp("fast");
                    a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                    this.p.gridstate = "hidden"
                } else if (d == "visible") {
                    a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + this.p.id).slideDown("fast");
                    this.p.pager && a(this.p.pager).slideDown("fast");
                    this.p.toppager && a(this.p.toppager).slideDown("fast");
                    if (this.p.toolbar[0] === true) {
                        this.p.toolbar[1] == "both" && a(this.grid.ubDiv).slideDown("fast");
                        a(this.grid.uDiv).slideDown("fast")
                    }
                    this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + this.p.id).slideDown("fast");
                    a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                    this.p.gridstate = "visible"
                }
            })
        },
        filterToolbar: function(d) {
            d = a.extend({
                autosearch: true,
                searchOnEnter: true,
                beforeSearch: null,
                afterSearch: null,
                beforeClear: null,
                afterClear: null,
                searchurl: "",
                stringResult: false,
                groupOp: "AND",
                defaultSearch: "bw"
            },
            d || {});
            return this.each(function() {
                function e(j, b) {
                    var m = a(j);
                    m[0] && jQuery.each(b,
                    function() {
                        this.data !== undefined ? m.bind(this.type, this.data, this.fn) : m.bind(this.type, this.fn)
                    })
                }
                var c = this;
                if (!this.ftoolbar) {
                    var f = function() {
                        var j = {},
                        b = 0,
                        m, l, n = {},
                        k;
                        a.each(c.p.colModel,
                        function() {
                            l = this.index || this.name;
                            switch (this.stype) {
                            case "select":
                                k = this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : "eq";
                                if (m = a("#gs_" + a.jgrid.jqID(this.name), c.grid.hDiv).val()) {
                                    j[l] = m;
                                    n[l] = k;
                                    b++
                                } else try {
                                    delete c.p.postData[l]
                                } catch(s) {}
                                break;
                            case "text":
                                k = this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : d.defaultSearch;
                                if (m = a("#gs_" + a.jgrid.jqID(this.name), c.grid.hDiv).val()) {
                                    j[l] = m;
                                    n[l] = k;
                                    b++
                                } else try {
                                    delete c.p.postData[l]
                                } catch(x) {}
                            }
                        });
                        var p = b > 0 ? true: false;
                        if (d.stringResult === true || c.p.datatype == "local") {
                            var o = '{"groupOp":"' + d.groupOp + '","rules":[',
                            v = 0;
                            a.each(j,
                            function(s, x) {
                                if (v > 0) o += ",";
                                o += '{"field":"' + s + '",';
                                o += '"op":"' + n[s] + '",';
                                x += "";
                                o += '"data":"' + x.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                v++
                            });
                            o += "]}";
                            a.extend(c.p.postData, {
                                filters: o
                            });
                            a.each(["searchField", "searchString", "searchOper"],
                            function(s, x) {
                                c.p.postData.hasOwnProperty(x) && delete c.p.postData[x]
                            })
                        } else a.extend(c.p.postData, j);
                        var q;
                        if (c.p.searchurl) {
                            q = c.p.url;
                            a(c).jqGrid("setGridParam", {
                                url: c.p.searchurl
                            })
                        }
                        var r = false;
                        if (a.isFunction(d.beforeSearch)) r = d.beforeSearch.call(c);
                        r || a(c).jqGrid("setGridParam", {
                            search: p
                        }).trigger("reloadGrid", [{
                            page: 1
                        }]);
                        q && a(c).jqGrid("setGridParam", {
                            url: q
                        });
                        a.isFunction(d.afterSearch) && d.afterSearch()
                    },
                    g = a("<tr class='ui-search-toolbar' role='rowheader'></tr>"),
                    h;
                    a.each(c.p.colModel,
                    function() {
                        var j = this,
                        b, m, l, n;
                        m = a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" + c.p.direction + "'></th>");
                        b = a("<div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div>");
                        this.hidden === true && a(m).css("display", "none");
                        this.search = this.search === false ? false: true;
                        if (typeof this.stype == "undefined") this.stype = "text";
                        l = a.extend({},
                        this.searchoptions || {});
                        if (this.search) switch (this.stype) {
                        case "select":
                            if (n = this.surl || l.dataUrl) a.ajax(a.extend({
                                url: n,
                                dataType: "html",
                                complete: function(q) {
                                    if (l.buildSelect !== undefined)(q = l.buildSelect(q)) && a(b).append(q);
                                    else a(b).append(q.responseText);
                                    l.defaultValue && a("select", b).val(l.defaultValue);
                                    a("select", b).attr({
                                        name: j.index || j.name,
                                        id: "gs_" + j.name
                                    });
                                    l.attr && a("select", b).attr(l.attr);
                                    a("select", b).css({
                                        width: "100%"
                                    });
                                    l.dataInit !== undefined && l.dataInit(a("select", b)[0]);
                                    l.dataEvents !== undefined && e(a("select", b)[0], l.dataEvents);
                                    d.autosearch === true && a("select", b).change(function() {
                                        f();
                                        return false
                                    });
                                    q = null
                                }
                            },
                            a.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                            else {
                                var k;
                                if (j.searchoptions && j.searchoptions.value) k = j.searchoptions.value;
                                else if (j.editoptions && j.editoptions.value) k = j.editoptions.value;
                                if (k) {
                                    n = document.createElement("select");
                                    n.style.width = "100%";
                                    a(n).attr({
                                        name: j.index || j.name,
                                        id: "gs_" + j.name
                                    });
                                    var p, o;
                                    if (typeof k === "string") {
                                        k = k.split(";");
                                        for (var v = 0; v < k.length; v++) {
                                            p = k[v].split(":");
                                            o = document.createElement("option");
                                            o.value = p[0];
                                            o.innerHTML = p[1];
                                            n.appendChild(o)
                                        }
                                    } else if (typeof k === "object") for (p in k) if (k.hasOwnProperty(p)) {
                                        o = document.createElement("option");
                                        o.value = p;
                                        o.innerHTML = k[p];
                                        n.appendChild(o)
                                    }
                                    l.defaultValue && a(n).val(l.defaultValue);
                                    l.attr && a(n).attr(l.attr);
                                    l.dataInit !== undefined && l.dataInit(n);
                                    l.dataEvents !== undefined && e(n, l.dataEvents);
                                    a(b).append(n);
                                    d.autosearch === true && a(n).change(function() {
                                        f();
                                        return false
                                    })
                                }
                            }
                            break;
                        case "text":
                            n = l.defaultValue ? l.defaultValue: "";
                            a(b).append("<input type='text' style='width:95%;padding:0px;' name='" + (j.index || j.name) + "' id='gs_" + j.name + "' value='" + n + "'/>");
                            l.attr && a("input", b).attr(l.attr);
                            l.dataInit !== undefined && l.dataInit(a("input", b)[0]);
                            l.dataEvents !== undefined && e(a("input", b)[0], l.dataEvents);
                            if (d.autosearch === true) d.searchOnEnter ? a("input", b).keypress(function(q) {
                                if ((q.charCode ? q.charCode: q.keyCode ? q.keyCode: 0) == 13) {
                                    f();
                                    return false
                                }
                                return this
                            }) : a("input", b).keydown(function(q) {
                                switch (q.which) {
                                case 13:
                                    return false;
                                case 9:
                                case 16:
                                case 37:
                                case 38:
                                case 39:
                                case 40:
                                case 27:
                                    break;
                                default:
                                    h && clearTimeout(h);
                                    h = setTimeout(function() {
                                        f()
                                    },
                                    500)
                                }
                            })
                        }
                        a(m).append(b);
                        a(g).append(m)
                    });
                    a("table thead", c.grid.hDiv).append(g);
                    this.ftoolbar = true;
                    this.triggerToolbar = f;
                    this.clearToolbar = function(j) {
                        var b = {},
                        m, l = 0,
                        n;
                        j = typeof j != "boolean" ? true: j;
                        a.each(c.p.colModel,
                        function() {
                            m = this.searchoptions && this.searchoptions.defaultValue ? this.searchoptions.defaultValue: "";
                            n = this.index || this.name;
                            switch (this.stype) {
                            case "select":
                                var r;
                                a("#gs_" + a.jgrid.jqID(n) + " option", c.grid.hDiv).each(function(A) {
                                    if (A === 0) this.selected = true;
                                    if (a(this).text() == m) {
                                        this.selected = true;
                                        r = a(this).val();
                                        return false
                                    }
                                });
                                if (r) {
                                    b[n] = r;
                                    l++
                                } else try {
                                    delete c.p.postData[n]
                                } catch(s) {}
                                break;
                            case "text":
                                a("#gs_" + a.jgrid.jqID(n), c.grid.hDiv).val(m);
                                if (m) {
                                    b[n] = m;
                                    l++
                                } else try {
                                    delete c.p.postData[n]
                                } catch(x) {}
                            }
                        });
                        var k = l > 0 ? true: false;
                        if (d.stringResult === true || c.p.datatype == "local") {
                            var p = '{"groupOp":"' + d.groupOp + '","rules":[',
                            o = 0;
                            a.each(b,
                            function(r, s) {
                                if (o > 0) p += ",";
                                p += '{"field":"' + r + '",';
                                p += '"op":"eq",';
                                s += "";
                                p += '"data":"' + s.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                o++
                            });
                            p += "]}";
                            a.extend(c.p.postData, {
                                filters: p
                            });
                            a.each(["searchField", "searchString", "searchOper"],
                            function(r, s) {
                                c.p.postData.hasOwnProperty(s) && delete c.p.postData[s]
                            })
                        } else a.extend(c.p.postData, b);
                        var v;
                        if (c.p.searchurl) {
                            v = c.p.url;
                            a(c).jqGrid("setGridParam", {
                                url: c.p.searchurl
                            })
                        }
                        var q = false;
                        if (a.isFunction(d.beforeClear)) q = d.beforeClear.call(c);
                        q || j && a(c).jqGrid("setGridParam", {
                            search: k
                        }).trigger("reloadGrid", [{
                            page: 1
                        }]);
                        v && a(c).jqGrid("setGridParam", {
                            url: v
                        });
                        a.isFunction(d.afterClear) && d.afterClear()
                    };
                    this.toggleToolbar = function() {
                        var j = a("tr.ui-search-toolbar", c.grid.hDiv);
                        j.css("display") == "none" ? j.show() : j.hide()
                    }
                }
            })
        }
    })
})(jQuery); (function(a) {
    a.fn.jqm = function(n) {
        var k = {
            overlay: 50,
            closeoverlay: true,
            overlayClass: "jqmOverlay",
            closeClass: "jqmClose",
            trigger: ".jqModal",
            ajax: g,
            ajaxText: "",
            target: g,
            modal: g,
            toTop: g,
            onShow: g,
            onHide: g,
            onLoad: g
        };
        return this.each(function() {
            if (this._jqm) return e[this._jqm].c = a.extend({},
            e[this._jqm].c, n);
            d++;
            this._jqm = d;
            e[d] = {
                c: a.extend(k, a.jqm.params, n),
                a: g,
                w: a(this).addClass("jqmID" + d),
                s: d
            };
            k.trigger && a(this).jqmAddTrigger(k.trigger)
        })
    };
    a.fn.jqmAddClose = function(n) {
        return l(this, n, "jqmHide")
    };
    a.fn.jqmAddTrigger = function(n) {
        return l(this, n, "jqmShow")
    };
    a.fn.jqmShow = function(n) {
        return this.each(function() {
            a.jqm.open(this._jqm, n)
        })
    };
    a.fn.jqmHide = function(n) {
        return this.each(function() {
            a.jqm.close(this._jqm, n)
        })
    };
    a.jqm = {
        hash: {},
        open: function(n, k) {
            var p = e[n],
            o = p.c,
            v = "." + o.closeClass,
            q = parseInt(p.w.css("z-index"));
            q = q > 0 ? q: 3E3;
            var r = a("<div></div>").css({
                height: "100%",
                width: "100%",
                position: "fixed",
                left: 0,
                top: 0,
                "z-index": q - 1,
                opacity: o.overlay / 100
            });
            if (p.a) return g;
            p.t = k;
            p.a = true;
            p.w.css("z-index", q);
            if (o.modal) {
                c[0] || setTimeout(function() {
                    b("bind")
                },
                1);
                c.push(n)
            } else if (o.overlay > 0) o.closeoverlay && p.w.jqmAddClose(r);
            else r = g;
            p.o = r ? r.addClass(o.overlayClass).prependTo("body") : g;
            if (f) {
                a("html,body").css({
                    height: "100%",
                    width: "100%"
                });
                if (r) {
                    r = r.css({
                        position: "absolute"
                    })[0];
                    for (var s in {
                        Top: 1,
                        Left: 1
                    }) r.style.setExpression(s.toLowerCase(), "(_=(document.documentElement.scroll" + s + " || document.body.scroll" + s + "))+'px'")
                }
            }
            if (o.ajax) {
                q = o.target || p.w;
                r = o.ajax;
                q = typeof q == "string" ? a(q, p.w) : a(q);
                r = r.substr(0, 1) == "@" ? a(k).attr(r.substring(1)) : r;
                q.html(o.ajaxText).load(r,
                function() {
                    o.onLoad && o.onLoad.call(this, p);
                    v && p.w.jqmAddClose(a(v, p.w));
                    h(p)
                })
            } else v && p.w.jqmAddClose(a(v, p.w));
            o.toTop && p.o && p.w.before('<span id="jqmP' + p.w[0]._jqm + '"></span>').insertAfter(p.o);
            o.onShow ? o.onShow(p) : p.w.show();
            h(p);
            return g
        },
        close: function(n) {
            n = e[n];
            if (!n.a) return g;
            n.a = g;
            if (c[0]) {
                c.pop();
                c[0] || b("unbind")
            }
            n.c.toTop && n.o && a("#jqmP" + n.w[0]._jqm).after(n.w).remove();
            if (n.c.onHide) n.c.onHide(n);
            else {
                n.w.hide();
                n.o && n.o.remove()
            }
            return g
        },
        params: {}
    };
    var d = 0,
    e = a.jqm.hash,
    c = [],
    f = a.browser.msie && a.browser.version == "6.0",
    g = false,
    h = function(n) {
        var k = a('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({
            opacity: 0
        });
        if (f) if (n.o) n.o.html('<p style="width:100%;height:100%"/>').prepend(k);
        else a("iframe.jqm", n.w)[0] || n.w.prepend(k);
        j(n)
    },
    j = function(n) {
        try {
            a(":input:visible", n.w)[0].focus()
        } catch(k) {}
    },
    b = function(n) {
        a(document)[n]("keypress", m)[n]("keydown", m)[n]("mousedown", m)
    },
    m = function(n) {
        var k = e[c[c.length - 1]]; (n = !a(n.target).parents(".jqmID" + k.s)[0]) && j(k);
        return ! n
    },
    l = function(n, k, p) {
        return n.each(function() {
            var o = this._jqm;
            a(k).each(function() {
                if (!this[p]) {
                    this[p] = [];
                    a(this).click(function() {
                        for (var v in {
                            jqmShow: 1,
                            jqmHide: 1
                        }) for (var q in this[v]) if (e[this[v][q]]) e[this[v][q]].w[v](this);
                        return g
                    })
                }
                this[p].push(o)
            })
        })
    }
})(jQuery); (function(a) {
    a.fn.jqDrag = function(j) {
        return g(this, j, "d")
    };
    a.fn.jqResize = function(j, b) {
        return g(this, j, "r", b)
    };
    a.jqDnR = {
        dnr: {},
        e: 0,
        drag: function(j) {
            if (e.k == "d") c.css({
                left: e.X + j.pageX - e.pX,
                top: e.Y + j.pageY - e.pY
            });
            else {
                c.css({
                    width: Math.max(j.pageX - e.pX + e.W, 0),
                    height: Math.max(j.pageY - e.pY + e.H, 0)
                });
                M1 && f.css({
                    width: Math.max(j.pageX - M1.pX + M1.W, 0),
                    height: Math.max(j.pageY - M1.pY + M1.H, 0)
                })
            }
            return false
        },
        stop: function() {
            a(document).unbind("mousemove", d.drag).unbind("mouseup", d.stop)
        }
    };
    var d = a.jqDnR,
    e = d.dnr,
    c = d.e,
    f, g = function(j, b, m, l) {
        return j.each(function() {
            b = b ? a(b, j) : j;
            b.bind("mousedown", {
                e: j,
                k: m
            },
            function(n) {
                var k = n.data,
                p = {};
                c = k.e;
                f = l ? a(l) : false;
                if (c.css("position") != "relative") try {
                    c.position(p)
                } catch(o) {}
                e = {
                    X: p.left || h("left") || 0,
                    Y: p.top || h("top") || 0,
                    W: h("width") || c[0].scrollWidth || 0,
                    H: h("height") || c[0].scrollHeight || 0,
                    pX: n.pageX,
                    pY: n.pageY,
                    k: k.k
                };
                M1 = f && k.k != "d" ? {
                    X: p.left || f1("left") || 0,
                    Y: p.top || f1("top") || 0,
                    W: f[0].offsetWidth || f1("width") || 0,
                    H: f[0].offsetHeight || f1("height") || 0,
                    pX: n.pageX,
                    pY: n.pageY,
                    k: k.k
                }: false;
                if (a("input.hasDatepicker", c[0])[0]) try {
                    a("input.hasDatepicker", c[0]).datepicker("hide")
                } catch(v) {}
                a(document).mousemove(a.jqDnR.drag).mouseup(a.jqDnR.stop);
                return false
            })
        })
    },
    h = function(j) {
        return parseInt(c.css(j)) || false
    };
    f1 = function(j) {
        return parseInt(f.css(j)) || false
    }
})(jQuery);
var xmlJsonClass = {
    xml2json: function(a, d) {
        if (a.nodeType === 9) a = a.documentElement;
        var e = this.toJson(this.toObj(this.removeWhite(a)), a.nodeName, "\t");
        return "{\n" + d + (d ? e.replace(/\t/g, d) : e.replace(/\t|\n/g, "")) + "\n}"
    },
    json2xml: function(a, d) {
        var e = function(g, h, j) {
            var b = "",
            m, l;
            if (g instanceof Array) if (g.length === 0) b += j + "<" + h + ">__EMPTY_ARRAY_</" + h + ">\n";
            else {
                m = 0;
                for (l = g.length; m < l; m += 1) {
                    var n = j + e(g[m], h, j + "\t") + "\n";
                    b += n
                }
            } else if (typeof g === "object") {
                m = false;
                b += j + "<" + h;
                for (l in g) if (g.hasOwnProperty(l)) if (l.charAt(0) === "@") b += " " + l.substr(1) + '="' + g[l].toString() + '"';
                else m = true;
                b += m ? ">": "/>";
                if (m) {
                    for (l in g) if (g.hasOwnProperty(l)) if (l === "#text") b += g[l];
                    else if (l === "#cdata") b += "<![CDATA[" + g[l] + "]]\>";
                    else if (l.charAt(0) !== "@") b += e(g[l], l, j + "\t");
                    b += (b.charAt(b.length - 1) === "\n" ? j: "") + "</" + h + ">"
                }
            } else b += typeof g === "function" ? j + "<" + h + "><![CDATA[" + g + "]]\></" + h + ">": g.toString() === '""' || g.toString().length === 0 ? j + "<" + h + ">__EMPTY_STRING_</" + h + ">": j + "<" + h + ">" + g.toString() + "</" + h + ">";
            return b
        },
        c = "",
        f;
        for (f in a) if (a.hasOwnProperty(f)) c += e(a[f], f, "");
        return d ? c.replace(/\t/g, d) : c.replace(/\t|\n/g, "")
    },
    toObj: function(a) {
        var d = {},
        e = /function/i;
        if (a.nodeType === 1) {
            if (a.attributes.length) {
                var c;
                for (c = 0; c < a.attributes.length; c += 1) d["@" + a.attributes[c].nodeName] = (a.attributes[c].nodeValue || "").toString()
            }
            if (a.firstChild) {
                var f = c = 0,
                g = false,
                h;
                for (h = a.firstChild; h; h = h.nextSibling) if (h.nodeType === 1) g = true;
                else if (h.nodeType === 3 && h.nodeValue.match(/[^ \f\n\r\t\v]/)) c += 1;
                else if (h.nodeType === 4) f += 1;
                if (g) if (c < 2 && f < 2) {
                    this.removeWhite(a);
                    for (h = a.firstChild; h; h = h.nextSibling) if (h.nodeType === 3) d["#text"] = this.escape(h.nodeValue);
                    else if (h.nodeType === 4) if (e.test(h.nodeValue)) d[h.nodeName] = [d[h.nodeName], h.nodeValue];
                    else d["#cdata"] = this.escape(h.nodeValue);
                    else if (d[h.nodeName]) if (d[h.nodeName] instanceof Array) d[h.nodeName][d[h.nodeName].length] = this.toObj(h);
                    else d[h.nodeName] = [d[h.nodeName], this.toObj(h)];
                    else d[h.nodeName] = this.toObj(h)
                } else if (a.attributes.length) d["#text"] = this.escape(this.innerXml(a));
                else d = this.escape(this.innerXml(a));
                else if (c) if (a.attributes.length) d["#text"] = this.escape(this.innerXml(a));
                else {
                    d = this.escape(this.innerXml(a));
                    if (d === "__EMPTY_ARRAY_") d = "[]";
                    else if (d === "__EMPTY_STRING_") d = ""
                } else if (f) if (f > 1) d = this.escape(this.innerXml(a));
                else for (h = a.firstChild; h; h = h.nextSibling) if (e.test(a.firstChild.nodeValue)) {
                    d = a.firstChild.nodeValue;
                    break
                } else d["#cdata"] = this.escape(h.nodeValue)
            }
            if (!a.attributes.length && !a.firstChild) d = null
        } else if (a.nodeType === 9) d = this.toObj(a.documentElement);
        else alert("unhandled node type: " + a.nodeType);
        return d
    },
    toJson: function(a, d, e, c) {
        if (c === undefined) c = true;
        var f = d ? '"' + d + '"': "",
        g = "\t",
        h = "\n";
        if (!c) h = g = "";
        if (a === "[]") f += d ? ":[]": "[]";
        else if (a instanceof Array) {
            var j, b, m = [];
            b = 0;
            for (j = a.length; b < j; b += 1) m[b] = this.toJson(a[b], "", e + g, c);
            f += (d ? ":[": "[") + (m.length > 1 ? h + e + g + m.join("," + h + e + g) + h + e: m.join("")) + "]"
        } else if (a === null) f += (d && ":") + "null";
        else if (typeof a === "object") {
            j = [];
            for (b in a) if (a.hasOwnProperty(b)) j[j.length] = this.toJson(a[b], b, e + g, c);
            f += (d ? ":{": "{") + (j.length > 1 ? h + e + g + j.join("," + h + e + g) + h + e: j.join("")) + "}"
        } else f += typeof a === "string" ? (d && ":") + '"' + a.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"': (d && ":") + '"' + a.toString() + '"';
        return f
    },
    innerXml: function(a) {
        var d = "";
        if ("innerHTML" in a) d = a.innerHTML;
        else {
            var e = function(c) {
                var f = "",
                g;
                if (c.nodeType === 1) {
                    f += "<" + c.nodeName;
                    for (g = 0; g < c.attributes.length; g += 1) f += " " + c.attributes[g].nodeName + '="' + (c.attributes[g].nodeValue || "").toString() + '"';
                    if (c.firstChild) {
                        f += ">";
                        for (g = c.firstChild; g; g = g.nextSibling) f += e(g);
                        f += "</" + c.nodeName + ">"
                    } else f += "/>"
                } else if (c.nodeType === 3) f += c.nodeValue;
                else if (c.nodeType === 4) f += "<![CDATA[" + c.nodeValue + "]]\>";
                return f
            };
            for (a = a.firstChild; a; a = a.nextSibling) d += e(a)
        }
        return d
    },
    escape: function(a) {
        return a.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
    },
    removeWhite: function(a) {
        a.normalize();
        var d;
        for (d = a.firstChild; d;) if (d.nodeType === 3) if (d.nodeValue.match(/[^ \f\n\r\t\v]/)) d = d.nextSibling;
        else {
            var e = d.nextSibling;
            a.removeChild(d);
            d = e
        } else {
            d.nodeType === 1 && this.removeWhite(d);
            d = d.nextSibling
        }
        return a
    }
}; (function(a) {
    a.fmatter = {};
    a.extend(a.fmatter, {
        isBoolean: function(d) {
            return typeof d === "boolean"
        },
        isObject: function(d) {
            return d && (typeof d === "object" || a.isFunction(d)) || false
        },
        isString: function(d) {
            return typeof d === "string"
        },
        isNumber: function(d) {
            return typeof d === "number" && isFinite(d)
        },
        isNull: function(d) {
            return d === null
        },
        isUndefined: function(d) {
            return typeof d === "undefined"
        },
        isValue: function(d) {
            return this.isObject(d) || this.isString(d) || this.isNumber(d) || this.isBoolean(d)
        },
        isEmpty: function(d) {
            if (!this.isString(d) && this.isValue(d)) return false;
            else if (!this.isValue(d)) return true;
            d = a.trim(d).replace(/\&nbsp\;/ig, "").replace(/\&#160\;/ig, "");
            return d === ""
        }
    });
    a.fn.fmatter = function(d, e, c, f, g) {
        var h = e;
        c = a.extend({},
        a.jgrid.formatter, c);
        if (a.fn.fmatter[d]) h = a.fn.fmatter[d](e, c, f, g);
        return h
    };
    a.fmatter.util = {
        NumberFormat: function(d, e) {
            a.fmatter.isNumber(d) || (d *= 1);
            if (a.fmatter.isNumber(d)) {
                var c = d < 0,
                f = d + "",
                g = e.decimalSeparator ? e.decimalSeparator: ".",
                h;
                if (a.fmatter.isNumber(e.decimalPlaces)) {
                    var j = e.decimalPlaces;
                    f = Math.pow(10, j);
                    f = Math.round(d * f) / f + "";
                    h = f.lastIndexOf(".");
                    if (j > 0) {
                        if (h < 0) {
                            f += g;
                            h = f.length - 1
                        } else if (g !== ".") f = f.replace(".", g);
                        for (; f.length - 1 - h < j;) f += "0"
                    }
                }
                if (e.thousandsSeparator) {
                    j = e.thousandsSeparator;
                    h = f.lastIndexOf(g);
                    h = h > -1 ? h: f.length;
                    g = f.substring(h);
                    for (var b = -1,
                    m = h; m > 0; m--) {
                        b++;
                        if (b % 3 === 0 && m !== h && (!c || m > 1)) g = j + g;
                        g = f.charAt(m - 1) + g
                    }
                    f = g
                }
                f = e.prefix ? e.prefix + f: f;
                return f = e.suffix ? f + e.suffix: f
            } else return d
        },
        DateFormat: function(d, e, c, f) {
            var g = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,
            h = typeof e === "string" ? e.match(g) : null;
            g = function(s, x) {
                s = String(s);
                for (x = parseInt(x, 10) || 2; s.length < x;) s = "0" + s;
                return s
            };
            var j = {
                m: 1,
                d: 1,
                y: 1970,
                h: 0,
                i: 0,
                s: 0,
                u: 0
            },
            b = 0,
            m,
            l = ["i18n"];
            l.i18n = {
                dayNames: f.dayNames,
                monthNames: f.monthNames
            };
            if (d in f.masks) d = f.masks[d];
            if (e.constructor === Number) {
                if (String(d).toLowerCase() == "u") e *= 1E3;
                b = new Date(e)
            } else if (e.constructor === Date) b = e;
            else if (h !== null) {
                b = new Date(parseInt(h[1], 10));
                if (h[3]) {
                    d = Number(h[5]) * 60 + Number(h[6]);
                    d *= h[4] == "-" ? 1 : -1;
                    d -= b.getTimezoneOffset();
                    b.setTime(Number(Number(b) + d * 6E4))
                }
            } else {
                e = String(e).split(/[\\\/:_;.,\t\T\s-]/);
                d = d.split(/[\\\/:_;.,\t\T\s-]/);
                h = 0;
                for (m = d.length; h < m; h++) {
                    if (d[h] == "M") {
                        b = a.inArray(e[h], l.i18n.monthNames);
                        if (b !== -1 && b < 12) e[h] = b + 1
                    }
                    if (d[h] == "F") {
                        b = a.inArray(e[h], l.i18n.monthNames);
                        if (b !== -1 && b > 11) e[h] = b + 1 - 12
                    }
                    if (e[h]) j[d[h].toLowerCase()] = parseInt(e[h], 10)
                }
                if (j.f) j.m = j.f;
                if (j.m === 0 && j.y === 0 && j.d === 0) return "&#160;";
                j.m = parseInt(j.m, 10) - 1;
                b = j.y;
                if (b >= 70 && b <= 99) j.y = 1900 + j.y;
                else if (b >= 0 && b <= 69) j.y = 2E3 + j.y;
                b = new Date(j.y, j.m, j.d, j.h, j.i, j.s, j.u)
            }
            if (c in f.masks) c = f.masks[c];
            else c || (c = "Y-m-d");
            d = b.getHours();
            e = b.getMinutes();
            j = b.getDate();
            h = b.getMonth() + 1;
            m = b.getTimezoneOffset();
            var n = b.getSeconds(),
            k = b.getMilliseconds(),
            p = b.getDay(),
            o = b.getFullYear(),
            v = (p + 6) % 7 + 1,
            q = (new Date(o, h - 1, j) - new Date(o, 0, 1)) / 864E5,
            r = {
                d: g(j),
                D: l.i18n.dayNames[p],
                j: j,
                l: l.i18n.dayNames[p + 7],
                N: v,
                S: f.S(j),
                w: p,
                z: q,
                W: v < 5 ? Math.floor((q + v - 1) / 7) + 1 : Math.floor((q + v - 1) / 7) || (((new Date(o - 1, 0, 1)).getDay() + 6) % 7 < 4 ? 53 : 52),
                F: l.i18n.monthNames[h - 1 + 12],
                m: g(h),
                M: l.i18n.monthNames[h - 1],
                n: h,
                t: "?",
                L: "?",
                o: "?",
                Y: o,
                y: String(o).substring(2),
                a: d < 12 ? f.AmPm[0] : f.AmPm[1],
                A: d < 12 ? f.AmPm[2] : f.AmPm[3],
                B: "?",
                g: d % 12 || 12,
                G: d,
                h: g(d % 12 || 12),
                H: g(d),
                i: g(e),
                s: g(n),
                u: k,
                e: "?",
                I: "?",
                O: (m > 0 ? "-": "+") + g(Math.floor(Math.abs(m) / 60) * 100 + Math.abs(m) % 60, 4),
                P: "?",
                T: (String(b).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""]).pop().replace(/[^-+\dA-Z]/g, ""),
                Z: "?",
                c: "?",
                r: "?",
                U: Math.floor(b / 1E3)
            };
            return c.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
            function(s) {
                return s in r ? r[s] : s.substring(1)
            })
        }
    };
    a.fn.fmatter.defaultFormat = function(d, e) {
        return a.fmatter.isValue(d) && d !== "" ? d: e.defaultValue ? e.defaultValue: "&#160;"
    };
    a.fn.fmatter.email = function(d, e) {
        return a.fmatter.isEmpty(d) ? a.fn.fmatter.defaultFormat(d, e) : '<a href="mailto:' + d + '">' + d + "</a>"
    };
    a.fn.fmatter.checkbox = function(d, e) {
        var c = a.extend({},
        e.checkbox),
        f;
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend({},
        c, e.colModel.formatoptions));
        f = c.disabled === true ? 'disabled="disabled"': "";
        if (a.fmatter.isEmpty(d) || a.fmatter.isUndefined(d)) d = a.fn.fmatter.defaultFormat(d, c);
        d += "";
        d = d.toLowerCase();
        return '<input type="checkbox" ' + (d.search(/(false|0|no|off)/i) < 0 ? " checked='checked' ": "") + ' value="' + d + '" offval="no" ' + f + "/>"
    };
    a.fn.fmatter.link = function(d, e) {
        var c = {
            target: e.target
        },
        f = "";
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend({},
        c, e.colModel.formatoptions));
        if (c.target) f = "target=" + c.target;
        return a.fmatter.isEmpty(d) ? a.fn.fmatter.defaultFormat(d, e) : "<a " + f + ' href="' + d + '">' + d + "</a>"
    };
    a.fn.fmatter.showlink = function(d, e) {
        var c = {
            baseLinkUrl: e.baseLinkUrl,
            showAction: e.showAction,
            addParam: e.addParam || "",
            target: e.target,
            idName: e.idName
        },
        f = "";
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend({},
        c, e.colModel.formatoptions));
        if (c.target) f = "target=" + c.target;
        c = c.baseLinkUrl + c.showAction + "?" + c.idName + "=" + e.rowId + c.addParam;
        return a.fmatter.isString(d) || a.fmatter.isNumber(d) ? "<a " + f + ' href="' + c + '">' + d + "</a>": a.fn.fmatter.defaultFormat(d, e)
    };
    a.fn.fmatter.integer = function(d, e) {
        var c = a.extend({},
        e.integer);
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend({},
        c, e.colModel.formatoptions));
        if (a.fmatter.isEmpty(d)) return c.defaultValue;
        return a.fmatter.util.NumberFormat(d, c)
    };
    a.fn.fmatter.number = function(d, e) {
        var c = a.extend({},
        e.number);
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend({},
        c, e.colModel.formatoptions));
        if (a.fmatter.isEmpty(d)) return c.defaultValue;
        return a.fmatter.util.NumberFormat(d, c)
    };
    a.fn.fmatter.currency = function(d, e) {
        var c = a.extend({},
        e.currency);
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend({},
        c, e.colModel.formatoptions));
        if (a.fmatter.isEmpty(d)) return c.defaultValue;
        return a.fmatter.util.NumberFormat(d, c)
    };
    a.fn.fmatter.date = function(d, e, c, f) {
        c = a.extend({},
        e.date);
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend({},
        c, e.colModel.formatoptions));
        return ! c.reformatAfterEdit && f == "edit" ? a.fn.fmatter.defaultFormat(d, e) : a.fmatter.isEmpty(d) ? a.fn.fmatter.defaultFormat(d, e) : a.fmatter.util.DateFormat(c.srcformat, d, c.newformat, c)
    };
    a.fn.fmatter.select = function(d, e) {
        d += "";
        var c = false,
        f = [];
        if (a.fmatter.isUndefined(e.colModel.formatoptions)) {
            if (!a.fmatter.isUndefined(e.colModel.editoptions)) c = e.colModel.editoptions.value
        } else c = e.colModel.formatoptions.value;
        if (c) {
            var g = e.colModel.editoptions.multiple === true ? true: false,
            h = [],
            j;
            if (g) {
                h = d.split(",");
                h = a.map(h,
                function(n) {
                    return a.trim(n)
                })
            }
            if (a.fmatter.isString(c)) for (var b = c.split(";"), m = 0, l = 0; l < b.length; l++) {
                j = b[l].split(":");
                if (j.length > 2) j[1] = jQuery.map(j,
                function(n, k) {
                    if (k > 0) return n
                }).join(":");
                if (g) {
                    if (jQuery.inArray(j[0], h) > -1) {
                        f[m] = j[1];
                        m++
                    }
                } else if (a.trim(j[0]) == a.trim(d)) {
                    f[0] = j[1];
                    break
                }
            } else if (a.fmatter.isObject(c)) if (g) f = jQuery.map(h,
            function(n) {
                return c[n]
            });
            else f[0] = c[d] || ""
        }
        d = f.join(", ");
        return d === "" ? a.fn.fmatter.defaultFormat(d, e) : d
    };
    a.fn.fmatter.rowactions = function(d, e, c, f) {
        var g = {
            keys: false,
            onEdit: null,
            onSuccess: null,
            afterSave: null,
            onError: null,
            afterRestore: null,
            extraparam: {
                oper: "edit"
            },
            url: null,
            delOptions: {},
            editOptions: {}
        };
        d = a.jgrid.jqID(d);
        e = a.jgrid.jqID(e);
        f = a("#" + e)[0].p.colModel[f];
        a.fmatter.isUndefined(f.formatoptions) || (g = a.extend(g, f.formatoptions));
        if (!a.fmatter.isUndefined(a("#" + e)[0].p.editOptions)) g.editOptions = a("#" + e)[0].p.editOptions;
        if (!a.fmatter.isUndefined(a("#" + e)[0].p.delOptions)) g.delOptions = a("#" + e)[0].p.delOptions;
        f = function(j) {
            g.afterSave && g.afterSave(j);
            a("tr#" + d + " div.ui-inline-edit, tr#" + d + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
            a("tr#" + d + " div.ui-inline-save, tr#" + d + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide()
        };
        var h = function(j) {
            g.afterRestore && g.afterRestore(j);
            a("tr#" + d + " div.ui-inline-edit, tr#" + d + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
            a("tr#" + d + " div.ui-inline-save, tr#" + d + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide()
        };
        switch (c) {
        case "edit":
            a("#" + e).jqGrid("editRow", d, g.keys, g.onEdit, g.onSuccess, g.url, g.extraparam, f, g.onError, h);
            a("tr#" + d + " div.ui-inline-edit, tr#" + d + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").hide();
            a("tr#" + d + " div.ui-inline-save, tr#" + d + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").show();
            break;
        case "save":
            if (a("#" + e).jqGrid("saveRow", d, g.onSuccess, g.url, g.extraparam, f, g.onError, h)) {
                a("tr#" + d + " div.ui-inline-edit, tr#" + d + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
                a("tr#" + d + " div.ui-inline-save, tr#" + d + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide()
            }
            break;
        case "cancel":
            a("#" + e).jqGrid("restoreRow", d, h);
            a("tr#" + d + " div.ui-inline-edit, tr#" + d + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
            a("tr#" + d + " div.ui-inline-save, tr#" + d + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide();
            break;
        case "del":
            a("#" + e).jqGrid("delGridRow", d, g.delOptions);
            break;
        case "formedit":
            a("#" + e).jqGrid("setSelection", d);
            a("#" + e).jqGrid("editGridRow", d, g.editOptions)
        }
    };
    a.fn.fmatter.actions = function(d, e) {
        var c = {
            keys: false,
            editbutton: true,
            delbutton: true,
            editformbutton: false
        };
        a.fmatter.isUndefined(e.colModel.formatoptions) || (c = a.extend(c, e.colModel.formatoptions));
        var f = e.rowId,
        g = "",
        h;
        if (typeof f == "undefined" || a.fmatter.isEmpty(f)) return "";
        if (c.editformbutton) {
            h = "onclick=$.fn.fmatter.rowactions('" + f + "','" + e.gid + "','formedit'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
            g = g + "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + h + "><span class='ui-icon ui-icon-pencil'></span></div>"
        } else if (c.editbutton) {
            h = "onclick=$.fn.fmatter.rowactions('" + f + "','" + e.gid + "','edit'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ";
            g = g + "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + h + "><span class='ui-icon ui-icon-pencil'></span></div>"
        }
        if (c.delbutton) {
            h = "onclick=$.fn.fmatter.rowactions('" + f + "','" + e.gid + "','del'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
            g = g + "<div title='" + a.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + h + "><span class='ui-icon ui-icon-trash'></span></div>"
        }
        h = "onclick=$.fn.fmatter.rowactions('" + f + "','" + e.gid + "','save'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
        g = g + "<div title='" + a.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + h + "><span class='ui-icon ui-icon-disk'></span></div>";
        h = "onclick=$.fn.fmatter.rowactions('" + f + "','" + e.gid + "','cancel'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
        g = g + "<div title='" + a.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " + h + "><span class='ui-icon ui-icon-cancel'></span></div>";
        return "<div style='margin-left:8px;'>" + g + "</div>"
    };
    a.unformat = function(d, e, c, f) {
        var g, h = e.colModel.formatter,
        j = e.colModel.formatoptions || {},
        b = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
        m = e.colModel.unformat || a.fn.fmatter[h] && a.fn.fmatter[h].unformat;
        if (typeof m !== "undefined" && a.isFunction(m)) g = m(a(d).text(), e, d);
        else if (!a.fmatter.isUndefined(h) && a.fmatter.isString(h)) {
            g = a.jgrid.formatter || {};
            switch (h) {
            case "integer":
                j = a.extend({},
                g.integer, j);
                e = j.thousandsSeparator.replace(b, "\\$1");
                g = a(d).text().replace(RegExp(e, "g"), "");
                break;
            case "number":
                j = a.extend({},
                g.number, j);
                e = j.thousandsSeparator.replace(b, "\\$1");
                g = a(d).text().replace(RegExp(e, "g"), "").replace(j.decimalSeparator, ".");
                break;
            case "currency":
                j = a.extend({},
                g.currency, j);
                e = j.thousandsSeparator.replace(b, "\\$1");
                g = a(d).text().replace(RegExp(e, "g"), "").replace(j.decimalSeparator, ".").replace(j.prefix, "").replace(j.suffix, "");
                break;
            case "checkbox":
                j = e.colModel.editoptions ? e.colModel.editoptions.value.split(":") : ["Yes", "No"];
                g = a("input", d).attr("checked") ? j[0] : j[1];
                break;
            case "select":
                g = a.unformat.select(d, e, c, f);
                break;
            case "actions":
                return "";
            default:
                g = a(d).text()
            }
        }
        return g !== undefined ? g: f === true ? a(d).text() : a.jgrid.htmlDecode(a(d).html())
    };
    a.unformat.select = function(d, e, c, f) {
        c = [];
        d = a(d).text();
        if (f === true) return d;
        e = a.extend({},
        e.colModel.editoptions);
        if (e.value) {
            var g = e.value;
            e = e.multiple === true ? true: false;
            f = [];
            var h;
            if (e) {
                f = d.split(",");
                f = a.map(f,
                function(l) {
                    return a.trim(l)
                })
            }
            if (a.fmatter.isString(g)) for (var j = g.split(";"), b = 0, m = 0; m < j.length; m++) {
                h = j[m].split(":");
                if (h.length > 2) h[1] = jQuery.map(h,
                function(l, n) {
                    if (n > 0) return l
                }).join(":");
                if (e) {
                    if (jQuery.inArray(h[1], f) > -1) {
                        c[b] = h[0];
                        b++
                    }
                } else if (a.trim(h[1]) == a.trim(d)) {
                    c[0] = h[0];
                    break
                }
            } else if (a.fmatter.isObject(g) || a.isArray(g)) {
                e || (f[0] = d);
                c = jQuery.map(f,
                function(l) {
                    var n;
                    a.each(g,
                    function(k, p) {
                        if (p == l) {
                            n = k;
                            return false
                        }
                    });
                    if (typeof n != "undefined") return n
                })
            }
            return c.join(", ")
        } else return d || ""
    };
    a.unformat.date = function(d, e) {
        var c = a.jgrid.formatter.date || {};
        a.fmatter.isUndefined(e.formatoptions) || (c = a.extend({},
        c, e.formatoptions));
        return a.fmatter.isEmpty(d) ? a.fn.fmatter.defaultFormat(d, e) : a.fmatter.util.DateFormat(c.newformat, d, c.srcformat, c)
    }
})(jQuery); (function(a) {
    a.extend(a.jgrid, {
        showModal: function(d) {
            d.w.show()
        },
        closeModal: function(d) {
            d.w.hide().attr("aria-hidden", "true");
            d.o && d.o.remove()
        },
        hideModal: function(d, e) {
            e = a.extend({
                jqm: true,
                gb: ""
            },
            e || {});
            if (e.onClose) {
                var c = e.onClose(d);
                if (typeof c == "boolean" && !c) return
            }
            if (a.fn.jqm && e.jqm === true) a(d).attr("aria-hidden", "true").jqmHide();
            else {
                if (e.gb !== "") try {
                    a(".jqgrid-overlay:first", e.gb).hide()
                } catch(f) {}
                a(d).hide().attr("aria-hidden", "true")
            }
        },
        findPos: function(d) {
            var e = 0,
            c = 0;
            if (d.offsetParent) {
                do {
                    e += d.offsetLeft;
                    c += d.offsetTop
                } while ( d = d . offsetParent )
            }
            return [e, c]
        },
        createModal: function(d, e, c, f, g, h, j) {
            var b = document.createElement("div"),
            m,
            l = this;
            j = a.extend({},
            j || {});
            m = a(c.gbox).attr("dir") == "rtl" ? true: false;
            b.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
            b.id = d.themodal;
            var n = document.createElement("div");
            n.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
            n.id = d.modalhead;
            a(n).append("<span class='ui-jqdialog-title'>" + c.caption + "</span>");
            var k = a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function() {
                k.addClass("ui-state-hover")
            },
            function() {
                k.removeClass("ui-state-hover")
            }).append("<span class='ui-icon ui-icon-closethick'></span>");
            a(n).append(k);
            if (m) {
                b.dir = "rtl";
                a(".ui-jqdialog-title", n).css("float", "right");
                a(".ui-jqdialog-titlebar-close", n).css("left", "0.3em")
            } else {
                b.dir = "ltr";
                a(".ui-jqdialog-title", n).css("float", "left");
                a(".ui-jqdialog-titlebar-close", n).css("right", "0.3em")
            }
            var p = document.createElement("div");
            a(p).addClass("ui-jqdialog-content ui-widget-content").attr("id", d.modalcontent);
            a(p).append(e);
            b.appendChild(p);
            a(b).prepend(n);
            if (h === true) a("body").append(b);
            else typeof h == "string" ? a(h).append(b) : a(b).insertBefore(f);
            a(b).css(j);
            if (typeof c.jqModal === "undefined") c.jqModal = true;
            e = {};
            if (a.fn.jqm && c.jqModal === true) {
                if (c.left === 0 && c.top === 0 && c.overlay) {
                    j = [];
                    j = this.findPos(g);
                    c.left = j[0] + 4;
                    c.top = j[1] + 4
                }
                e.top = c.top + "px";
                e.left = c.left
            } else if (c.left !== 0 || c.top !== 0) {
                e.left = c.left;
                e.top = c.top + "px"
            }
            a("a.ui-jqdialog-titlebar-close", n).click(function() {
                var q = a("#" + d.themodal).data("onClose") || c.onClose,
                r = a("#" + d.themodal).data("gbox") || c.gbox;
                l.hideModal("#" + d.themodal, {
                    gb: r,
                    jqm: c.jqModal,
                    onClose: q
                });
                return false
            });
            if (c.width === 0 || !c.width) c.width = 300;
            if (c.height === 0 || !c.height) c.height = 200;
            if (!c.zIndex) {
                f = a(f).parents("*[role=dialog]").filter(":first").css("z-index");
                c.zIndex = f ? parseInt(f, 10) + 1 : 950
            }
            f = 0;
            if (m && e.left && !h) {
                f = a(c.gbox).width() - (!isNaN(c.width) ? parseInt(c.width, 10) : 0) - 8;
                e.left = parseInt(e.left, 10) + parseInt(f, 10)
            }
            if (e.left) e.left += "px";
            a(b).css(a.extend({
                width: isNaN(c.width) ? "auto": c.width + "px",
                height: isNaN(c.height) ? "auto": c.height + "px",
                zIndex: c.zIndex,
                overflow: "hidden"
            },
            e)).attr({
                tabIndex: "-1",
                role: "dialog",
                "aria-labelledby": d.modalhead,
                "aria-hidden": "true"
            });
            if (typeof c.drag == "undefined") c.drag = true;
            if (typeof c.resize == "undefined") c.resize = true;
            if (c.drag) {
                a(n).css("cursor", "move");
                if (a.fn.jqDrag) a(b).jqDrag(n);
                else try {
                    a(b).draggable({
                        handle: a("#" + n.id)
                    })
                } catch(o) {}
            }
            if (c.resize) if (a.fn.jqResize) {
                a(b).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se ui-icon-grip-diagonal-se'></div>");
                a("#" + d.themodal).jqResize(".jqResize", d.scrollelm ? "#" + d.scrollelm: false)
            } else try {
                a(b).resizable({
                    handles: "se, sw",
                    alsoResize: d.scrollelm ? "#" + d.scrollelm: false
                })
            } catch(v) {}
            c.closeOnEscape === true && a(b).keydown(function(q) {
                if (q.which == 27) {
                    q = a("#" + d.themodal).data("onClose") || c.onClose;
                    l.hideModal(this, {
                        gb: c.gbox,
                        jqm: c.jqModal,
                        onClose: q
                    })
                }
            })
        },
        viewModal: function(d, e) {
            e = a.extend({
                toTop: true,
                overlay: 10,
                modal: false,
                onShow: this.showModal,
                onHide: this.closeModal,
                gbox: "",
                jqm: true,
                jqM: true
            },
            e || {});
            if (a.fn.jqm && e.jqm === true) e.jqM ? a(d).attr("aria-hidden", "false").jqm(e).jqmShow() : a(d).attr("aria-hidden", "false").jqmShow();
            else {
                if (e.gbox !== "") {
                    a(".jqgrid-overlay:first", e.gbox).show();
                    a(d).data("gbox", e.gbox)
                }
                a(d).show().attr("aria-hidden", "false");
                try {
                    a(":input:visible", d)[0].focus()
                } catch(c) {}
            }
        },
        info_dialog: function(d, e, c, f) {
            var g = {
                width: 290,
                height: "auto",
                dataheight: "auto",
                drag: true,
                resize: false,
                caption: "<b>" + d + "</b>",
                left: 250,
                top: 170,
                zIndex: 1E3,
                jqModal: true,
                modal: false,
                closeOnEscape: true,
                align: "center",
                buttonalign: "center",
                buttons: []
            };
            a.extend(g, f || {});
            var h = g.jqModal,
            j = this;
            if (a.fn.jqm && !h) h = false;
            d = "";
            if (g.buttons.length > 0) for (f = 0; f < g.buttons.length; f++) {
                if (typeof g.buttons[f].id == "undefined") g.buttons[f].id = "info_button_" + f;
                d += "<a href='javascript:void(0)' id='" + g.buttons[f].id + "' class='fm-button ui-state-default ui-corner-all'>" + g.buttons[f].text + "</a>"
            }
            f = isNaN(g.dataheight) ? g.dataheight: g.dataheight + "px";
            var b = "<div id='info_id'>";
            b += "<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + f + ";" + ("text-align:" + g.align + ";") + "'>" + e + "</div>";
            b += c ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>" + c + "</a>" + d + "</div>": d !== "" ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + d + "</div>": "";
            b += "</div>";
            try {
                a("#info_dialog").attr("aria-hidden") == "false" && this.hideModal("#info_dialog", {
                    jqm: h
                });
                a("#info_dialog").remove()
            } catch(m) {}
            this.createModal({
                themodal: "info_dialog",
                modalhead: "info_head",
                modalcontent: "info_content",
                scrollelm: "infocnt"
            },
            b, g, "", "", true);
            d && a.each(g.buttons,
            function(n) {
                a("#" + this.id, "#info_id").bind("click",
                function() {
                    g.buttons[n].onClick.call(a("#info_dialog"));
                    return false
                })
            });
            a("#closedialog", "#info_id").click(function() {
                j.hideModal("#info_dialog", {
                    jqm: h
                });
                return false
            });
            a(".fm-button", "#info_dialog").hover(function() {
                a(this).addClass("ui-state-hover")
            },
            function() {
                a(this).removeClass("ui-state-hover")
            });
            a.isFunction(g.beforeOpen) && g.beforeOpen();
            this.viewModal("#info_dialog", {
                onHide: function(n) {
                    n.w.hide().remove();
                    n.o && n.o.remove()
                },
                modal: g.modal,
                jqm: h
            });
            a.isFunction(g.afterOpen) && g.afterOpen();
            try {
                a("#info_dialog").focus()
            } catch(l) {}
        },
        createEl: function(d, e, c, f, g) {
            function h(p, o) {
                a.isFunction(o.dataInit) && o.dataInit(p);
                o.dataEvents && a.each(o.dataEvents,
                function() {
                    this.data !== undefined ? a(p).bind(this.type, this.data, this.fn) : a(p).bind(this.type, this.fn)
                });
                return o
            }
            function j(p, o, v) {
                var q = ["dataInit", "dataEvents", "dataUrl", "buildSelect", "sopt", "searchhidden", "defaultValue", "attr"];
                if (typeof v != "undefined" && a.isArray(v)) q = a.extend(q, v);
                a.each(o,
                function(r, s) {
                    a.inArray(r, q) === -1 && a(p).attr(r, s)
                });
                o.hasOwnProperty("id") || a(p).attr("id", a.jgrid.randId())
            }
            var b = "";
            switch (d) {
            case "textarea":
                b = document.createElement("textarea");
                if (f) e.cols || a(b).css({
                    width: "98%"
                });
                else if (!e.cols) e.cols = 20;
                if (!e.rows) e.rows = 2;
                if (c == "&nbsp;" || c == "&#160;" || c.length == 1 && c.charCodeAt(0) == 160) c = "";
                b.value = c;
                j(b, e);
                e = h(b, e);
                a(b).attr({
                    role: "textbox",
                    multiline: "true"
                });
                break;
            case "checkbox":
                b = document.createElement("input");
                b.type = "checkbox";
                if (e.value) {
                    d = e.value.split(":");
                    if (c === d[0]) {
                        b.checked = true;
                        b.defaultChecked = true
                    }
                    b.value = d[0];
                    a(b).attr("offval", d[1])
                } else {
                    d = c.toLowerCase();
                    if (d.search(/(false|0|no|off|undefined)/i) < 0 && d !== "") {
                        b.checked = true;
                        b.defaultChecked = true;
                        b.value = c
                    } else b.value = "on";
                    a(b).attr("offval", "off")
                }
                j(b, e, ["value"]);
                e = h(b, e);
                a(b).attr("role", "checkbox");
                break;
            case "select":
                b = document.createElement("select");
                b.setAttribute("role", "select");
                f = [];
                if (e.multiple === true) {
                    d = true;
                    b.multiple = "multiple";
                    a(b).attr("aria-multiselectable", "true")
                } else d = false;
                if (typeof e.dataUrl != "undefined") a.ajax(a.extend({
                    url: e.dataUrl,
                    type: "GET",
                    dataType: "html",
                    context: {
                        elem: b,
                        options: e,
                        vl: c
                    },
                    success: function(p) {
                        var o = [],
                        v = this.elem,
                        q = this.vl,
                        r = a.extend({},
                        this.options),
                        s = r.multiple === true;
                        if (typeof r.buildSelect != "undefined") p = r.buildSelect(p);
                        if (p = a(p).html()) {
                            a(v).append(p);
                            j(v, r);
                            r = h(v, r);
                            if (typeof r.size === "undefined") r.size = s ? 3 : 1;
                            if (s) {
                                o = q.split(",");
                                o = a.map(o,
                                function(x) {
                                    return a.trim(x)
                                })
                            } else o[0] = a.trim(q);
                            setTimeout(function() {
                                a("option", v).each(function() {
                                    a(this).attr("role", "option");
                                    if (a.inArray(a.trim(a(this).text()), o) > -1 || a.inArray(a.trim(a(this).val()), o) > -1) this.selected = "selected"
                                })
                            },
                            0)
                        }
                    }
                },
                g || {}));
                else if (e.value) {
                    var m;
                    if (d) {
                        f = c.split(",");
                        f = a.map(f,
                        function(p) {
                            return a.trim(p)
                        });
                        if (typeof e.size === "undefined") e.size = 3
                    } else e.size = 1;
                    if (typeof e.value === "function") e.value = e.value();
                    var l, n;
                    if (typeof e.value === "string") {
                        l = e.value.split(";");
                        for (m = 0; m < l.length; m++) {
                            n = l[m].split(":");
                            if (n.length > 2) n[1] = a.map(n,
                            function(p, o) {
                                if (o > 0) return p
                            }).join(":");
                            g = document.createElement("option");
                            g.setAttribute("role", "option");
                            g.value = n[0];
                            g.innerHTML = n[1];
                            if (!d && (a.trim(n[0]) == a.trim(c) || a.trim(n[1]) == a.trim(c))) g.selected = "selected";
                            if (d && (a.inArray(a.trim(n[1]), f) > -1 || a.inArray(a.trim(n[0]), f) > -1)) g.selected = "selected";
                            b.appendChild(g)
                        }
                    } else if (typeof e.value === "object") {
                        l = e.value;
                        for (m in l) if (l.hasOwnProperty(m)) {
                            g = document.createElement("option");
                            g.setAttribute("role", "option");
                            g.value = m;
                            g.innerHTML = l[m];
                            if (!d && (a.trim(m) == a.trim(c) || a.trim(l[m]) == a.trim(c))) g.selected = "selected";
                            if (d && (a.inArray(a.trim(l[m]), f) > -1 || a.inArray(a.trim(m), f) > -1)) g.selected = "selected";
                            b.appendChild(g)
                        }
                    }
                    j(b, e, ["value"]);
                    e = h(b, e)
                }
                break;
            case "text":
            case "password":
            case "button":
                m = d == "button" ? "button": "textbox";
                b = document.createElement("input");
                b.type = d;
                b.value = c;
                j(b, e);
                e = h(b, e);
                if (d != "button") if (f) e.size || a(b).css({
                    width: "98%"
                });
                else if (!e.size) e.size = 20;
                a(b).attr("role", m);
                break;
            case "image":
            case "file":
                b = document.createElement("input");
                b.type = d;
                j(b, e);
                e = h(b, e);
                break;
            case "custom":
                b = document.createElement("span");
                try {
                    if (a.isFunction(e.custom_element)) if (l = e.custom_element.call(this, c, e)) {
                        l = a(l).addClass("customelement").attr({
                            id: e.id,
                            name: e.name
                        });
                        a(b).empty().append(l)
                    } else throw "e2";
                    else throw "e1";
                } catch(k) {
                    k == "e1" && this.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose);
                    k == "e2" ? this.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : this.info_dialog(a.jgrid.errors.errcap, typeof k === "string" ? k: k.message, a.jgrid.edit.bClose)
                }
            }
            return b
        },
        checkDate: function(d, e) {
            var c = {},
            f;
            d = d.toLowerCase();
            f = d.indexOf("/") != -1 ? "/": d.indexOf("-") != -1 ? "-": d.indexOf(".") != -1 ? ".": "/";
            d = d.split(f);
            e = e.split(f);
            if (e.length != 3) return false;
            f = -1;
            for (var g, h = -1,
            j = -1,
            b = 0; b < d.length; b++) {
                g = isNaN(e[b]) ? 0 : parseInt(e[b], 10);
                c[d[b]] = g;
                g = d[b];
                if (g.indexOf("y") != -1) f = b;
                if (g.indexOf("m") != -1) j = b;
                if (g.indexOf("d") != -1) h = b
            }
            g = d[f] == "y" || d[f] == "yyyy" ? 4 : d[f] == "yy" ? 2 : -1;
            b = function(l) {
                for (var n = 1; n <= l; n++) {
                    this[n] = 31;
                    if (n == 4 || n == 6 || n == 9 || n == 11) this[n] = 30;
                    if (n == 2) this[n] = 29
                }
                return this
            } (12);
            var m;
            if (f === -1) return false;
            else {
                m = c[d[f]].toString();
                if (g == 2 && m.length == 1) g = 1;
                if (m.length != g || c[d[f]] === 0 && e[f] != "00") return false
            }
            if (j === -1) return false;
            else {
                m = c[d[j]].toString();
                if (m.length < 1 || c[d[j]] < 1 || c[d[j]] > 12) return false
            }
            if (h === -1) return false;
            else {
                m = c[d[h]].toString();
                if (m.length < 1 || c[d[h]] < 1 || c[d[h]] > 31 || c[d[j]] == 2 && c[d[h]] > (c[d[f]] % 4 === 0 && (c[d[f]] % 100 !== 0 || c[d[f]] % 400 === 0) ? 29 : 28) || c[d[h]] > b[c[d[j]]]) return false

            }
            return true
        },
        isEmpty: function(d) {
            return d.match(/^\s+$/) || d === "" ? true: false
        },
        checkTime: function(d) {
            var e = /^(\d{1,2}):(\d{2})([ap]m)?$/;
            if (!this.isEmpty(d)) if (d = d.match(e)) {
                if (d[3]) {
                    if (d[1] < 1 || d[1] > 12) return false
                } else if (d[1] > 23) return false;
                if (d[2] > 59) return false
            } else return false;
            return true
        },
        checkValues: function(d, e, c, f, g) {
            var h, j;
            if (typeof f === "undefined") if (typeof e == "string") {
                f = 0;
                for (g = c.p.colModel.length; f < g; f++) if (c.p.colModel[f].name == e) {
                    h = c.p.colModel[f].editrules;
                    e = f;
                    try {
                        j = c.p.colModel[f].formoptions.label
                    } catch(b) {}
                    break
                }
            } else {
                if (e >= 0) h = c.p.colModel[e].editrules
            } else {
                h = f;
                j = g === undefined ? "_": g
            }
            if (h) {
                j || (j = c.p.colNames[e]);
                if (h.required === true) if (this.isEmpty(d)) return [false, j + ": " + a.jgrid.edit.msg.required, ""];
                f = h.required === false ? false: true;
                if (h.number === true) if (! (f === false && this.isEmpty(d))) if (isNaN(d)) return [false, j + ": " + a.jgrid.edit.msg.number, ""];
                if (typeof h.minValue != "undefined" && !isNaN(h.minValue)) if (parseFloat(d) < parseFloat(h.minValue)) return [false, j + ": " + a.jgrid.edit.msg.minValue + " " + h.minValue, ""];
                if (typeof h.maxValue != "undefined" && !isNaN(h.maxValue)) if (parseFloat(d) > parseFloat(h.maxValue)) return [false, j + ": " + a.jgrid.edit.msg.maxValue + " " + h.maxValue, ""];
                if (h.email === true) if (! (f === false && this.isEmpty(d))) {
                    g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
                    if (!g.test(d)) return [false, j + ": " + a.jgrid.edit.msg.email, ""]
                }
                if (h.integer === true) if (! (f === false && this.isEmpty(d))) {
                    if (isNaN(d)) return [false, j + ": " + a.jgrid.edit.msg.integer, ""];
                    if (d % 1 !== 0 || d.indexOf(".") != -1) return [false, j + ": " + a.jgrid.edit.msg.integer, ""]
                }
                if (h.date === true) if (! (f === false && this.isEmpty(d))) {
                    e = c.p.colModel[e].formatoptions && c.p.colModel[e].formatoptions.newformat ? c.p.colModel[e].formatoptions.newformat: c.p.colModel[e].datefmt || "Y-m-d";
                    if (!this.checkDate(e, d)) return [false, j + ": " + a.jgrid.edit.msg.date + " - " + e, ""]
                }
                if (h.time === true) if (! (f === false && this.isEmpty(d))) if (!this.checkTime(d)) return [false, j + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""];
                if (h.url === true) if (! (f === false && this.isEmpty(d))) {
                    g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
                    if (!g.test(d)) return [false, j + ": " + a.jgrid.edit.msg.url, ""]
                }
                if (h.custom === true) if (! (f === false && this.isEmpty(d))) if (a.isFunction(h.custom_func)) {
                    d = h.custom_func.call(c, d, j);
                    return a.isArray(d) ? d: [false, a.jgrid.edit.msg.customarray, ""]
                } else return [false, a.jgrid.edit.msg.customfcheck, ""]
            }
            return [true, "", ""]
        }
    })
})(jQuery); (function(a) {
    a.fn.jqFilter = function(d) {
        if (typeof d === "string") {
            var e = a.fn.jqFilter[d];
            if (!e) throw "jqFilter - No such method: " + d;
            var c = a.makeArray(arguments).slice(1);
            return e.apply(this, c)
        }
        var f = a.extend(true, {
            filter: null,
            columns: [],
            onChange: null,
            afterRedraw: null,
            checkValues: null,
            error: false,
            errmsg: "",
            errorcheck: true,
            showQuery: true,
            sopt: null,
            ops: [{
                name: "eq",
                description: "equal",
                operator: "="
            },
            {
                name: "ne",
                description: "not equal",
                operator: "<>"
            },
            {
                name: "lt",
                description: "less",
                operator: "<"
            },
            {
                name: "le",
                description: "less or equal",
                operator: "<="
            },
            {
                name: "gt",
                description: "greater",
                operator: ">"
            },
            {
                name: "ge",
                description: "greater or equal",
                operator: ">="
            },
            {
                name: "bw",
                description: "begins with",
                operator: "LIKE"
            },
            {
                name: "bn",
                description: "does not begin with",
                operator: "NOT LIKE"
            },
            {
                name: "in",
                description: "in",
                operator: "IN"
            },
            {
                name: "ni",
                description: "not in",
                operator: "NOT IN"
            },
            {
                name: "ew",
                description: "ends with",
                operator: "LIKE"
            },
            {
                name: "en",
                description: "does not end with",
                operator: "NOT LIKE"
            },
            {
                name: "cn",
                description: "contains",
                operator: "LIKE"
            },
            {
                name: "nc",
                description: "does not contain",
                operator: "NOT LIKE"
            },
            {
                name: "nu",
                description: "is null",
                operator: "IS NULL"
            },
            {
                name: "nn",
                description: "is not null",
                operator: "IS NOT NULL"
            }],
            numopts: ["eq", "ne", "lt", "le", "gt", "ge", "nu", "nn", "in", "ni"],
            stropts: ["eq", "ne", "bw", "bn", "ew", "en", "cn", "nc", "nu", "nn", "in", "ni"],
            _gridsopt: [],
            groupOps: ["AND", "OR"],
            groupButton: true,
            ruleButtons: true
        },
        d || {});
        return this.each(function() {
            if (!this.filter) {
                this.p = f;
                if (this.p.filter === null || this.p.filter === undefined) this.p.filter = {
                    groupOp: this.p.groupOps[0],
                    rules: [],
                    groups: []
                };
                var g, h = this.p.columns.length,
                j, b = /msie/i.test(navigator.userAgent) && !window.opera;
                if (this.p._gridsopt.length) for (g = 0; g < this.p._gridsopt.length; g++) this.p.ops[g].description = this.p._gridsopt[g];
                this.p.initFilter = a.extend(true, {},
                this.p.filter);
                if (h) {
                    for (g = 0; g < h; g++) {
                        j = this.p.columns[g];
                        if (j.stype) j.inputtype = j.stype;
                        else if (!j.inputtype) j.inputtype = "text";
                        if (j.sorttype) j.searchtype = j.sorttype;
                        else if (!j.searchtype) j.searchtype = "string";
                        if (j.hidden === undefined) j.hidden = false;
                        if (!j.label) j.label = j.name;
                        if (j.index) j.name = j.index;
                        if (!j.hasOwnProperty("searchoptions")) j.searchoptions = {};
                        if (!j.hasOwnProperty("searchrules")) j.searchrules = {}
                    }
                    this.p.showQuery && a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;'><tbody><tr><td class='query'></td></tr></tbody></table>");
                    var m = function(l, n) {
                        var k = [true, ""];
                        if (a.isFunction(n.searchrules)) k = n.searchrules(l, n);
                        else if (a.jgrid && a.jgrid.checkValues) try {
                            k = a.jgrid.checkValues(l, -1, null, n.searchrules, n.label)
                        } catch(p) {}
                        if (k && k.length && k[0] === false) {
                            f.error = !k[0];
                            f.errmsg = k[1]
                        }
                    };
                    this.onchange = function() {
                        this.p.error = false;
                        this.p.errmsg = "";
                        return a.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : false
                    };
                    this.reDraw = function() {
                        a("table.group:first", this).remove();
                        var l = this.createTableForGroup(f.filter, null);
                        a(this).append(l);
                        a.isFunction(this.p.afterRedraw) && this.p.afterRedraw.call(this, this.p)
                    };
                    this.createTableForGroup = function(l, n) {
                        var k = this,
                        p, o = a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>");
                        n === null && a(o).append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='left'></th></tr>");
                        var v = a("<tr></tr>");
                        a(o).append(v);
                        var q = a("<th colspan='5' align='left'></th>");
                        v.append(q);
                        if (this.p.ruleButtons === true) {
                            var r = a("<select class='opsel'></select>");
                            q.append(r);
                            v = "";
                            var s;
                            for (p = 0; p < f.groupOps.length; p++) {
                                s = l.groupOp === k.p.groupOps[p] ? " selected='selected'": "";
                                v += "<option value='" + k.p.groupOps[p] + "'" + s + ">" + k.p.groupOps[p] + "</option>"
                            }
                            r.append(v).bind("change",
                            function() {
                                l.groupOp = a(r).val();
                                k.onchange()
                            })
                        }
                        v = "<span></span>";
                        if (this.p.groupButton) {
                            v = a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>");
                            v.bind("click",
                            function() {
                                if (l.groups === undefined) l.groups = [];
                                l.groups.push({
                                    groupOp: f.groupOps[0],
                                    rules: [],
                                    groups: []
                                });
                                k.reDraw();
                                k.onchange();
                                return false
                            })
                        }
                        q.append(v);
                        if (this.p.ruleButtons === true) {
                            v = a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>");
                            var x;
                            v.bind("click",
                            function() {
                                if (l.rules === undefined) l.rules = [];
                                for (p = 0; p < k.p.columns.length; p++) {
                                    var A = typeof k.p.columns[p].search === "undefined" ? true: k.p.columns[p].search,
                                    B = k.p.columns[p].hidden === true;
                                    if (k.p.columns[p].searchoptions.searchhidden === true && A || A && !B) {
                                        x = k.p.columns[p];
                                        break
                                    }
                                }
                                l.rules.push({
                                    field: x.name,
                                    op: (x.searchoptions.sopt ? x.searchoptions.sopt: k.p.sopt ? k.p.sopt: x.searchtype === "string" ? k.p.stropts: k.p.numopts)[0],
                                    data: ""
                                });
                                k.reDraw();
                                return false
                            });
                            q.append(v)
                        }
                        if (n !== null) {
                            v = a("<input type='button' value='-' title='Delete group' class='delete-group'/>");
                            q.append(v);
                            v.bind("click",
                            function() {
                                for (p = 0; p < n.groups.length; p++) if (n.groups[p] === l) {
                                    n.groups.splice(p, 1);
                                    break
                                }
                                k.reDraw();
                                k.onchange();
                                return false
                            })
                        }
                        if (l.groups !== undefined) for (p = 0; p < l.groups.length; p++) {
                            q = a("<tr></tr>");
                            o.append(q);
                            v = a("<td class='first'></td>");
                            q.append(v);
                            v = a("<td colspan='4'></td>");
                            v.append(this.createTableForGroup(l.groups[p], l));
                            q.append(v)
                        }
                        if (l.groupOp === undefined) l.groupOp = k.p.groupOps[0];
                        if (l.rules !== undefined) for (p = 0; p < l.rules.length; p++) o.append(this.createTableRowForRule(l.rules[p], l));
                        return o
                    };
                    this.createTableRowForRule = function(l, n) {
                        var k = this,
                        p = a("<tr></tr>"),
                        o,
                        v,
                        q,
                        r,
                        s = "",
                        x;
                        p.append("<td class='first'></td>");
                        var A = a("<td class='columns'></td>");
                        p.append(A);
                        var B = a("<select></select>"),
                        F,
                        y = [];
                        A.append(B);
                        B.bind("change",
                        function() {
                            l.field = a(B).val();
                            q = a(this).parents("tr:first");
                            for (o = 0; o < k.p.columns.length; o++) if (k.p.columns[o].name === l.field) {
                                r = k.p.columns[o];
                                break
                            }
                            if (r) {
                                r.searchoptions.id = a.jgrid.randId();
                                if (b && r.inputtype === "text") if (!r.searchoptions.size) r.searchoptions.size = 10;
                                var C = a.jgrid.createEl(r.inputtype, r.searchoptions, "", true, k.p.ajaxSelectOptions, true);
                                a(C).addClass("input-elm");
                                v = r.searchoptions.sopt ? r.searchoptions.sopt: k.p.sopt ? k.p.sopt: r.searchtype === "string" ? k.p.stropts: k.p.numopts;
                                var R = "",
                                ca = "";
                                y = [];
                                a.each(k.p.ops,
                                function() {
                                    y.push(this.name)
                                });
                                for (o = 0; o < v.length; o++) {
                                    F = a.inArray(v[o], y);
                                    if (F !== -1) {
                                        ca = "";
                                        if (o === 0) {
                                            l.op = k.p.ops[F].name;
                                            ca = " selected='selected'"
                                        }
                                        R += "<option value='" + k.p.ops[F].name + "'" + ca + ">" + k.p.ops[F].description + "</option>"
                                    }
                                }
                                a(".selectopts", q).empty().append(R);
                                a(".data", q).empty().append(C);
                                a(".input-elm", q).bind("change",
                                function() {
                                    l.data = a(this).val();
                                    k.onchange()
                                });
                                setTimeout(function() {
                                    l.data = a(C).val();
                                    k.onchange()
                                },
                                0)
                            }
                        });
                        for (o = A = 0; o < k.p.columns.length; o++) {
                            x = typeof k.p.columns[o].search === "undefined" ? true: k.p.columns[o].search;
                            var G = k.p.columns[o].hidden === true;
                            if (k.p.columns[o].searchoptions.searchhidden === true && x || x && !G) {
                                x = "";
                                if (l.field === k.p.columns[o].name) {
                                    x = " selected='selected'";
                                    A = o
                                }
                                s += "<option value='" + k.p.columns[o].name + "'" + x + ">" + k.p.columns[o].label + "</option>"
                            }
                        }
                        B.append(s);
                        s = a("<td class='operators'></td>");
                        p.append(s);
                        r = f.columns[A];
                        r.searchoptions.id = a.jgrid.randId();
                        if (b && r.inputtype === "text") if (!r.searchoptions.size) r.searchoptions.size = 10;
                        A = a.jgrid.createEl(r.inputtype, r.searchoptions, l.data, true, k.p.ajaxSelectOptions, true);
                        var S = a("<select class='selectopts'></select>");
                        s.append(S);
                        S.bind("change",
                        function() {
                            l.op = a(S).val();
                            q = a(this).parents("tr:first");
                            var C = a(".input-elm", q)[0];
                            if (l.op === "nu" || l.op === "nn") {
                                l.data = "";
                                C.value = "";
                                C.setAttribute("readonly", "true");
                                C.setAttribute("disabled", "true")
                            } else {
                                C.removeAttribute("readonly");
                                C.removeAttribute("disabled")
                            }
                            k.onchange()
                        });
                        v = r.searchoptions.sopt ? r.searchoptions.sopt: k.p.sopt ? k.p.sopt: r.searchtype === "string" ? f.stropts: k.p.numopts;
                        s = "";
                        a.each(k.p.ops,
                        function() {
                            y.push(this.name)
                        });
                        for (o = 0; o < v.length; o++) {
                            F = a.inArray(v[o], y);
                            if (F !== -1) {
                                x = l.op === k.p.ops[F].name ? " selected='selected'": "";
                                s += "<option value='" + k.p.ops[F].name + "'" + x + ">" + k.p.ops[F].description + "</option>"
                            }
                        }
                        S.append(s);
                        s = a("<td class='data'></td>");
                        p.append(s);
                        s.append(A);
                        a(A).addClass("input-elm").bind("change",
                        function() {
                            l.data = a(this).val();
                            k.onchange()
                        });
                        s = a("<td></td>");
                        p.append(s);
                        if (this.p.ruleButtons === true) {
                            A = a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>");
                            s.append(A);
                            A.bind("click",
                            function() {
                                for (o = 0; o < n.rules.length; o++) if (n.rules[o] === l) {
                                    n.rules.splice(o, 1);
                                    break
                                }
                                k.reDraw();
                                k.onchange();
                                return false
                            })
                        }
                        return p
                    };
                    this.getStringForGroup = function(l) {
                        var n = "(",
                        k;
                        if (l.groups !== undefined) for (k = 0; k < l.groups.length; k++) {
                            if (n.length > 1) n += " " + l.groupOp + " ";
                            try {
                                n += this.getStringForGroup(l.groups[k])
                            } catch(p) {
                                alert(p)
                            }
                        }
                        if (l.rules !== undefined) try {
                            for (k = 0; k < l.rules.length; k++) {
                                if (n.length > 1) n += " " + l.groupOp + " ";
                                n += this.getStringForRule(l.rules[k])
                            }
                        } catch(o) {
                            alert(o)
                        }
                        n += ")";
                        return n === "()" ? "": n
                    };
                    this.getStringForRule = function(l) {
                        var n = "",
                        k = "",
                        p, o;
                        for (p = 0; p < this.p.ops.length; p++) if (this.p.ops[p].name === l.op) {
                            n = this.p.ops[p].operator;
                            k = this.p.ops[p].name;
                            break
                        }
                        for (p = 0; p < this.p.columns.length; p++) if (this.p.columns[p].name === l.field) {
                            o = this.p.columns[p];
                            break
                        }
                        p = l.data;
                        if (k === "bw" || k === "bn") p += "%";
                        if (k === "ew" || k === "en") p = "%" + p;
                        if (k === "cn" || k === "nc") p = "%" + p + "%";
                        if (k === "in" || k === "ni") p = " (" + p + ")";
                        f.errorcheck && m(l.data, o);
                        return a.inArray(o.searchtype, ["int", "integer", "float", "number", "currency"]) !== -1 || k === "nn" || k === "nu" ? l.field + " " + n + " " + p: l.field + " " + n + ' "' + p + '"'
                    };
                    this.resetFilter = function() {
                        this.p.filter = a.extend(true, {},
                        this.p.initFilter);
                        this.reDraw();
                        this.onchange()
                    };
                    this.hideError = function() {
                        a("th.ui-state-error", this).html("");
                        a("tr.error", this).hide()
                    };
                    this.showError = function() {
                        a("th.ui-state-error", this).html(this.p.errmsg);
                        a("tr.error", this).show()
                    };
                    this.toUserFriendlyString = function() {
                        return this.getStringForGroup(f.filter)
                    };
                    this.toString = function() {
                        function l(k) {
                            var p = "(",
                            o;
                            if (k.groups !== undefined) for (o = 0; o < k.groups.length; o++) {
                                if (p.length > 1) p += k.groupOp === "OR" ? " || ": " && ";
                                p += l(k.groups[o])
                            }
                            if (k.rules !== undefined) for (o = 0; o < k.rules.length; o++) {
                                if (p.length > 1) p += k.groupOp === "OR" ? " || ": " && ";
                                var v = k.rules[o];
                                if (n.p.errorcheck) {
                                    var q = void 0,
                                    r = void 0;
                                    for (q = 0; q < n.p.columns.length; q++) if (n.p.columns[q].name === v.field) {
                                        r = n.p.columns[q];
                                        break
                                    }
                                    r && m(v.data, r)
                                }
                                p += v.op + "(item." + v.field + ",'" + v.data + "')"
                            }
                            p += ")";
                            return p === "()" ? "": p
                        }
                        var n = this;
                        return l(this.p.filter)
                    };
                    this.reDraw();
                    if (this.p.showQuery) this.onchange();
                    this.filter = true
                }
            }
        })
    };
    a.extend(a.fn.jqFilter, {
        toSQLString: function() {
            var d = "";
            this.each(function() {
                d = this.toUserFriendlyString()
            });
            return d
        },
        filterData: function() {
            var d;
            this.each(function() {
                d = this.p.filter
            });
            return d
        },
        getParameter: function(d) {
            if (d !== undefined) if (this.p.hasOwnProperty(d)) return this.p[d];
            return this.p
        },
        resetFilter: function() {
            return this.each(function() {
                this.resetFilter()
            })
        },
        addFilter: function(d) {
            if (typeof d === "string") d = jQuery.jgrid.parse(d);
            this.each(function() {
                this.p.filter = d;
                this.reDraw();
                this.onchange()
            })
        }
    })
})(jQuery); (function(a) {
    a.jgrid.extend({
        searchGrid: function(d) {
            d = a.extend({
                recreateFilter: false,
                drag: true,
                sField: "searchField",
                sValue: "searchString",
                sOper: "searchOper",
                sFilter: "filters",
                loadDefaults: true,
                beforeShowSearch: null,
                afterShowSearch: null,
                onInitializeSearch: null,
                afterRedraw: null,
                closeAfterSearch: false,
                closeAfterReset: false,
                closeOnEscape: false,
                multipleSearch: false,
                multipleGroup: false,
                top: 0,
                left: 0,
                jqModal: true,
                modal: false,
                resize: false,
                width: 450,
                height: "auto",
                dataheight: "auto",
                showQuery: false,
                errorcheck: true,
                sopt: null,
                stringResult: undefined,
                onClose: null,
                onSearch: null,
                onReset: null,
                toTop: true,
                overlay: 10,
                columns: [],
                tmplNames: null,
                tmplFilters: null,
                tmplLabel: " Template: ",
                showOnLoad: false,
                layer: null
            },
            a.jgrid.search, d || {});
            return this.each(function() {
                function e() {
                    if (a.isFunction(d.beforeShowSearch)) {
                        g = d.beforeShowSearch(a("#" + f));
                        if (typeof g === "undefined") g = true
                    }
                    if (g) {
                        a.jgrid.viewModal("#" + h.themodal, {
                            gbox: "#gbox_" + f,
                            jqm: d.jqModal,
                            modal: d.modal,
                            overlay: d.overlay,
                            toTop: d.toTop
                        });
                        a.isFunction(d.afterShowSearch) && d.afterShowSearch(a("#" + f))
                    }
                }
                var c = this;
                if (c.grid) {
                    var f = "fbox_" + c.p.id,
                    g = true,
                    h = {
                        themodal: "searchmod" + f,
                        modalhead: "searchhd" + f,
                        modalcontent: "searchcnt" + f,
                        scrollelm: f
                    },
                    j = c.p.postData[d.sFilter];
                    if (typeof j === "string") j = a.jgrid.parse(j);
                    d.recreateFilter === true && a("#" + h.themodal).remove();
                    if (a("#" + h.themodal).html() !== null) e();
                    else {
                        var b = a("<span><div id='" + f + "' class='searchFilter' style='overflow:auto'></div></span>").insertBefore("#gview_" + c.p.id);
                        if (a.isFunction(d.onInitializeSearch)) d.onInitializeSearch(a("#" + f));
                        var m = a.extend([], c.p.colModel),
                        l = "<a href='javascript:void(0)' id='" + f + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" + d.Find + "</a>",
                        n = "<a href='javascript:void(0)' id='" + f + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" + d.Reset + "</a>",
                        k = "",
                        p = "",
                        o,
                        v = false,
                        q = -1;
                        if (d.showQuery) k = "<a href='javascript:void(0)' id='" + f + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>";
                        if (d.columns.length) m = d.columns;
                        else a.each(m,
                        function(s, x) {
                            if (!x.label) x.label = c.p.colNames[s];
                            if (!v) {
                                var A = typeof x.search === "undefined" ? true: x.search,
                                B = x.hidden === true;
                                if (x.searchoptions && x.searchoptions.searchhidden === true && A || A && !B) {
                                    v = true;
                                    o = x.index || x.name;
                                    q = s
                                }
                            }
                        });
                        if (!j && o || d.multipleSearch === false) {
                            var r = "eq";
                            if (q >= 0 && m[q].searchoptions && m[q].searchoptions.sopt) r = m[q].searchoptions.sopt[0];
                            else if (d.sopt && d.sopt.length) r = d.sopt[0];
                            j = {
                                groupOp: "AND",
                                rules: [{
                                    field: o,
                                    op: r,
                                    data: ""
                                }]
                            }
                        }
                        v = false;
                        if (d.tmplNames && d.tmplNames.length) {
                            v = true;
                            p = d.tmplLabel;
                            p += "<select class='ui-template'>";
                            p += "<option value='default'>Default</option>";
                            a.each(d.tmplNames,
                            function(s, x) {
                                p += "<option value='" + s + "'>" + x + "</option>"
                            });
                            p += "</select>"
                        }
                        l = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + f + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:left'>" + n + p + "</td><td class='EditButton'>" + k + l + "</td></tr></tbody></table>";
                        a("#" + f).jqFilter({
                            columns: m,
                            filter: d.loadDefaults ? j: null,
                            showQuery: d.showQuery,
                            errorcheck: d.errorcheck,
                            sopt: d.sopt,
                            groupButton: d.multipleGroup,
                            ruleButtons: d.multipleSearch,
                            afterRedraw: d.afterRedraw,
                            _gridsopt: a.jgrid.search.odata,
                            onChange: function() {
                                this.p.showQuery && a(".query", this).html(this.toUserFriendlyString())
                            }
                        });
                        b.append(l);
                        v && d.tmplFilters && d.tmplFilters.length && a(".ui-template", b).bind("change",
                        function() {
                            var s = a(this).val();
                            s == "default" ? a("#" + f).jqFilter("addFilter", j) : a("#" + f).jqFilter("addFilter", d.tmplFilters[parseInt(s, 10)]);
                            return false
                        });
                        if (d.multipleGroup === true) d.multipleSearch = true;
                        if (a.isFunction(d.onInitializeSearch)) d.onInitializeSearch(a("#" + f));
                        d.layer ? a.jgrid.createModal(h, b, d, "#gview_" + c.p.id, a("#gbox_" + c.p.id)[0], "#" + d.layer, {
                            position: "relative"
                        }) : a.jgrid.createModal(h, b, d, "#gview_" + c.p.id, a("#gbox_" + c.p.id)[0]);
                        k && a("#" + f + "_query").bind("click",
                        function() {
                            a(".queryresult", b).toggle();
                            return false
                        });
                        if (d.stringResult === undefined) d.stringResult = d.multipleSearch;
                        a("#" + f + "_search").bind("click",
                        function() {
                            var s = a("#" + f),
                            x = {},
                            A,
                            B = s.jqFilter("filterData");
                            if (d.errorcheck) {
                                s[0].hideError();
                                d.showQuery || s.jqFilter("toSQLString");
                                if (s[0].p.error) {
                                    s[0].showError();
                                    return false
                                }
                            }
                            if (d.stringResult) {
                                try {
                                    A = xmlJsonClass.toJson(B, "", "", false)
                                } catch(F) {
                                    try {
                                        A = JSON.stringify(B)
                                    } catch(y) {}
                                }
                                if (typeof A === "string") {
                                    x[d.sFilter] = A;
                                    a.each([d.sField, d.sValue, d.sOper],
                                    function() {
                                        x[this] = ""
                                    })
                                }
                            } else if (d.multipleSearch) {
                                x[d.sFilter] = B;
                                a.each([d.sField, d.sValue, d.sOper],
                                function() {
                                    x[this] = ""
                                })
                            } else {
                                x[d.sField] = B.rules[0].field;
                                x[d.sValue] = B.rules[0].data;
                                x[d.sOper] = B.rules[0].op;
                                x[d.sFilter] = ""
                            }
                            c.p.search = true;
                            a.extend(c.p.postData, x);
                            if (a.isFunction(d.onSearch)) d.onSearch();
                            a(c).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            d.closeAfterSearch && a.jgrid.hideModal("#" + h.themodal, {
                                gb: "#gbox_" + c.p.id,
                                jqm: d.jqModal,
                                onClose: d.onClose
                            });
                            return false
                        });
                        a("#" + f + "_reset").bind("click",
                        function() {
                            var s = {},
                            x = a("#" + f);
                            c.p.search = false;
                            if (d.multipleSearch === false) s[d.sField] = s[d.sValue] = s[d.sOper] = "";
                            else s[d.sFilter] = "";
                            x[0].resetFilter();
                            v && a(".ui-template", b).val("default");
                            a.extend(c.p.postData, s);
                            if (a.isFunction(d.onReset)) d.onReset();
                            a(c).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            return false
                        });
                        e();
                        a(".fm-button:not(.ui-state-disabled)", b).hover(function() {
                            a(this).addClass("ui-state-hover")
                        },
                        function() {
                            a(this).removeClass("ui-state-hover")
                        })
                    }
                }
            })
        },
        editGridRow: function(d, e) {
            var c = e = a.extend({
                top: 0,
                left: 0,
                width: 300,
                height: "auto",
                dataheight: "auto",
                modal: false,
                overlay: 10,
                drag: true,
                resize: true,
                url: null,
                mtype: "POST",
                clearAfterAdd: true,
                closeAfterEdit: false,
                reloadAfterSubmit: true,
                onInitializeForm: null,
                beforeInitData: null,
                beforeShowForm: null,
                afterShowForm: null,
                beforeSubmit: null,
                afterSubmit: null,
                onclickSubmit: null,
                afterComplete: null,
                onclickPgButtons: null,
                afterclickPgButtons: null,
                editData: {},
                recreateForm: false,
                jqModal: true,
                closeOnEscape: false,
                addedrow: "first",
                topinfo: "",
                bottominfo: "",
                saveicon: [],
                closeicon: [],
                savekey: [false, 13],
                navkeys: [false, 38, 40],
                checkOnSubmit: false,
                checkOnUpdate: false,
                _savedData: {},
                processing: false,
                onClose: null,
                ajaxEditOptions: {},
                serializeEditData: null,
                viewPagerButtons: true
            },
            a.jgrid.edit, e || {});
            return this.each(function() {
                function f() {
                    a("#" + r + " > tbody > tr > td > .FormElement").each(function() {
                        var E = a(".customelement", this);
                        if (E.length) {
                            var H = a(E[0]).attr("name");
                            a.each(o.p.colModel,
                            function() {
                                if (this.name === H && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
                                    try {
                                        C[H] = this.editoptions.custom_value(a("#" + a.jgrid.jqID(H), "#" + r), "get");
                                        if (C[H] === undefined) throw "e1";
                                    } catch(M) {
                                        M === "e1" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, M.message, jQuery.jgrid.edit.bClose)
                                    }
                                    return true
                                }
                            })
                        } else {
                            switch (a(this).get(0).type) {
                            case "checkbox":
                                if (a(this).attr("checked")) C[this.name] = a(this).val();
                                else {
                                    E = a(this).attr("offval");
                                    C[this.name] = E
                                }
                                break;
                            case "select-one":
                                C[this.name] = a("option:selected", this).val();
                                R[this.name] = a("option:selected", this).text();
                                break;
                            case "select-multiple":
                                C[this.name] = a(this).val();
                                C[this.name] = C[this.name] ? C[this.name].join(",") : "";
                                var U = [];
                                a("option:selected", this).each(function(M, Q) {
                                    U[M] = a(Q).text()
                                });
                                R[this.name] = U.join(",");
                                break;
                            case "password":
                            case "text":
                            case "textarea":
                            case "button":
                                C[this.name] = a(this).val()
                            }
                            if (o.p.autoencode) C[this.name] = a.jgrid.htmlEncode(C[this.name])
                        }
                    });
                    return true
                }
                function g(E, H, U, M) {
                    var Q, Y, Z, da = 0,
                    V, la, fa, ma = [],
                    ba = false,
                    ta = "",
                    na;
                    for (na = 1; na <= M; na++) ta += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
                    if (E != "_empty") ba = a(H).jqGrid("getInd", E);
                    a(H.p.colModel).each(function(wa) {
                        Q = this.name;
                        la = (Y = this.editrules && this.editrules.edithidden === true ? false: this.hidden === true ? true: false) ? "style='display:none'": "";
                        if (Q !== "cb" && Q !== "subgrid" && this.editable === true && Q !== "rn") {
                            if (ba === false) V = "";
                            else if (Q == H.p.ExpandColumn && H.p.treeGrid === true) V = a("td:eq(" + wa + ")", H.rows[ba]).text();
                            else {
                                try {
                                    V = a.unformat(a("td:eq(" + wa + ")", H.rows[ba]), {
                                        rowId: E,
                                        colModel: this
                                    },
                                    wa)
                                } catch(u) {
                                    V = this.edittype && this.edittype == "textarea" ? a("td:eq(" + wa + ")", H.rows[ba]).text() : a("td:eq(" + wa + ")", H.rows[ba]).html()
                                }
                                if (!V || V == "&nbsp;" || V == "&#160;" || V.length == 1 && V.charCodeAt(0) == 160) V = ""
                            }
                            var t = a.extend({},
                            this.editoptions || {},
                            {
                                id: Q,
                                name: Q
                            }),
                            w = a.extend({},
                            {
                                elmprefix: "",
                                elmsuffix: "",
                                rowabove: false,
                                rowcontent: ""
                            },
                            this.formoptions || {}),
                            z = parseInt(w.rowpos, 10) || da + 1,
                            D = parseInt((parseInt(w.colpos, 10) || 1) * 2, 10);
                            if (E == "_empty" && t.defaultValue) V = a.isFunction(t.defaultValue) ? t.defaultValue() : t.defaultValue;
                            if (!this.edittype) this.edittype = "text";
                            if (o.p.autoencode) V = a.jgrid.htmlDecode(V);
                            fa = a.jgrid.createEl(this.edittype, t, V, false, a.extend({},
                            a.jgrid.ajaxOptions, H.p.ajaxSelectOptions || {}));
                            if (V === "" && this.edittype == "checkbox") V = a(fa).attr("offval");
                            if (V === "" && this.edittype == "select") V = a("option:eq(0)", fa).text();
                            if (c.checkOnSubmit || c.checkOnUpdate) c._savedData[Q] = V;
                            a(fa).addClass("FormElement");
                            if (this.edittype == "text" || this.edittype == "textarea") a(fa).addClass("ui-widget-content ui-corner-all");
                            Z = a(U).find("tr[rowpos=" + z + "]");
                            if (w.rowabove) {
                                t = a("<tr><td class='contentinfo' colspan='" + M * 2 + "'>" + w.rowcontent + "</td></tr>");
                                a(U).append(t);
                                t[0].rp = z
                            }
                            if (Z.length === 0) {
                                Z = a("<tr " + la + " rowpos='" + z + "'></tr>").addClass("FormData").attr("id", "tr_" + Q);
                                a(Z).append(ta);
                                a(U).append(Z);
                                Z[0].rp = z
                            }
                            a("td:eq(" + (D - 2) + ")", Z[0]).html(typeof w.label === "undefined" ? H.p.colNames[wa] : w.label);
                            a("td:eq(" + (D - 1) + ")", Z[0]).append(w.elmprefix).append(fa).append(w.elmsuffix);
                            ma[da] = wa;
                            da++
                        }
                    });
                    if (da > 0) {
                        na = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (M * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + H.p.id + "_id' value='" + E + "'/></td></tr>");
                        na[0].rp = da + 999;
                        a(U).append(na);
                        if (c.checkOnSubmit || c.checkOnUpdate) c._savedData[H.p.id + "_id"] = E
                    }
                    return ma
                }
                function h(E, H, U) {
                    var M, Q = 0,
                    Y, Z, da, V, la;
                    if (c.checkOnSubmit || c.checkOnUpdate) {
                        c._savedData = {};
                        c._savedData[H.p.id + "_id"] = E
                    }
                    var fa = H.p.colModel;
                    if (E == "_empty") {
                        a(fa).each(function() {
                            M = this.name;
                            da = a.extend({},
                            this.editoptions || {});
                            if ((Z = a("#" + a.jgrid.jqID(M), "#" + U)) && Z.length && Z[0] !== null) {
                                V = "";
                                if (da.defaultValue) {
                                    V = a.isFunction(da.defaultValue) ? da.defaultValue() : da.defaultValue;
                                    if (Z[0].type == "checkbox") {
                                        la = V.toLowerCase();
                                        if (la.search(/(false|0|no|off|undefined)/i) < 0 && la !== "") {
                                            Z[0].checked = true;
                                            Z[0].defaultChecked = true;
                                            Z[0].value = V
                                        } else Z.attr({
                                            checked: "",
                                            defaultChecked: ""
                                        })
                                    } else Z.val(V)
                                } else if (Z[0].type == "checkbox") {
                                    Z[0].checked = false;
                                    Z[0].defaultChecked = false;
                                    V = a(Z).attr("offval")
                                } else if (Z[0].type && Z[0].type.substr(0, 6) == "select") Z[0].selectedIndex = 0;
                                else Z.val(V);
                                if (c.checkOnSubmit === true || c.checkOnUpdate) c._savedData[M] = V
                            }
                        });
                        a("#id_g", "#" + U).val(E)
                    } else {
                        var ma = a(H).jqGrid("getInd", E, true);
                        if (ma) {
                            a("td", ma).each(function(ba) {
                                M = fa[ba].name;
                                if (M !== "cb" && M !== "subgrid" && M !== "rn" && fa[ba].editable === true) {
                                    if (M == H.p.ExpandColumn && H.p.treeGrid === true) Y = a(this).text();
                                    else try {
                                        Y = a.unformat(a(this), {
                                            rowId: E,
                                            colModel: fa[ba]
                                        },
                                        ba)
                                    } catch(ta) {
                                        Y = fa[ba].edittype == "textarea" ? a(this).text() : a(this).html()
                                    }
                                    if (o.p.autoencode) Y = a.jgrid.htmlDecode(Y);
                                    if (c.checkOnSubmit === true || c.checkOnUpdate) c._savedData[M] = Y;
                                    M = a.jgrid.jqID(M);
                                    switch (fa[ba].edittype) {
                                    case "password":
                                    case "text":
                                    case "button":
                                    case "image":
                                    case "textarea":
                                        if (Y == "&nbsp;" || Y == "&#160;" || Y.length == 1 && Y.charCodeAt(0) == 160) Y = "";
                                        a("#" + M, "#" + U).val(Y);
                                        break;
                                    case "select":
                                        var na = Y.split(",");
                                        na = a.map(na,
                                        function(u) {
                                            return a.trim(u)
                                        });
                                        a("#" + M + " option", "#" + U).each(function() {
                                            this.selected = !fa[ba].editoptions.multiple && (na[0] == a.trim(a(this).text()) || na[0] == a.trim(a(this).val())) ? true: fa[ba].editoptions.multiple ? a.inArray(a.trim(a(this).text()), na) > -1 || a.inArray(a.trim(a(this).val()), na) > -1 ? true: false: false
                                        });
                                        break;
                                    case "checkbox":
                                        Y += "";
                                        if (fa[ba].editoptions && fa[ba].editoptions.value) if (fa[ba].editoptions.value.split(":")[0] == Y) {
                                            a("#" + M, "#" + U).attr("checked", true);
                                            a("#" + M, "#" + U).attr("defaultChecked", true)
                                        } else {
                                            a("#" + M, "#" + U).attr("checked", false);
                                            a("#" + M, "#" + U).attr("defaultChecked", "")
                                        } else {
                                            Y = Y.toLowerCase();
                                            if (Y.search(/(false|0|no|off|undefined)/i) < 0 && Y !== "") {
                                                a("#" + M, "#" + U).attr("checked", true);
                                                a("#" + M, "#" + U).attr("defaultChecked", true)
                                            } else {
                                                a("#" + M, "#" + U).attr("checked", false);
                                                a("#" + M, "#" + U).attr("defaultChecked", "")
                                            }
                                        }
                                        break;
                                    case "custom":
                                        try {
                                            if (fa[ba].editoptions && a.isFunction(fa[ba].editoptions.custom_value)) fa[ba].editoptions.custom_value(a("#" + M, "#" + U), "set", Y);
                                            else throw "e1";
                                        } catch(wa) {
                                            wa == "e1" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, wa.message, jQuery.jgrid.edit.bClose)
                                        }
                                    }
                                    Q++
                                }
                            });
                            Q > 0 && a("#id_g", "#" + r).val(E)
                        }
                    }
                }
                function j() {
                    var E, H = [true, "", ""],
                    U = {},
                    M = o.p.prmNames,
                    Q,
                    Y,
                    Z,
                    da;
                    if (a.isFunction(c.beforeCheckValues)) {
                        var V = c.beforeCheckValues(C, a("#" + q), C[o.p.id + "_id"] == "_empty" ? M.addoper: M.editoper);
                        if (V && typeof V === "object") C = V
                    }
                    for (Z in C) if (C.hasOwnProperty(Z)) {
                        H = a.jgrid.checkValues(C[Z], Z, o);
                        if (H[0] === false) break
                    }
                    if (H[0]) {
                        if (a.isFunction(c.onclickSubmit)) U = c.onclickSubmit(c, C) || {};
                        if (a.isFunction(c.beforeSubmit)) H = c.beforeSubmit(C, a("#" + q))
                    }
                    if (H[0] && !c.processing) {
                        c.processing = true;
                        a("#sData", "#" + r + "_2").addClass("ui-state-active");
                        Y = M.oper;
                        Q = M.id;
                        C[Y] = a.trim(C[o.p.id + "_id"]) == "_empty" ? M.addoper: M.editoper;
                        if (C[Y] != M.addoper) C[Q] = C[o.p.id + "_id"];
                        else if (C[Q] === undefined) C[Q] = C[o.p.id + "_id"];
                        delete C[o.p.id + "_id"];
                        C = a.extend(C, c.editData, U);
                        if (o.p.treeGrid === true) {
                            if (C[Y] == M.addoper) {
                                da = a(o).jqGrid("getGridParam", "selrow");
                                C[o.p.treeGridModel == "adjacency" ? o.p.treeReader.parent_id_field: "parent_id"] = da
                            }
                            for (i in o.p.treeReader) {
                                U = o.p.treeReader[i];
                                if (C.hasOwnProperty(U)) C[Y] == M.addoper && i === "parent_id_field" || delete C[U]
                            }
                        }
                        U = a.extend({
                            url: c.url ? c.url: a(o).jqGrid("getGridParam", "editurl"),
                            type: c.mtype,
                            data: a.isFunction(c.serializeEditData) ? c.serializeEditData(C) : C,
                            complete: function(la, fa) {
                                if (fa != "success") {
                                    H[0] = false;
                                    H[1] = a.isFunction(c.errorTextFormat) ? c.errorTextFormat(la) : fa + " Status: '" + la.statusText + "'. Error code: " + la.status
                                } else if (a.isFunction(c.afterSubmit)) H = c.afterSubmit(la, C);
                                if (H[0] === false) {
                                    a("#FormError>td", "#" + r).html(H[1]);
                                    a("#FormError", "#" + r).show()
                                } else {
                                    a.each(o.p.colModel,
                                    function() {
                                        if (R[this.name] && this.formatter && this.formatter == "select") try {
                                            delete R[this.name]
                                        } catch(ta) {}
                                    });
                                    C = a.extend(C, R);
                                    o.p.autoencode && a.each(C,
                                    function(ta, na) {
                                        C[ta] = a.jgrid.htmlDecode(na)
                                    });
                                    c.reloadAfterSubmit = c.reloadAfterSubmit && o.p.datatype != "local";
                                    if (C[Y] == M.addoper) {
                                        H[2] || (H[2] = a.jgrid.randId());
                                        C[Q] = H[2];
                                        if (c.closeAfterAdd) {
                                            if (c.reloadAfterSubmit) a(o).trigger("reloadGrid");
                                            else if (o.p.treeGrid === true) a(o).jqGrid("addChildNode", H[2], da, C);
                                            else {
                                                a(o).jqGrid("addRowData", H[2], C, e.addedrow);
                                                a(o).jqGrid("setSelection", H[2])
                                            }
                                            a.jgrid.hideModal("#" + s.themodal, {
                                                gb: "#gbox_" + v,
                                                jqm: e.jqModal,
                                                onClose: c.onClose
                                            })
                                        } else if (c.clearAfterAdd) {
                                            if (c.reloadAfterSubmit) a(o).trigger("reloadGrid");
                                            else o.p.treeGrid === true ? a(o).jqGrid("addChildNode", H[2], da, C) : a(o).jqGrid("addRowData", H[2], C, e.addedrow);
                                            h("_empty", o, q)
                                        } else if (c.reloadAfterSubmit) a(o).trigger("reloadGrid");
                                        else o.p.treeGrid === true ? a(o).jqGrid("addChildNode", H[2], da, C) : a(o).jqGrid("addRowData", H[2], C, e.addedrow)
                                    } else {
                                        if (c.reloadAfterSubmit) {
                                            a(o).trigger("reloadGrid");
                                            c.closeAfterEdit || setTimeout(function() {
                                                a(o).jqGrid("setSelection", C[Q])
                                            },
                                            1E3)
                                        } else o.p.treeGrid === true ? a(o).jqGrid("setTreeRow", C[Q], C) : a(o).jqGrid("setRowData", C[Q], C);
                                        c.closeAfterEdit && a.jgrid.hideModal("#" + s.themodal, {
                                            gb: "#gbox_" + v,
                                            jqm: e.jqModal,
                                            onClose: c.onClose
                                        })
                                    }
                                    if (a.isFunction(c.afterComplete)) {
                                        E = la;
                                        setTimeout(function() {
                                            c.afterComplete(E, C, a("#" + q));
                                            E = null
                                        },
                                        500)
                                    }
                                    if (c.checkOnSubmit || c.checkOnUpdate) {
                                        a("#" + q).data("disabled", false);
                                        if (c._savedData[o.p.id + "_id"] != "_empty") for (var ma in c._savedData) if (C[ma]) c._savedData[ma] = C[ma]
                                    }
                                }
                                c.processing = false;
                                a("#sData", "#" + r + "_2").removeClass("ui-state-active");
                                try {
                                    a(":input:visible", "#" + q)[0].focus()
                                } catch(ba) {}
                            }
                        },
                        a.jgrid.ajaxOptions, c.ajaxEditOptions);
                        if (!U.url && !c.useDataProxy) if (a.isFunction(o.p.dataProxy)) c.useDataProxy = true;
                        else {
                            H[0] = false;
                            H[1] += " " + a.jgrid.errors.nourl
                        }
                        if (H[0]) c.useDataProxy ? o.p.dataProxy.call(o, U, "set_" + o.p.id) : a.ajax(U)
                    }
                    if (H[0] === false) {
                        a("#FormError>td", "#" + r).html(H[1]);
                        a("#FormError", "#" + r).show()
                    }
                }
                function b(E, H) {
                    var U = false,
                    M;
                    for (M in E) if (E[M] != H[M]) {
                        U = true;
                        break
                    }
                    return U
                }
                function m() {
                    a.each(o.p.colModel,
                    function(E, H) {
                        if (H.editoptions && H.editoptions.NullIfEmpty === true) if (C.hasOwnProperty(H.name) && C[H.name] == "") C[H.name] = "null"
                    })
                }
                function l() {
                    var E = true;
                    a("#FormError", "#" + r).hide();
                    if (c.checkOnUpdate) {
                        C = {};
                        R = {};
                        f();
                        ca = a.extend({},
                        C, R);
                        if (ka = b(ca, c._savedData)) {
                            a("#" + q).data("disabled", true);
                            a(".confirm", "#" + s.themodal).show();
                            E = false
                        } else m()
                    }
                    return E
                }
                function n() {
                    if (d !== "_empty" && typeof o.p.savedRow !== "undefined" && o.p.savedRow.length > 0 && a.isFunction(a.fn.jqGrid.restoreRow)) for (var E = 0; E < o.p.savedRow.length; E++) if (o.p.savedRow[E].id == d) {
                        a(o).jqGrid("restoreRow", d);
                        break
                    }
                }
                function k(E, H) {
                    E === 0 ? a("#pData", "#" + r + "_2").addClass("ui-state-disabled") : a("#pData", "#" + r + "_2").removeClass("ui-state-disabled");
                    E == H ? a("#nData", "#" + r + "_2").addClass("ui-state-disabled") : a("#nData", "#" + r + "_2").removeClass("ui-state-disabled")
                }
                function p() {
                    var E = a(o).jqGrid("getDataIDs"),
                    H = a("#id_g", "#" + r).val();
                    return [a.inArray(H, E), E]
                }
                var o = this;
                if (o.grid && d) {
                    var v = o.p.id,
                    q = "FrmGrid_" + v,
                    r = "TblGrid_" + v,
                    s = {
                        themodal: "editmod" + v,
                        modalhead: "edithd" + v,
                        modalcontent: "editcnt" + v,
                        scrollelm: q
                    },
                    x = a.isFunction(c.beforeShowForm) ? c.beforeShowForm: false,
                    A = a.isFunction(c.afterShowForm) ? c.afterShowForm: false,
                    B = a.isFunction(c.beforeInitData) ? c.beforeInitData: false,
                    F = a.isFunction(c.onInitializeForm) ? c.onInitializeForm: false,
                    y = true,
                    G = 1,
                    S = 0,
                    C,
                    R,
                    ca,
                    ka;
                    if (d === "new") {
                        d = "_empty";
                        e.caption = c.addCaption
                    } else e.caption = c.editCaption;
                    e.recreateForm === true && a("#" + s.themodal).html() !== null && a("#" + s.themodal).remove();
                    var ia = true;
                    if (e.checkOnUpdate && e.jqModal && !e.modal) ia = false;
                    if (a("#" + s.themodal).html() !== null) {
                        if (B) {
                            y = B(a("#" + q));
                            if (typeof y == "undefined") y = true
                        }
                        if (y === false) return;
                        n();
                        a(".ui-jqdialog-title", "#" + s.modalhead).html(e.caption);
                        a("#FormError", "#" + r).hide();
                        if (c.topinfo) {
                            a(".topinfo", "#" + r + "_2").html(c.topinfo);
                            a(".tinfo", "#" + r + "_2").show()
                        } else a(".tinfo", "#" + r + "_2").hide();
                        if (c.bottominfo) {
                            a(".bottominfo", "#" + r + "_2").html(c.bottominfo);
                            a(".binfo", "#" + r + "_2").show()
                        } else a(".binfo", "#" + r + "_2").hide();
                        h(d, o, q);
                        d == "_empty" || !c.viewPagerButtons ? a("#pData, #nData", "#" + r + "_2").hide() : a("#pData, #nData", "#" + r + "_2").show();
                        if (c.processing === true) {
                            c.processing = false;
                            a("#sData", "#" + r + "_2").removeClass("ui-state-active")
                        }
                        if (a("#" + q).data("disabled") === true) {
                            a(".confirm", "#" + s.themodal).hide();
                            a("#" + q).data("disabled", false)
                        }
                        x && x(a("#" + q));
                        a("#" + s.themodal).data("onClose", c.onClose);
                        a.jgrid.viewModal("#" + s.themodal, {
                            gbox: "#gbox_" + v,
                            jqm: e.jqModal,
                            jqM: false,
                            overlay: e.overlay,
                            modal: e.modal
                        });
                        ia || a(".jqmOverlay").click(function() {
                            if (!l()) return false;
                            a.jgrid.hideModal("#" + s.themodal, {
                                gb: "#gbox_" + v,
                                jqm: e.jqModal,
                                onClose: c.onClose
                            });
                            return false
                        });
                        A && A(a("#" + q))
                    } else {
                        var qa = isNaN(e.dataheight) ? e.dataheight: e.dataheight + "px";
                        qa = a("<form name='FormPost' id='" + q + "' class='FormGrid' onSubmit='return false;' style='width:100%;overflow:auto;position:relative;height:" + qa + ";'></form>").data("disabled", false);
                        var xa = a("<table id='" + r + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>");
                        if (B) {
                            y = B(a("#" + q));
                            if (typeof y == "undefined") y = true
                        }
                        if (y === false) return;
                        n();
                        a(o.p.colModel).each(function() {
                            var E = this.formoptions;
                            G = Math.max(G, E ? E.colpos || 0 : 0);
                            S = Math.max(S, E ? E.rowpos || 0 : 0)
                        });
                        a(qa).append(xa);
                        B = a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + G * 2 + "'></td></tr>");
                        B[0].rp = 0;
                        a(xa).append(B);
                        B = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + G * 2 + "'>" + c.topinfo + "</td></tr>");
                        B[0].rp = 0;
                        a(xa).append(B);
                        y = (B = o.p.direction == "rtl" ? true: false) ? "nData": "pData";
                        var Aa = B ? "pData": "nData";
                        g(d, o, xa, G);
                        y = "<a href='javascript:void(0)' id='" + y + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
                        Aa = "<a href='javascript:void(0)' id='" + Aa + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>";
                        var Ba = "<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>" + e.bSubmit + "</a>",
                        pa = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + e.bCancel + "</a>";
                        y = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + r + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" + (B ? Aa + y: y + Aa) + "</td><td class='EditButton'>" + Ba + pa + "</td></tr>";
                        y += "<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + c.bottominfo + "</td></tr>";
                        y += "</tbody></table>";
                        if (S > 0) {
                            var Ca = [];
                            a.each(a(xa)[0].rows,
                            function(E, H) {
                                Ca[E] = H
                            });
                            Ca.sort(function(E, H) {
                                if (E.rp > H.rp) return 1;
                                if (E.rp < H.rp) return - 1;
                                return 0
                            });
                            a.each(Ca,
                            function(E, H) {
                                a("tbody", xa).append(H)
                            })
                        }
                        e.gbox = "#gbox_" + v;
                        var va = false;
                        if (e.closeOnEscape === true) {
                            e.closeOnEscape = false;
                            va = true
                        }
                        qa = a("<span></span>").append(qa).append(y);
                        a.jgrid.createModal(s, qa, e, "#gview_" + o.p.id, a("#gbox_" + o.p.id)[0]);
                        if (B) {
                            a("#pData, #nData", "#" + r + "_2").css("float", "right");
                            a(".EditButton", "#" + r + "_2").css("text-align", "left")
                        }
                        c.topinfo && a(".tinfo", "#" + r + "_2").show();
                        c.bottominfo && a(".binfo", "#" + r + "_2").show();
                        y = qa = null;
                        a("#" + s.themodal).keydown(function(E) {
                            var H = E.target;
                            if (a("#" + q).data("disabled") === true) return false;
                            if (c.savekey[0] === true && E.which == c.savekey[1]) if (H.tagName != "TEXTAREA") {
                                a("#sData", "#" + r + "_2").trigger("click");
                                return false
                            }
                            if (E.which === 27) {
                                if (!l()) return false;
                                va && a.jgrid.hideModal(this, {
                                    gb: e.gbox,
                                    jqm: e.jqModal,
                                    onClose: c.onClose
                                });
                                return false
                            }
                            if (c.navkeys[0] === true) {
                                if (a("#id_g", "#" + r).val() == "_empty") return true;
                                if (E.which == c.navkeys[1]) {
                                    a("#pData", "#" + r + "_2").trigger("click");
                                    return false
                                }
                                if (E.which == c.navkeys[2]) {
                                    a("#nData", "#" + r + "_2").trigger("click");
                                    return false
                                }
                            }
                        });
                        if (e.checkOnUpdate) {
                            a("a.ui-jqdialog-titlebar-close span", "#" + s.themodal).removeClass("jqmClose");
                            a("a.ui-jqdialog-titlebar-close", "#" + s.themodal).unbind("click").click(function() {
                                if (!l()) return false;
                                a.jgrid.hideModal("#" + s.themodal, {
                                    gb: "#gbox_" + v,
                                    jqm: e.jqModal,
                                    onClose: c.onClose
                                });
                                return false
                            })
                        }
                        e.saveicon = a.extend([true, "left", "ui-icon-disk"], e.saveicon);
                        e.closeicon = a.extend([true, "left", "ui-icon-close"], e.closeicon);
                        if (e.saveicon[0] === true) a("#sData", "#" + r + "_2").addClass(e.saveicon[1] == "right" ? "fm-button-icon-right": "fm-button-icon-left").append("<span class='ui-icon " + e.saveicon[2] + "'></span>");
                        if (e.closeicon[0] === true) a("#cData", "#" + r + "_2").addClass(e.closeicon[1] == "right" ? "fm-button-icon-right": "fm-button-icon-left").append("<span class='ui-icon " + e.closeicon[2] + "'></span>");
                        if (c.checkOnSubmit || c.checkOnUpdate) {
                            Ba = "<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + e.bYes + "</a>";
                            Aa = "<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + e.bNo + "</a>";
                            pa = "<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + e.bExit + "</a>";
                            qa = e.zIndex || 999;
                            qa++;
                            a("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:" + qa + ";display:none;'>&#160;" + (a.browser.msie && a.browser.version == 6 ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>': "") + "</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" + (qa + 1) + "'>" + e.saveData + "<br/><br/>" + Ba + Aa + pa + "</div>").insertAfter("#" + q);
                            a("#sNew", "#" + s.themodal).click(function() {
                                j();
                                a("#" + q).data("disabled", false);
                                a(".confirm", "#" + s.themodal).hide();
                                return false
                            });
                            a("#nNew", "#" + s.themodal).click(function() {
                                a(".confirm", "#" + s.themodal).hide();
                                a("#" + q).data("disabled", false);
                                setTimeout(function() {
                                    a(":input", "#" + q)[0].focus()
                                },
                                0);
                                return false
                            });
                            a("#cNew", "#" + s.themodal).click(function() {
                                a(".confirm", "#" + s.themodal).hide();
                                a("#" + q).data("disabled", false);
                                a.jgrid.hideModal("#" + s.themodal, {
                                    gb: "#gbox_" + v,
                                    jqm: e.jqModal,
                                    onClose: c.onClose
                                });
                                return false
                            })
                        }
                        F && F(a("#" + q));
                        d == "_empty" || !c.viewPagerButtons ? a("#pData,#nData", "#" + r + "_2").hide() : a("#pData,#nData", "#" + r + "_2").show();
                        x && x(a("#" + q));
                        a("#" + s.themodal).data("onClose", c.onClose);
                        a.jgrid.viewModal("#" + s.themodal, {
                            gbox: "#gbox_" + v,
                            jqm: e.jqModal,
                            overlay: e.overlay,
                            modal: e.modal
                        });
                        ia || a(".jqmOverlay").click(function() {
                            if (!l()) return false;
                            a.jgrid.hideModal("#" + s.themodal, {
                                gb: "#gbox_" + v,
                                jqm: e.jqModal,
                                onClose: c.onClose
                            });
                            return false
                        });
                        A && A(a("#" + q));
                        a(".fm-button", "#" + s.themodal).hover(function() {
                            a(this).addClass("ui-state-hover")
                        },
                        function() {
                            a(this).removeClass("ui-state-hover")
                        });
                        a("#sData", "#" + r + "_2").click(function() {
                            C = {};
                            R = {};
                            a("#FormError", "#" + r).hide();
                            f();
                            m();
                            if (C[o.p.id + "_id"] == "_empty") j();
                            else if (e.checkOnSubmit === true) {
                                ca = a.extend({},
                                C, R);
                                if (ka = b(ca, c._savedData)) {
                                    a("#" + q).data("disabled", true);
                                    a(".confirm", "#" + s.themodal).show()
                                } else j()
                            } else j();
                            return false
                        });
                        a("#cData", "#" + r + "_2").click(function() {
                            if (!l()) return false;
                            a.jgrid.hideModal("#" + s.themodal, {
                                gb: "#gbox_" + v,
                                jqm: e.jqModal,
                                onClose: c.onClose
                            });
                            return false
                        });
                        a("#nData", "#" + r + "_2").click(function() {
                            if (!l()) return false;
                            a("#FormError", "#" + r).hide();
                            var E = p();
                            E[0] = parseInt(E[0], 10);
                            if (E[0] != -1 && E[1][E[0] + 1]) {
                                if (a.isFunction(e.onclickPgButtons)) e.onclickPgButtons("next", a("#" + q), E[1][E[0]]);
                                h(E[1][E[0] + 1], o, q);
                                a(o).jqGrid("setSelection", E[1][E[0] + 1]);
                                a.isFunction(e.afterclickPgButtons) && e.afterclickPgButtons("next", a("#" + q), E[1][E[0] + 1]);
                                k(E[0] + 1, E[1].length - 1)
                            }
                            return false
                        });
                        a("#pData", "#" + r + "_2").click(function() {
                            if (!l()) return false;
                            a("#FormError", "#" + r).hide();
                            var E = p();
                            if (E[0] != -1 && E[1][E[0] - 1]) {
                                if (a.isFunction(e.onclickPgButtons)) e.onclickPgButtons("prev", a("#" + q), E[1][E[0]]);
                                h(E[1][E[0] - 1], o, q);
                                a(o).jqGrid("setSelection", E[1][E[0] - 1]);
                                a.isFunction(e.afterclickPgButtons) && e.afterclickPgButtons("prev", a("#" + q), E[1][E[0] - 1]);
                                k(E[0] - 1, E[1].length - 1)
                            }
                            return false
                        })
                    }
                    x = p();
                    k(x[0], x[1].length - 1)
                }
            })
        },
        viewGridRow: function(d, e) {
            e = a.extend({
                top: 0,
                left: 0,
                width: 0,
                height: "auto",
                dataheight: "auto",
                modal: false,
                overlay: 10,
                drag: true,
                resize: true,
                jqModal: true,
                closeOnEscape: false,
                labelswidth: "30%",
                closeicon: [],
                navkeys: [false, 38, 40],
                onClose: null,
                beforeShowForm: null,
                beforeInitData: null,
                viewPagerButtons: true
            },
            a.jgrid.view, e || {});
            return this.each(function() {
                function c() {
                    if (e.closeOnEscape === true || e.navkeys[0] === true) setTimeout(function() {
                        a(".ui-jqdialog-titlebar-close", "#" + k.modalhead).focus()
                    },
                    0)
                }
                function f(y, G, S, C) {
                    for (var R, ca, ka, ia = 0,
                    qa, xa, Aa = [], Ba = false, pa = "<td class='CaptionTD form-view-label ui-widget-content' width='" + e.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>", Ca = "", va = ["integer", "number", "currency"], E = 0, H = 0, U, M, Q, Y = 1; Y <= C; Y++) Ca += Y == 1 ? pa: "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>";
                    a(G.p.colModel).each(function() {
                        ca = this.editrules && this.editrules.edithidden === true ? false: this.hidden === true ? true: false;
                        if (!ca && this.align === "right") if (this.formatter && a.inArray(this.formatter, va) !== -1) E = Math.max(E, parseInt(this.width, 10));
                        else H = Math.max(H, parseInt(this.width, 10))
                    });
                    U = E !== 0 ? E: H !== 0 ? H: 0;
                    Ba = a(G).jqGrid("getInd", y);
                    a(G.p.colModel).each(function(Z) {
                        R = this.name;
                        M = false;
                        xa = (ca = this.editrules && this.editrules.edithidden === true ? false: this.hidden === true ? true: false) ? "style='display:none'": "";
                        Q = typeof this.viewable != "boolean" ? true: this.viewable;
                        if (R !== "cb" && R !== "subgrid" && R !== "rn" && Q) {
                            qa = Ba === false ? "": R == G.p.ExpandColumn && G.p.treeGrid === true ? a("td:eq(" + Z + ")", G.rows[Ba]).text() : a("td:eq(" + Z + ")", G.rows[Ba]).html();
                            M = this.align === "right" && U !== 0 ? true: false;
                            a.extend({},
                            this.editoptions || {},
                            {
                                id: R,
                                name: R
                            });
                            var da = a.extend({},
                            {
                                rowabove: false,
                                rowcontent: ""
                            },
                            this.formoptions || {}),
                            V = parseInt(da.rowpos, 10) || ia + 1,
                            la = parseInt((parseInt(da.colpos, 10) || 1) * 2, 10);
                            if (da.rowabove) {
                                var fa = a("<tr><td class='contentinfo' colspan='" + C * 2 + "'>" + da.rowcontent + "</td></tr>");
                                a(S).append(fa);
                                fa[0].rp = V
                            }
                            ka = a(S).find("tr[rowpos=" + V + "]");
                            if (ka.length === 0) {
                                ka = a("<tr " + xa + " rowpos='" + V + "'></tr>").addClass("FormData").attr("id", "trv_" + R);
                                a(ka).append(Ca);
                                a(S).append(ka);
                                ka[0].rp = V
                            }
                            a("td:eq(" + (la - 2) + ")", ka[0]).html("<b>" + (typeof da.label === "undefined" ? G.p.colNames[Z] : da.label) + "</b>");
                            a("td:eq(" + (la - 1) + ")", ka[0]).append("<span>" + qa + "</span>").attr("id", "v_" + R);
                            M && a("td:eq(" + (la - 1) + ") span", ka[0]).css({
                                "text-align": "right",
                                width: U + "px"
                            });
                            Aa[ia] = Z;
                            ia++
                        }
                    });
                    if (ia > 0) {
                        y = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (C * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + y + "'/></td></tr>");
                        y[0].rp = ia + 99;
                        a(S).append(y)
                    }
                    return Aa
                }
                function g(y, G) {
                    var S, C, R = 0,
                    ca, ka;
                    if (ka = a(G).jqGrid("getInd", y, true)) {
                        a("td", ka).each(function(ia) {
                            S = G.p.colModel[ia].name;
                            C = G.p.colModel[ia].editrules && G.p.colModel[ia].editrules.edithidden === true ? false: G.p.colModel[ia].hidden === true ? true: false;
                            if (S !== "cb" && S !== "subgrid" && S !== "rn") {
                                ca = S == G.p.ExpandColumn && G.p.treeGrid === true ? a(this).text() : a(this).html();
                                a.extend({},
                                G.p.colModel[ia].editoptions || {});
                                S = a.jgrid.jqID("v_" + S);
                                a("#" + S + " span", "#" + n).html(ca);
                                C && a("#" + S, "#" + n).parents("tr:first").hide();
                                R++
                            }
                        });
                        R > 0 && a("#id_g", "#" + n).val(y)
                    }
                }
                function h(y, G) {
                    y === 0 ? a("#pData", "#" + n + "_2").addClass("ui-state-disabled") : a("#pData", "#" + n + "_2").removeClass("ui-state-disabled");
                    y == G ? a("#nData", "#" + n + "_2").addClass("ui-state-disabled") : a("#nData", "#" + n + "_2").removeClass("ui-state-disabled")
                }
                function j() {
                    var y = a(b).jqGrid("getDataIDs"),
                    G = a("#id_g", "#" + n).val();
                    return [a.inArray(G, y), y]
                }
                var b = this;
                if (b.grid && d) {
                    if (!e.imgpath) e.imgpath = b.p.imgpath;
                    var m = b.p.id,
                    l = "ViewGrid_" + m,
                    n = "ViewTbl_" + m,
                    k = {
                        themodal: "viewmod" + m,
                        modalhead: "viewhd" + m,
                        modalcontent: "viewcnt" + m,
                        scrollelm: l
                    },
                    p = a.isFunction(e.beforeInitData) ? e.beforeInitData: false,
                    o = true,
                    v = 1,
                    q = 0;
                    if (a("#" + k.themodal).html() !== null) {
                        if (p) {
                            o = p(a("#" + l));
                            if (typeof o == "undefined") o = true
                        }
                        if (o === false) return;
                        a(".ui-jqdialog-title", "#" + k.modalhead).html(e.caption);
                        a("#FormError", "#" + n).hide();
                        g(d, b);
                        a.isFunction(e.beforeShowForm) && e.beforeShowForm(a("#" + l));
                        a.jgrid.viewModal("#" + k.themodal, {
                            gbox: "#gbox_" + m,
                            jqm: e.jqModal,
                            jqM: false,
                            overlay: e.overlay,
                            modal: e.modal
                        });
                        c()
                    } else {
                        var r = isNaN(e.dataheight) ? e.dataheight: e.dataheight + "px";
                        r = a("<form name='FormPost' id='" + l + "' class='FormGrid' style='width:100%;overflow:auto;position:relative;height:" + r + ";'></form>");
                        var s = a("<table id='" + n + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
                        if (p) {
                            o = p(a("#" + l));
                            if (typeof o == "undefined") o = true
                        }
                        if (o === false) return;
                        a(b.p.colModel).each(function() {
                            var y = this.formoptions;
                            v = Math.max(v, y ? y.colpos || 0 : 0);
                            q = Math.max(q, y ? y.rowpos || 0 : 0)
                        });
                        a(r).append(s);
                        f(d, b, s, v);
                        p = b.p.direction == "rtl" ? true: false;
                        o = "<a href='javascript:void(0)' id='" + (p ? "nData": "pData") + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
                        var x = "<a href='javascript:void(0)' id='" + (p ? "pData": "nData") + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
                        A = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + e.bClose + "</a>";
                        if (q > 0) {
                            var B = [];
                            a.each(a(s)[0].rows,
                            function(y, G) {
                                B[y] = G
                            });
                            B.sort(function(y, G) {
                                if (y.rp > G.rp) return 1;
                                if (y.rp < G.rp) return - 1;
                                return 0
                            });
                            a.each(B,
                            function(y, G) {
                                a("tbody", s).append(G)
                            })
                        }
                        e.gbox = "#gbox_" + m;
                        var F = false;
                        if (e.closeOnEscape === true) {
                            e.closeOnEscape = false;
                            F = true
                        }
                        r = a("<span></span>").append(r).append("<table border='0' class='EditTable' id='" + n + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" + e.labelswidth + "'>" + (p ? x + o: o + x) + "</td><td class='EditButton'>" + A + "</td></tr></tbody></table>");
                        a.jgrid.createModal(k, r, e, "#gview_" + b.p.id, a("#gview_" + b.p.id)[0]);
                        if (p) {
                            a("#pData, #nData", "#" + n + "_2").css("float", "right");
                            a(".EditButton", "#" + n + "_2").css("text-align", "left")
                        }
                        e.viewPagerButtons || a("#pData, #nData", "#" + n + "_2").hide();
                        r = null;
                        a("#" + k.themodal).keydown(function(y) {
                            if (y.which === 27) {
                                F && a.jgrid.hideModal(this, {
                                    gb: e.gbox,
                                    jqm: e.jqModal,
                                    onClose: e.onClose
                                });
                                return false
                            }
                            if (e.navkeys[0] === true) {
                                if (y.which === e.navkeys[1]) {
                                    a("#pData", "#" + n + "_2").trigger("click");
                                    return false
                                }
                                if (y.which === e.navkeys[2]) {
                                    a("#nData", "#" + n + "_2").trigger("click");
                                    return false
                                }
                            }
                        });
                        e.closeicon = a.extend([true, "left", "ui-icon-close"], e.closeicon);
                        if (e.closeicon[0] === true) a("#cData", "#" + n + "_2").addClass(e.closeicon[1] == "right" ? "fm-button-icon-right": "fm-button-icon-left").append("<span class='ui-icon " + e.closeicon[2] + "'></span>");
                        a.isFunction(e.beforeShowForm) && e.beforeShowForm(a("#" + l));
                        a.jgrid.viewModal("#" + k.themodal, {
                            gbox: "#gbox_" + m,
                            jqm: e.jqModal,
                            modal: e.modal
                        });
                        a(".fm-button:not(.ui-state-disabled)", "#" + n + "_2").hover(function() {
                            a(this).addClass("ui-state-hover")
                        },
                        function() {
                            a(this).removeClass("ui-state-hover")
                        });
                        c();
                        a("#cData", "#" + n + "_2").click(function() {
                            a.jgrid.hideModal("#" + k.themodal, {
                                gb: "#gbox_" + m,
                                jqm: e.jqModal,
                                onClose: e.onClose
                            });
                            return false
                        });
                        a("#nData", "#" + n + "_2").click(function() {
                            a("#FormError", "#" + n).hide();
                            var y = j();
                            y[0] = parseInt(y[0], 10);
                            if (y[0] != -1 && y[1][y[0] + 1]) {
                                if (a.isFunction(e.onclickPgButtons)) e.onclickPgButtons("next", a("#" + l), y[1][y[0]]);
                                g(y[1][y[0] + 1], b);
                                a(b).jqGrid("setSelection", y[1][y[0] + 1]);
                                a.isFunction(e.afterclickPgButtons) && e.afterclickPgButtons("next", a("#" + l), y[1][y[0] + 1]);
                                h(y[0] + 1, y[1].length - 1)
                            }
                            c();
                            return false
                        });
                        a("#pData", "#" + n + "_2").click(function() {
                            a("#FormError", "#" + n).hide();
                            var y = j();
                            if (y[0] != -1 && y[1][y[0] - 1]) {
                                if (a.isFunction(e.onclickPgButtons)) e.onclickPgButtons("prev", a("#" + l), y[1][y[0]]);
                                g(y[1][y[0] - 1], b);
                                a(b).jqGrid("setSelection", y[1][y[0] - 1]);
                                a.isFunction(e.afterclickPgButtons) && e.afterclickPgButtons("prev", a("#" + l), y[1][y[0] - 1]);
                                h(y[0] - 1, y[1].length - 1)
                            }
                            c();
                            return false
                        })
                    }
                    r = j();
                    h(r[0], r[1].length - 1)
                }
            })
        },
        delGridRow: function(d, e) {
            var c = e = a.extend({
                top: 0,
                left: 0,
                width: 240,
                height: "auto",
                dataheight: "auto",
                modal: false,
                overlay: 10,
                drag: true,
                resize: true,
                url: "",
                mtype: "POST",
                reloadAfterSubmit: true,
                beforeShowForm: null,
                beforeInitData: null,
                afterShowForm: null,
                beforeSubmit: null,
                onclickSubmit: null,
                afterSubmit: null,
                jqModal: true,
                closeOnEscape: false,
                delData: {},
                delicon: [],
                cancelicon: [],
                onClose: null,
                ajaxDelOptions: {},
                processing: false,
                serializeDelData: null,
                useDataProxy: false
            },
            a.jgrid.del, e || {});
            return this.each(function() {
                var f = this;
                if (f.grid) if (d) {
                    var g = a.isFunction(e.beforeShowForm),
                    h = a.isFunction(e.afterShowForm),
                    j = a.isFunction(e.beforeInitData) ? e.beforeInitData: false,
                    b = f.p.id,
                    m = {},
                    l = true,
                    n = "DelTbl_" + b,
                    k,
                    p,
                    o,
                    v,
                    q = {
                        themodal: "delmod" + b,
                        modalhead: "delhd" + b,
                        modalcontent: "delcnt" + b,
                        scrollelm: n
                    };
                    if (jQuery.isArray(d)) d = d.join();
                    if (a("#" + q.themodal).html() !== null) {
                        if (j) {
                            l = j(a("#" + n));
                            if (typeof l == "undefined") l = true
                        }
                        if (l === false) return;
                        a("#DelData>td", "#" + n).text(d);
                        a("#DelError", "#" + n).hide();
                        if (c.processing === true) {
                            c.processing = false;
                            a("#dData", "#" + n).removeClass("ui-state-active")
                        }
                        g && e.beforeShowForm(a("#" + n));
                        a.jgrid.viewModal("#" + q.themodal, {
                            gbox: "#gbox_" + b,
                            jqm: e.jqModal,
                            jqM: false,
                            overlay: e.overlay,
                            modal: e.modal
                        })
                    } else {
                        var r = isNaN(e.dataheight) ? e.dataheight: e.dataheight + "px";
                        r = "<div id='" + n + "' class='formdata' style='width:100%;overflow:auto;position:relative;height:" + r + ";'>";
                        r += "<table class='DelTable'><tbody>";
                        r += "<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>";
                        r += "<tr id='DelData' style='display:none'><td >" + d + "</td></tr>";
                        r += '<tr><td class="delmsg" style="white-space:pre;">' + e.msg + "</td></tr><tr><td >&#160;</td></tr>";
                        r += "</tbody></table></div>";
                        r += "<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + n + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr></tr><tr><td class='DelButton EditButton'>" + ("<a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-corner-all'>" + e.bSubmit + "</a>") + "&#160;" + ("<a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-corner-all'>" + e.bCancel + "</a>") + "</td></tr></tbody></table>";
                        e.gbox = "#gbox_" + b;
                        a.jgrid.createModal(q, r, e, "#gview_" + f.p.id, a("#gview_" + f.p.id)[0]);
                        if (j) {
                            l = j(a("#" + n));
                            if (typeof l == "undefined") l = true
                        }
                        if (l === false) return;
                        a(".fm-button", "#" + n + "_2").hover(function() {
                            a(this).addClass("ui-state-hover")
                        },
                        function() {
                            a(this).removeClass("ui-state-hover")
                        });
                        e.delicon = a.extend([true, "left", "ui-icon-scissors"], e.delicon);
                        e.cancelicon = a.extend([true, "left", "ui-icon-cancel"], e.cancelicon);
                        if (e.delicon[0] === true) a("#dData", "#" + n + "_2").addClass(e.delicon[1] == "right" ? "fm-button-icon-right": "fm-button-icon-left").append("<span class='ui-icon " + e.delicon[2] + "'></span>");
                        if (e.cancelicon[0] === true) a("#eData", "#" + n + "_2").addClass(e.cancelicon[1] == "right" ? "fm-button-icon-right": "fm-button-icon-left").append("<span class='ui-icon " + e.cancelicon[2] + "'></span>");
                        a("#dData", "#" + n + "_2").click(function() {
                            var s = [true, ""];
                            m = {};
                            var x = a("#DelData>td", "#" + n).text();
                            if (a.isFunction(e.onclickSubmit)) m = e.onclickSubmit(c, x) || {};
                            if (a.isFunction(e.beforeSubmit)) s = e.beforeSubmit(x);
                            if (s[0] && !c.processing) {
                                c.processing = true;
                                a(this).addClass("ui-state-active");
                                o = f.p.prmNames;
                                k = a.extend({},
                                c.delData, m);
                                v = o.oper;
                                k[v] = o.deloper;
                                p = o.id;
                                k[p] = x;
                                var A = a.extend({
                                    url: c.url ? c.url: a(f).jqGrid("getGridParam", "editurl"),
                                    type: e.mtype,
                                    data: a.isFunction(e.serializeDelData) ? e.serializeDelData(k) : k,
                                    complete: function(B, F) {
                                        if (F != "success") {
                                            s[0] = false;
                                            s[1] = a.isFunction(c.errorTextFormat) ? c.errorTextFormat(B) : F + " Status: '" + B.statusText + "'. Error code: " + B.status
                                        } else if (a.isFunction(c.afterSubmit)) s = c.afterSubmit(B, k);
                                        if (s[0] === false) {
                                            a("#DelError>td", "#" + n).html(s[1]);
                                            a("#DelError", "#" + n).show()
                                        } else {
                                            if (c.reloadAfterSubmit && f.p.datatype != "local") a(f).trigger("reloadGrid");
                                            else {
                                                var y = [];
                                                y = x.split(",");
                                                if (f.p.treeGrid === true) try {
                                                    a(f).jqGrid("delTreeNode", y[0])
                                                } catch(G) {} else for (var S = 0; S < y.length; S++) a(f).jqGrid("delRowData", y[S]);
                                                f.p.selrow = null;
                                                f.p.selarrrow = []
                                            }
                                            a.isFunction(c.afterComplete) && setTimeout(function() {
                                                c.afterComplete(B, x)
                                            },
                                            500)
                                        }
                                        c.processing = false;
                                        a("#dData", "#" + n + "_2").removeClass("ui-state-active");
                                        s[0] && a.jgrid.hideModal("#" + q.themodal, {
                                            gb: "#gbox_" + b,
                                            jqm: e.jqModal,
                                            onClose: c.onClose
                                        })
                                    }
                                },
                                a.jgrid.ajaxOptions, e.ajaxDelOptions);
                                if (!A.url && !c.useDataProxy) if (a.isFunction(f.p.dataProxy)) c.useDataProxy = true;
                                else {
                                    s[0] = false;
                                    s[1] += " " + a.jgrid.errors.nourl
                                }
                                if (s[0]) c.useDataProxy ? f.p.dataProxy.call(f, A, "del_" + f.p.id) : a.ajax(A)
                            }
                            if (s[0] === false) {
                                a("#DelError>td", "#" + n).html(s[1]);
                                a("#DelError", "#" + n).show()
                            }
                            return false
                        });
                        a("#eData", "#" + n + "_2").click(function() {
                            a.jgrid.hideModal("#" + q.themodal, {
                                gb: "#gbox_" + b,
                                jqm: e.jqModal,
                                onClose: c.onClose
                            });
                            return false
                        });
                        g && e.beforeShowForm(a("#" + n));
                        a.jgrid.viewModal("#" + q.themodal, {
                            gbox: "#gbox_" + b,
                            jqm: e.jqModal,
                            overlay: e.overlay,
                            modal: e.modal
                        })
                    }
                    h && e.afterShowForm(a("#" + n));
                    e.closeOnEscape === true && setTimeout(function() {
                        a(".ui-jqdialog-titlebar-close", "#" + q.modalhead).focus()
                    },
                    0)
                }
            })
        },
        navGrid: function(d, e, c, f, g, h, j) {
            e = a.extend({
                edit: false,
                editicon: "ui-icon-pencil",
                add: false,
                addicon: "ui-icon-plus",
                del: false,
                delicon: "ui-icon-trash",
                search: false,
                searchicon: "ui-icon-search",
                refresh: false,
                refreshicon: "ui-icon-refresh",
                refreshstate: "firstpage",
                view: false,
                viewicon: "ui-icon-document",
                position: "left",
                closeOnEscape: true,
                beforeRefresh: null,
                afterRefresh: null,
                cloneToTop: false,
            },
            a.jgrid.nav, e || {});
            return this.each(function() {
                if (!this.nav) {
                    var b = {
                        themodal: "alertmod",
                        modalhead: "alerthd",
                        modalcontent: "alertcnt"
                    },
                    m = this,
                    l,
                    n,
                    k;
                    if (! (!m.grid || typeof d != "string")) {
                        if (a("#" + b.themodal).html() === null) {
                            if (typeof window.innerWidth != "undefined") {
                                l = window.innerWidth;
                                n = window.innerHeight
                            } else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined" && document.documentElement.clientWidth !== 0) {
                                l = document.documentElement.clientWidth;
                                n = document.documentElement.clientHeight
                            } else {
                                l = 1024;
                                n = 768
                            }
                            a.jgrid.createModal(b, "<div>" + e.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>", {
                                gbox: "#gbox_" + m.p.id,
                                jqModal: true,
                                drag: true,
                                resize: true,
                                caption: e.alertcap,
                                top: n / 2 - 25,
                                left: l / 2 - 100,
                                width: 200,
                                height: "auto",
                                closeOnEscape: e.closeOnEscape
                            },
                            "", "", true)
                        }
                        l = 1;
                        if (e.cloneToTop && m.p.toppager) l = 2;
                        for (n = 0; n < l; n++) {
                            var p = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                            o,
                            v;
                            if (n === 0) {
                                o = d;
                                v = m.p.id;
                                if (o == m.p.toppager) {
                                    v += "_top";
                                    l = 1
                                }
                            } else {
                                o = m.p.toppager;
                                v = m.p.id + "_top"
                            }
                            m.p.direction == "rtl" && a(p).attr("dir", "rtl").css("float", "right");
                            if (e.add) {
                                f = f || {};
                                k = a("<td class='ui-pg-button ui-corner-all'></td>");
                                a(k).append("<div class='ui-pg-div'><span class='ui-icon " + e.addicon + "'></span>" + e.addtext + "</div>");
                                a("tr", p).append(k);
                                a(k, p).attr({
                                    title: e.addtitle || "",
                                    id: f.id || "add_" + v
                                }).click(function() {
                                    a(this).hasClass("ui-state-disabled") || (a.isFunction(e.addfunc) ? e.addfunc() : a(m).jqGrid("editGridRow", "new", f));
                                    return false
                                }).hover(function() {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                },
                                function() {
                                    a(this).removeClass("ui-state-hover")
                                });
                                k = null
                            }
                            if (e.edit) {
                                k = a("<td class='ui-pg-button ui-corner-all'></td>");
                                c = c || {};
                                a(k).append("<div class='ui-pg-div'><span class='ui-icon " + e.editicon + "'></span>" + e.edittext + "</div>");
                                a("tr", p).append(k);
                                a(k, p).attr({
                                    title: e.edittitle || "",
                                    id: c.id || "edit_" + v
                                }).click(function() {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        var q = m.p.selrow;
                                        if (q) a.isFunction(e.editfunc) ? e.editfunc(q) : a(m).jqGrid("editGridRow", q, c);
                                        else {
                                            a.jgrid.viewModal("#" + b.themodal, {
                                                gbox: "#gbox_" + m.p.id,
                                                jqm: true
                                            });
                                            a("#jqg_alrt").focus()
                                        }
                                    }
                                    return false
                                }).hover(function() {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                },
                                function() {
                                    a(this).removeClass("ui-state-hover")
                                });
                                k = null
                            }
                            if (e.view) {
                                k = a("<td class='ui-pg-button ui-corner-all'></td>");
                                j = j || {};
                                a(k).append("<div class='ui-pg-div'><span class='ui-icon " + e.viewicon + "'></span>" + e.viewtext + "</div>");
                                a("tr", p).append(k);
                                a(k, p).attr({
                                    title: e.viewtitle || "",
                                    id: j.id || "view_" + v
                                }).click(function() {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        var q = m.p.selrow;
                                        if (q) a.isFunction(e.viewfunc) ? e.viewfunc(q) : a(m).jqGrid("viewGridRow", q, j);
                                        else {
                                            a.jgrid.viewModal("#" + b.themodal, {
                                                gbox: "#gbox_" + m.p.id,
                                                jqm: true
                                            });
                                            a("#jqg_alrt").focus()
                                        }
                                    }
                                    return false
                                }).hover(function() {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                },
                                function() {
                                    a(this).removeClass("ui-state-hover")
                                });
                                k = null
                            }
                            if (e.del) {
                                k = a("<td class='ui-pg-button ui-corner-all'></td>");
                                g = g || {};
                                a(k).append("<div class='ui-pg-div'><span class='ui-icon " + e.delicon + "'></span>" + e.deltext + "</div>");
                                a("tr", p).append(k);
                                a(k, p).attr({
                                    title: e.deltitle || "",
                                    id: g.id || "del_" + v
                                }).click(function() {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        var q;
                                        if (m.p.multiselect) {
                                            q = m.p.selarrrow;
                                            if (q.length === 0) q = null
                                        } else q = m.p.selrow;
                                        if (q)"function" == typeof e.delfunc ? e.delfunc(q) : a(m).jqGrid("delGridRow", q, g);
                                        else {
                                            a.jgrid.viewModal("#" + b.themodal, {
                                                gbox: "#gbox_" + m.p.id,
                                                jqm: true
                                            });
                                            a("#jqg_alrt").focus()
                                        }
                                    }
                                    return false
                                }).hover(function() {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                },
                                function() {
                                    a(this).removeClass("ui-state-hover")
                                });
                                k = null
                            }
                            if (e.add || e.edit || e.del || e.view) a("tr", p).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>");
                            if (e.search) {
                                k = a("<td class='ui-pg-button ui-corner-all'></td>");
                                h = h || {};
                                a(k).append("<div class='ui-pg-div'><span class='ui-icon " + e.searchicon + "'></span>" + e.searchtext + "</div>");
                                a("tr", p).append(k);
                                a(k, p).attr({
                                    title: e.searchtitle || "",
                                    id: h.id || "search_" + v
                                }).click(function() {
                                    a(this).hasClass("ui-state-disabled") || a(m).jqGrid("searchGrid", h);
                                    return false
                                }).hover(function() {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                },
                                function() {
                                    a(this).removeClass("ui-state-hover")
                                });
                                h.showOnLoad && h.showOnLoad === true && a(k, p).click();
                                k = null
                            }
                            if (e.refresh) {
                                k = a("<td class='ui-pg-button ui-corner-all'></td>");
                                a(k).append("<div class='ui-pg-div'><span class='ui-icon " + e.refreshicon + "'></span>" + e.refreshtext + "</div>");
                                a("tr", p).append(k);
                                a(k, p).attr({
                                    title: e.refreshtitle || "",
                                    id: "refresh_" + v
                                }).click(function() {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        a.isFunction(e.beforeRefresh) && e.beforeRefresh();
                                        m.p.search = false;
                                        try {
                                            var q = m.p.id;
                                            m.p.postData.filters = "";
                                            a("#fbox_" + q).jqFilter("resetFilter");
                                            a.isFunction(m.clearToolbar) && m.clearToolbar(false)
                                        } catch(r) {}
                                        switch (e.refreshstate) {
                                        case "firstpage":
                                            a(m).trigger("reloadGrid", [{
                                                page: 1
                                            }]);
                                            break;
                                        case "current":
                                            a(m).trigger("reloadGrid", [{
                                                current: true
                                            }])
                                        }
                                        a.isFunction(e.afterRefresh) && e.afterRefresh()
                                    }
                                    return false
                                }).hover(function() {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                },
                                function() {
                                    a(this).removeClass("ui-state-hover")
                                });
                                k = null
                            }
                            k = a(".ui-jqgrid").css("font-size") || "11px";
                            a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + k + ";visibility:hidden;' ></div>");
                            k = a(p).clone().appendTo("#testpg2").width();
                            a("#testpg2").remove();
                            a(o + "_" + e.position, o).append(p);
                            if (m.p._nvtd) {
                                if (k > m.p._nvtd[0]) {
                                    a(o + "_" + e.position, o).width(k);
                                    m.p._nvtd[0] = k
                                }
                                m.p._nvtd[1] = k
                            }
                            p = k = k = null;
                            this.nav = true
                        }
                    }
                }
            })
        },
        navButtonAdd: function(d, e) {
            e = a.extend({
                caption: "newButton",
                title: "",
                buttonicon: "ui-icon-newwin",
                onClickButton: null,
                position: "last",
                cursor: "pointer"
            },
            e || {});
            return this.each(function() {
                if (this.grid) {
                    if (d.indexOf("#") !== 0) d = "#" + d;
                    var c = a(".navtable", d)[0],
                    f = this;
                    if (c) if (! (e.id && a("#" + e.id, c).html() !== null)) {
                        var g = a("<td></td>");
                        e.buttonicon.toString().toUpperCase() == "NONE" ? a(g).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" + e.caption + "</div>") : a(g).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " + e.buttonicon + "'></span>" + e.caption + "</div>");
                        e.id && a(g).attr("id", e.id);
                        if (e.position == "first") c.rows[0].cells.length === 0 ? a("tr", c).append(g) : a("tr td:eq(0)", c).before(g);
                        else a("tr", c).append(g);
                        a(g, c).attr("title", e.title || "").click(function(h) {
                            a(this).hasClass("ui-state-disabled") || a.isFunction(e.onClickButton) && e.onClickButton.call(f, h);
                            return false
                        }).hover(function() {
                            a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                        },
                        function() {
                            a(this).removeClass("ui-state-hover")
                        })
                    }
                }
            })
        },
        navSeparatorAdd: function(d, e) {
            e = a.extend({
                sepclass: "ui-separator",
                sepcontent: ""
            },
            e || {});
            return this.each(function() {
                if (this.grid) {
                    if (d.indexOf("#") !== 0) d = "#" + d;
                    var c = a(".navtable", d)[0];
                    if (c) {
                        var f = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" + e.sepclass + "'></span>" + e.sepcontent + "</td>";
                        a("tr", c).append(f)
                    }
                }
            })
        },
        GridToForm: function(d, e) {
            return this.each(function() {
                if (this.grid) {
                    var c = a(this).jqGrid("getRowData", d);
                    if (c) for (var f in c) a("[name=" + a.jgrid.jqID(f) + "]", e).is("input:radio") || a("[name=" + a.jgrid.jqID(f) + "]", e).is("input:checkbox") ? a("[name=" + a.jgrid.jqID(f) + "]", e).each(function() {
                        a(this).val() == c[f] ? a(this).attr("checked", "checked") : a(this).attr("checked", "")
                    }) : a("[name=" + a.jgrid.jqID(f) + "]", e).val(c[f])
                }
            })
        },
        FormToGrid: function(d, e, c, f) {
            return this.each(function() {
                if (this.grid) {
                    c || (c = "set");
                    f || (f = "first");
                    var g = a(e).serializeArray(),
                    h = {};
                    a.each(g,
                    function(j, b) {
                        h[b.name] = b.value
                    });
                    if (c == "add") a(this).jqGrid("addRowData", d, h, f);
                    else c == "set" && a(this).jqGrid("setRowData", d, h)
                }
            })
        }
    })
})(jQuery); (function(a) {
    a.jgrid.extend({
        editRow: function(d, e, c, f, g, h, j, b, m) {
            var l = {
                keys: e || false,
                oneditfunc: c || null,
                successfunc: f || null,
                url: g || null,
                extraparam: h || {},
                aftersavefunc: j || null,
                errorfunc: b || null,
                afterrestorefunc: m || null,
                restoreAfterErorr: true
            },
            n = a.makeArray(arguments).slice(1),
            k;
            k = n[0] && typeof n[0] == "object" && !a.isFunction(n[0]) ? a.extend(l, n[0]) : l;
            return this.each(function() {
                var p = this,
                o, v, q = 0,
                r = null,
                s = {},
                x, A;
                if (p.grid) {
                    x = a(p).jqGrid("getInd", d, true);
                    if (x !== false) if ((a(x).attr("editable") || "0") == "0" && !a(x).hasClass("not-editable-row")) {
                        A = p.p.colModel;
                        a("td", x).each(function(B) {
                            o = A[B].name;
                            var F = p.p.treeGrid === true && o == p.p.ExpandColumn;
                            if (F) v = a("span:first", this).html();
                            else try {
                                v = a.unformat(this, {
                                    rowId: d,
                                    colModel: A[B]
                                },
                                B)
                            } catch(y) {
                                v = A[B].edittype && A[B].edittype == "textarea" ? a(this).text() : a(this).html()
                            }
                            if (o != "cb" && o != "subgrid" && o != "rn") {
                                if (p.p.autoencode) v = a.jgrid.htmlDecode(v);
                                s[o] = v;
                                if (A[B].editable === true) {
                                    if (r === null) r = B;
                                    F ? a("span:first", this).html("") : a(this).html("");
                                    var G = a.extend({},
                                    A[B].editoptions || {},
                                    {
                                        id: d + "_" + o,
                                        name: o
                                    });
                                    if (!A[B].edittype) A[B].edittype = "text";
                                    if (v == "&nbsp;" || v == "&#160;" || v.length == 1 && v.charCodeAt(0) == 160) v = "";
                                    G = a.jgrid.createEl(A[B].edittype, G, v, true, a.extend({},
                                    a.jgrid.ajaxOptions, p.p.ajaxSelectOptions || {}));
                                    a(G).addClass("editable");
                                    F ? a("span:first", this).append(G) : a(this).append(G);
                                    A[B].edittype == "select" && A[B].editoptions.multiple === true && a.browser.msie && a(G).width(a(G).width());
                                    q++
                                }
                            }
                        });
                        if (q > 0) {
                            s.id = d;
                            p.p.savedRow.push(s);
                            a(x).attr("editable", "1");
                            a("td:eq(" + r + ") input", x).focus();
                            k.keys === true && a(x).bind("keydown",
                            function(B) {
                                B.keyCode === 27 && a(p).jqGrid("restoreRow", d, m);
                                if (B.keyCode === 13) {
                                    if (B.target.tagName == "TEXTAREA") return true;
                                    a(p).jqGrid("saveRow", d, k);
                                    return false
                                }
                                B.stopPropagation()
                            });
                            a.isFunction(k.oneditfunc) && k.oneditfunc.call(p, d)
                        }
                    }
                }
            })
        },
        saveRow: function(d, e, c, f, g, h, j) {
            var b = {
                successfunc: e || null,
                url: c || null,
                extraparam: f || {},
                aftersavefunc: g || null,
                errorfunc: h || null,
                afterrestorefunc: j || null,
                restoreAfterErorr: true
            },
            m = a.makeArray(arguments).slice(1),
            l;
            l = m[0] && typeof m[0] == "object" && !a.isFunction(m[0]) ? a.extend(b, m[0]) : b;
            var n = false,
            k = this[0],
            p,
            o = {},
            v = {},
            q = {},
            r,
            s,
            x;
            if (!k.grid) return n;
            x = a(k).jqGrid("getInd", d, true);
            if (x === false) return n;
            b = a(x).attr("editable");
            l.url = l.url ? l.url: k.p.editurl;
            if (b === "1") {
                var A;
                a("td", x).each(function(y) {
                    A = k.p.colModel[y];
                    p = A.name;
                    if (p != "cb" && p != "subgrid" && A.editable === true && p != "rn" && !a(this).hasClass("not-editable-cell")) {
                        switch (A.edittype) {
                        case "checkbox":
                            var G = ["Yes", "No"];
                            if (A.editoptions) G = A.editoptions.value.split(":");
                            o[p] = a("input", this).attr("checked") ? G[0] : G[1];
                            break;
                        case "text":
                        case "password":
                        case "textarea":
                        case "button":
                            o[p] = a("input, textarea", this).val();
                            break;
                        case "select":
                            if (A.editoptions.multiple) {
                                G = a("select", this);
                                var S = [];
                                o[p] = a(G).val();
                                o[p] = o[p] ? o[p].join(",") : "";
                                a("select > option:selected", this).each(function(R, ca) {
                                    S[R] = a(ca).text()
                                });
                                v[p] = S.join(",")
                            } else {
                                o[p] = a("select>option:selected", this).val();
                                v[p] = a("select>option:selected", this).text()
                            }
                            if (A.formatter && A.formatter == "select") v = {};
                            break;
                        case "custom":
                            try {
                                if (A.editoptions && a.isFunction(A.editoptions.custom_value)) {
                                    o[p] = A.editoptions.custom_value.call(k, a(".customelement", this), "get");
                                    if (o[p] === undefined) throw "e2";
                                } else throw "e1";
                            } catch(C) {
                                C == "e1" && a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose);
                                C == "e2" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, C.message, jQuery.jgrid.edit.bClose)
                            }
                        }
                        s = a.jgrid.checkValues(o[p], y, k);
                        if (s[0] === false) {
                            s[1] = o[p] + " " + s[1];
                            return false
                        }
                        if (k.p.autoencode) o[p] = a.jgrid.htmlEncode(o[p]);
                        if (l.url !== "clientArray" && A.editoptions && A.editoptions.NullIfEmpty === true) if (o[p] == "") q[p] = "null"
                    }
                });
                if (s[0] === false) {
                    try {
                        var B = a.jgrid.findPos(a("#" + a.jgrid.jqID(d), k.grid.bDiv)[0]);
                        a.jgrid.info_dialog(a.jgrid.errors.errcap, s[1], a.jgrid.edit.bClose, {
                            left: B[0],
                            top: B[1]
                        })
                    } catch(F) {
                        alert(s[1])
                    }
                    return n
                }
                if (o) {
                    b = k.p.prmNames;
                    m = b.oper;
                    B = b.id;
                    o[m] = b.editoper;
                    o[B] = d;
                    if (typeof k.p.inlineData == "undefined") k.p.inlineData = {};
                    o = a.extend({},
                    o, k.p.inlineData, l.extraparam)
                }
                if (l.url == "clientArray") {
                    o = a.extend({},
                    o, v);
                    k.p.autoencode && a.each(o,
                    function(y, G) {
                        o[y] = a.jgrid.htmlDecode(G)
                    });
                    B = a(k).jqGrid("setRowData", d, o);
                    a(x).attr("editable", "0");
                    for (b = 0; b < k.p.savedRow.length; b++) if (k.p.savedRow[b].id == d) {
                        r = b;
                        break
                    }
                    r >= 0 && k.p.savedRow.splice(r, 1);
                    a.isFunction(l.aftersavefunc) && l.aftersavefunc.call(k, d, B);
                    n = true
                } else {
                    a("#lui_" + k.p.id).show();
                    q = a.extend({},
                    o, q);
                    a.ajax(a.extend({
                        url: l.url,
                        data: a.isFunction(k.p.serializeRowData) ? k.p.serializeRowData.call(k, q) : q,
                        type: "POST",
                        async: false,
                        complete: function(y, G) {
                            a("#lui_" + k.p.id).hide();
                            if (G === "success") if ((a.isFunction(l.successfunc) ? l.successfunc.call(k, y) : true) === true) {
                                k.p.autoencode && a.each(o,
                                function(C, R) {
                                    o[C] = a.jgrid.htmlDecode(R)
                                });
                                o = a.extend({},
                                o, v);
                                a(k).jqGrid("setRowData", d, o);
                                a(x).attr("editable", "0");
                                for (var S = 0; S < k.p.savedRow.length; S++) if (k.p.savedRow[S].id == d) {
                                    r = S;
                                    break
                                }
                                r >= 0 && k.p.savedRow.splice(r, 1);
                                a.isFunction(l.aftersavefunc) && l.aftersavefunc.call(k, d, y);
                                n = true
                            } else {
                                a.isFunction(l.errorfunc) && l.errorfunc.call(k, d, y, G);
                                l.restoreAfterError === true && a(k).jqGrid("restoreRow", d, l.afterrestorefunc)
                            }
                        },
                        error: function(y, G) {
                            a("#lui_" + k.p.id).hide();
                            if (a.isFunction(l.errorfunc)) l.errorfunc.call(k, d, y, G);
                            else try {
                                jQuery.jgrid.info_dialog(jQuery.jgrid.errors.errcap, '<div class="ui-state-error">' + y.responseText + "</div>", jQuery.jgrid.edit.bClose, {
                                    buttonalign: "right"
                                })
                            } catch(S) {
                                alert(y.responseText)
                            }
                            l.restoreAfterError === true && a(k).jqGrid("restoreRow", d, l.afterrestorefunc)
                        }
                    },
                    a.jgrid.ajaxOptions, k.p.ajaxRowOptions || {}))
                }
                a(x).unbind("keydown")
            }
            return n
        },
        restoreRow: function(d, e) {
            return this.each(function() {
                var c = this,
                f, g, h = {};
                if (c.grid) {
                    g = a(c).jqGrid("getInd", d, true);
                    if (g !== false) {
                        for (var j = 0; j < c.p.savedRow.length; j++) if (c.p.savedRow[j].id == d) {
                            f = j;
                            break
                        }
                        if (f >= 0) {
                            if (a.isFunction(a.fn.datepicker)) try {
                                a("input.hasDatepicker", "#" + a.jgrid.jqID(g.id)).datepicker("hide")
                            } catch(b) {}
                            a.each(c.p.colModel,
                            function() {
                                if (this.editable === true && this.name in c.p.savedRow[f] && !a(this).hasClass("not-editable-cell")) h[this.name] = c.p.savedRow[f][this.name]
                            });
                            a(c).jqGrid("setRowData", d, h);
                            a(g).attr("editable", "0").unbind("keydown");
                            c.p.savedRow.splice(f, 1)
                        }
                        a.isFunction(e) && e.call(c, d)
                    }
                }
            })
        }
    })
})(jQuery); (function(a) {
    a.jgrid.extend({
        editCell: function(d, e, c) {
            return this.each(function() {
                var f = this,
                g, h, j, b;
                if (! (!f.grid || f.p.cellEdit !== true)) {
                    e = parseInt(e, 10);
                    f.p.selrow = f.rows[d].id;
                    f.p.knv || a(f).jqGrid("GridNav");
                    if (f.p.savedRow.length > 0) {
                        if (c === true) if (d == f.p.iRow && e == f.p.iCol) return;
                        a(f).jqGrid("saveCell", f.p.savedRow[0].id, f.p.savedRow[0].ic)
                    } else window.setTimeout(function() {
                        a("#" + f.p.knv).attr("tabindex", "-1").focus()
                    },
                    0);
                    b = f.p.colModel[e];
                    g = b.name;
                    if (! (g == "subgrid" || g == "cb" || g == "rn")) {
                        j = a("td:eq(" + e + ")", f.rows[d]);
                        if (b.editable === true && c === true && !j.hasClass("not-editable-cell")) {
                            if (parseInt(f.p.iCol, 10) >= 0 && parseInt(f.p.iRow, 10) >= 0) {
                                a("td:eq(" + f.p.iCol + ")", f.rows[f.p.iRow]).removeClass("edit-cell ui-state-highlight");
                                a(f.rows[f.p.iRow]).removeClass("selected-row ui-state-hover")
                            }
                            a(j).addClass("edit-cell ui-state-highlight");
                            a(f.rows[d]).addClass("selected-row ui-state-hover");
                            try {
                                h = a.unformat(j, {
                                    rowId: f.rows[d].id,
                                    colModel: b
                                },
                                e)
                            } catch(m) {
                                h = b.edittype && b.edittype == "textarea" ? a(j).text() : a(j).html()
                            }
                            if (f.p.autoencode) h = a.jgrid.htmlDecode(h);
                            if (!b.edittype) b.edittype = "text";
                            f.p.savedRow.push({
                                id: d,
                                ic: e,
                                name: g,
                                v: h
                            });
                            if (h == "&nbsp;" || h == "&#160;" || h.length == 1 && h.charCodeAt(0) == 160) h = "";
                            if (a.isFunction(f.p.formatCell)) {
                                var l = f.p.formatCell.call(f, f.rows[d].id, g, h, d, e);
                                if (l !== undefined) h = l
                            }
                            l = a.extend({},
                            b.editoptions || {},
                            {
                                id: d + "_" + g,
                                name: g
                            });
                            var n = a.jgrid.createEl(b.edittype, l, h, true, a.extend({},
                            a.jgrid.ajaxOptions, f.p.ajaxSelectOptions || {}));
                            a.isFunction(f.p.beforeEditCell) && f.p.beforeEditCell.call(f, f.rows[d].id, g, h, d, e);
                            a(j).html("").append(n).attr("tabindex", "0");
                            window.setTimeout(function() {
                                a(n).focus()
                            },
                            0);
                            a("input, select, textarea", j).bind("keydown",
                            function(k) {
                                if (k.keyCode === 27) if (a("input.hasDatepicker", j).length > 0) a(".ui-datepicker").is(":hidden") ? a(f).jqGrid("restoreCell", d, e) : a("input.hasDatepicker", j).datepicker("hide");
                                else a(f).jqGrid("restoreCell", d, e);
                                k.keyCode === 13 && a(f).jqGrid("saveCell", d, e);
                                if (k.keyCode == 9) if (f.grid.hDiv.loading) return false;
                                else k.shiftKey ? a(f).jqGrid("prevCell", d, e) : a(f).jqGrid("nextCell", d, e);
                                k.stopPropagation()
                            });
                            a.isFunction(f.p.afterEditCell) && f.p.afterEditCell.call(f, f.rows[d].id, g, h, d, e)
                        } else {
                            if (parseInt(f.p.iCol, 10) >= 0 && parseInt(f.p.iRow, 10) >= 0) {
                                a("td:eq(" + f.p.iCol + ")", f.rows[f.p.iRow]).removeClass("edit-cell ui-state-highlight");
                                a(f.rows[f.p.iRow]).removeClass("selected-row ui-state-hover")
                            }
                            j.addClass("edit-cell ui-state-highlight");
                            a(f.rows[d]).addClass("selected-row ui-state-hover");
                            if (a.isFunction(f.p.onSelectCell)) {
                                h = j.html().replace(/\&#160\;/ig, "");
                                f.p.onSelectCell.call(f, f.rows[d].id, g, h, d, e)
                            }
                        }
                        f.p.iCol = e;
                        f.p.iRow = d
                    }
                }
            })
        },
        saveCell: function(d, e) {
            return this.each(function() {
                var c = this,
                f;
                if (! (!c.grid || c.p.cellEdit !== true)) {
                    f = c.p.savedRow.length >= 1 ? 0 : null;
                    if (f !== null) {
                        var g = a("td:eq(" + e + ")", c.rows[d]),
                        h,
                        j,
                        b = c.p.colModel[e],
                        m = b.name,
                        l = a.jgrid.jqID(m);
                        switch (b.edittype) {
                        case "select":
                            if (b.editoptions.multiple) {
                                l = a("#" + d + "_" + l, c.rows[d]);
                                var n = [];
                                if (h = a(l).val()) h.join(",");
                                else h = "";
                                a("option:selected", l).each(function(s, x) {
                                    n[s] = a(x).text()
                                });
                                j = n.join(",")
                            } else {
                                h = a("#" + d + "_" + l + ">option:selected", c.rows[d]).val();
                                j = a("#" + d + "_" + l + ">option:selected", c.rows[d]).text()
                            }
                            if (b.formatter) j = h;
                            break;
                        case "checkbox":
                            var k = ["Yes", "No"];
                            if (b.editoptions) k = b.editoptions.value.split(":");
                            j = h = a("#" + d + "_" + l, c.rows[d]).attr("checked") ? k[0] : k[1];
                            break;
                        case "password":
                        case "text":
                        case "textarea":
                        case "button":
                            j = h = a("#" + d + "_" + l, c.rows[d]).val();
                            break;
                        case "custom":
                            try {
                                if (b.editoptions && a.isFunction(b.editoptions.custom_value)) {
                                    h = b.editoptions.custom_value.call(c, a(".customelement", g), "get");
                                    if (h === undefined) throw "e2";
                                    else j = h
                                } else throw "e1";
                            } catch(p) {
                                p == "e1" && a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose);
                                p == "e2" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, p.message, jQuery.jgrid.edit.bClose)
                            }
                        }
                        if (j !== c.p.savedRow[f].v) {
                            if (a.isFunction(c.p.beforeSaveCell)) if (f = c.p.beforeSaveCell.call(c, c.rows[d].id, m, h, d, e)) j = h = f;
                            var o = a.jgrid.checkValues(h, e, c);
                            if (o[0] === true) {
                                f = {};
                                if (a.isFunction(c.p.beforeSubmitCell))(f = c.p.beforeSubmitCell.call(c, c.rows[d].id, m, h, d, e)) || (f = {});
                                a("input.hasDatepicker", g).length > 0 && a("input.hasDatepicker", g).datepicker("hide");
                                if (c.p.cellsubmit == "remote") if (c.p.cellurl) {
                                    var v = {};
                                    if (c.p.autoencode) h = a.jgrid.htmlEncode(h);
                                    v[m] = h;
                                    k = c.p.prmNames;
                                    b = k.id;
                                    l = k.oper;
                                    v[b] = c.rows[d].id;
                                    v[l] = k.editoper;
                                    v = a.extend(f, v);
                                    a("#lui_" + c.p.id).show();
                                    c.grid.hDiv.loading = true;
                                    a.ajax(a.extend({
                                        url: c.p.cellurl,
                                        data: a.isFunction(c.p.serializeCellData) ? c.p.serializeCellData.call(c, v) : v,
                                        type: "POST",
                                        complete: function(s, x) {
                                            a("#lui_" + c.p.id).hide();
                                            c.grid.hDiv.loading = false;
                                            if (x == "success") if (a.isFunction(c.p.afterSubmitCell)) {
                                                var A = c.p.afterSubmitCell.call(c, s, v.id, m, h, d, e);
                                                if (A[0] === true) {
                                                    a(g).empty();
                                                    a(c).jqGrid("setCell", c.rows[d].id, e, j, false, false, true);
                                                    a(g).addClass("dirty-cell");
                                                    a(c.rows[d]).addClass("edited");
                                                    a.isFunction(c.p.afterSaveCell) && c.p.afterSaveCell.call(c, c.rows[d].id, m, h, d, e);
                                                    c.p.savedRow.splice(0, 1)
                                                } else {
                                                    a.jgrid.info_dialog(a.jgrid.errors.errcap, A[1], a.jgrid.edit.bClose);
                                                    a(c).jqGrid("restoreCell", d, e)
                                                }
                                            } else {
                                                a(g).empty();
                                                a(c).jqGrid("setCell", c.rows[d].id, e, j, false, false, true);
                                                a(g).addClass("dirty-cell");
                                                a(c.rows[d]).addClass("edited");
                                                a.isFunction(c.p.afterSaveCell) && c.p.afterSaveCell.call(c, c.rows[d].id, m, h, d, e);
                                                c.p.savedRow.splice(0, 1)
                                            }
                                        },
                                        error: function(s, x) {
                                            a("#lui_" + c.p.id).hide();
                                            c.grid.hDiv.loading = false;
                                            a.isFunction(c.p.errorCell) ? c.p.errorCell.call(c, s, x) : a.jgrid.info_dialog(a.jgrid.errors.errcap, s.status + " : " + s.statusText + "<br/>" + x, a.jgrid.edit.bClose);
                                            a(c).jqGrid("restoreCell", d, e)
                                        }
                                    },
                                    a.jgrid.ajaxOptions, c.p.ajaxCellOptions || {}))
                                } else try {
                                    a.jgrid.info_dialog(a.jgrid.errors.errcap, a.jgrid.errors.nourl, a.jgrid.edit.bClose);
                                    a(c).jqGrid("restoreCell", d, e)
                                } catch(q) {}
                                if (c.p.cellsubmit == "clientArray") {
                                    a(g).empty();
                                    a(c).jqGrid("setCell", c.rows[d].id, e, j, false, false, true);
                                    a(g).addClass("dirty-cell");
                                    a(c.rows[d]).addClass("edited");
                                    a.isFunction(c.p.afterSaveCell) && c.p.afterSaveCell.call(c, c.rows[d].id, m, h, d, e);
                                    c.p.savedRow.splice(0, 1)
                                }
                            } else try {
                                window.setTimeout(function() {
                                    a.jgrid.info_dialog(a.jgrid.errors.errcap, h + " " + o[1], a.jgrid.edit.bClose)
                                },
                                100);
                                a(c).jqGrid("restoreCell", d, e)
                            } catch(r) {}
                        } else a(c).jqGrid("restoreCell", d, e)
                    }
                    a.browser.opera ? a("#" + c.p.knv).attr("tabindex", "-1").focus() : window.setTimeout(function() {
                        a("#" + c.p.knv).attr("tabindex", "-1").focus()
                    },
                    0)
                }
            })
        },
        restoreCell: function(d, e) {
            return this.each(function() {
                var c = this,
                f;
                if (! (!c.grid || c.p.cellEdit !== true)) {
                    f = c.p.savedRow.length >= 1 ? 0 : null;
                    if (f !== null) {
                        var g = a("td:eq(" + e + ")", c.rows[d]);
                        if (a.isFunction(a.fn.datepicker)) try {
                            a("input.hasDatepicker", g).datepicker("hide")
                        } catch(h) {}
                        a(g).empty().attr("tabindex", "-1");
                        a(c).jqGrid("setCell", c.rows[d].id, e, c.p.savedRow[f].v, false, false, true);
                        a.isFunction(c.p.afterRestoreCell) && c.p.afterRestoreCell.call(c, c.rows[d].id, c.p.savedRow[f].v, d, e);
                        c.p.savedRow.splice(0, 1)
                    }
                    window.setTimeout(function() {
                        a("#" + c.p.knv).attr("tabindex", "-1").focus()
                    },
                    0)
                }
            })
        },
        nextCell: function(d, e) {
            return this.each(function() {
                var c = false;
                if (! (!this.grid || this.p.cellEdit !== true)) {
                    for (var f = e + 1; f < this.p.colModel.length; f++) if (this.p.colModel[f].editable === true) {
                        c = f;
                        break
                    }
                    if (c !== false) a(this).jqGrid("editCell", d, c, true);
                    else this.p.savedRow.length > 0 && a(this).jqGrid("saveCell", d, e)
                }
            })
        },
        prevCell: function(d, e) {
            return this.each(function() {
                var c = false;
                if (! (!this.grid || this.p.cellEdit !== true)) {
                    for (var f = e - 1; f >= 0; f--) if (this.p.colModel[f].editable === true) {
                        c = f;
                        break
                    }
                    if (c !== false) a(this).jqGrid("editCell", d, c, true);
                    else this.p.savedRow.length > 0 && a(this).jqGrid("saveCell", d, e)
                }
            })
        },
        GridNav: function() {
            return this.each(function() {
                function d(j, b, m) {
                    if (m.substr(0, 1) == "v") {
                        var l = a(c.grid.bDiv)[0].clientHeight,
                        n = a(c.grid.bDiv)[0].scrollTop,
                        k = c.rows[j].offsetTop + c.rows[j].clientHeight,
                        p = c.rows[j].offsetTop;
                        if (m == "vd") if (k >= l) a(c.grid.bDiv)[0].scrollTop = a(c.grid.bDiv)[0].scrollTop + c.rows[j].clientHeight;
                        if (m == "vu") if (p < n) a(c.grid.bDiv)[0].scrollTop = a(c.grid.bDiv)[0].scrollTop - c.rows[j].clientHeight
                    }
                    if (m == "h") {
                        m = a(c.grid.bDiv)[0].clientWidth;
                        l = a(c.grid.bDiv)[0].scrollLeft;
                        n = c.rows[j].cells[b].offsetLeft;
                        if (c.rows[j].cells[b].offsetLeft + c.rows[j].cells[b].clientWidth >= m + parseInt(l, 10)) a(c.grid.bDiv)[0].scrollLeft = a(c.grid.bDiv)[0].scrollLeft + c.rows[j].cells[b].clientWidth;
                        else if (n < l) a(c.grid.bDiv)[0].scrollLeft = a(c.grid.bDiv)[0].scrollLeft - c.rows[j].cells[b].clientWidth
                    }
                }
                function e(j, b) {
                    var m, l;
                    if (b == "lft") {
                        m = j + 1;
                        for (l = j; l >= 0; l--) if (c.p.colModel[l].hidden !== true) {
                            m = l;
                            break
                        }
                    }
                    if (b == "rgt") {
                        m = j - 1;
                        for (l = j; l < c.p.colModel.length; l++) if (c.p.colModel[l].hidden !== true) {
                            m = l;
                            break
                        }
                    }
                    return m
                }
                var c = this;
                if (! (!c.grid || c.p.cellEdit !== true)) {
                    c.p.knv = c.p.id + "_kn";
                    var f = a("<span style='width:0px;height:0px;background-color:black;' tabindex='0'><span tabindex='-1' style='width:0px;height:0px;background-color:grey' id='" + c.p.knv + "'></span></span>"),
                    g,
                    h;
                    a(f).insertBefore(c.grid.cDiv);
                    a("#" + c.p.knv).focus().keydown(function(j) {
                        h = j.keyCode;
                        if (c.p.direction == "rtl") if (h == 37) h = 39;
                        else if (h == 39) h = 37;
                        switch (h) {
                        case 38:
                            if (c.p.iRow - 1 > 0) {
                                d(c.p.iRow - 1, c.p.iCol, "vu");
                                a(c).jqGrid("editCell", c.p.iRow - 1, c.p.iCol, false)
                            }
                            break;
                        case 40:
                            if (c.p.iRow + 1 <= c.rows.length - 1) {
                                d(c.p.iRow + 1, c.p.iCol, "vd");
                                a(c).jqGrid("editCell", c.p.iRow + 1, c.p.iCol, false)
                            }
                            break;
                        case 37:
                            if (c.p.iCol - 1 >= 0) {
                                g = e(c.p.iCol - 1, "lft");
                                d(c.p.iRow, g, "h");
                                a(c).jqGrid("editCell", c.p.iRow, g, false)
                            }
                            break;
                        case 39:
                            if (c.p.iCol + 1 <= c.p.colModel.length - 1) {
                                g = e(c.p.iCol + 1, "rgt");
                                d(c.p.iRow, g, "h");
                                a(c).jqGrid("editCell", c.p.iRow, g, false)
                            }
                            break;
                        case 13:
                            parseInt(c.p.iCol, 10) >= 0 && parseInt(c.p.iRow, 10) >= 0 && a(c).jqGrid("editCell", c.p.iRow, c.p.iCol, true)
                        }
                        return false
                    })
                }
            })
        },
        getChangedCells: function(d) {
            var e = [];
            d || (d = "all");
            this.each(function() {
                var c = this,
                f; ! c.grid || c.p.cellEdit !== true || a(c.rows).each(function(g) {
                    var h = {};
                    if (a(this).hasClass("edited")) {
                        a("td", this).each(function(j) {
                            f = c.p.colModel[j].name;
                            if (f !== "cb" && f !== "subgrid") if (d == "dirty") {
                                if (a(this).hasClass("dirty-cell")) try {
                                    h[f] = a.unformat(this, {
                                        rowId: c.rows[g].id,
                                        colModel: c.p.colModel[j]
                                    },
                                    j)
                                } catch(b) {
                                    h[f] = a.jgrid.htmlDecode(a(this).html())
                                }
                            } else try {
                                h[f] = a.unformat(this, {
                                    rowId: c.rows[g].id,
                                    colModel: c.p.colModel[j]
                                },
                                j)
                            } catch(m) {
                                h[f] = a.jgrid.htmlDecode(a(this).html())
                            }
                        });
                        h.id = this.id;
                        e.push(h)
                    }
                })
            });
            return e
        }
    })
})(jQuery); (function(a) {
    a.jgrid.extend({
        setSubGrid: function() {
            return this.each(function() {
                var d;
                this.p.subGridOptions = a.extend({
                    plusicon: "ui-icon-plus",
                    minusicon: "ui-icon-minus",
                    openicon: "ui-icon-carat-1-sw",
                    expandOnLoad: false,
                    delayOnLoad: 50,
                    selectOnExpand: false,
                    reloadOnExpand: true
                },
                this.p.subGridOptions || {});
                this.p.colNames.unshift("");
                this.p.colModel.unshift({
                    name: "subgrid",
                    width: a.browser.safari ? this.p.subGridWidth + this.p.cellLayout: this.p.subGridWidth,
                    sortable: false,
                    resizable: false,
                    hidedlg: true,
                    search: false,
                    fixed: true
                });
                d = this.p.subGridModel;
                if (d[0]) {
                    d[0].align = a.extend([], d[0].align || []);
                    for (var e = 0; e < d[0].name.length; e++) d[0].align[e] = d[0].align[e] || "left"
                }
            })
        },
        addSubGridCell: function(d, e) {
            var c = "",
            f, g;
            this.each(function() {
                c = this.formatCol(d, e);
                g = this.p.id;
                f = this.p.subGridOptions.plusicon
            });
            return '<td role="grid" aria-describedby="' + g + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + c + "><a href='javascript:void(0);'><span class='ui-icon " + f + "'></span></a></td>"
        },
        addSubGrid: function(d, e) {
            return this.each(function() {
                var c = this;
                if (c.grid) {
                    var f = function(q, r, s) {
                        r = a("<td align='" + c.p.subGridModel[0].align[s] + "'></td>").html(r);
                        a(q).append(r)
                    },
                    g = function(q, r) {
                        var s, x, A, B = a("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                        F = a("<tr></tr>");
                        for (x = 0; x < c.p.subGridModel[0].name.length; x++) {
                            s = a("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + c.p.direction + "'></th>");
                            a(s).html(c.p.subGridModel[0].name[x]);
                            a(s).width(c.p.subGridModel[0].width[x]);
                            a(F).append(s)
                        }
                        a(B).append(F);
                        if (q) {
                            A = c.p.xmlReader.subgrid;
                            a(A.root + " " + A.row, q).each(function() {
                                F = a("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                if (A.repeatitems === true) a(A.cell, this).each(function(G) {
                                    f(F, a(this).text() || "&#160;", G)
                                });
                                else {
                                    var y = c.p.subGridModel[0].mapping || c.p.subGridModel[0].name;
                                    if (y) for (x = 0; x < y.length; x++) f(F, a(y[x], this).text() || "&#160;", x)
                                }
                                a(B).append(F)
                            })
                        }
                        s = a("table:first", c.grid.bDiv).attr("id") + "_";
                        a("#" + s + r).append(B);
                        c.grid.hDiv.loading = false;
                        a("#load_" + c.p.id).hide();
                        return false
                    },
                    h = function(q, r) {
                        var s, x, A, B, F, y = a("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                        G = a("<tr></tr>");
                        for (x = 0; x < c.p.subGridModel[0].name.length; x++) {
                            s = a("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + c.p.direction + "'></th>");
                            a(s).html(c.p.subGridModel[0].name[x]);
                            a(s).width(c.p.subGridModel[0].width[x]);
                            a(G).append(s)
                        }
                        a(y).append(G);
                        if (q) {
                            B = c.p.jsonReader.subgrid;
                            s = q[B.root];
                            if (typeof s !== "undefined") for (x = 0; x < s.length; x++) {
                                A = s[x];
                                G = a("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                if (B.repeatitems === true) {
                                    if (B.cell) A = A[B.cell];
                                    for (F = 0; F < A.length; F++) f(G, A[F] || "&#160;", F)
                                } else {
                                    var S = c.p.subGridModel[0].mapping || c.p.subGridModel[0].name;
                                    if (S.length) for (F = 0; F < S.length; F++) f(G, A[S[F]] || "&#160;", F)
                                }
                                a(y).append(G)
                            }
                        }
                        x = a("table:first", c.grid.bDiv).attr("id") + "_";
                        a("#" + x + r).append(y);
                        c.grid.hDiv.loading = false;
                        a("#load_" + c.p.id).hide();
                        return false
                    },
                    j = function(q) {
                        var r, s, x, A;
                        r = a(q).attr("id");
                        s = {
                            nd_: (new Date).getTime()
                        };
                        s[c.p.prmNames.subgridid] = r;
                        if (!c.p.subGridModel[0]) return false;
                        if (c.p.subGridModel[0].params) for (A = 0; A < c.p.subGridModel[0].params.length; A++) for (x = 0; x < c.p.colModel.length; x++) if (c.p.colModel[x].name == c.p.subGridModel[0].params[A]) s[c.p.colModel[x].name] = a("td:eq(" + x + ")", q).text().replace(/\&#160\;/ig, "");
                        if (!c.grid.hDiv.loading) {
                            c.grid.hDiv.loading = true;
                            a("#load_" + c.p.id).show();
                            if (!c.p.subgridtype) c.p.subgridtype = c.p.datatype;
                            if (a.isFunction(c.p.subgridtype)) c.p.subgridtype.call(c, s);
                            else c.p.subgridtype = c.p.subgridtype.toLowerCase();
                            switch (c.p.subgridtype) {
                            case "xml":
                            case "json":
                                a.ajax(a.extend({
                                    type:
                                    c.p.mtype,
                                    url: c.p.subGridUrl,
                                    dataType: c.p.subgridtype,
                                    data: a.isFunction(c.p.serializeSubGridData) ? c.p.serializeSubGridData.call(c, s) : s,
                                    complete: function(B) {
                                        c.p.subgridtype == "xml" ? g(B.responseXML, r) : h(a.jgrid.parse(B.responseText), r)
                                    }
                                },
                                a.jgrid.ajaxOptions, c.p.ajaxSubgridOptions || {}))
                            }
                        }
                        return false
                    },
                    b,
                    m,
                    l,
                    n = 0,
                    k,
                    p;
                    a.each(c.p.colModel,
                    function() {
                        if (this.hidden === true || this.name == "rn" || this.name == "cb") n++
                    });
                    var o = c.rows.length,
                    v = 1;
                    if (e !== undefined && e > 0) {
                        v = e;
                        o = e + 1
                    }
                    for (; v < o;) {
                        a(c.rows[v]).hasClass("jqgrow") && a(c.rows[v].cells[d]).bind("click",
                        function() {
                            var q = a(this).parent("tr")[0];
                            p = q.nextSibling;
                            if (a(this).hasClass("sgcollapsed")) {
                                m = c.p.id;
                                b = q.id;
                                if (c.p.subGridOptions.reloadOnExpand === true || c.p.subGridOptions.reloadOnExpand === false && !a(p).hasClass("ui-subgrid")) {
                                    l = d >= 1 ? "<td colspan='" + d + "'>&#160;</td>": "";
                                    k = true;
                                    if (a.isFunction(c.p.subGridBeforeExpand)) k = c.p.subGridBeforeExpand.call(c, m + "_" + b, b);
                                    if (k === false) return false;
                                    a(q).after("<tr role='row' class='ui-subgrid'>" + l + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + c.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(c.p.colNames.length - 1 - n, 10) + "' class='ui-widget-content subgrid-data'><div id=" + m + "_" + b + " class='tablediv'></div></td></tr>");
                                    a.isFunction(c.p.subGridRowExpanded) ? c.p.subGridRowExpanded.call(c, m + "_" + b, b) : j(q)
                                } else a(p).show();
                                a(this).html("<a href='javascript:void(0);'><span class='ui-icon " + c.p.subGridOptions.minusicon + "'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
                                c.p.subGridOptions.selectOnExpand && a(c).jqGrid("setSelection", b)
                            } else if (a(this).hasClass("sgexpanded")) {
                                k = true;
                                if (a.isFunction(c.p.subGridRowColapsed)) {
                                    b = q.id;
                                    k = c.p.subGridRowColapsed.call(c, m + "_" + b, b)
                                }
                                if (k === false) return false;
                                if (c.p.subGridOptions.reloadOnExpand === true) a(p).remove(".ui-subgrid");
                                else a(p).hasClass("ui-subgrid") && a(p).hide();
                                a(this).html("<a href='javascript:void(0);'><span class='ui-icon " + c.p.subGridOptions.plusicon + "'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed")
                            }
                            return false
                        });
                        c.p.subGridOptions.expandOnLoad === true && a(c.rows[v].cells[d]).trigger("click");
                        v++
                    }
                    c.subGridXml = function(q, r) {
                        g(q, r)
                    };
                    c.subGridJson = function(q, r) {
                        h(q, r)
                    }
                }
            })
        },
        expandSubGridRow: function(d) {
            return this.each(function() {
                if (this.grid || d) if (this.p.subGrid === true) {
                    var e = a(this).jqGrid("getInd", d, true);
                    if (e)(e = a("td.sgcollapsed", e)[0]) && a(e).trigger("click")
                }
            })
        },
        collapseSubGridRow: function(d) {
            return this.each(function() {
                if (this.grid || d) if (this.p.subGrid === true) {
                    var e = a(this).jqGrid("getInd", d, true);
                    if (e)(e = a("td.sgexpanded", e)[0]) && a(e).trigger("click")
                }
            })
        },
        toggleSubGridRow: function(d) {
            return this.each(function() {
                if (this.grid || d) if (this.p.subGrid === true) {
                    var e = a(this).jqGrid("getInd", d, true);
                    if (e) {
                        var c = a("td.sgcollapsed", e)[0];
                        if (c) a(c).trigger("click");
                        else(c = a("td.sgexpanded", e)[0]) && a(c).trigger("click")
                    }
                }
            })
        }
    })
})(jQuery); (function(a) {
    a.jgrid.extend({
        setTreeNode: function(d, e) {
            return this.each(function() {
                var c = this;
                if (c.grid && c.p.treeGrid) for (var f = c.p.expColInd,
                g = c.p.treeReader.expanded_field,
                h = c.p.treeReader.leaf_field,
                j = c.p.treeReader.level_field,
                b = c.p.treeReader.icon_field,
                m = c.p.treeReader.loaded,
                l, n, k, p; d < e;) {
                    p = c.p.data[c.p._index[c.rows[d].id]];
                    if (c.p.treeGridModel == "nested") if (!p[h]) {
                        l = parseInt(p[c.p.treeReader.left_field], 10);
                        n = parseInt(p[c.p.treeReader.right_field], 10);
                        p[h] = n === l + 1 ? "true": "false";
                        c.rows[d].cells[c.p._treeleafpos].innerHTML = p[h]
                    }
                    l = parseInt(p[j], 10);
                    if (c.p.tree_root_level === 0) {
                        k = l + 1;
                        n = l
                    } else {
                        k = l;
                        n = l - 1
                    }
                    k = "<div class='tree-wrap tree-wrap-" + c.p.direction + "' style='width:" + k * 18 + "px;'>";
                    k += "<div style='" + (c.p.direction == "rtl" ? "right:": "left:") + n * 18 + "px;' class='ui-icon ";
                    if (p[m] !== undefined) p[m] = p[m] == "true" || p[m] === true ? true: false;
                    if (p[h] == "true" || p[h] === true) {
                        k += (p[b] !== undefined && p[b] !== "" ? p[b] : c.p.treeIcons.leaf) + " tree-leaf treeclick'";
                        p[h] = true;
                        n = "leaf"
                    } else {
                        p[h] = false;
                        n = ""
                    }
                    p[g] = (p[g] == "true" || p[g] === true ? true: false) && p[m];
                    k += p[g] === true ? c.p.treeIcons.minus + " tree-minus treeclick'": c.p.treeIcons.plus + " tree-plus treeclick'";
                    k += "</div></div>";
                    a(c.rows[d].cells[f]).wrapInner("<span class='cell-wrapper" + n + "'></span>").prepend(k);
                    if (l !== parseInt(c.p.tree_root_level, 10))(p = (p = a(c).jqGrid("getNodeParent", p)) && p.hasOwnProperty(g) ? p[g] : true) || a(c.rows[d]).css("display", "none");
                    a(c.rows[d].cells[f]).find("div.treeclick").bind("click",
                    function(o) {
                        o = a(o.target || o.srcElement, c.rows).closest("tr.jqgrow")[0].id;
                        o = c.p._index[o];
                        if (!c.p.data[o][h]) if (c.p.data[o][g]) {
                            a(c).jqGrid("collapseRow", c.p.data[o]);
                            a(c).jqGrid("collapseNode", c.p.data[o])
                        } else {
                            a(c).jqGrid("expandRow", c.p.data[o]);
                            a(c).jqGrid("expandNode", c.p.data[o])
                        }
                        return false
                    });
                    c.p.ExpandColClick === true && a(c.rows[d].cells[f]).find("span.cell-wrapper").css("cursor", "pointer").bind("click",
                    function(o) {
                        o = a(o.target || o.srcElement, c.rows).closest("tr.jqgrow")[0].id;
                        var v = c.p._index[o];
                        if (!c.p.data[v][h]) if (c.p.data[v][g]) {
                            a(c).jqGrid("collapseRow", c.p.data[v]);
                            a(c).jqGrid("collapseNode", c.p.data[v])
                        } else {
                            a(c).jqGrid("expandRow", c.p.data[v]);
                            a(c).jqGrid("expandNode", c.p.data[v])
                        }
                        a(c).jqGrid("setSelection", o);
                        return false
                    });
                    d++
                }
            })
        },
        setTreeGrid: function() {
            return this.each(function() {
                var d = this,
                e = 0,
                c = false,
                f, g, h = [];
                if (d.p.treeGrid) {
                    d.p.treedatatype || a.extend(d.p, {
                        treedatatype: d.p.datatype
                    });
                    d.p.subGrid = false;
                    d.p.altRows = false;
                    d.p.pgbuttons = false;
                    d.p.pginput = false;
                    d.p.gridview = true;
                    d.p.multiselect = false;
                    d.p.rowList = [];
                    d.p.expColInd = 0;
                    d.p.treeIcons = a.extend({
                        plus: "ui-icon-triangle-1-" + (d.p.direction == "rtl" ? "w": "e"),
                        minus: "ui-icon-triangle-1-s",
                        leaf: "ui-icon-radio-off"
                    },
                    d.p.treeIcons || {});
                    if (d.p.treeGridModel == "nested") d.p.treeReader = a.extend({
                        level_field: "level",
                        left_field: "lft",
                        right_field: "rgt",
                        leaf_field: "isLeaf",
                        expanded_field: "expanded",
                        loaded: "loaded",
                        icon_field: "icon"
                    },
                    d.p.treeReader);
                    else if (d.p.treeGridModel == "adjacency") d.p.treeReader = a.extend({
                        level_field: "level",
                        parent_id_field: "parent",
                        leaf_field: "isLeaf",
                        expanded_field: "expanded",
                        loaded: "loaded",
                        icon_field: "icon"
                    },
                    d.p.treeReader);
                    for (g in d.p.colModel) if (d.p.colModel.hasOwnProperty(g)) {
                        f = d.p.colModel[g].name;
                        if (f == d.p.ExpandColumn && !c) {
                            c = true;
                            d.p.expColInd = e
                        }
                        e++;
                        for (var j in d.p.treeReader) d.p.treeReader[j] == f && h.push(f)
                    }
                    a.each(d.p.treeReader,
                    function(b, m) {
                        if (m && a.inArray(m, h) === -1) {
                            if (b === "leaf_field") d.p._treeleafpos = e;
                            e++;
                            d.p.colNames.push(m);
                            d.p.colModel.push({
                                name: m,
                                width: 1,
                                hidden: true,
                                sortable: false,
                                resizable: false,
                                hidedlg: true,
                                editable: true,
                                search: false
                            })
                        }
                    })
                }
            })
        },
        expandRow: function(d) {
            this.each(function() {
                var e = this;
                if (e.grid && e.p.treeGrid) {
                    var c = a(e).jqGrid("getNodeChildren", d),
                    f = e.p.treeReader.expanded_field;
                    a(c).each(function() {
                        var g = a.jgrid.getAccessor(this, e.p.localReader.id);
                        a("#" + g, e.grid.bDiv).css("display", "");
                        this[f] && a(e).jqGrid("expandRow", this)
                    })
                }
            })
        },
        collapseRow: function(d) {
            this.each(function() {
                var e = this;
                if (e.grid && e.p.treeGrid) {
                    var c = a(e).jqGrid("getNodeChildren", d),
                    f = e.p.treeReader.expanded_field;
                    a(c).each(function() {
                        var g = a.jgrid.getAccessor(this, e.p.localReader.id);
                        a("#" + g, e.grid.bDiv).css("display", "none");
                        this[f] && a(e).jqGrid("collapseRow", this)
                    })
                }
            })
        },
        getRootNodes: function() {
            var d = [];
            this.each(function() {
                var e = this;
                if (e.grid && e.p.treeGrid) switch (e.p.treeGridModel) {
                case "nested":
                    var c = e.p.treeReader.level_field;
                    a(e.p.data).each(function() {
                        parseInt(this[c], 10) === parseInt(e.p.tree_root_level, 10) && d.push(this)
                    });
                    break;
                case "adjacency":
                    var f = e.p.treeReader.parent_id_field;
                    a(e.p.data).each(function() {
                        if (this[f] === null || String(this[f]).toLowerCase() == "null") d.push(this)
                    })
                }
            });
            return d
        },
        getNodeDepth: function(d) {
            var e = null;
            this.each(function() {
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                case "nested":
                    e = parseInt(d[this.p.treeReader.level_field], 10) - parseInt(this.p.tree_root_level, 10);
                    break;
                case "adjacency":
                    e = a(this).jqGrid("getNodeAncestors", d).length
                }
            });
            return e
        },
        getNodeParent: function(d) {
            var e = null;
            this.each(function() {
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                case "nested":
                    var c = this.p.treeReader.left_field,
                    f = this.p.treeReader.right_field,
                    g = this.p.treeReader.level_field,
                    h = parseInt(d[c], 10),
                    j = parseInt(d[f], 10),
                    b = parseInt(d[g], 10);
                    a(this.p.data).each(function() {
                        if (parseInt(this[g], 10) === b - 1 && parseInt(this[c], 10) < h && parseInt(this[f], 10) > j) {
                            e = this;
                            return false
                        }
                    });
                    break;
                case "adjacency":
                    var m = this.p.treeReader.parent_id_field,
                    l = this.p.localReader.id;
                    a(this.p.data).each(function() {
                        if (this[l] == d[m]) {
                            e = this;
                            return false
                        }
                    })
                }
            });
            return e
        },
        getNodeChildren: function(d) {
            var e = [];
            this.each(function() {
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                case "nested":
                    var c = this.p.treeReader.left_field,
                    f = this.p.treeReader.right_field,
                    g = this.p.treeReader.level_field,
                    h = parseInt(d[c], 10),
                    j = parseInt(d[f], 10),
                    b = parseInt(d[g], 10);
                    a(this.p.data).each(function() {
                        parseInt(this[g], 10) === b + 1 && parseInt(this[c], 10) > h && parseInt(this[f], 10) < j && e.push(this)
                    });
                    break;
                case "adjacency":
                    var m = this.p.treeReader.parent_id_field,
                    l = this.p.localReader.id;
                    a(this.p.data).each(function() {
                        this[m] == d[l] && e.push(this)
                    })
                }
            });
            return e
        },
        getFullTreeNode: function(d) {
            var e = [];
            this.each(function() {
                var c;
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                case "nested":
                    var f = this.p.treeReader.left_field,
                    g = this.p.treeReader.right_field,
                    h = this.p.treeReader.level_field,
                    j = parseInt(d[f], 10),
                    b = parseInt(d[g], 10),
                    m = parseInt(d[h], 10);
                    a(this.p.data).each(function() {
                        parseInt(this[h], 10) >= m && parseInt(this[f], 10) >= j && parseInt(this[f], 10) <= b && e.push(this)
                    });
                    break;
                case "adjacency":
                    if (d) {
                        e.push(d);
                        var l = this.p.treeReader.parent_id_field,
                        n = this.p.localReader.id;
                        a(this.p.data).each(function(k) {
                            c = e.length;
                            for (k = 0; k < c; k++) if (e[k][n] == this[l]) {
                                e.push(this);
                                break
                            }
                        })
                    }
                }
            });
            return e
        },
        getNodeAncestors: function(d) {
            var e = [];
            this.each(function() {
                if (this.grid && this.p.treeGrid) for (var c = a(this).jqGrid("getNodeParent", d); c;) {
                    e.push(c);
                    c = a(this).jqGrid("getNodeParent", c)
                }
            });
            return e
        },
        isVisibleNode: function(d) {
            var e = true;
            this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var c = a(this).jqGrid("getNodeAncestors", d),
                    f = this.p.treeReader.expanded_field;
                    a(c).each(function() {
                        e = e && this[f];
                        if (!e) return false
                    })
                }
            });
            return e
        },
        isNodeLoaded: function(d) {
            var e;
            this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var c = this.p.treeReader.leaf_field;
                    e = d !== undefined ? d.loaded !== undefined ? d.loaded: d[c] || a(this).jqGrid("getNodeChildren", d).length > 0 ? true: false: false
                }
            });
            return e
        },
        expandNode: function(d) {
            return this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var e = this.p.treeReader.expanded_field,
                    c = this.p.treeReader.parent_id_field,
                    f = this.p.treeReader.loaded,
                    g = this.p.treeReader.level_field,
                    h = this.p.treeReader.left_field,
                    j = this.p.treeReader.right_field;
                    if (!d[e]) {
                        var b = a.jgrid.getAccessor(d, this.p.localReader.id),
                        m = a("#" + b, this.grid.bDiv)[0],
                        l = this.p._index[b];
                        if (a(this).jqGrid("isNodeLoaded", this.p.data[l])) {
                            d[e] = true;
                            a("div.treeclick", m).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus")
                        } else {
                            d[e] = true;
                            a("div.treeclick", m).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus");
                            this.p.treeANode = m.rowIndex;
                            this.p.datatype = this.p.treedatatype;
                            this.p.treeGridModel == "nested" ? a(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: b,
                                    n_left: d[h],
                                    n_right: d[j],
                                    n_level: d[g]
                                }
                            }) : a(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: b,
                                    parentid: d[c],
                                    n_level: d[g]
                                }
                            });
                            a(this).trigger("reloadGrid");
                            d[f] = true;
                            this.p.treeGridModel == "nested" ? a(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: "",
                                    n_left: "",
                                    n_right: "",
                                    n_level: ""
                                }
                            }) : a(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: "",
                                    parentid: "",
                                    n_level: ""
                                }
                            })
                        }
                    }
                }
            })
        },
        collapseNode: function(d) {
            return this.each(function() {
                if (this.grid && this.p.treeGrid) if (d.expanded) {
                    d.expanded = false;
                    var e = a.jgrid.getAccessor(d, this.p.localReader.id);
                    e = a("#" + e, this.grid.bDiv)[0];
                    a("div.treeclick", e).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus")
                }
            })
        },
        SortTree: function(d, e, c, f) {
            return this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var g, h, j, b = [],
                    m = this,
                    l;
                    g = a(this).jqGrid("getRootNodes");
                    g = a.jgrid.from(g);
                    g.orderBy(d, e, c, f);
                    l = g.select();
                    g = 0;
                    for (h = l.length; g < h; g++) {
                        j = l[g];
                        b.push(j);
                        a(this).jqGrid("collectChildrenSortTree", b, j, d, e, c, f)
                    }
                    a.each(b,
                    function(n) {
                        var k = a.jgrid.getAccessor(this, m.p.localReader.id);
                        a("#" + m.p.id + " tbody tr:eq(" + n + ")").after(a("tr#" + k, m.grid.bDiv))
                    });
                    b = l = g = null
                }
            })
        },
        collectChildrenSortTree: function(d, e, c, f, g, h) {
            return this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var j, b, m, l;
                    j = a(this).jqGrid("getNodeChildren", e);
                    j = a.jgrid.from(j);
                    j.orderBy(c, f, g, h);
                    l = j.select();
                    j = 0;
                    for (b = l.length; j < b; j++) {
                        m = l[j];
                        d.push(m);
                        a(this).jqGrid("collectChildrenSortTree", d, m, c, f, g, h)
                    }
                }
            })
        },
        setTreeRow: function(d, e) {
            var c = false;
            this.each(function() {
                if (this.grid && this.p.treeGrid) c = a(this).jqGrid("setRowData", d, e)
            });
            return c
        },
        delTreeNode: function(d) {
            return this.each(function() {
                var e = this.p.localReader.id,
                c = this.p.treeReader.left_field,
                f = this.p.treeReader.right_field,
                g, h, j;
                if (this.grid && this.p.treeGrid) {
                    var b = this.p._index[d];
                    if (b !== undefined) {
                        g = parseInt(this.p.data[b][f], 10);
                        h = g - parseInt(this.p.data[b][c], 10) + 1;
                        b = a(this).jqGrid("getFullTreeNode", this.p.data[b]);
                        if (b.length > 0) for (var m = 0; m < b.length; m++) a(this).jqGrid("delRowData", b[m][e]);
                        if (this.p.treeGridModel === "nested") {
                            e = a.jgrid.from(this.p.data).greater(c, g, {
                                stype: "integer"
                            }).select();
                            if (e.length) for (j in e) e[j][c] = parseInt(e[j][c], 10) - h;
                            e = a.jgrid.from(this.p.data).greater(f, g, {
                                stype: "integer"
                            }).select();
                            if (e.length) for (j in e) e[j][f] = parseInt(e[j][f], 10) - h
                        }
                    }
                }
            })
        },
        addChildNode: function(d, e, c) {
            var f = this[0];
            if (c) {
                var g = f.p.treeReader.expanded_field,
                h = f.p.treeReader.leaf_field,
                j = f.p.treeReader.level_field,
                b = f.p.treeReader.parent_id_field,
                m = f.p.treeReader.left_field,
                l = f.p.treeReader.right_field,
                n = f.p.treeReader.loaded,
                k, p, o, v, q;
                k = 0;
                var r = e,
                s;
                if (!d) {
                    q = f.p.data.length - 1;
                    if (q >= 0) for (; q >= 0;) {
                        k = Math.max(k, parseInt(f.p.data[q][f.p.localReader.id], 10));
                        q--
                    }
                    d = k + 1
                }
                var x = a(f).jqGrid("getInd", e);
                s = false;
                if (e === undefined || e === null || e === "") {
                    r = e = null;
                    k = "last";
                    v = f.p.tree_root_level;
                    q = f.p.data.length + 1
                } else {
                    k = "after";
                    p = f.p._index[e];
                    o = f.p.data[p];
                    e = o[f.p.localReader.id];
                    v = parseInt(o[j], 10) + 1;
                    q = a(f).jqGrid("getFullTreeNode", o);
                    if (q.length) {
                        r = q = q[q.length - 1][f.p.localReader.id];
                        q = a(f).jqGrid("getInd", r) + 1
                    } else q = a(f).jqGrid("getInd", e) + 1;
                    if (o[h]) {
                        s = true;
                        o[g] = true;
                        a(f.rows[x]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(f.p.treeIcons.leaf + " tree-leaf").addClass(f.p.treeIcons.minus + " tree-minus");
                        f.p.data[p][h] = false;
                        o[n] = true
                    }
                }
                p = q + 1;
                c[g] = false;
                c[n] = true;
                c[j] = v;
                c[h] = true;
                if (f.p.treeGridModel === "adjacency") c[b] = e;
                if (f.p.treeGridModel === "nested") {
                    var A;
                    if (e !== null) {
                        h = parseInt(o[l], 10);
                        j = a.jgrid.from(f.p.data);
                        j = j.greaterOrEquals(l, h, {
                            stype: "integer"
                        });
                        j = j.select();
                        if (j.length) for (A in j) {
                            j[A][m] = j[A][m] > h ? parseInt(j[A][m], 10) + 2 : j[A][m];
                            j[A][l] = j[A][l] >= h ? parseInt(j[A][l], 10) + 2 : j[A][l]
                        }
                        c[m] = h;
                        c[l] = h + 1
                    } else {
                        h = parseInt(a(f).jqGrid("getCol", l, false, "max"), 10);
                        j = a.jgrid.from(f.p.data).greater(m, h, {
                            stype: "integer"
                        }).select();
                        if (j.length) for (A in j) j[A][m] = parseInt(j[A][m], 10) + 2;
                        j = a.jgrid.from(f.p.data).greater(l, h, {
                            stype: "integer"
                        }).select();
                        if (j.length) for (A in j) j[A][l] = parseInt(j[A][l], 10) + 2;
                        c[m] = h + 1;
                        c[l] = h + 2
                    }
                }
                if (e === null || a(f).jqGrid("isNodeLoaded", o) || s) {
                    a(f).jqGrid("addRowData", d, c, k, r);
                    a(f).jqGrid("setTreeNode", q, p)
                }
                o && !o[g] && a(f.rows[x]).find("div.treeclick").click()
            }
        }
    })
})(jQuery); (function(a) {
    a.jgrid.extend({
        groupingSetup: function() {
            return this.each(function() {
                var d = this.p.groupingView;
                if (d !== null && (typeof d === "object" || a.isFunction(d))) if (d.groupField.length) {
                    if (typeof d.visibiltyOnNextGrouping == "undefined") d.visibiltyOnNextGrouping = [];
                    for (var e = 0; e < d.groupField.length; e++) {
                        d.groupOrder[e] || (d.groupOrder[e] = "asc");
                        d.groupText[e] || (d.groupText[e] = "{0}");
                        if (typeof d.groupColumnShow[e] != "boolean") d.groupColumnShow[e] = true;
                        if (typeof d.groupSummary[e] != "boolean") d.groupSummary[e] = false;
                        if (d.groupColumnShow[e] === true) {
                            d.visibiltyOnNextGrouping[e] = true;
                            a(this).jqGrid("showCol", d.groupField[e])
                        } else {
                            d.visibiltyOnNextGrouping[e] = a("#" + this.p.id + "_" + d.groupField[e]).is(":visible");
                            a(this).jqGrid("hideCol", d.groupField[e])
                        }
                        d.sortitems[e] = [];
                        d.sortnames[e] = [];
                        d.summaryval[e] = [];
                        if (d.groupSummary[e]) {
                            d.summary[e] = [];
                            for (var c = this.p.colModel,
                            f = 0,
                            g = c.length; f < g; f++) c[f].summaryType && d.summary[e].push({
                                nm: c[f].name,
                                st: c[f].summaryType,
                                v: ""
                            })
                        }
                    }
                    this.p.scroll = false;
                    this.p.rownumbers = false;
                    this.p.subGrid = false;
                    this.p.treeGrid = false;
                    this.p.gridview = true
                } else this.p.grouping = false;
                else this.p.grouping = false
            })
        },
        groupingPrepare: function(d, e, c, f) {
            this.each(function() {
                e[0] += "";
                var g = e[0].toString().split(" ").join(""),
                h = this.p.groupingView,
                j = this;
                if (c.hasOwnProperty(g)) c[g].push(d);
                else {
                    c[g] = [];
                    c[g].push(d);
                    h.sortitems[0].push(g);
                    h.sortnames[0].push(a.trim(e[0].toString()));
                    h.summaryval[0][g] = a.extend(true, [], h.summary[0])
                }
                h.groupSummary[0] && a.each(h.summaryval[0][g],
                function() {
                    this.v = a.isFunction(this.st) ? this.st.call(j, this.v, this.nm, f) : a(j).jqGrid("groupingCalculations." + this.st, this.v, this.nm, f)
                })
            });
            return c
        },
        groupingToggle: function(d) {
            this.each(function() {
                var e = this.p.groupingView,
                c = d.lastIndexOf("_"),
                f = d.substring(0, c + 1);
                c = parseInt(d.substring(c + 1), 10) + 1;
                var g = e.minusicon,
                h = e.plusicon,
                j = a("#" + d)[0].nextSibling,
                b = a("#" + d + " span.tree-wrap-" + this.p.direction),
                m = false;
                if (b.hasClass(g)) {
                    if (e.showSummaryOnHide && e.groupSummary[0]) {
                        if (j) for (; j;) {
                            if (a(j).hasClass("jqfoot")) break;
                            a(j).hide();
                            j = j.nextSibling
                        }
                    } else if (j) for (; j;) {
                        if (a(j).attr("id") == f + String(c)) break;
                        a(j).hide();
                        j = j.nextSibling
                    }
                    b.removeClass(g).addClass(h);
                    m = true
                } else {
                    if (j) for (; j;) {
                        if (a(j).attr("id") == f + String(c)) break;
                        a(j).show();
                        j = j.nextSibling
                    }
                    b.removeClass(h).addClass(g);
                    m = false
                }
                a.isFunction(this.p.onClickGroup) && this.p.onClickGroup.call(this, d, m)
            });
            return false
        },
        groupingRender: function(d, e) {
            return this.each(function() {
                var c = this,
                f = c.p.groupingView,
                g = "",
                h = "",
                j, b = "",
                m, l, n;
                if (!f.groupDataSorted) {
                    f.sortitems[0].sort();
                    f.sortnames[0].sort();
                    if (f.groupOrder[0].toLowerCase() == "desc") {
                        f.sortitems[0].reverse();
                        f.sortnames[0].reverse()
                    }
                }
                b = f.groupCollapse ? f.plusicon: f.minusicon;
                b += " tree-wrap-" + c.p.direction;
                for (n = 0; n < e;) {
                    if (c.p.colModel[n].name == f.groupField[0]) {
                        l = n;
                        break
                    }
                    n++
                }
                a.each(f.sortitems[0],
                function(k, p) {
                    j = c.p.id + "ghead_" + k;
                    h = "<span style='cursor:pointer;' class='ui-icon " + b + "' onclick=\"jQuery('#" + c.p.id + "').jqGrid('groupingToggle','" + j + "');return false;\"></span>";
                    try {
                        m = c.formatter(j, f.sortnames[0][k], l, f.sortitems[0])
                    } catch(o) {
                        m = f.sortnames[0][k]
                    }
                    g += '<tr id="' + j + '" role="row" class= "ui-widget-content jqgroup ui-row-' + c.p.direction + '"><td colspan="' + e + '">' + h + a.jgrid.format(f.groupText[0], m, d[p].length) + "</td></tr>";
                    for (var v = 0; v < d[p].length; v++) g += d[p][v].join("");
                    if (f.groupSummary[0]) {
                        v = "";
                        if (f.groupCollapse && !f.showSummaryOnHide) v = ' style="display:none;"';
                        g += "<tr" + v + ' role="row" class="ui-widget-content jqfoot ui-row-' + c.p.direction + '">';
                        v = f.summaryval[0][p];
                        for (var q = c.p.colModel,
                        r, s = d[p].length, x = 0; x < e; x++) {
                            var A = "<td " + c.formatCol(x, 1, "") + ">&#160;</td>",
                            B = "{0}";
                            a.each(v,
                            function() {
                                if (this.nm == q[x].name) {
                                    if (q[x].summaryTpl) B = q[x].summaryTpl;
                                    if (this.st == "avg") if (this.v && s > 0) this.v /= s;
                                    try {
                                        r = c.formatter("", this.v, x, this)
                                    } catch(F) {
                                        r = this.v
                                    }
                                    A = "<td " + c.formatCol(x, 1, "") + ">" + a.jgrid.format(B, r) + "</td>";
                                    return false
                                }
                            });
                            g += A
                        }
                        g += "</tr>"
                    }
                });
                a("#" + c.p.id + " tbody:first").append(g);
                g = null
            })
        },
        groupingGroupBy: function(d, e) {
            return this.each(function() {
                if (typeof d == "string") d = [d];
                var c = this.p.groupingView;
                this.p.grouping = true;
                for (var f = 0; f < c.groupField.length; f++) ! c.groupColumnShow[f] && c.visibiltyOnNextGrouping[f] && a(this).jqGrid("showCol", c.groupField[f]);
                for (f = 0; f < d.length; f++) c.visibiltyOnNextGrouping[f] = a("#" + this.p.id + "_" + d[f]).is(":visible");
                this.p.groupingView = a.extend(this.p.groupingView, e || {});
                c.groupField = d;
                a(this).trigger("reloadGrid")
            })
        },
        groupingRemove: function(d) {
            return this.each(function() {
                if (typeof d == "undefined") d = true;
                this.p.grouping = false;
                if (d === true) {
                    for (var e = this.p.groupingView,
                    c = 0; c < e.groupField.length; c++) ! e.groupColumnShow[c] && e.visibiltyOnNextGrouping[c] && a(this).jqGrid("showCol", e.groupField);
                    a("tr.jqgroup, tr.jqfoot", "#" + this.p.id + " tbody:first").remove();
                    a("tr.jqgrow:hidden", "#" + this.p.id + " tbody:first").show()
                } else a(this).trigger("reloadGrid")
            })
        },
        groupingCalculations: {
            sum: function(d, e, c) {
                return parseFloat(d || 0) + parseFloat(c[e] || 0)
            },
            min: function(d, e, c) {
                if (d === "") return parseFloat(c[e] || 0);
                return Math.min(parseFloat(d), parseFloat(c[e] || 0))
            },
            max: function(d, e, c) {
                if (d === "") return parseFloat(c[e] || 0);
                return Math.max(parseFloat(d), parseFloat(c[e] || 0))
            },
            count: function(d, e, c) {
                if (d === "") d = 0;
                return c.hasOwnProperty(e) ? d + 1 : 0
            },
            avg: function(d, e, c) {
                return parseFloat(d || 0) + parseFloat(c[e] || 0)
            }
        }
    })
})(jQuery); (function(a) {
    a.jgrid.extend({
        jqGridImport: function(d) {
            d = a.extend({
                imptype: "xml",
                impstring: "",
                impurl: "",
                mtype: "GET",
                impData: {},
                xmlGrid: {
                    config: "roots>grid",
                    data: "roots>rows"
                },
                jsonGrid: {
                    config: "grid",
                    data: "data"
                },
                ajaxOptions: {}
            },
            d || {});
            return this.each(function() {
                var e = this,
                c = function(h, j) {
                    var b = a(j.xmlGrid.config, h)[0],
                    m = a(j.xmlGrid.data, h)[0],
                    l;
                    if (xmlJsonClass.xml2json && a.jgrid.parse) {
                        b = xmlJsonClass.xml2json(b, " ");
                        b = a.jgrid.parse(b);
                        for (var n in b) if (b.hasOwnProperty(n)) l = b[n];
                        if (m) {
                            m = b.grid.datatype;
                            b.grid.datatype = "xmlstring";
                            b.grid.datastr = h;
                            a(e).jqGrid(l).jqGrid("setGridParam", {
                                datatype: m
                            })
                        } else a(e).jqGrid(l)
                    } else alert("xml2json or parse are not present")
                },
                f = function(h, j) {
                    if (h && typeof h == "string") {
                        var b = a.jgrid.parse(h),
                        m = b[j.jsonGrid.config];
                        if (b = b[j.jsonGrid.data]) {
                            var l = m.datatype;
                            m.datatype = "jsonstring";
                            m.datastr = b;
                            a(e).jqGrid(m).jqGrid("setGridParam", {
                                datatype: l
                            })
                        } else a(e).jqGrid(m)
                    }
                };
                switch (d.imptype) {
                case "xml":
                    a.ajax(a.extend({
                        url:
                        d.impurl,
                        type: d.mtype,
                        data: d.impData,
                        dataType: "xml",
                        complete: function(h, j) {
                            if (j == "success") {
                                c(h.responseXML, d);
                                a.isFunction(d.importComplete) && d.importComplete(h)
                            }
                        }
                    },
                    d.ajaxOptions));
                    break;
                case "xmlstring":
                    if (d.impstring && typeof d.impstring == "string") {
                        var g = a.jgrid.stringToDoc(d.impstring);
                        if (g) {
                            c(g, d);
                            a.isFunction(d.importComplete) && d.importComplete(g);
                            d.impstring = null
                        }
                        g = null
                    }
                    break;
                case "json":
                    a.ajax(a.extend({
                        url:
                        d.impurl,
                        type: d.mtype,
                        data: d.impData,
                        dataType: "json",
                        complete: function(h, j) {
                            if (j == "success") {
                                f(h.responseText, d);
                                a.isFunction(d.importComplete) && d.importComplete(h)
                            }
                        }
                    },
                    d.ajaxOptions));
                    break;
                case "jsonstring":
                    if (d.impstring && typeof d.impstring == "string") {
                        f(d.impstring, d);
                        a.isFunction(d.importComplete) && d.importComplete(d.impstring);
                        d.impstring = null
                    }
                }
            })
        },
        jqGridExport: function(d) {
            d = a.extend({
                exptype: "xmlstring",
                root: "grid",
                ident: "\t"
            },
            d || {});
            var e = null;
            this.each(function() {
                if (this.grid) {
                    var c = a.extend({},
                    a(this).jqGrid("getGridParam"));
                    if (c.rownumbers) {
                        c.colNames.splice(0, 1);
                        c.colModel.splice(0, 1)
                    }
                    if (c.multiselect) {
                        c.colNames.splice(0, 1);
                        c.colModel.splice(0, 1)
                    }
                    if (c.subGrid) {
                        c.colNames.splice(0, 1);
                        c.colModel.splice(0, 1)
                    }
                    c.knv = null;
                    if (c.treeGrid) for (var f in c.treeReader) if (c.treeReader.hasOwnProperty(f)) {
                        c.colNames.splice(c.colNames.length - 1);
                        c.colModel.splice(c.colModel.length - 1)
                    }
                    switch (d.exptype) {
                    case "xmlstring":
                        e = "<" + d.root + ">" + xmlJsonClass.json2xml(c, d.ident) + "</" + d.root + ">";
                        break;
                    case "jsonstring":
                        e = "{" + xmlJsonClass.toJson(c, d.root, d.ident, false) + "}";
                        if (c.postData.filters !== undefined) {
                            e = e.replace(/filters":"/, 'filters":');
                            e = e.replace(/}]}"/, "}]}")
                        }
                    }
                }
            });
            return e
        },
        excelExport: function(d) {
            d = a.extend({
                exptype: "remote",
                url: null,
                oper: "oper",
                tag: "excel",
                exportOptions: {}
            },
            d || {});
            return this.each(function() {
                if (this.grid) {
                    var e;
                    if (d.exptype == "remote") {
                        e = a.extend({},
                        this.p.postData);
                        e[d.oper] = d.tag;
                        e = jQuery.param(e);
                        e = d.url.indexOf("?") != -1 ? d.url + "&" + e: d.url + "?" + e;
                        window.location = e
                    }
                }
            })
        }
    })
})(jQuery); (function(a) {
    if (a.browser.msie && a.browser.version == 8) a.expr[":"].hidden = function(e) {
        return e.offsetWidth === 0 || e.offsetHeight === 0 || e.style.display == "none"
    };
    a.jgrid._multiselect = false;
    if (a.ui) if (a.ui.multiselect) {
        if (a.ui.multiselect.prototype._setSelected) {
            var d = a.ui.multiselect.prototype._setSelected;
            a.ui.multiselect.prototype._setSelected = function(e, c) {
                var f = d.call(this, e, c);
                if (c && this.selectedList) {
                    var g = this.element;
                    this.selectedList.find("li").each(function() {
                        a(this).data("optionLink") && a(this).data("optionLink").remove().appendTo(g)
                    })
                }
                return f
            }
        }
        if (a.ui.multiselect.prototype.destroy) a.ui.multiselect.prototype.destroy = function() {
            this.element.show();
            this.container.remove();
            a.Widget === undefined ? a.widget.prototype.destroy.apply(this, arguments) : a.Widget.prototype.destroy.apply(this, arguments)
        };
        a.jgrid._multiselect = true
    }
    a.jgrid.extend({
        sortableColumns: function(e) {
            return this.each(function() {
                function c() {
                    f.p.disableClick = true
                }
                var f = this,
                g = f.p.id;
                g = {
                    tolerance: "pointer",
                    axis: "x",
                    scrollSensitivity: "1",
                    items: ">th:not(:has(#jqgh_" + g + "_cb,#jqgh_" + g + "_rn,#jqgh_" + g + "_subgrid),:hidden)",
                    placeholder: {
                        element: function(j) {
                            return a(document.createElement(j[0].nodeName)).addClass(j[0].className + " ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]
                        },
                        update: function(j, b) {
                            b.height(j.currentItem.innerHeight() - parseInt(j.currentItem.css("paddingTop") || 0, 10) - parseInt(j.currentItem.css("paddingBottom") || 0, 10));
                            b.width(j.currentItem.innerWidth() - parseInt(j.currentItem.css("paddingLeft") || 0, 10) - parseInt(j.currentItem.css("paddingRight") || 0, 10))
                        }
                    },
                    update: function(j, b) {
                        var m = a(b.item).parent();
                        m = a(">th", m);
                        var l = {},
                        n = f.p.id + "_";
                        a.each(f.p.colModel,
                        function(p) {
                            l[this.name] = p
                        });
                        var k = [];
                        m.each(function() {
                            var p = a(">div", this).get(0).id.replace(/^jqgh_/, "").replace(n, "");
                            p in l && k.push(l[p])
                        });
                        a(f).jqGrid("remapColumns", k, true, true);
                        a.isFunction(f.p.sortable.update) && f.p.sortable.update(k);
                        setTimeout(function() {
                            f.p.disableClick = false
                        },
                        50)
                    }
                };
                if (f.p.sortable.options) a.extend(g, f.p.sortable.options);
                else if (a.isFunction(f.p.sortable)) f.p.sortable = {
                    update: f.p.sortable
                };
                if (g.start) {
                    var h = g.start;
                    g.start = function(j, b) {
                        c();
                        h.call(this, j, b)
                    }
                } else g.start = c;
                if (f.p.sortable.exclude) g.items += ":not(" + f.p.sortable.exclude + ")";
                e.sortable(g).data("sortable").floating = true
            })
        },
        columnChooser: function(e) {
            function c(k, p) {
                if (k) if (typeof k == "string") a.fn[k] && a.fn[k].apply(p, a.makeArray(arguments).slice(2));
                else a.isFunction(k) && k.apply(p, a.makeArray(arguments).slice(2))
            }
            var f = this;
            if (!a("#colchooser_" + f[0].p.id).length) {
                var g = a('<div id="colchooser_' + f[0].p.id + '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'),
                h = a("select", g);
                e = a.extend({
                    width: 420,
                    height: 240,
                    classname: null,
                    done: function(k) {
                        k && f.jqGrid("remapColumns", k, true)
                    },
                    msel: "multiselect",
                    dlog: "dialog",
                    dlog_opts: function(k) {
                        var p = {};
                        p[k.bSubmit] = function() {
                            k.apply_perm();
                            k.cleanup(false)
                        };
                        p[k.bCancel] = function() {
                            k.cleanup(true)
                        };
                        return {
                            buttons: p,
                            close: function() {
                                k.cleanup(true)
                            },
                            modal: k.modal ? k.modal: false,
                            resizable: k.resizable ? k.resizable: true,
                            width: k.width + 20
                        }
                    },
                    apply_perm: function() {
                        a("option", h).each(function() {
                            this.selected ? f.jqGrid("showCol", j[this.value].name) : f.jqGrid("hideCol", j[this.value].name)
                        });
                        var k = [];
                        a("option[selected]", h).each(function() {
                            k.push(parseInt(this.value, 10))
                        });
                        a.each(k,
                        function() {
                            delete m[j[parseInt(this, 10)].name]
                        });
                        a.each(m,
                        function() {
                            var p = parseInt(this, 10);
                            var o = k,
                            v = p;
                            if (v >= 0) {
                                var q = o.slice(),
                                r = q.splice(v, Math.max(o.length - v, v));
                                if (v > o.length) v = o.length;
                                q[v] = p;
                                k = q.concat(r)
                            } else k = void 0
                        });
                        e.done && e.done.call(f, k)
                    },
                    cleanup: function(k) {
                        c(e.dlog, g, "destroy");
                        c(e.msel, h, "destroy");
                        g.remove();
                        k && e.done && e.done.call(f)
                    },
                    msel_opts: {}
                },
                a.jgrid.col, e || {});
                if (a.ui) if (a.ui.multiselect) if (e.msel == "multiselect") {
                    if (!a.jgrid._multiselect) {
                        alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");
                        return
                    }
                    e.msel_opts = a.extend(a.ui.multiselect.defaults, e.msel_opts)
                }
                e.caption && g.attr("title", e.caption);
                if (e.classname) {
                    g.addClass(e.classname);
                    h.addClass(e.classname)
                }
                if (e.width) {
                    a(">div", g).css({
                        width: e.width,
                        margin: "0 auto"
                    });
                    h.css("width", e.width)
                }
                if (e.height) {
                    a(">div", g).css("height", e.height);
                    h.css("height", e.height - 10)
                }
                var j = f.jqGrid("getGridParam", "colModel"),
                b = f.jqGrid("getGridParam", "colNames"),
                m = {},
                l = [];
                h.empty();
                a.each(j,
                function(k) {
                    m[this.name] = k;
                    if (this.hidedlg) this.hidden || l.push(k);
                    else h.append("<option value='" + k + "' " + (this.hidden ? "": "selected='selected'") + ">" + b[k] + "</option>")
                });
                var n = a.isFunction(e.dlog_opts) ? e.dlog_opts.call(f, e) : e.dlog_opts;
                c(e.dlog, g, n);
                n = a.isFunction(e.msel_opts) ? e.msel_opts.call(f, e) : e.msel_opts;
                c(e.msel, h, n)
            }
        },
        sortableRows: function(e) {
            return this.each(function() {
                var c = this;
                if (c.grid) if (!c.p.treeGrid) if (a.fn.sortable) {
                    e = a.extend({
                        cursor: "move",
                        axis: "y",
                        items: ".jqgrow"
                    },
                    e || {});
                    if (e.start && a.isFunction(e.start)) {
                        e._start_ = e.start;
                        delete e.start
                    } else e._start_ = false;
                    if (e.update && a.isFunction(e.update)) {
                        e._update_ = e.update;
                        delete e.update
                    } else e._update_ = false;
                    e.start = function(f, g) {
                        a(g.item).css("border-width", "0px");
                        a("td", g.item).each(function(b) {
                            this.style.width = c.grid.cols[b].style.width
                        });
                        if (c.p.subGrid) {
                            var h = a(g.item).attr("id");
                            try {
                                a(c).jqGrid("collapseSubGridRow", h)
                            } catch(j) {}
                        }
                        e._start_ && e._start_.apply(this, [f, g])
                    };
                    e.update = function(f, g) {
                        a(g.item).css("border-width", "");
                        c.p.rownumbers === true && a("td.jqgrid-rownum", c.rows).each(function(h) {
                            a(this).html(h + 1)
                        });
                        e._update_ && e._update_.apply(this, [f, g])
                    };
                    a("tbody:first", c).sortable(e);
                    a("tbody:first", c).disableSelection()
                }
            })
        },
        gridDnD: function(e) {
            return this.each(function() {
                function c() {
                    var h = a.data(f, "dnd");
                    a("tr.jqgrow:not(.ui-draggable)", f).draggable(a.isFunction(h.drag) ? h.drag.call(a(f), h) : h.drag)
                }
                var f = this;
                if (f.grid) if (!f.p.treeGrid) if (a.fn.draggable && a.fn.droppable) {
                    a("#jqgrid_dnd").html() === null && a("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>");
                    if (typeof e == "string" && e == "updateDnD" && f.p.jqgdnd === true) c();
                    else {
                        e = a.extend({
                            drag: function(h) {
                                return a.extend({
                                    start: function(j, b) {
                                        if (f.p.subGrid) {
                                            var m = a(b.helper).attr("id");
                                            try {
                                                a(f).jqGrid("collapseSubGridRow", m)
                                            } catch(l) {}
                                        }
                                        for (m = 0; m < a.data(f, "dnd").connectWith.length; m++) a(a.data(f, "dnd").connectWith[m]).jqGrid("getGridParam", "reccount") == "0" && a(a.data(f, "dnd").connectWith[m]).jqGrid("addRowData", "jqg_empty_row", {});
                                        b.helper.addClass("ui-state-highlight");
                                        a("td", b.helper).each(function(n) {
                                            this.style.width = f.grid.headers[n].width + "px"
                                        });
                                        h.onstart && a.isFunction(h.onstart) && h.onstart.call(a(f), j, b)
                                    },
                                    stop: function(j, b) {
                                        if (b.helper.dropped) {
                                            var m = a(b.helper).attr("id");
                                            a(f).jqGrid("delRowData", m)
                                        }
                                        for (m = 0; m < a.data(f, "dnd").connectWith.length; m++) a(a.data(f, "dnd").connectWith[m]).jqGrid("delRowData", "jqg_empty_row");
                                        h.onstop && a.isFunction(h.onstop) && h.onstop.call(a(f), j, b)
                                    }
                                },
                                h.drag_opts || {})
                            },
                            drop: function(h) {
                                return a.extend({
                                    accept: function(j) {
                                        if (!a(j).hasClass("jqgrow")) return j;
                                        var b = a(j).closest("table.ui-jqgrid-btable");
                                        if (b.length > 0 && a.data(b[0], "dnd") !== undefined) {
                                            j = a.data(b[0], "dnd").connectWith;
                                            return a.inArray("#" + this.id, j) != -1 ? true: false
                                        }
                                        return j
                                    },
                                    drop: function(j, b) {
                                        if (a(b.draggable).hasClass("jqgrow")) {
                                            var m = a(b.draggable).attr("id");
                                            m = b.draggable.parent().parent().jqGrid("getRowData", m);
                                            if (!h.dropbyname) {
                                                var l = 0,
                                                n = {},
                                                k, p = a("#" + this.id).jqGrid("getGridParam", "colModel");
                                                try {
                                                    for (var o in m) {
                                                        if (m.hasOwnProperty(o) && p[l]) {
                                                            k = p[l].name;
                                                            n[k] = m[o]
                                                        }
                                                        l++
                                                    }
                                                    m = n
                                                } catch(v) {}
                                            }
                                            b.helper.dropped = true;
                                            if (h.beforedrop && a.isFunction(h.beforedrop)) {
                                                k = h.beforedrop.call(this, j, b, m, a("#" + f.id), a(this));
                                                if (typeof k != "undefined" && k !== null && typeof k == "object") m = k
                                            }
                                            if (b.helper.dropped) {
                                                var q;
                                                if (h.autoid) if (a.isFunction(h.autoid)) q = h.autoid.call(this, m);
                                                else {
                                                    q = Math.ceil(Math.random() * 1E3);
                                                    q = h.autoidprefix + q
                                                }
                                                a("#" + this.id).jqGrid("addRowData", q, m, h.droppos)
                                            }
                                            h.ondrop && a.isFunction(h.ondrop) && h.ondrop.call(this, j, b, m)
                                        }
                                    }
                                },
                                h.drop_opts || {})
                            },
                            onstart: null,
                            onstop: null,
                            beforedrop: null,
                            ondrop: null,
                            drop_opts: {
                                activeClass: "ui-state-active",
                                hoverClass: "ui-state-hover"
                            },
                            drag_opts: {
                                revert: "invalid",
                                helper: "clone",
                                cursor: "move",
                                appendTo: "#jqgrid_dnd",
                                zIndex: 5E3
                            },
                            dropbyname: false,
                            droppos: "first",
                            autoid: true,
                            autoidprefix: "dnd_"
                        },
                        e || {});
                        if (e.connectWith) {
                            e.connectWith = e.connectWith.split(",");
                            e.connectWith = a.map(e.connectWith,
                            function(h) {
                                return a.trim(h)
                            });
                            a.data(f, "dnd", e);
                            f.p.reccount != "0" && !f.p.jqgdnd && c();
                            f.p.jqgdnd = true;
                            for (var g = 0; g < e.connectWith.length; g++) a(e.connectWith[g]).droppable(a.isFunction(e.drop) ? e.drop.call(a(f), e) : e.drop)
                        }
                    }
                }
            })
        },
        gridResize: function(e) {
            return this.each(function() {
                var c = this;
                if (c.grid && a.fn.resizable) {
                    e = a.extend({},
                    e || {});
                    if (e.alsoResize) {
                        e._alsoResize_ = e.alsoResize;
                        delete e.alsoResize
                    } else e._alsoResize_ = false;
                    if (e.stop && a.isFunction(e.stop)) {
                        e._stop_ = e.stop;
                        delete e.stop
                    } else e._stop_ = false;
                    e.stop = function(f, g) {
                        a(c).jqGrid("setGridParam", {
                            height: a("#gview_" + c.p.id + " .ui-jqgrid-bdiv").height()
                        });
                        a(c).jqGrid("setGridWidth", g.size.width, e.shrinkToFit);
                        e._stop_ && e._stop_.call(c, f, g)
                    };
                    e.alsoResize = e._alsoResize_ ? eval("(" + ("{'#gview_" + c.p.id + " .ui-jqgrid-bdiv':true,'" + e._alsoResize_ + "':true}") + ")") : a(".ui-jqgrid-bdiv", "#gview_" + c.p.id);
                    delete e._alsoResize_;
                    a("#gbox_" + c.p.id).resizable(e)
                }
            })
        }
    })
})(jQuery);
function tableToGrid(a, d) {
    jQuery(a).each(function() {
        if (!this.grid) {
            jQuery(this).width("99%");
            var e = jQuery(this).width(),
            c = jQuery("input[type=checkbox]:first", jQuery(this)),
            f = jQuery("input[type=radio]:first", jQuery(this));
            c = c.length > 0;
            f = !c && f.length > 0;
            var g = c || f,
            h = [],
            j = [];
            jQuery("th", jQuery(this)).each(function() {
                if (h.length === 0 && g) {
                    h.push({
                        name: "__selection__",
                        index: "__selection__",
                        width: 0,
                        hidden: true
                    });
                    j.push("__selection__")
                } else {
                    h.push({
                        name: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                        index: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                        width: jQuery(this).width() || 150
                    });
                    j.push(jQuery(this).html())
                }
            });
            var b = [],
            m = [],
            l = [];
            jQuery("tbody > tr", jQuery(this)).each(function() {
                var n = {},
                k = 0;
                jQuery("td", jQuery(this)).each(function() {
                    if (k === 0 && g) {
                        var p = jQuery("input", jQuery(this)),
                        o = p.attr("value");
                        m.push(o || b.length);
                        p.attr("checked") && l.push(o);
                        n[h[k].name] = p.attr("value")
                    } else n[h[k].name] = jQuery(this).html();
                    k++
                });
                k > 0 && b.push(n)
            });
            jQuery(this).empty();
            jQuery(this).addClass("scroll");
            jQuery(this).jqGrid(jQuery.extend({
                datatype: "local",
                width: e,
                colNames: j,
                colModel: h,
                multiselect: c
            },
            d || {}));
            for (e = 0; e < b.length; e++) {
                f = null;
                if (m.length > 0) if ((f = m[e]) && f.replace) f = encodeURIComponent(f).replace(/[.\-%]/g, "_");
                if (f === null) f = e + 1;
                jQuery(this).jqGrid("addRowData", f, b[e])
            }
            for (e = 0; e < l.length; e++) jQuery(this).jqGrid("setSelection", l[e])
        }
    })
};