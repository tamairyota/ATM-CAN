//////////////////祝日対応///////////////////////////////////////////
syukuflag = 0;
firstflag = 0;
item = 'syukujitu/syukujitu2016.csv';
getCSVFile();
///////////////ここまで祝日対応
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
blue = 'icon/blue.png'
orange = 'icon/orange.png'
purple = 'icon/purple.png'
ginkouname = new Array('csvdata/IYO.csv', "janodata", 'csvdata/EHIME.csv', 'csvdata/AISIN.csv');
jacs = new Array();
jacs[0] = 'csvdata/JA1.csv'
jacs[1] = 'csvdata/JA2.csv'
////////////位置情報の取得に成功した時//////////////
function successCallback(pos) {
    Potition_latitude = pos.coords.latitude;
    Potition_longitude = pos.coords.longitude;

//window.onload= function () {

    //////////////////////getcookie//////////////////////////////////////
    result = new Array();
    var allcookies = document.cookie;
    if (allcookies != '') {
        var cookies = allcookies.split('; ');

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].split('=');

            // クッキーの名前をキーとして 配列に追加する
            result[cookie[0]] = decodeURIComponent(cookie[1]);
        }
    }
    ////////////////クッキーがあったら///////////////////////////////////////////////////
    if (result['ari'] == 1) {
        /////////////////前回の選択を選ぶ////////////////////////////////
        ///セルメニュー
        var options = document.getElementsByTagName("option");
        options[result['selcook']].selected = "selected";
        ///チェックボックス
        if (result['chcook'] == "true") {
            document.getElementById("chbox").checked = true;
        }
        if (result['chcook'] == "false") {
            document.getElementById("chbox").checked = false;
        }
    }
    else {
        ///クッキーがない場合クッキーを作る
        document.cookie = 'ari=' + encodeURIComponent(1);
        document.cookie = 'chcook=' + encodeURIComponent(false);
        document.cookie = 'selcook=' + encodeURIComponent(0);
    }
    mySelMenu = document.getElementById("ginkou");
    no = mySelMenu.selectedIndex;
    sentakusaretaname = mySelMenu.options[no].text;
    checkbtn = document.querySelectorAll("input[type=checkbox]");
    // ボタン要素の読み出し
    ///////////ロードした時の一回目の表示//////////////////////////////////////
    /////ＪＡかどうか判断
    if (no == 1) {
        for (var k = 0; k < jacs.length; k++) {
            item = jacs[k]
            initialize();
        }
    }
    else {
        item = ginkouname[no];
        initialize();
    }


    ///////////////チェックボタンのイベント/////////////////////////////////////////////////////////////////////////////
    chbtn = document.getElementById("chbox");
    chbtn.addEventListener("click", function (evt) {
        // セレクトメニューの要素を読み出し
        mySelMenu = document.getElementById("ginkou");
        //セレクトメニューの番号を取り出し
        no = mySelMenu.selectedIndex;
        //セレクトメニューの選択項目を取得
        sentakusaretaname = mySelMenu.options[no].text;
        ///////チェックボタンの処理////////////
        checkbtn = document.querySelectorAll("input[type=checkbox]");
        if (no == 1) {
            for (var k = 0; k < jacs.length; k++) {
                item = jacs[k]
                initialize();
            }
        }
        else {
            item = ginkouname[no];
            initialize();
        }
        //////////チェックボタンのクッキーを残す/////////////////////
        document.cookie = 'chcook=' + encodeURIComponent(checkbtn[0].checked);
    }, false);
}
//}
////////////セルメニューが変わるときに呼び出される関数///////////
function ginkouu() {
    mySelMenu = document.getElementById("ginkou");
    //セレクトメニューの番号を取り出し
    no = mySelMenu.selectedIndex;
    //セレクトメニューの選択項目を取得
    sentakusaretaname = mySelMenu.options[no].text;
    ///////チェックボタンの処理////////////
    checkbtn = document.querySelectorAll("input[type=checkbox]");
    ////ＪＡが選ばれているかの判断
    if (no == 1) {
        for (var k = 0; k < jacs.length; k++) {
            item = jacs[k]
            initialize();
        }
    }
    else {
        item = ginkouname[no];
        initialize();
    }
    //////////セルメニューのクッキーを残す/////////////////////
    document.cookie = 'selcook=' + encodeURIComponent(no);
}
function initialize() {
    /////////////////////地図の表示/////////////////////////
    genzaiti(Potition_latitude, Potition_longitude);
    datehyouji();
}

