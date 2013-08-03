/// <reference path="../../_references.js" />
(function ($) {
    yaryin.app.initView.onInitView(function (initRes, context) {
        var $ctx = $(context)
            , $$ = function () {
                return $ctx.find.apply($ctx, arguments);
            };

        var loc;

        function queryLatestLocation(showInfo) {
            var url = $$('a.js-use-wechat').attr('data-url');

            url && $.post(url, function (res) {
                if (res && res.data && res.data.length) {
                    loc = res.data;
                    $$('[name="loc[0]"]').val(res.data[0]);
                    $$('[name="loc[1]"]').val(res.data[1]);
                    showInfo && yaryin.alert('update you shop address successfully.'.localize());
                } else {
                    showInfo && yaryin.alert('update you shop address failed.'.localize());
                }
            });
        }

        !loc && $$('[name="loc[0]"]').length && !$$('[name="loc[0]"]').val() && !$$('[name="loc[1]"]').val() && queryLatestLocation();

        $$('a.js-use-wechat').click(function () {
            queryLatestLocation(true);
        });

        var $mapWidget = $$('#avril_map_widget');

        if ($mapWidget.length) {

            var map = new BMap.Map("avril_map_widget")
                , _loc; // 创建Map实例

            var popList = yaryin.ui.popContext.popList(), $prePop = popList[0].$pop();

            if (!_loc && $prePop.find('[name="loc[0]"]').val() && $prePop.find('[name="loc[1]"]').val()) {
                _loc = [$prePop.find('[name="loc[0]"]').val(), $prePop.find('[name="loc[1]"]').val()]
            }

            if (!_loc) {
                _loc = loc || [118.18476, 24.48457];
            }

            map.centerAndZoom(new BMap.Point(_loc[0], _loc[1]), 19);     // 初始化地图,设置中心点坐标和地图级别
            map.addControl(new BMap.NavigationControl());   // 添加平移缩放控件
            map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
            map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
            map.enableScrollWheelZoom();                            //启用滚轮放大缩小
            map.addControl(new BMap.MapTypeControl());          //添加地图类型控件
            map.setCurrentCity("厦门");          // 设置地图显示的城市 此项是必须设置的

            var curMarker = new BMap.Marker(new BMap.Point(_loc[0], _loc[1]));  // 创建标注
            map.addOverlay(curMarker);              // 将标注添加到地图中
            curMarker.enableDragging();

            $mapWidget.data('map', map);

            curMarker.addEventListener('dragend', function (e) {
                _loc = [e.point.lng, e.point.lat];

                console.log(e.point.lng + ',' + e.point.lat);
            });

            $$('.map-actions').find('.btn.save').click(function () {
                if (popList.length > 1) {
                    $prePop.find('[name="loc[0]"]').val(_loc[0]);
                    $prePop.find('[name="loc[1]"]').val(_loc[1]);

                }
                yaryin.ui.popContext.getCurrent().hide();

            });
        }


    });

})(jQuery);