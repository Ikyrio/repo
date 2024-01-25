

function generate(scaleA) {
    var scaleArray = scaleA;
    // var scaleArray = [1,3,"m", 1,3,"d", 1,3,"b", 1,3,"b"];              //m - multiply, d - divide, b - both, s - split
    for (var z = 0;z < scaleArray.length; z+=3){
        generateMath(scaleArray[z],scaleArray[z+1],scaleArray[z+2]);
    }
}

// 1,3,*,1,3,*,1,3,*,1,3,*,

function widthToGetImgFormat(){
    var widthW = $(window).width();
    if(widthW < 768){
        return "png";
    }else{
        return "svg";
    }
}

function generateMath(minS, maxS, opS) {        //### ops
    var mathArray = [];
    var addArray = [];
    var tmpArray = [];
    var maxScale = maxS;
    var minScale = minS;
    var customOp = opS;                            //###

    var mobilePrimary = "";
    if(isMobile()){
        mobilePrimary = "btn-mobile-primary"; //btn-mobile-primary
    }
    //var pageCount = 2;
    function genArray(aArray,aminScale, amaxScale) {
        addArray.length = 0;

        var k = 0;
        var forRepeat = 0;
        if((amaxScale - aminScale) == 0){
            forRepeat = 4
        }else if((amaxScale - aminScale) == 1){
            forRepeat = 2;
        }else{
            forRepeat = 1;
        }


        for (var i = aminScale; i <= amaxScale; i++) {
            for(var x = 0; x < forRepeat; x++) {
                for (var j = 1; j <= 10; j++) {

                    var numOp = 1 + Math.floor(Math.random() * 2);
                    //var gop = (numOp == 1)? "*" : "/";

                    //------###
                    if (customOp != "b") {
                        if (customOp == "m") {
                            numOp = 1;
                        } else if (customOp == "d") {
                            numOp = 2;
                        } else if (customOp == "s") {
                            //todo
                        }
                    }
                    //------###

                    var gop;
                    var gfst;
                    var gres;
                    var gsnd = i;

                    if (numOp == 1) {
                        gop = "*";
                        gfst = j;
                        gres = gfst * gsnd;

                    } else {
                        gop = "/";
                        gres = j;
                        gfst = gsnd * gres;
                    }

                    aArray[(k + j) - 1] = {op: gop, fst: gfst, snd: i, res: gres};
                }

                k += 10;

            }

        }
    }


    genArray(mathArray,minScale,maxScale);
    genArray(addArray,minScale,maxScale);


    var mathTmp = mathArray.slice();
    var numQ = Math.ceil(((maxScale-minScale+1)*10)/24)*24;

    // if(numQ > 48) {
    if(basil.get("difficulty") == "simple") {
        numQ = 24;
    }else{
        numQ = 48;
    }

    // }

    var baseQ = (maxScale-minScale+1)*10;

    tmpArray = addArray.slice();
    for(var l = baseQ; l < numQ;l++){
        var tmpItem = tmpArray.splice((1 + Math.floor(Math.random() * (tmpArray.length)))-1,1);
        mathArray[l] = tmpItem[0];
    }

    var mathItem;
    var blockQ;
    var pageQ;
    var v24v12;
    var v23v11;
    var popPos= "right";
    var ansArray = [];

    if(basil.get("difficulty") == "simple") {

        v24v12 = 12;
        v23v11 = 11;
    }else{
        v24v12 = 24;
        v23v11 = 23;
    }

    for(var m = 0;m < numQ;m++){
        // &middot; &#8282;

        mathItem = mathArray.splice((1 + Math.floor(Math.random() * (mathArray.length)))-1,1);
        var signOp;
        if(mathItem[0].op == "/"){
            signOp = "&#8282;"; //&divide;
        }else{
            signOp = "&middot;"; //&times;
        }

        if(m%v24v12 ==0){
            pageQ = "<div class=\"row\">\n" +
                "    <div class=\"col-lg-2 col-md-1 col-xs-0 xs-none\">\n" +
                "        <p>&nbsp;</p>\n" +
                "    </div>\n" +
                "    <div class=\"col-lg-8 col-md-10 col-xs-12\">\n" +
                "        <div class=\"pg-page\">" +
                "<div class='top-block'>" +
                "<div class='pg-rozsah'>" +
                "<div class=\"outer\">\n" +
                "<div class=\"inner\">" +
                "<h2 class=\"pg-scale line\"><div class=''></div></h2>\n" +             //pg-mobile-name
                "</div>" +
                "</div>\n" +
                "<h4 class=\"pg-scale pg-scale-cz light-color cz\"> Násobilka "+ minScale +" - "+ maxScale +"</h4>\n" +
                "<h4 class=\"pg-scale light-color en\"> Multiplication table "+ minScale +" - "+ maxScale +"</h4>" +
                "<h4 class=\"pg-scale light-color chi\"> 乘法表 "+ minScale +" - "+ maxScale +"</h4>" +
                "<button type=\"button\" class=\"btn btn-primary btn-start small-btn "+ mobilePrimary +"\"><i class=\"fa fa-play-circle\"></i>\n" +
                "<span class=\"cz "+ mobilePrimary +"\">Začít</span>\n" +
                "<span class=\"en "+ mobilePrimary +"\">Start</span>\n" +
                "<span class=\"chi "+ mobilePrimary +"\">开始</span>\n" +

                "</button>" +
                "<span class=\"pg-time\"> 00:00 </span><i class=\"fa fa-clock-o\"></i>\n" +
                "</div>";
        }

        if(m%4 == 0){
            if(basil.get("difficulty") == "simple") {
                blockQ = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center'>" +
                    "<div class='pg-block'>";
            }else{
                blockQ = "<div class='col-lg-6 col-md-6 col-sm-6 col-xs-12 text-center'>" +
                    "<div class='pg-block'>";
            }
        }
        var valInput;
        var rndInput = 1 + Math.floor(Math.random() * 4);
        //var strInput = "<input style='width: 70px' type='number' maxlength='3' data-value='"+valIn+"'>";
        if(basil.get("difficulty") == "easy" || basil.get("difficulty") == "simple"){
            rndInput = 4;
        }

        if(rndInput == 1) {
            valInput = mathItem[0].fst;
            mathItem[0].fst = "<input class='pg-input' type='number' min='0' max='100' data-value='"+valInput+"' >";
        }else if(rndInput == 2){
            valInput = mathItem[0].snd;
            mathItem[0].snd = "<input class='pg-input' type='number' min='0' max='100' data-value='"+valInput+"' >";
        }else{
            valInput = mathItem[0].res;
            mathItem[0].res = "<input class='pg-input' type='number' min='0' max='100' data-value='"+valInput+"' >";
        }

        ansArray = [0,0,0,0];
        var hintAns =  Math.floor(Math.random() * 4);
        ansArray[hintAns] = valInput;

        for(var c = 0; c < 4; c++){
            if(c != hintAns){
                if(mathItem[0].op == "/"){

                    tmpHint = 1 + Math.floor(Math.random() * 10);
                    while (tmpHint == ansArray[0] || tmpHint == ansArray[1] || tmpHint == ansArray[2] || tmpHint == ansArray[3]) {
                        tmpHint = tmpHint - 1;
                        if (tmpHint == 0) {
                            tmpHint = 10;
                        }
                    }

                } else {

                    var tmpHint = mathItem[0].snd * (1 + Math.floor(Math.random() * 10));

                    while (tmpHint == ansArray[0] || tmpHint == ansArray[1] || tmpHint == ansArray[2] || tmpHint == ansArray[3]) {
                        tmpHint = tmpHint - mathItem[0].snd;
                        if (tmpHint == 0) {
                            tmpHint = mathItem[0].snd * 10;
                        }
                    }
                }
                ansArray[c] = tmpHint;
            }

        }


        blockQ = blockQ + "<table class='pg-line'><tbody><td><span class='pg-num1'>"+ mathItem[0].fst +" </span></td><td><span class='pg-sign'>"+ signOp +"</span></td><td><span class='pg-num2'> "+ mathItem[0].snd +" </span></td><td><span class='pg-eq'>=</span></td><td>";
        if(basil.get("difficulty") == "simple"){
            if(isMobile() && ($(window).width() < 467)){
                popPos = "bottom";
            }
            blockQ = blockQ + "<div data-placement=\"" + popPos +"\" class=\"pg-popover\" data-html=\"true\" data-toggle=\"popover\" title=\"\" data-content=\"<button class='btn ans-1 ans-btn'>"+ ansArray[0] +"</button><button class='btn ans-2 ans-btn'>"+ ansArray[1] +"</button><button class='btn ans-3 ans-btn'>"+ ansArray[2] +"</button><button class='btn ans-4 ans-btn'>"+ ansArray[3] +"</button>\">";
        }
        blockQ = blockQ + "<span class='pg-num3'> "+ mathItem[0].res +" </span>";
        if(basil.get("difficulty") == "simple"){
            blockQ = blockQ + "</div>";
        }
        blockQ = blockQ + "</td></tbody>" +
            // "<span class='hidden ans-wrapper' style='position: absolute; left: 80%'><button class='btn ans-1'>1</button><button class='btn ans-2'>2</button><button class='btn ans-3'>3</button><button class='btn ans-4'>4</button></span>" +
            "</table>";

        if(m%4 == 3){
            blockQ = blockQ + "</div></div>";
            //$(".pg-page").append(blockQ);
            pageQ = pageQ + blockQ;
        }


        if(m%v24v12 == v23v11){
            var lineQ = "";
            var optionsQ = "";
            var numIter = minScale;
            for(var i= 0; i < ((maxScale - minScale) + 1); i++){

                lineQ = lineQ + "<div class=\"row\">\n" +
                    "<div class=\"col-lg-12 text-center\">" +
                    "<div class='pg-numline hidden line"+numIter+"'><div class='pg-num pg-num-l1 pg-hidden'>"+numIter*1+"</div><div class='pg-num pg-num-l2 pg-hidden'>"+numIter*2+"</div><div class='pg-num pg-num-l3 pg-hidden'>"+numIter*3+"</div><div class='pg-num pg-num-l4 pg-hidden'>"+numIter*4+"</div><div class='pg-num pg-num-l5 pg-hidden'>"+numIter*5+"</div><div class='pg-num pg-num-l6 pg-hidden'>"+numIter*6+"</div><div class='pg-num pg-num-l7 pg-hidden'>"+numIter*7+"</div><div class='pg-num pg-num-l8 pg-hidden'>"+numIter*8+"</div><div class='pg-num pg-num-l9 pg-hidden'>"+numIter*9+"</div><div class='pg-num pg-num-l10 pg-hidden'>"+numIter*10+"</div></div>" +
                    "</div></div>";
                optionsQ = optionsQ + "<option value='"+numIter+"'>"+numIter+"</option>";
                numIter++;
            }

            pageQ = pageQ + "<div class='row'>" +
                "                <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n" +
                "                    <div class='buttons-wrap'>\n" +
                "                        <button type=\"button\" class=\"btn btn-primary btn-eval check-btn\"><i class=\"fa fa-check\" aria-hidden=\"true\"></i>\n" +
                "                            <span class='cz'>Kontrola</span>\n" +
                "                            <span class=\"en\">Check</span>\n" +
                "                            <span class=\"chi\">检查</span>\n" +
                "                        </button>\n" +
                "                        <button type=\"button\" class=\"btn btn-danger btn-reset small-btn\"><i class=\"fa fa-refresh\"></i>\n" +
                "<span class=\"cz\">Znovu</span>\n" +
                "                            <span class=\"en\">Reset</span>\n" +
                "                            <span class=\"chi\">重置</span>\n" +
                "                        </button>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div></div>" +
                "<span class='hr-line' ><hr style='border-color: #777'></span>" +
                "<div class='bottom-block'>" +
                "<div class=\"row bottom-wrap\"></div>\n" +
                "<div class=\"row\">" +
                "                <div class=\"col-lg-12\">\n" +
                "                    <div class=\"ts-swipe-left-right-background\" style=\"text-align: center\">\n" +
                "                        <button type=\"button\" style=\"float: left\" class=\"btn btn-primary  btn-line\" >\n" +
                "                            <i class=\"fa fa-arrow-up\"></i>\n" +
                "                            <span class=\"cz\">Vzestupně</span>\n" +
                "                            <span class=\"en\">Ascending</span>\n" +
                "                            <span class=\"chi\">上一层</span>\n" +

                "                        </button>\n" +
                "                        <span style=\"float: left;\">&nbsp;</span>\n" +
                "                        <span class=\"pg-nasobky cz\">&nbsp;Násobky&nbsp;&nbsp;</span>\n" +
                "                        <span class=\"pg-nasobky en\">&nbsp;Multiples&nbsp;&nbsp;</span>\n" +
                "                        <span class=\"pg-nasobky chi\">&nbsp;倍数&nbsp;&nbsp;</span>\n" +

                "<select class='pg-select'>" + optionsQ +
                "</select>" +
                "<button type=\"button\" style=\"float: right\" class=\"btn btn-primary btn-line2 \">\n" +
                "<span class=\"cz\">Sestupně</span>\n" +
                "                            <span class=\"en\">Descending</span>\n" +
                "                            <span class=\"chi\">下一层</span>\n" +

                "                            <i class=\"fa fa-arrow-down\"></i>\n" +
                "                        </button>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            <br>\n" +
                "            \n" +
                "            <div class=\"row\">\n" +
                "                <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 text-center\">\n" +
                "                    <img class=\"img-responsive img-speed img-slow\" src=\"./images/snail.png\">" +
                "                </div>" +
                "                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6\">\n" +
                "                    <div class=\"slidecontainer ts-swipe-left-right-background\">\n" +
                "                        <div>\n" +
                "                            <input type=\"range\" min=\"2\" max=\"6\" value=\"4\" class=\"slider\" id=\"myRange\" >\n" +               /*onchange="sliderChange();"*/
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "                <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 text-center\">\n" +
                "                    <img class=\"img-responsive img-speed img-fast\" src=\"./images/rabbit.png\">\n" +
                "                </div>\n" +
                "            </div>\n";

                pageQ = pageQ + "            <div><p> </p></div>\n" +
                "<div class=\"row\">" +
                "<div class=\"col-lg-12 text-center\">" +
                    // "<img src='images/mline.jpg'>" + //line img
                    "<div class=\"pg-drop pg-drop-start pg-orange ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "<div class=\"pg-drop ts-swipe-left-right-background\">" +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-2\"></i></span> " +
                "      <span class=\"dashing\"><i></i></span> " +
                "      <span class=\"dashing\"><i class=\"vt-4\"></i></span>" +
                "</div>" +
                "" +
                "</div>" +
                "</div>" +
                "            <br>\n<div class=\"pg-line-wrap\">" + lineQ + "</div>" +
                "<div class='pg-drag-wrapper'><div class=\"pg-drag ts-swipe-left-right-background\">" +
                    "      <span class=\"dashing2\"><i></i></span> " +
                    "      <span class=\"dashing2\"><i class=\"vt-x2\"></i></span> " +
                    "      <span class=\"dashing2\"><i></i></span> " +
                    "      <span class=\"dashing2\"><i class=\"vt-x4\"></i></span>" +
                    "<img src=\"images/kl/kl"+ minScale + "."+widthToGetImgFormat()+"\"></div></div>\n" +   //svg
                "<br>\n" +
                "            <div style=\"text-align: center\">\n" +
                "                <img class=\"hands cz hands-cz\" src=\"images/hands_cz/0.png\">\n" +
                "                <img class=\"hands en hands-en\" src=\"images/hands_en/0.png\">\n" +
                    "                <img class=\"hands chi hands-chi\" src=\"images/hands_en/0.png\">\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "    <div class=\"col-lg-2 col-md-1 col-xs-0 xs-none\">\n" +
                "        <p>&nbsp;</p>\n" +
                "    </div>\n" +
                "</div></div>";


            if(pageCount > 8) return;
            tsChapters[pageCount].data = pageQ;

            var wlHash = window.location.hash;
            var vHash = wlHash;
            vHash = vHash.substr(3,wlHash.length);
            wlHash = wlHash.substr(1,wlHash.length);
            wlHash = parseInt(wlHash);

            if(isMobile()){

                if(wlHash-1 == pageCount) {
                    $(".swiper-slide-prev").html(pageQ);
                }

                if(wlHash == pageCount) {
                    $(".swiper-slide-active").html(pageQ);
                }

            }else{
                if(wlHash == pageCount){
                    $("#content").html(pageQ);
                }
            }
            pageCount++;
        }
    }
}