////////////位置情報の取得に失敗したとき//////////////
function errorCallback(error) {
    message = "位置情報が取得できませんでした";
    alert(message);
}
//////////////////////現在地を与えてマップを作る（マップの作成）/////////////////////////////////////////////////////////////////////
function genzaiti(x, y) {
    ///////////////////////////現在地の作成////////////////////////////
    var maylating = new google.maps.LatLng(x, y)
    var mapOptions = {
        center: maylating,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var infowindowgennzai = new google.maps.InfoWindow({
        content: "現在地"
    });
    ////////////////////現在地のマーカー貼り付け///////////
    genzaitinomarker = new google.maps.Marker({
        position: maylating,
        map: map,
        icon: blue
    });
    ////////////現在地のマーカーの情報window表示////////////////
    infowindowgennzai.open(map, genzaitinomarker);
    var flag = 1;
    ///////////////現在地のマーカーがクリックされた時の処理//////////////
    google.maps.event.addListener(genzaitinomarker, "click", function () {
        if (flag == 0) {
            infowindowgennzai.open(map, genzaitinomarker);
            flag = 1;
        }
        else {
            infowindowgennzai.close();
            flag = 0;
        }

    });
    //////////////円を作る//////////////
    var circleoption = {
        center: maylating,
        radius: 400,
        map: map,
        fillOpacity: 0.05,
        fillColor: "#1E90FF",
        strokeColor: "#1E90FF",
        strokeWeight: 2
    };

    circle1 = new google.maps.Circle(circleoption);
    circleoption.radius = 800;
    circle2 = new google.maps.Circle(circleoption);
    circleoption.radius = 1200;
    circle3 = new google.maps.Circle(circleoption);
    /////ズームで円のサイズを変える
    google.maps.event.addListener(map, "zoom_changed", function () {
        var latlngBounds = map.getBounds();
        ///地図の北西と南西の緯度と経度を取得
        var sw = latlngBounds.getSouthWest();
        var ne = latlngBounds.getNorthEast();
        circle1.setRadius(10000 * (ne.lng() - sw.lng()));
        circle2.setRadius(20000 * (ne.lng() - sw.lng()));
        circle3.setRadius(30000 * (ne.lng() - sw.lng()));
    });
}
///////////////////////////ここまで現在地の作成//////////////////////////
function datehyouji() {
    getCSVFile();
}
/////////csvファイルの読み込み関数//////////////////
function getCSVFile() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        createArray(xhr.responseText);
    };
    xhr.open("get", item, true);
    xhr.send(null);

}
function createArray(csvData) {
    var tempArray = csvData.split("\n");
    number = tempArray.length;
    var csvArray = new Array();
    for (var i = 0; i < tempArray.length; i++) {
        csvArray[i] = tempArray[i].split(",");
    }
    /////一回目だったらここを通るそして祝日かどうかの判断
    if (firstflag == 0) {
        firstflag = 1;
        for (var k = 0; k < number; k++) {
            syukujitu(csvArray[k][1], csvArray[k][0])
        }

    }////二回目以降はこっち
    else {
        for (var k = 1; k < number; k++) {
            atmloc(csvArray[k][0], csvArray[k][1], csvArray[k][2], csvArray[k][3], csvArray[k][4], csvArray[k][5], csvArray[k][6], csvArray[k][7]);
        }
    }

}
////////atmのマーカー表示関数
function atmloc(atmname, jusyo, heijitu, doyou, nitiyou, syukujitu, keido, ido) {
    //////////今の時間を手に入れる////////////
    var curenttime = new timesen();
    ////////////祝日の処理//
    if (syukuflag == 1) {
        if (String(syukujitu).length == 11) {
            var eigyou = new eleven(syukujitu);
            jikann();
        }
        if (String(syukujitu).length == 10) {
            var eigyou = new ten(syukujitu);
            jikann();
        }
        if (String(syukujitu).length < 10) {
            icon = purple;
            if (checkbtn[0].checked) {
                return
            }
        }
    }
    else {
        ////////////日曜日の処理/////////////
        if (curenttime.daynumber == 0) {
            if (String(nitiyou).length == 11) {
                var eigyou = new eleven(nitiyou);
                jikann();
            }
            if (String(nitiyou).length == 10) {
                var eigyou = new ten(nitiyou);
                jikann();
            }
            if (String(nitiyou).length < 10) {
                icon = purple;
                if (checkbtn[0].checked) {
                    return
                }
            }
        }
        ////////////平日の処理////////////////////////
        if ((curenttime.daynumber >= 1) && (curenttime.daynumber <= 5)) {
            if (String(heijitu).length == 11) {
                var eigyou = new eleven(heijitu);
                jikann();
            }
            if (String(heijitu).length == 10) {
                var eigyou = new ten(heijitu);
                jikann();
            }
            if (String(heijitu).length < 10) {
                icon = purple
                if (checkbtn[0].checked) {
                    icon = purple;
                    return
                }
            }
        }
        /////////////土曜の処理/////////////////
        if (curenttime.daynumber == 6) {
            if (String(doyou).length == 11) {
                var eigyou = new eleven(doyou);
                jikann();
            }
            if (String(doyou).length == 10) {
                var eigyou = new ten(doyou);
                jikann();
            }
            if (String(doyou).length < 10) {
                icon = purple;
                if (checkbtn[0].checked) {
                    return
                }
            }
        }
    }
    function jikann() {
        //////////////営業開始時間より遅ければ///////////////////
        if (eigyou.starthour <= curenttime.hour) {
            ///////////開始と同じ時間
            if (eigyou.starthour == curenttime.hour) {
                /////////開始と同じ時間かつ営業中なら////////
                if (eigyou.startminute <= curenttime.minute) {
                    icon = orange;
                }
                    /////開始と同じ時間かつ営業外なら/////////////
                else {
                    icon = purple;
                    if (checkbtn[0].checked) {
                        return
                    }
                }
            }
                ///////営業開始時間より遅くて同じ時間でないならば/////////////
            else {
                icon = orange;
            }
        }
            ////////////////営業時間より早かったら///////////////////
        else {
            icon = purple;
            if (checkbtn[0].checked) {
                return
            }
        }
        ///////////////営業時間を超えてるかの確認//////////////////////
        ///////////////超えてなければただの通過////////////////////////
        if (eigyou.endhour <= curenttime.hour) {
            /*icon = purple;
            if (checkbtn[0].checked) {
                return
            }*/
            ///////////営業終了と同じ時間か///////////////////////
            if (eigyou.endhour == curenttime.hour) {
                ////////////同じ時間なので分で判定//////////////
                ///////////現在の分が大きいので営業外///////////////////
                if (eigyou.endminute < curenttime.minute) {
                    icon = purple;
                    if (checkbtn[0].checked) {
                        return
                    }
                }
            }
                ////////////////時間が営業時間を超えているので//////
            else {
                icon = purple;
                if (checkbtn[0].checked) {
                    return
                }
            }
        }
        hyouji();
    }
    //////////////////////////////マーカー表示の関数///////////////////////////////////////////////
    function hyouji() {
        /////”を削除
        var keidonum = String(keido).replace(/"/g, "");
        var idonum = String(ido).replace(/"/g, "");
        /////マーカーを作る
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(idonum, keidonum),
            map: map,
            icon: icon
        });
        //////マーカーの表示の代入//////
        //クリックされた時に表示する内容
        var infowindow = new google.maps.InfoWindow({
            content: "銀行名：" + sentakusaretaname + "<br>"
                + "ATM：" + atmname + "<br>"
                + "住所：" + jusyo + "<br>"
                + "平日：" + heijitu + "<br>"
            + "土曜：" + doyou + "<br>"
              + "日曜：" + nitiyou + "<br>"
              + "祝日：" + syukujitu + "<br>"
        });
        ///////////クリックされたかどうかのフラッグとクリックされたときの処理/////////////////////////////
        var flag = 0;
        google.maps.event.addListener(marker, "click", function () {
            if (flag == 0) {
                infowindow.open(map, marker);
                flag = 1;
            }
            else {
                infowindow.close();
                flag = 0;
            }
        });
    }
}
///////////////日付を読み取るクラス/////////////
var timesen = function () {
    this.hour;
    this.minute;
    this.second;
    this.day;
    this.daynumber;
    // 現在の日時を示すDateオブジェクトを生成
    var currentDate = new Date();
    // 時間(0〜23)を読み出し
    this.hour = currentDate.getHours();
    // 分(0〜59)を読み出し
    this.minute = currentDate.getMinutes();
    // 秒(0〜59)を読み出し
    this.second = currentDate.getSeconds();
    // 曜日(0〜6)を読み出し
    var n = currentDate.getDay();
    this.daynumber = n;
    this.day = "日月火水木金土".charAt(n);

}
//////11文字のときのクラス///
var eleven = function (youbi) {
    this.starthour;
    this.startminute;
    this.endhour;
    this.endminute;
    var time;
    time = youbi.substr(0, 2);
    this.starthour = parseInt(time, 10);
    time = youbi.substr(3, 2);
    this.startminute = parseInt(time, 10);
    time = youbi.substr(6, 2);
    this.endhour = parseInt(time, 10);
    time = youbi.substr(9, 2);
    this.endminute = parseInt(time, 10);
}
//////10文字のときのクラス///
var ten = function (youbi) {
    this.starthour;
    this.startminute;
    this.endhour;
    this.endminute;
    var time;
    time = youbi.substr(0, 1);
    this.starthour = parseInt(time, 10);
    time = youbi.substr(2, 2);
    this.startminute = parseInt(time, 10);
    time = youbi.substr(5, 2);
    this.endhour = parseInt(time, 10);
    time = youbi.substr(8, 2);
    this.endminute = parseInt(time, 10);
}
//////////////////////////////////////祝日かどうかの判断
function syukujitu(syukuname, syukudate) {
    var myD = new Date();
    var myYear = myD.getFullYear();
    var myMonth = myD.getMonth() + 1;
    var myDate = myD.getDate();
    var myDaynumber = myD.getDay();
    var syukumonthday = new Array()
    syukuyear = String(syukudate).split("年");
    syukumonth = String(syukuyear[1]).split("月");
    ////当日祝日かどうか
    if (parseInt(syukumonth[0], 10) == myMonth) {
        if (parseInt(syukumonth[1], 10) == myDate) {
            syukuflag = 1;
        }
    }
}
