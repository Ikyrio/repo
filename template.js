/* template */


if (typeof window.version === "undefined") {
    version = {};
}
if (typeof window.version === "object") {
    version["template-prodos"] = "2021.4.28.1";
}


bookTemplate = {};

function setSideTextLeft() {
    $("body")
        .removeClass("template-right")
        .addClass("template-left");

}

function setSideTextRight() {
    $("body")
        .removeClass("template-left")
        .addClass("template-right");
}


// bookTemplate.allowSharingNotes = false;
bookTemplate.allowCitation = false;
bookTemplate.stretchCoverImage = true;
bookTemplate.onAfterBookLoaded = function () {
    var voices;
    var testArray = [];

    bookProgressBar.init();
    setDemo();

    $("body").on("click", "a", function () {
       var $a = $(this);
       if($a.attr("data-lightbox")){
           if(isiOS()){
               console.log("lightbox img");
               $(".lb-dataContainer").css({"height":"150px", "overflow-y":"auto"});
           }
       }

    });


    if(!window.speechSynthesis || !window.speechSynthesis.getVoices){
        error += "FAIL ";
    }else{
        error += "Speech Synthesis is working";
    }
    try {
        voices = window.speechSynthesis.getVoices(); //init for text to speech
    }catch(error){
        error += " er: " +error;
    }


    renderMathInElementOrig = renderMathInElement;
    renderMathInElement = function(){};

    $('body').on("touchstart click", "#ts-search-formula", function (e) {
        renderMathInElementOrig(document.body);
    });


    if (isMobile()) {
        var $firstPage = $('.swiper-slide[data-idx="0"]');

        var defaultPadding = $firstPage.css("padding-left");
        $firstPage.css("padding-right", defaultPadding);
    }


    $("body").on("click", ".test-mail .btn-check", function () {
        $(this).parents(".test-mail").find(".btn-mail").removeClass("disabled");
    });

    $("body").on("click", ".a-openmenu", function (e) {
        e.stopPropagation();
        $("#ts-menu").click();
    });


    $("body").on("click", ".btn-speech", function () {
        var $this = $(this);
        var msg = $this.prev().find(".text-to-speech").text();
        var lang = $this.prev().find(".text-to-speech").attr("data-lang");

        textToSpeech(msg, lang);
    });



    setSideTextLeft();
    repro();
    mailTo();

    // scrollInit();
    testy.getGlobalPoints();

    testArrayInit(testArray);

    $("body").on("evaluated.testy", ".test-placeholder", function () {
        testy.getGlobalPoints();
        var $this = $(this);



        if(!$this.hasClass("not-test")){
            var earnedPoints = $this.find(".final-score span").html();
            earnedPoints = earnedPoints.split("/", 1);
            testy.setEarnedPoints($this.attr("datasrc"), parseFloat(earnedPoints[0]));
            // setScore();
            updateScoreMenu();
        }

    });


    // ---- feature: wikipedia button in text selected menu ----

    selectionMenuAddButton(
        '<button id="search-wikipedia-trigger" type="button" class="btn btn-default btn-lg" style="padding-left: 0!important; padding-right: 0!important;">' +
        '    <a style="padding: 13px 16px " class="search-wikipedia-link" href="#" target="_blank"><span class="fa fa-wikipedia-w" style="color: rgb(117,117,117); font-size: 90%;"></span></a>' +
        '</button>');


    // ---- feature addon for iOS ----
    var selectionEndTimeout = null;
    // bind selection change event to my function
    document.onselectionchange = userSelectionChanged;

    //part that wont trigger link change every onselectionchange but after 0.5sec since last onselectionchange
    function userSelectionChanged() {
        // wait 500 ms after the last selection change event
        if (selectionEndTimeout) {
            clearTimeout(selectionEndTimeout);
        }
        selectionEndTimeout = setTimeout(function () {
            $(window).trigger('selectionEnd');
        }, 500);
    }


    $(window).bind('selectionEnd', function () {
        // reset selection timeout
        selectionEndTimeout = null;

        // get user selection
        var selectedText = getSelectionText();
        // if the selection is not empty show it
        if(selectedText != ''){
            var url = "https://en.wikipedia.org/wiki/Special:Search?search=" + selectedText;
            $(".search-wikipedia-link").attr("href", url);
        }
    });

    // returns string of selected text
    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }



    setTimeout(setProgressInMenu(),3000);
}
bookTemplate.onAfterPageChange = function () {
    bookProgressBar.update();

    $('.i-tooltip[data-toggle="popover"]').each(function () {
        var p = $(this).attr("data-placement");
        var t = $(this).attr("data-trigger");
        $(this).popover({
            html: true,
            placement: p || "top",
            trigger: t || "hover"
        });
    });

    if (! isMobile()) {
        if ((currentIndex == 0)) { //||(currentIndex == 1)

            $("#content").css("padding-right", "0");
            $("#content").css("padding-left", "0");

        }
        else {
            $("#content").css("padding-right", "");
            $("#content").css("padding-left", "");
        }
    }
    $(".test-mail .btn-mail").addClass("disabled");
    setBackground();
    renderMathInElementOrig(document.body);

    createProgressBar();


    // called after all tests
    var renderLatexPostponeTimeout = null;

    // whatever needs to be done after test is generated/reset
    function afterTestCreated() {
        if (renderLatexPostponeTimeout)
            clearTimeout(renderLatexPostponeTimeout);
        btnRewrite();
        renderLatexPostponeTimeout = setTimeout(function(){
            renderMathInElementOrig(document.body);
        }, 500);
    }


    // po vytvoreni testov zavolat afterTestCreated()
    $(".test-placeholder").each(function(){
        var testPlaceholder = this;
        $(testPlaceholder).on("created.testy", afterTestCreated);

        // if sme nestihli .on(...) event, tak dodatocne zavolat
        if ($(testPlaceholder).hasClass("filled")) {
            afterTestCreated();
        }

    });

}