function evalMath() {
    var resArray = [];

    var selector = "";
    if(isMobile()){
        selector = ".swiper-slide-active ";
    }

    var rname = basil.get("username");
    var email = basil.get("user-mail");
    var rdate = new Date();
    var rtime = $(selector + ".pg-time").text();
    var rright = 0;
    var rwrong = 0;
    var rscale = $(selector + ".pg-scale-cz").text();
    var rwlist = "";
    rscale = rscale.substr(10, rscale.length-7);

    rdate = $.date(rdate);





    $(selector + ".pg-line input").each(function () {

        var thisInput = $(this);
        if(thisInput.val() == thisInput.attr("data-value")){
            thisInput.addClass("pg-correct").removeClass("pg-wrong");
            rright++;
        }else{
            thisInput.removeClass("pg-correct").addClass("pg-wrong");
            rwrong++;
        }
        thisInput.prop("disabled", true);
    });

    var v24v12;
    if(basil.get("difficulty") == "simple") {
        v24v12 = 12;
    }else{
        v24v12 = 24;
    }

    if(rright == v24v12){

        var achievArray = basil.get("achiev-array");
        var wlHash = window.location.hash;
        wlHash = wlHash.substr(1,2);
        wlHash = parseInt(wlHash);
        if(wlHash<9) {
            achievArray[wlHash - 1] = true;
            basil.set("achiev-array", achievArray);
        }

        $("#achievModal").modal();
        $(".achiev-modal-img-cz").attr("src", "images/achiev_cz/achievement_"+wlHash+"_cz.png");
        $(".achiev-modal-img-en").attr("src", "images/achiev_en/achievement_"+wlHash+"_en.png");
        $(".achiev-modal-img-chi").attr("src", "images/achiev_chi/achievement_"+wlHash+"_chi.png");

    }

    if(rname != "") {
        resArray = basil.get("result-array");
        resArray[resArray.length] = {name: rname, date: rdate, time: rtime, right: rright, wrong: rwrong, scale: rscale};
        basil.set("result-array", resArray);
    }

    if(email != "") {
        $("#emailModal").modal();
    }

    $(".pg-btn-send").on("click", function () {

        var rnum1;
        var rsign;
        var rnum2;
        var req;
        var rnum3;
        var $val;

        $(selector + ".pg-wrong").each(function () {
           var $this =  $(this);

            rnum1 = $this.parents(".pg-line").find(".pg-num1").text();
            rsign = $this.parents(".pg-line").find(".pg-sign").text();
            rnum2 = $this.parents(".pg-line").find(".pg-num2").text();
            req = $this.parents(".pg-line").find(".pg-eq").text();
            rnum3 = $this.parents(".pg-line").find(".pg-num3").text();

            $val = $this.val();
            if($val == ""){
                $val = " ";
            }

            if(rnum1 == " "){
                rnum1 = " (" + $val + ") ";
            }
            if(rnum2 == "  "){
                rnum2 = " (" + $val + ") ";
            }
            if(rnum3 == "  "){
                rnum3 = " (" + $val + ") ";
            }

            rwlist = rwlist + rnum1 +
                            rsign +
                            rnum2 +
                            req +
                            rnum3 + "%0D%0A";
        });

        if(email != ""){
            var mailSubject = 'Násobilka výsledky '+ rname;
            var mailBody = '';

            mailBody = mailBody + rname + "%0D%0A";
            mailBody = mailBody + "--------------- %0D%0A";
            mailBody = mailBody +" Datum: " + rdate + '%0D%0A';
            mailBody = mailBody +" Rozsah: " + rscale + '%0D%0A';
            mailBody = mailBody + "Čas: " + rtime + '%0D%0A';
            mailBody = mailBody + "Správně: " + rright + '%0D%0A';
            mailBody = mailBody + "Špatně: " + rwrong + '%0D%0A %0D%0A';
            mailBody = mailBody + "Chybné odpovědi:%0D%0A" + rwlist;

            window.location = "mailto:" + email + "?subject=" + mailSubject + "&body=" + mailBody;
        }
    });
}


