(function ($) {
    var matches = [];
    var index = 0;
    $.fn.hypermodel = function (opt, arg) {
        var _this = this;
        var method = 'init';
        var $window = $(window), $document = $(document);

        if (typeof opt !== 'object') {
            method = opt;
            opt = arg;
        }

        var _opt = {
            grad: 1.75,
            time: {
                animate: 300,
                frame: 3000,
                highlight: 3000
            },
            update: null,
            strokeSpeed: 500,
            strokeColor: 'rgba(192, 192, 192, .6)',
            strokeHighlightColor: 'rgba(200, 206, 255, .6)',
            strokeHighlightDashColor: 'rgba(178, 192, 255, 1)',
            strokeDashColor: 'rgba(192, 192, 192, .95)',
            strokeWidth: 1,
            strokeHighlightWidth: 1,
            strokeDashWidth: 1,
            strokeDashWeight: 8,
            strokeDashMargin: 6
        };
        $.extend(_opt, opt);

        var prop = {
            offset: {
                t: 20,
                r: 10,
                b: 20,
                l: 10,
                d: 0.5,
                g: 1
            },
            placeholder: {
                size: 600
            }
        };

        var $r = $(this).addClass('hypermodel-wrapper');
        var $canvas = null;
        var useCurve = true;
        var paper = null;
        var selection = window.getSelection ? window.getSelection() : document.selection ? document.selection : null;
        var getDistanceBtDot = function (pos1, pos2) {
            return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
        };

        var hyperModelChange = function () {
            hyperModelUpdate.apply(this, Array.prototype.slice.call(arguments));
        };

        var hyperModelUpdate = function () {
            $window.triggerHandler('resize.hypermodelHandler');
        };

        var hypermodelColumnHandler = function (i) {
            var $this = $(this);
            $r.disableSelection();
            $this.sortable({
                items: '.hypermodel-grid',
                handle: '.hypermodel-header',
                change: hyperModelChange,
                out: hyperModelUpdate,
                containment: 'body',
                tolerance: 'pointer',
                dropOnEmpty: true,
                axis: "y",
                scroll: true,
                beforeStop: function(event, ui) {
                    var $this = $(this);
                    var $last = $this.children(':last');
                    var lastItemTop = $last.position().top;
                    var currentItemTop = ui.position.top;
                    var currentItemHeight = ui.item.height();
                    if (currentItemTop + currentItemHeight * 2 > lastItemTop) {
                        $last.insertBefore(ui.item);
                    }
                },
                start: function (e, ui) {
                    ui.placeholder.height(ui.item.height());
                    ui.item.data('sortable-idx', ui.item.index());
                },
                update: function (e, ui) {
                    if (typeof _opt.update === 'function') {
                        _opt.update.apply(this, Array.prototype.slice.call(arguments));
                    }
                },
                stop: function() {
                    _this.hypermodel('repaint');
                }
            });
        };

        switch (method) {
            case 'init':
                matches = [];
                return this.each(function () {
                    $r.css('position', 'relative').bind('click', function(event) {
                        if(selection) {
                            if(selection.empty) {
                                selection.empty();
                            } else {
                                selection.removeAllRanges();
                            }
                        }
                    });
                    $r.find('.hypermodel-column .hypermodel-grid').bind('click', function (event) {
                        event.stopPropagation();
                        var $this = $(this);
                    }).find('.hypermodel-item').bind('click', function (event) {
                        event.stopPropagation();
                        var $this = $(this);
                    });

                    $window.unbind('resize.hypermodelHandler init.hypermodelHandler').bind('resize.hypermodelHandler init.hypermodelHandler', function (event) {
                        try {
                            var width = 0;
                            $r.find('.hypermodel-column').each(function () {
                                var $this = $(this);
                                width += $this.outerWidth(true);
                            });
                            $r.find('.hypermodel-area').outerWidth(parseInt(width + 1));
                            var positionGap = {
                                t: $r.offset().top,
                                l: $r.offset().left
                            };

                            var paddingGap = {
                                t: parseInt($r.css('padding-top').replace(/[^\d]+/, '') || 0),
                                l: parseInt($r.css('padding-left').replace(/[^\d]+/, '') || 0)
                            };
                            var docWidth = 0, docHeight = 0;
                            try {
                                /* jshint ignore:start */
                                docWidth = ($r.parent())[0].scrollWidth - paddingGap.l * 2, docHeight = ($r.parent())[0].scrollHeight - paddingGap.t * 2;
                                /* jshint ignore:end */
                            } catch (e) {
                                return false;
                            }

                            if (event.type == 'init') {
                                $('.hyper-model-canvas').remove();
                                paper = Raphael(0, 0, docWidth, docHeight);
                                paper.canvas.setAttribute("class", "hyper-model-canvas");
                                $canvas = $(paper.canvas);
                                $(paper.canvas).appendTo($r)
                                    .css({
                                        left: 0 + paddingGap.l,
                                        top: 0 + paddingGap.t
                                    });
                            } else {
                                $canvas.attr({
                                    width: docWidth,
                                    height: docHeight
                                });
                            }

                            var $style = $('<style class="hyper-model-anim"></style>');
                            $('.hyper-model-anim').remove();
                            $('head').append($style);

                            var styles = '';
                            $r.find('.hypermodel-grid, .hypermodel-item').unbind('click.hypermodelHandler').bind('click.hypermodelHandler', function (event) {
                                event.stopPropagation();
                                var $this = $(this);
                            }).each(function () {
                                var $this = $(this);
                                if (typeof $this.data('target') !== 'undefined' && $this.data('target') !== '') {
                                    var eObj = {
                                        t: $this.offset().top + prop.offset.d - prop.offset.g + prop.offset.t - positionGap.t - paddingGap.t,
                                        r: $this.offset().left + $this.outerWidth() + prop.offset.d - prop.offset.g - positionGap.l - paddingGap.l,
                                        b: $this.offset().top + $this.outerHeight() + prop.offset.d - prop.offset.g - positionGap.t - paddingGap.t,
                                        l: $this.offset().left + prop.offset.d - prop.offset.g - positionGap.l - paddingGap.l
                                    };
                                    var sid = '';
                                    var tids = $this.data('target').toString().split(',');
                                    var pos1 = { x: 0, y: 0 }, pos2 = { x: 0, y: 0 };

                                    if (typeof $this.attr('id') !== 'undefined' && $this.attr('id') !== null) {
                                        sid = $this.attr('id').replace(/.*model-[nc](\d+).*/, '$1');
                                        if (typeof sid !== 'undefined' && sid !== '') {
                                            sid = parseInt(sid);
                                        }
                                    }

                                    for (var idx in tids) {
                                        var tid = $.trim(tids[idx]);
                                        var mid = sid + '->' + tid;
                                        var hids = $this.data('highlight') ? $this.data('highlight').split(',') : '';
                                        for (var hid_idx in hids) {
                                            var hid = hids[hid_idx];
                                            hids[hid_idx] = sid + '->' + hid;
                                        }
                                        var $target = $('#model-n' + tid).filter(':visible').not('.ui-sortable-helper');

                                        if ($target.length <= 0 || $target.is(':hidden') || $target.hasClass('ui-sortable-helper')) {
                                            for (var i in matches[mid]) {
                                                try {
                                                    matches[mid][i].remove();
                                                } catch (e) { console.log(e); }
                                            }
                                            delete matches[mid];
                                            continue;
                                        }

                                        var tObj = {
                                            t: $target.offset().top + prop.offset.d + prop.offset.t - positionGap.t - paddingGap.t,
                                            r: $target.offset().left + $target.outerWidth() + prop.offset.d - positionGap.l - paddingGap.l,
                                            b: $target.offset().top + $target.outerHeight() + prop.offset.d - positionGap.t - paddingGap.t,
                                            l: $target.offset().left + prop.offset.d - positionGap.l - paddingGap.l
                                        };

                                        pos1.x = eObj.r;
                                        pos1.y = eObj.t;
                                        pos2.x = tObj.l;
                                        pos2.y = tObj.t;

                                        var pathData = '';
                                        var distance = getDistanceBtDot(pos1, pos2);

                                        pathData += ' M ' + eObj.r + ' ' + eObj.t;

                                        if (eObj.t !== tObj.t && useCurve === true) {
                                            var hDiffL = (Math.abs(eObj.r - tObj.l) / (_opt.grad * 1));
                                            var hDiffT = (Math.abs(eObj.t - tObj.t) / 100);
                                            pathData += ' C ' + (eObj.r + hDiffL) + ' ' + (eObj.t + hDiffT) + ' ' + (tObj.l - hDiffL) + ' ' + (tObj.t - hDiffT) + ' ';
                                        } else {
                                            pathData += ' L ';
                                        }

                                        pathData += tObj.l + ' ' + tObj.t;
                                        styles += '@keyframes keyframe-dash-i' + index + ' {to {stroke-dashoffset: ' + distance + ';}}@-webkit-keyframes keyframe-dash-i' + index + ' {to {stroke-dashoffset: ' + distance + ';}}';

                                        if (event.type !== 'init') {
                                            for (var matchIdx in matches[mid]) {
                                                /* jshint ignore:start */
                                                var path = matches[mid][i];
                                                path.animate({ path: pathData }, _opt.time.animate);
                                                if ($.inArray(mid, hids) != -1) {
                                                    path.node.setAttribute("stroke-width", _opt.strokeHighlightWidth);
                                                    if (i === '0') {
                                                        path.node.setAttribute("stroke", _opt.strokeHighlightColor);
                                                    } else {
                                                        path.node.setAttribute("stroke", _opt.strokeHighlightDashColor);
                                                    }
                                                } else {
                                                    if (i === '0') {
                                                        path.node.setAttribute("type", "straight");
                                                        path.node.setAttribute("stroke-width", _opt.strokeWidth);
                                                        path.node.setAttribute("stroke", _opt.strokeColor);
                                                    } else {
                                                        path.node.setAttribute("type", "dash");
                                                        path.node.setAttribute("stroke-width", _opt.strokeDashWidth);
                                                        path.node.setAttribute("stroke", _opt.strokeDashColor);
                                                    }
                                                }
                                                /* jshint ignore:end */
                                            }
                                            try {
                                                matches[mid][1].node.setAttribute("style", "animation: keyframe-dash-i" + index + " " + (distance / _opt.strokeSpeed * _opt.time.frame / 100.0) + "s linear infinite; -webkit-animation: keyframe-dash-i" + index + " " + (distance / 500 * 30) + "s linear infinite");
                                            } catch (e) { }
                                        }

                                        if (typeof matches[mid] === 'undefined') {
                                            matches[mid] = [];
                                            var p = paper.path(pathData);
                                            p.node.setAttribute("stroke-width", _opt.strokeWidth);
                                            p.node.setAttribute("stroke", _opt.strokeColor);
                                            p.node.setAttribute("match", mid);
                                            matches[mid].push(p);

                                            var a = paper.path(pathData);
                                            a.node.setAttribute("stroke-width", _opt.strokeDashWidth);
                                            a.node.setAttribute("stroke", _opt.strokeDashColor);
                                            a.node.setAttribute("stroke-dasharray", _opt.strokeDashWeight + ', ' + _opt.strokeDashMargin);
                                            a.node.setAttribute("class", "anim-path");
                                            a.node.setAttribute("style", "animation: keyframe-dash-i" + index + " " + (distance / _opt.strokeSpeed * _opt.time.frame / 100.0) + "s linear infinite; webkit-animation: keyframe-dash-i" + index + " " + (distance / 500 * 30) + "s linear infinite");
                                            a.node.setAttribute("match", mid);
                                            matches[mid].push(a);

                                            if ($.inArray(mid, hids) != -1) {
                                                p.node.setAttribute("stroke-width", _opt.strokeHighlightWidth);
                                                a.node.setAttribute("stroke-width", _opt.strokeHighlightWidth);
                                                p.node.setAttribute("stroke", _opt.strokeHighlightColor);
                                                a.node.setAttribute("stroke", _opt.strokeHighlightDashColor);
                                            }

                                            var smid = $this.data('modelview-m');
                                            var tmid = $target.data('modelview-p');

                                            if (typeof smid !== 'undefined') {
                                                smid = smid.toString().split(',');
                                            } else {
                                                smid = [];
                                            }
                                            smid.push(mid);

                                            if (typeof tmid !== 'undefined') {
                                                tmid = tmid.toString().split(',');
                                            } else {
                                                tmid = [];
                                            }
                                            tmid.push(mid);

                                            $this.data('modelview-m', $.unique(smid).join(','));
                                            $target.data('modelview-p', $.unique(tmid).join(','));
                                        }
                                        index++;
                                    }
                                } else {
                                    return true;
                                }
                            });
                            $style.text(styles);
                        } catch(e) { console.warn(e); }
                    }).triggerHandler('init.hypermodelHandler');

                if (typeof $.fn.sortable !== 'undefined') {
                    $r.find('.hypermodel-column').each(hypermodelColumnHandler);

                    $r.find('.hypermodel-body').each(function () {
                        var $this = $(this);
                        $this.sortable({
                            items: '.hypermodel-item:not(.hypermodel-item-add)',
                            change: hyperModelChange,
                            out: hyperModelUpdate,
                            containment: 'parent',
                            tolerance: 'pointer',
                            start: function(e, ui) {
                                ui.placeholder.height(ui.item.height());
                                ui.item.data('sortable-idx', ui.item.index());
                            },
                            update: function (e, ui) {
                                if (typeof _opt.update === 'function') {
                                    _opt.update.apply(this, Array.prototype.slice.call(arguments));
                                }
                            }
                        });
                    });
                }
            });
            case 'add':
                var _index_grid = 0;
                var _index_item = 1000;

                $('[id^="model-"]').each(function () {
                    var $this = $(this);
                    var index = parseInt($this.attr('id').replace(/[^\d]+/, ''));
                    if ($this.hasClass('hypermodel-grid')) {
                        if (_index_grid < index) {
                            _index_grid = index;
                        }
                    } else if ($this.hasClass('hypermodel-item')) {
                        if (_index_item < index) {
                            _index_item = index;
                        }
                    }
                });

                _index_grid++;
                _index_item++;

                $window.triggerHandler('resize.hypermodelHandler');

                return this.each(function () {
                    var $this = $(this);

                    if (typeof $.fn.sortable !== 'undefined') {
                        $this.parent().sortable({
                            items: '.hypermodel-grid',
                            handle: '.hypermodel-header',
                            change: hyperModelChange,
                            out: hyperModelUpdate,
                            containment: 'parent',
                            tolerance: 'intersect',
                            axis: "y",
                            scroll: true,
                            dropOnEmpty:true,
                            start: function (e, ui) {
                                ui.placeholder.height(ui.item.height());
                                ui.item.data('sortable-idx', ui.item.index());
                            },
                            update: function (e, ui) {
                                if (typeof _opt.update === 'function') {
                                    _opt.update.apply(this, Array.prototype.slice.call(arguments));
                                }
                            }
                        }).disableSelection();
                    }

                    if ($this.hasClass('hypermodel-grid')) {
                        $this.attr('id', ($this.attr('id') ? ($this.attr('id') + ' ') : '') + 'model-n' + _index_grid);
                        _index_grid++;
                    } else if ($this.hasClass('hypermodel-item')) {
                        $this.attr('id', ($this.attr('id') ? ($this.attr('id') + ' ') : '') + 'model-n' + _index_item);
                        _index_item++;
                    }
                });
            case 'connect':
                return this.each(function () {
                    var $this = $(this);
                    opt.each(function () {
                        var $target = $(this);
                        var id = $target.attr('id').replace(/.*model-[nc](\d+).*/, '$1');
                        var t = $this.data('target');
                        if (typeof t !== 'undefined' && t !== null && t !== '') {
                            t = t.split(',');
                        } else {
                            t = [];
                        }
                        t.push(id);
                        $this.data('target', t.join(','));
                    });
                    $window.triggerHandler('resize.hypermodelHandler');
                });
            case 'highlight':
                return this.each(function () {
                    var $this = $(this);
                    var hid = $this.data('highlight') ? $this.data('highlight') : '';
                    var stack = [];
                    hid = hid === '' ? [] : hid.split(',');
                    if (typeof opt === 'undefined') {
                        var target = (($this.data('target'))? $this.data('target'):'').toString();
                        var parted_tids = target.split(',');
                        for (var idx in parted_tids) {
                            var item = parted_tids[idx];
                            hid.push(item);
                            stack.push(item);
                        }
                    } else {
                        opt.each(function () {
                            var $target = $(this);
                            var id = $target.attr('id').replace(/.*model-[nc](\d+).*/, '$1');
                            if (id !== '') {
                                hid.push(id);
                                stack.push(id);
                            }
                        });
                    }
                    $this.data('highlight', $.unique(hid).join(','));
                    $window.triggerHandler('resize.hypermodelHandler');
                    setTimeout(function () {
                        var hid = $this.data('highlight') ? $this.data('highlight') : '';
                        hid = hid === '' ? [] : hid.split(',');
                        for(var idx in stack) {
                            var item = stack[idx];
                            if($.inArray(item, hid) != -1) {
                                hid.splice($.inArray(item, hid), 1);
                            }
                        }
                        $this.data('highlight', $.unique(hid).join(','));
                        $window.triggerHandler('resize.hypermodelHandler');
                    }, _opt.time.highlight);
                });
            case 'repaint':
                $window.triggerHandler('resize.hypermodelHandler');
                return this;
            case 'remove':
                this.each(function () {
                    var $this = $(this);
                    var l = [];
                    var m = $this.data('modelview-m');
                    var p = $this.data('modelview-p');
                    if (typeof m !== 'undefined' && m !== null) {
                        m = m.toString().split(',');
                        l = l.concat(m);
                    }
                    if (typeof p !== 'undefined' && p !== null) {
                        p = p.toString().split(',');
                        l = l.concat(p);
                    }
                    for (var j in l) {
                        var s = l[j];
                        for (var i in matches[s]) {
                            try {
                                matches[s][i].remove();
                                delete l[j];
                            } catch (e) { console.log(e); }
                        }
                        delete matches[s];
                    }
                });
                return this.hypermodel('repaint');
        }
    };
}(jQuery));
