/* default template */

// optional
if (typeof window.version === "undefined") {
    version = {};
}
if (typeof window.version === "object") {
    version["template-default"] = "2020.3.5.1";
}

var testArray = [];

bookTemplate = {};

bookTemplate.onAfterBookLoaded = function () {

    $("body").on("click", ".button-zadani", function () {
        var $this = $(this).find(".audio-btn");


        if($this.parents(".lista-ukolu").find("audio").length == 0){

            var audioSource = $this.attr("data-sound");
            var audioStr = `<div class='ts-swipe-left-right-background'>
                                <audio controls>
                                    <source src='${audioSource}' type='audio/mpeg'>
                                </audio>
                                </div>`;
            $this.parents(".lista-ukolu").append(audioStr);

            setTimeout(function () {
                $this.parents(".lista-ukolu").find("audio")[0].play();
            },500)

        }else{
            $this.parents(".lista-ukolu").find("audio")[0].pause();
            $this.parents(".lista-ukolu").find("audio").remove();
        }


        // audio.play();
    });

    $("body").on("click", ".a-openmenu", function (e) {
        e.stopPropagation();
        $("#ts-menu").click();
    });

    $("body").on({
        mouseenter: function () {

            $(this).find("img").attr("src", "images/info_orig.svg");
        },
        mouseleave: function () {

            $(this).find("img").attr("src", "images/info.svg");
        }
    },".blok-proUcitele");


    $("body").on("click", function (e) {
        $(".blok-proUcitele").each(function(){
            var insideTooltip = this.contains(e.target);
            if (!insideTooltip){
                this.removeAttribute("open");
            }
        });
    });


    $("body").on('shown.bs.popover', "[data-toggle='popover']", function(){
        $(this).parents(".lista-ukolu").next().find(".info-answers").removeClass("hidden");
    });

    $("body").on('hide.bs.popover', "[data-toggle='popover']", function(){
        $(this).parents(".lista-ukolu").next().find(".info-answers").addClass("hidden");
    });


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

    testArrayInit();

    setTimeout(setProgressInMenu(),3000);

    
    
    $("body").on("click",".btn-reset-input", function () {
        var $btn = $(this);
        buttonResetInputs($btn);
    })
    

}


bookTemplate.onAfterPageChange = function () {

    stopAllMedia();

    setTimeout(function () {
        $('.footnote[data-toggle="popover"]').each(function () {

            var p = $(this).attr("data-placement");
            var t = $(this).attr("data-trigger");
            $(this).popover({
                html: true,
                placement: p || "left",
                trigger: t || "click"
            });
        });
    },2000);

    createProgressBar();
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

function getProgressPercents() {

    var points =  testy.getGlobalPoints().allTestsPointsEarned;
    var allPoints = testy.getGlobalPoints().allTestsPointsTotal;
    // points = 834;
    return Math.floor((points/allPoints) * 100);
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


    var h = parseInt(0 + score);
    var s = 100;
    var l = 40;
    var hslColor = "hsl(" + h + ", " + s +"%, "+ l +"%)";
    return bgColor;
    // $(".score-value").css("color", bgColor);

}

//----------------image------------------------

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
    },10);

}