$.date = function(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes();

    if(minute < 10){
        minute = "0"+minute;
    }


    var date = day + ". " + month + ". " + year + " " + hour+":"+minute;

    return date;
};


function resetMath() {
    var wlHash = window.location.hash;
    wlHash = wlHash.substr(1,wlHash.length);
    wlHash = parseInt(wlHash);

    var selector = "";
    if(isMobile()){
        selector = ".swiper-slide-active ";
    }
    $(selector + "span input").each(function () {
        $(this).removeClass("pg-correct pg-wrong");
        $(this).val("");
        $(this).prop("disabled", false);

    });
    inputArray[wlHash-1] = [];
    statusArray[wlHash-1] = [];


}


function nameInit(scaleArray){
    //if (basil.get("username") == '') {

        scaleArrayInit();

        $("body").on("click",".pg-btn-set", function () {

            var name_input = $("#pg-init")[0].value;
            var mail_input = $("#pg-init-mail")[0].value;

            basil.set("minV", $(".diff-select-num1 option:selected").val());
            basil.set("maxV", $(".diff-select-num2 option:selected").val());
            minVal = basil.get("minV");
            maxVal = basil.get("maxV");

            scaleArray = [minVal,maxVal,"m", minVal,maxVal,"d", minVal,maxVal,"b", minVal,maxVal,"b"];

            basil.set("username", name_input);
            basil.set("user-mail", mail_input);
            basil.set("achiev-array", [false,false,false,false,false,false,false,false]);

            $("#nameInitModal").modal("hide");

            $(".pg-panel-name").text(basil.get("username"));
            $(".pg-mobile-name").text(basil.get("username"));

            var diffVal = "";

            var langArray = ["cz", "en", "chi"];
            for(var i = 0;i<langArray.length;i++){
                if(!$("body").hasClass("hidden-"+langArray[i])){
                    diffVal = $($(".diff-select").get(i)).val();
                }
            }


            if (diffVal == "easy") {
                toggleDiff("easy", scaleArray);
            } else if (diffVal == "hard"){
                toggleDiff("hard", scaleArray);
            }else{
                toggleDiff("simple", scaleArray);
            }
            ddInit();
            writeResults();
            loginCover();
            loadAchiev();
            langPanel();

            $(".pg-popover").popover({
                trigger: "click",
                delay: {
                    show: "500",
                    hide: "100"
                }
            });

            blockView();
            blockViewSwitch();
        });

    $("body").on("click",".pg-btn-delete", function () {
        $("#pg-init").val("");
        $("#pg-init-mail").val("");

        basil.set("username", "");
        basil.set("user-mail", "");
        basil.set("achiev-array", [false,false,false,false,false,false,false,false]);

        $("#nameInitModal").modal("hide");

        $(".pg-panel-name").text("");
        $(".pg-mobile-name").text("");

        writeResults();
        loginCover();
        loadAchiev();
    });
}