function repro(){
    var playingAudio = null;
    $("body").on("click", '.repro', function(event, ui) {
        playingAudio = $(this).children();
        playingAudio[0].currentTime = 0;
        if($(this).hasClass("paused")){
            playingAudio[0].pause();
        }else{
            playingAudio[0].play();
        }
        $(this).toggleClass("paused");
    });
}


function mailTo(){
    $("body").on("click",".btn-mail", function () {
       var $testMail = $(this).parent();
       var fScore, tName;
       var mailSubject, mailBody, email = "";


       tName = $(this).attr("data-testName");
       fScore = $testMail.find(".final-score").html();
       if(fScore == undefined){
           return;
       }
        fScore = fScore.replace("<span>", "");
        fScore = fScore.replace("</span>", "");

        mailSubject = "Výsledek testu";
        mailBody = tName + "%0D%0A" + fScore + "%0D%0A";

        window.location = "mailto:" + email + "?subject=" + mailSubject + "&body=" + mailBody;


    });
}

function setBackground(){
    var wHash = window.location.hash;
    wHash = wHash.split("&");
    wHash = wHash[0];
    if((wHash == "#tests1-1")||(wHash == "#tests1-2")||(wHash == "#tests1-3")||(wHash == "#tests1-4")||(wHash == "#tests1-5")||(wHash == "#tests2-1")||(wHash == "#tests2-2")||(wHash == "#tests2-3")){
        $("body").removeClass("bf-1");
        $("body").addClass("test-background");

    }else{
        $("body").addClass("bf-1");
        $("body").removeClass("test-background");
    }
}


function collapseTriangle(tClass){
    // console.log($(tClass));
    $(tClass).toggleClass("glyphicon-triangle-right");
    $(tClass).toggleClass("glyphicon-triangle-bottom");
}


