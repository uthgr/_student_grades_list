if ("undefined" == typeof jQuery) throw new Error("Bootstrap requires jQuery"); + 
function (a) {
    "use strict";
	
    function b(b) {
        a(d).remove(), a(e).each(function () {
            var d = c(a(this)),
                e = {
                    relatedTarget: this
                };
            d.hasClass("open") && (	d.trigger(b = a.Event("hide.bs.dropdown-submenu", e)),
									b.isDefaultPrevented() || d.removeClass("open").trigger("hidden.bs.dropdown-submenu", e))
        });
    }

    function c(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }
    var d = ".dropdown-submenu-backdrop",
        e = "[data-toggle=dropdown-submenu]",
        f = function (b) {
            a(b).on("click.bs.dropdown-submenu", this.toggle)
        };
    f.prototype.toggle = function (d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = c(e),
                g = f.hasClass("open");
            if (b(), !g) {
                "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-submenu-backdrop"/>').insertAfter(a(this)).on("click", b);
                var h = {
                    relatedTarget: this
                };
                if (f.trigger(d = a.Event("show.bs.dropdown-submenu", h)), d.isDefaultPrevented()) return;
                f.toggleClass("open").trigger("shown.bs.dropdown-submenu", h), e.focus()
            }
			f.parents(".dropdown-submenu").addClass("open");
            return !1
        }
    }, f.prototype.keydown = function (b) {
        if (/(38|40|27)/.test(b.keyCode)) {
            var d = a(this);
            if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
                var f = c(d),
                    g = f.hasClass("open");
                if (!g || g && 27 == b.keyCode) return 27 == b.which && f.find(e).focus(), d.click();
                var h = " li:not(.divider):visible a",
                    i = f.find("[role=menu]" + h + ", [role=listbox]" + h);
                if (i.length) {
                    var j = i.index(i.filter(":focus"));
                    38 == b.keyCode && j > 0 && j--, 40 == b.keyCode && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).focus()
                }
            }
        }
    };
    var g = a.fn.dropdown_submenu;
    a.fn.dropdown_submenu = function (b) {
        return this.each(function () {
            var c = a(this),
                d = c.data("bs.dropdown-submenu");
            d || c.data("bs.dropdown-submenu", d = new f(this)), "string" == typeof b && d[b].call(c)
        })
    }, a.fn.dropdown_submenu.Constructor = f, a.fn.dropdown_submenu.noConflict = function () {
        return a.fn.dropdown_submenu = g, this
    }, a(document).on("click.bs.dropdown-submenu.data-api", b).on("click.bs.dropdown-submenu.data-api", ".dropdown-submenu form", function (a) {
        a.stopPropagation()
    }).on("click.bs.dropdown-submenu.data-api", e, f.prototype.toggle).on("keydown.bs.dropdown-submenu.data-api", e + ", [role=menu], [role=listbox]", f.prototype.keydown)
}(jQuery)