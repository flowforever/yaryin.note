/**
 * Created by trump on 14/6/26.
 */
(function($){
    avril.Mvvm.defaults.show_dev_info = true;

    var setCurrentMenu = function(){
        var paths = location.pathname.split('/');
        var currentPage = paths[ paths.length - 1 ];
        avril.mvvm.setVal('$root.routeInfo.currentPage', currentPage);
    };

    var mvvm = avril.mvvm;

    mvvm.setVal('$root.mainMenu',[
        { text: 'Home', url: 'index.html'  }
        , { text: 'Array', url: 'array.html'  }
    ]);


    var testRealArray = avril.array( new Array(10) ).select(function(item,index){
        return {
            name: 'name'+index
            , id: index
        }
    });

    mvvm.setVal('$root.avRealScope.array',testRealArray);

    $(function(){

        setCurrentMenu();

        mvvm.setVal('$root.timeTest', new Array(20000));

        mvvm.setVal('$root.basicEach',[{},{},{}])

        mvvm.bindDom(document);
    });
})(jQuery);