function saveInput() {
    var wlHash = window.location.hash;
    wlHash = wlHash.substr(1,wlHash.length);
    wlHash = parseInt(wlHash);

    var i = 0;
    // var j = 0;
    var selector = "";
    if(isMobile()){
        selector = ".swiper-slide-active ";
    }

    $(selector + ".pg-line input").each(function () {
        inputArray[wlHash-1][i] = $(this).val();
        i++;

    });

}

function saveStatus() {
    var wlHash = window.location.hash;
    wlHash = wlHash.substr(1,wlHash.length);
    wlHash = parseInt(wlHash);

    var i = 0;
    var selector = "";
    if(isMobile()){
        selector = ".swiper-slide-active ";
    }
    $(selector + ".pg-line input").each(function () {

        if($(this).hasClass("pg-wrong")){
            statusArray[wlHash-1][i] = "pg-wrong";
        }
        if($(this).hasClass("pg-correct")){
            statusArray[wlHash-1][i] = "pg-correct";
        }
        i++;
    });
}


function loadInput() {
    var wlHash = window.location.hash;
    if(wlHash != "#Cover" && wlHash != "#achievments") {
        wlHash = wlHash.substr(1, wlHash.length);
        wlHash = parseInt(wlHash);
        if(wlHash < pageCount) {
            var selector = "";
            if (isMobile()) {
                selector = ".swiper-slide-active ";
            }
            var i = 0;
            $(selector + ".pg-line input").each(function () {
                $(this).val(inputArray[wlHash - 1][i]);
                i++;
            });
        }
    }
}