function btnRewrite(){
    var $test = $(".test-placeholder");
    if(!$test.hasClass("not-test")){
        $test.find(".btn-check").html("<span class=\"pg-btn-check\"><img src=\"images/ikona-check.png\"></span>");
        $test.find(".btn-reset").html("<span class=\"pg-btn-check\" ><img src=\"images/ikona-reset.png\"></span>");
    }
}

function createImage(){
    var imgNumber = 0;
    var jpgNumber = 0;
    var rowInsert = "";
    var tableInsert = "";
    var tableAll, rowAll = "";
    var partNum = "";

    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            imgNumber++;

            if(imgNumber < 10){
                jpgNumber = "00" + imgNumber;
            }
            if (imgNumber > 9 && imgNumber < 100){
                jpgNumber = "0" + imgNumber;
            }
            if(imgNumber === 100){
                jpgNumber = "" + imgNumber;
            }

            partNum = "part-" + imgNumber;

            var colInsert = "<td><image class=\"part-opacity " + partNum + "\"  src=\"images\/split\/part_"+ jpgNumber + ".jpg\"></td>";
            rowInsert = rowInsert + colInsert;
        }
        rowAll = "<tr>"+ rowInsert +"</tr>";
        tableInsert = tableInsert + rowAll;
        rowInsert= "";
    }

    tableAll = "<table class='table-responsive table-image-box'>"+tableInsert+"</table>";

    $(".image-box").html(tableAll);
    setTimeout(function () {
        fillImage();
    },3000);

}


function fillImage() {
    var arrayOrder = [23, 69, 5, 18, 90, 84, 99, 95, 65, 91, 86, 58, 100, 76, 13, 60, 56, 36, 34, 53, 41, 9, 11, 35, 44, 27, 88, 59, 80, 48, 82, 83, 72, 40, 89, 85, 92, 87, 17, 55, 24, 43, 54, 75, 94, 78, 38, 62, 64, 93, 37, 20, 30, 68, 15, 49, 74, 96, 46, 50, 63, 16, 3, 66, 67, 42, 73, 79, 71, 52, 12, 14, 26, 97, 1, 61, 57, 47, 8, 45, 32, 98, 70, 6, 29, 2, 10, 31, 39, 81, 4, 51, 21, 77, 22, 28, 25, 7, 19, 33];
    var limit = getProgressPercents();

    // console.log(limit);
    
    if(limit === undefined || limit > 100){
        limit = 100;
    }
    
    for (var i = 0; i < 100; i++){
        var $part_i = $(".part-"+ arrayOrder[i]);
        if(i >= limit){
            if(!$part_i.hasClass("part-opacity")){
                $part_i.addClass("part-opacity");
            }
        }else{
            if($part_i.hasClass("part-opacity")){
                $part_i.removeClass("part-opacity");
            }
        }
    }
}

function testArrayInit(testArray){

    // console.log("testArrayInit");
    for (var i = 0; i < tsChapters.length; i++) {
        var tsPage = tsChapters[i].data;
        tsPage = tsPage.replace(/<img /g, "<ximg ");
        // console.log(tsPage);
        $('<div>' + tsPage + '</div>').find(".test-placeholder").each(function () {

            var testURL = tsChapters[i].id;
            var $this =  $(this);
            if (!$this.hasClass("not-test")) {
                var testName = $this.parent().prevAll("h2").html();
                var testHref = $this.parent().find(".anchor-href").attr("data-href");
                testHref = testHref.slice(0, testHref.length - 4);
                var fileName = $this.attr("datasrc");
                var testItem = new TestObj(fileName, testName, testHref, testURL);
                testArray.push(testItem);
            }
        });
    }
}


function TestObj(fileName, testName, datahref, url){
    this.fileName = fileName;
    this.testName = testName;
    this.datahref = datahref;
    this.url = url;
}