function fillImage() {
    var arrayOrder = [23, 69, 5, 18, 90, 84, 99, 95, 65, 91, 86, 58, 100, 76, 13, 60, 56, 36, 34, 53, 41, 9, 11, 35, 44, 27, 88, 59, 80, 48, 82, 83, 72, 40, 89, 85, 92, 87, 17, 55, 24, 43, 54, 75, 94, 78, 38, 62, 64, 93, 37, 20, 30, 68, 15, 49, 74, 96, 46, 50, 63, 16, 3, 66, 67, 42, 73, 79, 71, 52, 12, 14, 26, 97, 1, 61, 57, 47, 8, 45, 32, 98, 70, 6, 29, 2, 10, 31, 39, 81, 4, 51, 21, 77, 22, 28, 25, 7, 19, 33];
    var limit = getProgressPercents();


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



//---------------progress bar-----------------------


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



//-----------create list-----------------

function createList(){
    var savedProgress = basil.get("testy:globalProgress");
    var prevTestName = "";
    var sumEarned = 0;
    var sumMax = 0;
    var tmpUrl = "";
    var testString = "";



    for(var i = 0; i<testArray.length; i++){

        var fileName = testArray[i].fileName;
        var testEarned = savedProgress[fileName].earned;
        var testMax = savedProgress[fileName].max;
        var testName = testArray[i].testName;
        var tmpA = "";
        var sectionString= "";



        if(i != (testArray.length - 1)){


            // if(testName == testArray[i+1].testName){
                //ulozit si score pro secteni
                // sumEarned += testEarned;
                // sumMax += testMax;
            // }else{

               ;
                if(prevTestName == testArray[i].testName){
                    //zapis polozku
                    sumEarned += testEarned;
                    sumMax += testMax;
                    // anchor-href data-href='"+ testArray[i].datahref +"'
                    if(tmpUrl != testArray[i].url){
                        if(testArray[i].url.length == 2){
                            tmpA = "A";
                        }

                        sectionString = "<tr><td colspan='2'>"+testArray[i].url + tmpA +"</td></tr>";
                    }
                    tmpUrl = testArray[i].url;
                    testString = sectionString + "<tr><td><a class='eval-href anchor-href' data-href='"+ testArray[i].datahref +"' href='#"+ testArray[i].url +"'>"+ testName +":</a> </td><td>" + sumEarned + " / "+ sumMax + " b</td></tr>";

                    $(".test-list").append(testString);
                    sumEarned = 0;
                    sumMax = 0;
                }else{
                    if(tmpUrl != testArray[i].url){
                        if(testArray[i].url.length == 2){


                            tmpA = "A";
                        }
                        sectionString = "<tr><td colspan='2'>"+testArray[i].url + tmpA +"</td></tr>";
                    }
                    tmpUrl = testArray[i].url;
                    testString = sectionString + "<tr><td><a class='eval-href anchor-href' data-href='"+ testArray[i].datahref +"' href='#"+ testArray[i].url  +"'>"+ testName +":</a> </td><td>" + testEarned + " / "+ testMax + " b</td></tr>";

                    $(".test-list").append(testString);
                }
            // }

        }else{
            testString = "<tr><td><a class='eval-href anchor-href' data-href='"+ testArray[i].datahref +"' href='#"+ testArray[i].url  +"'>"+ testName +":</a> </td><td>" + testEarned + " / "+ testMax + " b</td></tr>";
            $(".test-list").append(testString);
        }

        prevTestName = testArray[i].testName;

    }
    var testSumString = "<tr class='sum-test'><td>Celkem: </td><td>"+ testy.getGlobalPoints().allTestsPointsEarned + " / "+ testy.getGlobalPoints().allTestsPointsTotal +" b</td></tr>";
    $(".test-list").append(testSumString);


}


function buttonResetInputs($btn) {
    $btn.parent().prev().find(".form-control").each(function () {
        $(this).val("");
    });
}



function testArrayInit(){
    for (var i = 0; i < tsChapters.length; i++) {
        var tsPage = tsChapters[i].data;
        tsPage = tsPage.replace(/<img /g, "<ximg ");
        $('<div>' + tsPage + '</div>').find(".test-placeholder").each(function () {

            var testURL = tsChapters[i].id;

            var $this =  $(this);
            if (!$this.hasClass("not-test")) {
                var testName ="";

                var testHref = $this.attr("datasrc");
                testHref = testHref.slice(6, testHref.length);
                testHref = testHref.split(".");
                testHref = testHref[0].split("-");
                // testHref = testHref.split(-)
                testName = testHref[1] + "-"  + testHref[3];


                var fileName = $this.attr("datasrc");
                var testItem = new TestObj(fileName, testName, testURL); //testHref,
                testArray.push(testItem);
            }
        });
    }
}

function TestObj(fileName, testName, url){  //, datahref
    this.fileName = fileName;
    this.testName = testName;
    // this.datahref = datahref;
    this.url = url;
}



if (! window.initAudioOnImg) window.initAudioOnImg = function () {}