function loadStatus(){

    var wlHash = window.location.hash;
    if(wlHash != "#Cover" && wlHash != "#achievments") {
        wlHash = wlHash.substr(1, wlHash.length);
        wlHash = parseInt(wlHash);
        if(wlHash < pageCount) {
            var selector = "";
            if (isMobile()) {
                selector = ".swiper-slide-active ";
            }
            var i = 0;

            if (statusArray[wlHash - 1][i] != null) {

                $(selector + ".pg-line input").each(function () {
                    $(this).addClass(statusArray[wlHash - 1][i]);
                    $(this).prop("disabled", true);
                    i++;
                });
            }


        }
    }
}


function timeCheck() {
    var selector = "";
    var pgTimer;
    if(isMobile()){
        selector = ".swiper-slide-active ";
    }

    if(!$(selector + ".btn-start").hasClass("pg-btn-lock")) {
        $(selector + ".btn-start").addClass("pg-btn-lock");
        resetMath();

        function pretty_time_string(num) {
            return ( num < 10 ? "0" : "" ) + num;
        }

        var start = new Date;

        pgTimer = setInterval(function () {

            var total_seconds = (new Date - start) / 1000;

            var hours = Math.floor(total_seconds / 3600);
            total_seconds = total_seconds % 3600;

            var minutes = Math.floor(total_seconds / 60);
            total_seconds = total_seconds % 60;

            var seconds = Math.floor(total_seconds);

            hours = pretty_time_string(hours);
            minutes = pretty_time_string(minutes);
            seconds = pretty_time_string(seconds);

            var currentTimeString = " "+ minutes + ":" + seconds +" ";

            $(".pg-time").text(currentTimeString);
        }, 100);
    }


    function resetTime(){
        clearInterval(pgTimer);
        $(".pg-time").text(" 00:00 ");
        $(".btn-start").removeClass("pg-btn-lock");

    }

    function stopTime() {
        clearInterval(pgTimer);
        $(".btn-start").removeClass("pg-btn-lock");

    }
}



function writeResults(){
    var wlHash = window.location.hash;
    wlHash = wlHash.substr(3,wlHash.length);
    var resultQ = "";
    var resultF = "";
    if(wlHash == "_v"){
        var resSelector = "#content";
        if(isMobile()){
            resSelector = ".swiper-slide-active"
        }
        var tmpArray = basil.get("result-array");


        resultQ = "<div class=\"row\">\n" +
        "    <div class=\"col-lg-2 col-md-1 col-xs-1\">\n" +
        "        <p>&nbsp</p>\n" +
        "    </div>\n" +
        "    <div class=\"col-lg-8 col-md-10 col-xs-10\">" +
            "<br>" +
            "<h4 class=\"pg-scale light-color cz\">Statistiky</h4>\n" +
            "<h4 class=\"pg-scale light-color en\">Statistics</h4>\n" +
            "<h4 class=\"pg-scale light-color chi\">统计数据</h4>";

        // --

            resultQ += "<div class=\"row\">\n";
            for (var i = tmpArray.length - 1; i >= 0; i--) {

                resultF += "" +
                    "" +
                    "<div class=\"col-lg-6 col-md-6 col-sm-6\">\n" +
                    "    <div class=\"vt-table-result\">\n" +
                    "      <div class=\"table-responsive\">\n" +
                    "        <table class=\"table table-striped\">\n" +
                    "          <tbody>\n" +
                    "            <tr>\n" +
                    "              <td>\n" +
                    "                <span class=\"cz\">Jméno:</span>\n" +
                    "                <span class=\"en\">Name:</span>\n" +
                    "                <span class=\"chi\">名称：</span>\n" +

                    "              </td>\n" +
                    "              <td>" + tmpArray[i].name + "</td>\n" +
                    "            </tr>\n" +
                    "            <tr>\n" +
                    "              <td>\n" +
                    "                <span class=\"cz\">Datum:</span>\n" +
                    "                <span class=\"en\">Date:</span>\n" +
                    "                <span class=\"chi\">日期：</span>\n" +

                    "              </td>\n" +
                    "              <td>" + tmpArray[i].date + "</td>\n" +
                    "            </tr>\n" +
                    "            <tr>\n" +
                    "              <td>\n" +
                    "                <span class=\"cz\">Čas:</span>\n" +
                    "                <span class=\"en\">Time:</span>\n" +
                    "                <span class=\"chi\">时间：</span>\n" +

                    "              </td>\n" +
                    "              <td>" + tmpArray[i].time + "</td>\n" +
                    "            </tr>\n" +
                    "            <tr>\n" +
                    "              <td>\n" +
                    "                <span class=\"cz\">Správně:</span>\n" +
                    "                <span class=\"en\">Correct:</span>\n" +
                    "                <span class=\"chi\">正确：</span>\n" +

                    "              </td>\n" +
                    "              <td>" + tmpArray[i].right + "</td>\n" +
                    "            </tr>\n" +
                    "            <tr>\n" +
                    "              <td>\n" +
                    "                <span class=\"cz\">Špatně:</span>\n" +
                    "                <span class=\"en\">Wrong</span>\n" +
                    "                <span class=\"chi\">错误：</span>\n" +

                    "              </td>\n" +
                    "              <td>" + tmpArray[i].wrong + "</td>\n" +
                    "            </tr>\n" +
                    "            <tr>\n" +
                    "              <td>\n" +
                    "                <span class=\"cz\">Rozsah:</span>\n" +
                    "                <span class=\"en\">Range:</span>\n" +
                    "                <span class=\"chi\">范围：</span>\n" +

                    "              </td>\n" +
                    "              <td>" + tmpArray[i].scale + "</td>\n" +
                    "            </tr>\n" +
                    "          </tbody>\n" +
                    "        </table>\n" +
                    "      </div>\n" +
                    "    </div>\n" +
                    "</div>";
            }

            resultQ += resultF;

            resultQ = resultQ + "</div><br>";

        if(basil.get("username") != "") {

            resultQ = resultQ + "<button class='btn-danger btn btn-reset-v cz'>RESET</button>" +
                "<button class='btn-danger btn btn-reset-v en'>RESET</button>" +
                "<button class='btn-danger btn btn-reset-v chi'>重置</button>";
            // ---
        }else{
            resultQ = resultQ + " <br><br><div class=\"text-center\">\n" +
                "<span class='cz'>Pro sbíraní statistik se musíte přihlásit</span>" +
                "<span class='en'>You are required to login for statistics gathering</span>\n" +
                "<span class='chi'>你需要登录收集数据</span>\n" +
                "<br>\n" +
                "<br>\n" +
                "<button type=\"button\" class=\"btn  vt-pg-btn-set vt-btn-signin pg-signin-btn\">\n" +
                "<span class=\"cz\">Přihlásit</span>\n" +
                "<span class=\"en\">Sign in</span>\n" +
                "<span class=\"chi\">登录</span>\n" +
                "</button>\n" +
                "</div>";

        }

        resultQ = resultQ + "  <br><br>\n" +
            "\n" +
            "    </div>\n" +
            "    <div class=\"col-lg-2 col-md-1 col-xs-1\">\n" +
            "        <p>&nbsp</p>\n" +
            "    </div>\n" +
            "</div>";
        $(resSelector).html(resultQ);

    }
}