function createList(){
    var savedProgress = basil.get("testy:globalProgress");
    var prevTestName = "";
    var sumEarned = 0;
    var sumMax = 0;

    // console.log(testArray);
    for(var i = 0; i<testArray.length; i++){
        // console.log(i + "index of testArray");
        var fileName = testArray[i].fileName;
        var testEarned = savedProgress[fileName].earned;
        var testMax = savedProgress[fileName].max;
        var testName = testArray[i].testName;


        if(i != (testArray.length - 1)){

            if(testName == testArray[i+1].testName){
                //ulozit si score pro secteni
                sumEarned += testEarned;
                sumMax += testMax;
            }else{
                if(prevTestName == testArray[i].testName){
                    //zapis polozku
                    sumEarned += testEarned;
                    sumMax += testMax;
                    // anchor-href data-href='"+ testArray[i].datahref +"'
                    testString = "<tr><td><a class='eval-href anchor-href' data-href='"+ testArray[i].datahref +"' href='#"+ testArray[i].url +"&jumptoanchor="+ testArray[i].datahref +"'>"+ testName +":</a> </td><td>" + sumEarned + " / "+ sumMax + " b</td></tr>";
                    $(".test-list").append(testString);
                    sumEarned = 0;
                    sumMax = 0;
                }else{
                    testString = "<tr><td><a class='eval-href anchor-href' data-href='"+ testArray[i].datahref +"' href='#"+ testArray[i].url +"&jumptoanchor="+ testArray[i].datahref +"'>"+ testName +":</a> </td><td>" + testEarned + " / "+ testMax + " b</td></tr>";
                    $(".test-list").append(testString);
                }
            }

        }else{
            var testString = "<tr><td><a class='eval-href anchor-href' data-href='"+ testArray[i].datahref +"' href='#"+ testArray[i].url +"&jumptoanchor="+ testArray[i].datahref +"'>"+ testName +":</a> </td><td>" + testEarned + " / "+ testMax + " b</td></tr>";
            $(".test-list").append(testString);
        }

        prevTestName = testArray[i].testName;
    }
    var testSumString = "<tr class='sum-test'><td>Celkem: </td><td>"+ testy.getGlobalPoints().allTestsPointsEarned + " / "+ testy.getGlobalPoints().allTestsPointsTotal +" b</td></tr>";
    $(".test-list").append(testSumString);
}



function getProgressPercents() {

    var points =  testy.getGlobalPoints().allTestsPointsEarned;
    var allPoints = testy.getGlobalPoints().allTestsPointsTotal;

    return Math.floor((points/allPoints) * 100);
}

function createProgressBar() {

    var progress = getProgressPercents();

    $(".progress-bar-tests").html("<div id=\"progress\">\n" +
        "  <div id=\"pBar\"><div class='progress-num'>"+ progress +"&nbsp;%</div></div>\n" +
        "</div>");


    $("#pBar").css({"width" : progress +"%" ,"background-color" : getScoreColor()});
}

function setScore() {
    var progress = getProgressPercents();
    var icon = "";


    var progressMessage = "";
    switch (true){
        case (progress >= 0 && progress < 10):
            progressMessage = "Dlouhá cesta před námi!";
            icon = "&#128170;";
            break;
        case (progress >= 10 && progress < 20):
            progressMessage = "Už se rozjíždíš!";
            icon = "&#127852;";
            break;
        case (progress >= 20 && progress < 30):
            progressMessage = "Jde to. Máš na víc?";
            icon = "&#127853;";
            break;
        case (progress >= 30 && progress < 40):
            progressMessage = "Hmm, jen tak dál!";
            icon = "&#128077;";
            break;
        case (progress >= 40 && progress < 50):
            progressMessage = "Fajn! Jsi na dobré cestě!";
            icon = "&#127856;";
            break;
        case (progress >= 50 && progress < 60):
            progressMessage = "Prima! Tohle vypadá dobře!";
            icon = "&#127873;";
            break;
        case (progress >= 60 && progress < 70):
            progressMessage = "Dobrá práce! Pokračuj!";
            icon = "&#127881;";
            break;
        case (progress >= 70 && progress < 80):
            progressMessage = "Jupí! Tohle vypadá báječně!";
            icon = "&#129353;";
            break;
        case (progress >= 80 && progress < 90):
            progressMessage = "Výtečný výsledek! Potlesk!";
            icon = "&#129352;";
            break;
        case (progress >= 90 && progress < 98):
            progressMessage = "Co dodat? Skvěle, skvěle, skvěle!";
            icon = "&#129351;";
            break;
        case (progress >= 98):
            progressMessage = "Ty jsi génius!";
            icon = "&#127942;";
            break;
        default:
            console.log("This shouldn't happen");

    }

    $(".score-value").html(progress + "% ");
    $(".score-message").html(progressMessage + " " + icon ); //"<img class='icon-eval' src='images/eval_icons/"+ icon + ".png'">
}