function startLine(order, cntNumbers) {
    // clearLogs();

    var tmpsound = new Audio("mp3/beep07.mp3");
    var timerST = "";
    var selector = "";
    if(isMobile()){
        selector = ".swiper-slide-active ";
    }


    if(!$(".btn-line").hasClass("pg-btn-lock")) {
        $(".pg-drag-wrapper").addClass("pg-orange");
        $(".btn-line").addClass("pg-btn-lock");
        if(toggleLine){
            clearLogs();
        }
        if(toggleDrag){
            clearLogs();
            toggleDrag = false;
        }
        toggleLine = true;
        $(".pg-numline").addClass("hidden");        //TODO each !!!
        $(selector + ".pg-numline .pg-num").each(function () {
           $(this).addClass("pg-hidden");
        });
        $(selector + ".line"+$(selector + ".pg-select").val()).removeClass("hidden");

        $(selector + ".pg-drop-start").removeClass("pg-orange");

        var j = 0;
        if(order == "backwards"){
            j = 9;
            $(selector + ".pg-drop").each(function () {
               $(this).append($(selector + ".pg-drag").clone()[0]);
            });
        }

        var timer = 8 - $(selector + ".slider")[0].value;               // 8   4*2 aka 4 pro otoceni hodnoty - jde to sestupne
        var x;

        var t = 0;
        var timeL = (8 - $(selector + ".slider")[0].value) / 2;
        timeL = timeL*1000;
        timeL = 0;
        function timerLine(timeL) {
            timerST = setTimeout(function () {
                if(t>10){
                    return;
                }else{
                    var timeW = (8 - $(selector + ".slider")[0].value) / 2;
                    timeW = timeW*1000;
                    timerLine(timeW);
                    tmpsound.play();


                //    --------

                    if(order == "backwards"){
                        if(j != 9){
                            $(selector + ".pg-drop").get(j+1).children[4].remove();
                        }
                    }else{
                        $(selector + ".pg-drop").get(j).append($(selector + ".pg-drag").clone()[0]);

                    }


                    $(selector + ".hands-cz").attr("src", "images/hands_cz/"+ (j+1) + ".png");
                    $(selector + ".hands-en").attr("src", "images/hands_en/"+ (j+1) + ".png");
                    $(selector + ".hands-chi").attr("src", "images/hands_en/"+ (j+1) + ".png");


                    if(order == "backwards") {
                        $(selector + ".line"+$(selector + ".pg-select").val()).find(".pg-num-l" + (j+1)).removeClass("pg-hidden");

                        if (j < 9) {
                           // $(selector + ".pg-dot")[j+1].setAttribute("class", "pg-dot");
                        }
                        x = 0 ;
                        j--;

                    }else{
                        $(selector + ".line"+$(selector + ".pg-select").val()).find(".pg-num-l" + (j+1)).removeClass("pg-hidden");

                        if (j > 0) {
                        }
                        x = 10;
                        j++;
                    }


                    if (j == x) {
                        timerST = setTimeout(function () {
                            if(j == -1){
                                $(selector + ".pg-drop").get(0).children[4].remove();
                            }
                            $(selector + ".line"+$(selector + ".pg-select").val()).removeClass("hidden"); // TODO asi remove
                            $(".btn-line").removeClass("pg-btn-lock");


                        }, (timer/2) * 1000); //2*
                    }
                //    --------

                }
            },timeL);
            t++;

        }
        timerLine(timeL);

    }else{
        clearTimeout(timerST);

        $(".btn-line").removeClass("pg-btn-lock");

    }


    function clearLogs() {
        clearTimeout(timerST);
        ddInit();
        // $(".btn-line").removeClass("pg-btn-lock");

        $(selector + ".pg-drop").each(function () {
            $(this).droppable("option", "disabled", true);
            $(this).find(".pg-drag").remove();
            $(this).removeClass("pg-orange");
        });

        $(selector + ".pg-numline .pg-num").each(function () {
            $(this).addClass("pg-hidden");
        });
        cntNumbers = 1;

        $(selector + ".pg-drop-start").droppable("option", "disabled", false);
        $(selector + ".pg-drop-start").addClass("pg-orange");
        $(".hands-cz").attr("src", "images/hands_cz/0.png");
        $(".hands-en").attr("src", "images/hands_en/0.png");
        $(".hands-chi").attr("src", "images/hands_en/0.png");

    }
}


function loadNameMobile() {
    if(isMobile()){
        $(".pg-mobile-name").text(basil.get("username"));
    }
}


function loginCover() {
    // var wlHash = window.location.hash;
    if(basil.get("username") == ""){                               //wlHash == "#Cover"
        $(".pg-panel-name").addClass("hidden");
        $(".pg-panel-login").removeClass("hidden");

    }else{
        $(".pg-panel-name").removeClass("hidden");
        $(".pg-panel-login").addClass("hidden");
    }
}

function arrowNext() {
    $('#nav-next').click();
}


function langPanel() {      //TODO
        var ltLang = getLang();

        if(currentIndex != 0 && currentIndex != 9 && currentIndex != 10 && currentIndex != 11) {
            minVal = basil.get("minV");
            maxVal = basil.get("maxV");
            var menuItemIndex = $($(tsMenu).find(".menu-item")[currentIndex]).find("." + ltLang).text();
            menuItemIndex = menuItemIndex.substr(0, menuItemIndex.length - 9);
            menuItemIndex = menuItemIndex + minVal + " - " + maxVal;

            $("#ts-main-navbar .navbar-brand").text(menuItemIndex);
        }else{
            $("#ts-main-navbar .navbar-brand").text($($(tsMenu).find(".menu-item")[currentIndex]).find("." + ltLang).text());
        }

}




function ddInit() {

    $(selector + ".pg-drag").draggable({
        revert: "invalid",
        scroll: true,
        helper: "clone",
        drag : function () {
            if(toggleLine){
                toggleLine = false;
                clearLogs();
            }
            toggleDrag = true;

            $(".pg-drag-wrapper").removeClass("pg-orange");
        }
    });

    $(selector + ".pg-drop").droppable({
        tolerance: "intersect",
        accept: ".pg-drag",
        drop: function (event, ui) {

            $(".pg-numline").addClass("hidden");
            $(selector + ".line"+$(selector + ".pg-select").val()).removeClass("hidden");

            $(".hands-cz").attr("src", "images/hands_cz/"+cntNumbers+".png");
            $(".hands-en").attr("src", "images/hands_en/"+cntNumbers+".png");
            $(".hands-chi").attr("src", "images/hands_en/"+cntNumbers+".png");


            $(selector + ".line"+$(selector + ".pg-select").val()).find(".pg-num-l" + cntNumbers).removeClass("pg-hidden");
            cntNumbers++;

            $(this).append($(ui.draggable).clone());
            if ($(this).next().hasClass("pg-drop")) {
                $(this).next().droppable("option", "disabled", false);
                $(this).next().addClass("pg-orange");
            }
            $(this).droppable("option", "disabled", true);
            $(this).removeClass("pg-orange");
        }
    });

    $(selector + ".pg-drop").each(function () {
        var $this = $(this);
        if(!$this.hasClass("pg-drop-start")) {
            $this.droppable("option", "disabled", true);
            $this.removeClass("pg-orange");
        }
    });
}


function selectChange(){
    $("body").on("change", selector + ".pg-select", function () {
        clearLogs();
        removeBtnLock();
        $(selector + ".pg-drag").find("img").attr("src", "images/kl/kl"+$(selector+ ".pg-select").val()+"."+widthToGetImgFormat());        //svg
        $(".pg-drag-wrapper").removeClass("pg-orange");
    });
}


function loadAchiev() {

    var acArray = basil.get("achiev-array");
    var i = 0;
    var resultAchiev = true;



    $(".pg-achiev-img").each(function () {
       var $this = $(this);
        if(acArray[i] == true) {
            $this.find(".achiev-cz").attr("src","images/achiev_cz/achievement_"+ (i+1) +"_cz.png");
            $this.find(".achiev-en").attr("src","images/achiev_en/achievement_"+ (i+1) +"_en.png");
            $this.find(".achiev-chi").attr("src","images/achiev_chi/achievement_"+ (i+1) +"_chi.png");


        }else{
            $this.find(".achiev-cz").attr("src","images/achievement_empty.png");
            $this.find(".achiev-en").attr("src","images/achievement_empty.png");
            $this.find(".achiev-chi").attr("src","images/achievement_empty.png");
        }
        i++;
        if(i == 9) i = 0;

    });

    for(var j = 0; j<8;j++){
        if(acArray[j] == false){
            resultAchiev = false;
        }
    }

    if(resultAchiev){
        $(".pg-achiev-img").last().find(".achiev-cz").attr("src","images/achiev_cz/achievement_9_cz.png");
        $(".pg-achiev-img").last().find(".achiev-en").attr("src","images/achiev_en/achievement_9_en.png");
        $(".pg-achiev-img").last().find(".achiev-chi").attr("src","images/achiev_chi/achievement_9_chi.png");

        $(".pg-achiev-modal .achiev-cz").attr("src","images/achiev_cz/achievement_9_cz.png");
        $(".pg-achiev-modal .achiev-en").attr("src","images/achiev_en/achievement_9_en.png");
        $(".pg-achiev-modal .achiev-chi").attr("src","images/achiev_chi/achievement_9_chi.png");


        $(".achiev-boy").attr("src", "images/boy2.png");
    }else{
        $(".pg-achiev-img").last().find(".achiev-cz").attr("src","images/achievement_empty.png");
        $(".pg-achiev-img").last().find(".achiev-en").attr("src","images/achievement_empty.png");
        $(".pg-achiev-img").last().find(".achiev-chi").attr("src","images/achievement_empty.png");
        $(".achiev-boy").attr("src", "images/boy1.png");
    }

}


function toggleDiff(difficulty, scaleArray) {

    pageCount = 1;
    basil.set("difficulty", difficulty);

    for(var i = 0; i < inputArray.length;i++){
        inputArray[i] = [];
        statusArray[i] = [];
    }

    generate(scaleArray);

    if(isMobile()){
        var wlHash = window.location.hash;

        if(wlHash == "#Cover") {
            $(".swiper-slide-next").html(tsChapters[1].data);
        } else if(wlHash == "#11_v") {
            $(".swiper-slide-prev").html(tsChapters[8].data);
        } else if(wlHash != "#achievments"){
            wlHash = parseInt(wlHash.substr(1,2));

            $(".swiper-slide-prev").html(tsChapters[wlHash - 1].data);
            $(".swiper-slide-next").html(tsChapters[wlHash + 1].data);
        }
    }
}