function getScoreColor() {
    var score = getProgressPercents();
    if(isNaN(score)){
        score = 0;
    }
    var r = parseInt((210 * (100 - score)) / 100);
    var g = parseInt((210 * score) / 100);
    var b = parseInt(25);
    var bgColor = "rgb(" + r + "," + g + "," + b + ")";
    // console.log(bgColor);

    var h = parseInt(0 + score);
    var s = 100;
    var l = 40;
    var hslColor = "hsl(" + h + ", " + s +"%, "+ l +"%)";
    return bgColor;
    // $(".score-value").css("color", bgColor);

}


function setProgressInMenu(){
    var progress = getProgressPercents();
    if(isNaN(progress)){
        progress = 0;
    }
    if(!$(".navbar-right").find(".score-menu").length){
        // $(".navbar-right").prepend("<li class='score-menu'><a class='ts-navigation-icon' href='#vyhodnoceni'><span class='score-value '>"+ progress +"%</span></a></li>");
        $(".navbar-right").prepend("<li class='score-menu'><a class='ts-navigation-icon' href='#vyhodnoceni'><div role=\"progressbar\" aria-valuenow=\""+ progress +"\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"--value:"+ progress +"\"></div></a></li>");

    }
    // getScoreColor();
    scoreMenuColor();
}

function updateScoreMenu() {
    var progress = getProgressPercents();

    var $nav =  $(".navbar-right").find(".score-menu div");
    $nav.attr("aria-valuenow", progress);

    $nav[0].style.setProperty("--value", progress);
    scoreMenuColor();
}

function scoreMenuColor() {
    var $nav =  $(".navbar-right").find(".score-menu div");
    $nav[0].style.setProperty("--fg", getScoreColor());
}


function textToSpeech(message, lang){
    if(lang == undefined){
        lang = "cs-CZ";
    }

    try {
        var msg = new SpeechSynthesisUtterance(message);
        voices = window.speechSynthesis.getVoices();
        for(const v of voices){
            if(v.lang == lang){
                msg.voice = v;
                $(".err-msg").html(lang);
                break;
            }
        }

            if (!speechSynthesis.speaking) {
                console.log("halted");
            }
            window.speechSynthesis.speak(msg);
    }
    catch(error){
        console.error(error);
        alert(error);
    }
}


function isiOS() {
    return !window.MSStream && /iPhone/.test(navigator.userAgent); // fails on iPad iOS 13
}