function removeBtnLock(){
    if(isMobile) {
        $(".swiper-slide-prev .btn-line").removeClass("pg-btn-lock");
        $(".swiper-slide-next .btn-line").removeClass("pg-btn-lock");
    }
    $(selector + ".btn-line").removeClass("pg-btn-lock");
}

function scaleArrayInit() {
    var minVal = basil.get("minV");
    var maxVal = basil.get("maxV");

    if(maxVal < minVal){
        maxVal = minVal;
    }

    scaleArray = [minVal,maxVal,"m", minVal,maxVal,"d", minVal,maxVal,"b", minVal,maxVal,"b"];

}


function scaleListener() {

    $(".diff-select-num1").on("change",function () {

        // basil.set("minV", $(this).val());
        var $this = $(this);
        $(".diff-select-num2 option").each(function () {
           if(parseInt($(this).val()) < parseInt($this.val())){
               $(this).attr('disabled','disabled');
           }else{
               $(this).removeAttr('disabled');
           }
        });
        // langPanel();
        scaleArrayInit();
        nameInit(scaleArray);
    });

    $(".diff-select-num2").on("change",function () {

        // basil.set("maxV", $(this).val());
        var $this = $(this);
        $(".diff-select-num1 option").each(function () {
            if(parseInt($(this).val()) > parseInt($this.val())){
                $(this).attr('disabled','disabled');
            }else{
                $(this).removeAttr('disabled');
            }
        });
        // langPanel();
        scaleArrayInit();
        nameInit(scaleArray);
    });
}

function updateMenu() {
    $('#ts-menu').on('inserted.bs.popover', function(){

       var newMenuContent = tsMenu;
       minVal = basil.get("minV");
       maxVal = basil.get("maxV");
       newMenuContent = newMenuContent.replace(/MIN/g, minVal);
       newMenuContent = newMenuContent.replace(/MAX/g, maxVal);
       $(".popover-content").html(newMenuContent);
    });
}

function blockView(){
    // if (appExtBool) {
        if (!isMobile()) {
            var widthW = $(window).width();

            if (widthW > 991) {
                $(".pg-block").css("padding","2% 3%");
                var hPage = $(window).height();
                hPage = hPage - $(".bottom-block").height();
                hPage = hPage / 2;
                hPage = hPage - (55 + 50);
                if (hPage > 0) $(".bottom-block").css("padding-top", hPage);

                hPage = $(window).height();
                hPage = hPage - $(".top-block").height();
                hPage = hPage / 2;
                hPage = hPage - (55 + 50);
                if (hPage > 0) $(".top-block").css("padding-top", hPage);


                $(".bottom-block").addClass("hidden");
                $(".hr-line").addClass("hidden");
                $(".pg-block").css("margin", "0");

                var btnShiftD = "<button type=\"button\" class=\"btn btn-danger btn-shift-down small-btn\">\n" +
                "<span class=\"cz\">Dolů</span>\n" +
                "                            <span class=\"en\">Down</span>\n" +
                "                            <span class=\"chi\">下</span>\n" +
                "                        <i class=\"fa fa-arrow-down\"></i></button>\n";
                    // "<div class='small-btn btn-shift btn-shift-down'><span class='glyphicon glyphicon-arrow-down pg-arrow-glyphicon'></span></div>";
                var btnShiftU = "<button type=\"button\" class=\"btn btn-danger btn-shift-up small-btn\">\n" +
                "<span class=\"cz\">Nahoru</span>\n" +
                "                            <span class=\"en\">Up</span>\n" +
                "                            <span class=\"chi\">上</span>\n" +
                "                        <i class=\"fa fa-arrow-up\"></i></button>\n";
                    // "<div class='small-btn btn-shift btn-shift-up'><span class='glyphicon glyphicon-arrow-up pg-arrow-glyphicon'></span></div>";
                $(".buttons-wrap").append(btnShiftD);
                $(".bottom-wrap").append(btnShiftU);
            }
        }
    // }
}

function blockViewSwitch(){
    // if (appExtBool) {
        if (!isMobile()) {
            $("body").on("click", ".btn-shift-down", function () {
                $(selector + ".top-block").addClass("hidden");
                $(selector + ".bottom-block").removeClass("hidden");

            });

            $("body").on("click", ".btn-shift-up", function () {
                $(selector + ".top-block").removeClass("hidden");
                $(selector + ".bottom-block").addClass("hidden");

            });
        }
    // }
}

function popAns(){
    var tmpInput;
    var pThis;
    $("body").on("click", ".pg-input", function () {
        tmpInput = $(this);
        // tmpInput.focus();
        pThis = $(this).parents(".pg-popover");
        $('.pg-popover').not(pThis).popover("hide");
    });

    $("body").on("click", ".ans-btn", function () {
        tmpInput.val($(this).text());
        pThis.popover("hide");
    });

}

function langSwitch(){
    $("body").on("click", ".flag-popover", function () {
        var langArray = ["cz", "en", "chi"];
        var $this = $(this);
        var langSel = $this.attr("data-val");

        basil.set("lang", langSel);

        for(var i = 0; i<langArray.length;i++){
            if(langArray[i] != langSel){
                $("body").addClass("hidden-"+langArray[i]);
            }
        }
        $("body").removeClass("hidden-"+langSel);

        if(langSel == "en"){
               $("#pg-init").attr("placeholder","Enter the name to record statistics");
               $("#pg-init-mail").attr("placeholder","Enter the email to send results");
           }else if(langSel == "cz"){
               $("#pg-init").attr("placeholder", "Zadejte jméno pro úkládání statistik");
               $("#pg-init-mail").attr("placeholder", "Zadejte email pro možnost odesílání výsledků");
           }else if(langSel == "chi"){
               $("#pg-init").attr("placeholder", "输入名字来记录数据");
               $("#pg-init-mail").attr("placeholder", "输入电子邮箱来发送结果");
        }

        langPanel();
        $(".pg-flag-popover").popover("hide");
    });
}


function getLang(){
    return basil.get("lang");
}

function setLang() {
    var langArray = ["cz", "en", "chi"];

    for(var i = 0;i<langArray.length;i++){
        if(langArray[i] != basil.get("lang")){
            $("body").addClass("hidden-"+langArray[i]);
        }
    }
}