function feedback() {

    $(".not-test .button-wrapper .btn-check").hide();

    var $test = $(".not-test");



    var htmlButton = "<button class=\"btn btn-feedback btn-primary\" type=\"button\">Odeslat</button>";

    $(htmlButton).insertBefore( $(".not-test .button-wrapper") );




    $(".btn-feedback").on("click", function () {
       $(".btn-check").click();
    });

    $test.on("evaluated.testy", function () {
        console.log("eval-hmm");


        var $longAnswers = $test.find(".testy-task-type-long textarea");
        var chooseAnsArray = [];
        $test.find(".testy-task-type-choose").each(function () {
            var $this = $(this);
            var array = [];
            $this.find(".selected").each(function () {
                var $inputVal = $(this).find(".input-eval-other").val();

                if($inputVal){
                    array.push($(this).text() + " " + $inputVal);
                }else{
                    array.push($(this).text());
                }

            });
            chooseAnsArray.push(array);
        });
        // $test.find(".testy-task-type-mixed ").find(":selected").text();
        var selectAnswer = [];
        $test.find(".testy-task-type-mixed ").find(":selected").each(function () {
            selectAnswer.push($(this).text());
        });

        var fields = {
            o1: chooseAnsArray[0],
            o2: selectAnswer,
            o3: chooseAnsArray[1],
            o4: $longAnswers[0].value,
            o5: $longAnswers[1].value,
            o6: chooseAnsArray[2],
            o7: chooseAnsArray[3]
        };
        console.log(fields);

        var email ="nakladatelstvi.prodos@gmail.com, d.sevcik@prodos.eu";
        var mailSubject = "Dotazník Fyzika kapaliny a plyny";
        var mailBody = "";



        mailBody = mailBody + "Dotazník %0D%0A";
        mailBody = mailBody + "--------------- %0D%0A";
        mailBody = mailBody + "Jak ses o učebnici Interaktivní fyzika – Kapaliny, Plyny dozvěděl/a? %0D%0A";
        mailBody = mailBody + fields.o1 + "%0D%0A %0D%0A";
        mailBody = mailBody + "Jak hodnotíš následující kritéria na škále od 0 (velmi špatná úroveň) po 10 (vynikající úroveň)? %0D%0A";
        mailBody = mailBody + "srozumitelnost textů " + fields.o2[0] + "%0D%0A";
        mailBody = mailBody + "grafické zpracování " + fields.o2[1] + "%0D%0A";
        mailBody = mailBody + "pestrá skladba úloh " +fields.o2[2] + "%0D%0A";
        mailBody = mailBody + "celková koncepce učebnice " + fields.o2[3] + "%0D%0A";
        mailBody = mailBody + "spolehlivost aplikace " + fields.o2[4] + "%0D%0A %0D%0A";
        mailBody = mailBody + "Které interaktivní prvky učebnice považuješ za nejpřínosnější? %0D%0A";
        mailBody = mailBody + fields.o3 + "%0D%0A %0D%0A";
        mailBody = mailBody + "Co bychom měli na učebnici vylepšit? %0D%0A";
        mailBody = mailBody + fields.o4 + "%0D%0A %0D%0A";
        mailBody = mailBody + "Co se ti na učebnici líbí nejvíc? %0D%0A";
        mailBody = mailBody + fields.o5 + "%0D%0A %0D%0A";
        mailBody = mailBody + "Doporučil/a bys tuto učebnici fyziky svým přátelům? %0D%0A";
        mailBody = mailBody + fields.o6 + "%0D%0A %0D%0A";
        mailBody = mailBody + "Kdo pro nás vyplnil tento formulář?  %0D%0A";
        mailBody = mailBody + fields.o7 + "%0D%0A %0D%0A";

        window.location = "mailto:" + email + "?subject=" + mailSubject + "&body=" + mailBody;


    });

}


function setCertificate() {

    var cdate = new Date().toISOString().split('T')[0];
    cdate = cdate.split('-');
    var cdateM = cdate[1];
    if(cdateM < 10) {
        cdateM = cdateM.substr(1, 1);
    }
    var dateString = cdate[2] + "." + cdateM + "." + cdate[0];

    $(".pg-certificate-date").text(dateString);
    $(".pg-certificate-score").text(getProgressPercents() + " %");
}


function setDemo() {
    $('#ts-menu').on('inserted.bs.popover', ltPositionMenu);
}

function ltPositionMenu() {
    var $popover = $(this).next('.popover');
    console.log("Hmm");
    // $popover.find(".menu-item-fake, .menu-anchor").each(function () {
    $popover.find("a").each(function () {
        var $a = $(this);
        if ($a.attr("href") != "#Cover" && !$a.hasClass("menu-demo")) {
            $a.addClass("not-available");
            $a.on("click", function() {
                alert("Odkaz je součástí plné verze knihy.");
                return false;
            })
        }
    });
}