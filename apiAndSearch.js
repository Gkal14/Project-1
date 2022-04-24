var searchBtn = $('#searchBtn')
var searchInput = $('#seachInput')
var omdbAPIKey = '6cf7de9c'
var xAPIHost = "streaming-availability.p.rapidapi.com"
var xAPIKey = "48af6d5201msh053c835d802b65ep19886ajsnbee02c30d0f3"
var posterImg = $('#posterImg')
var movieTitle = $('#movieTitle')
var movieOverview = $('#movieOverview')
var trailer = $('#videoPlayer')
var streamPlatform = $('#streamPlatform')



// initialzation
async function init(){
    resizeSvg(100,100)
    hideAllSvg()
    var movieName = getMovieName()
    if (movieName === ''){
        // show modal
        return
    }
    var omdbData = await getDataOMDB(movieName)
    
    var streamingData = await getDataStreamingAvailability(omdbData.imdbID)
    console.log(streamingData)
    displayData(omdbData, streamingData)
}

function resizeSvg(width, height) {
    var streamList = $('#streamPlatform img')
    for (var i = 0; i < streamList.length; i++) {
        $(streamList[i]).attr('width', width)
        $(streamList[i]).attr('height', height)
    }
}

function hideAllSvg(){
    var streamList = streamPlatform.children()
    for (var i = 0; i < streamList.length; i++) {
        $(streamList[i]).attr('style', 'display:none;')
    }
}

init()

// api call
function getMovieName(){
    var query = document.location.search
    if (query.includes('=')){
        var movieName = query.split('=')[1]
        if (movieName.length > 0){
            return movieName
        }
        else{
            // if movie name field is empty
            return ""
        }
    }
    else{
        // if query part is empty
        return ""
    }
}

// return data get from OMDB API
async function getDataOMDB(movieName){
    var url = getURLOMDB(movieName)
    var response = await fetch(url)
    console.log(response)
    if (!response.ok){
        // TODO redirect to error page with status and statusText param
        var errorParam = "status="+ response.status + "&statusText=" + response.statusText
        var location = "./404.html?" + errorParam
        window.location.href = location
    }
    var data = await response.json()
    console.log(data)
    if (data.Response =="True"){
        return data
    }
    else{
        var errorParam = "status=404%" + data.Error
        var location = "./404.html?" + errorParam
        window.location.href = location
    }
}


// return url for OMDB API call
function getURLOMDB(movieName){
    var link = "https://www.omdbapi.com/?t=" + movieName +"&apikey=" + omdbAPIKey
    return link
}

// return data get from StreamingAvailability API
async function getDataStreamingAvailability(movieID){
    var option = {
        method: "GET",
        headers:{
            'X-RapidAPI-Host': xAPIHost,
            'X-RapidAPI-Key': xAPIKey
        }
    }
    var url = getURLStream(movieID)
    var response = await fetch(url, option)
    var data = response.json()
    return data
}

// return url for StreamingAvailability API cal;
function getURLStream(movieID){
    var link = 'https://streaming-availability.p.rapidapi.com/get/basic?country=au&imdb_id=' + movieID + '&output_language=en'
    return link
}

// get youtube video url for displaying trailer
function getYouTubeLink(videoID){
    var link = "https://www.youtube.com/embed/" + videoID
    return link
}

// rendering function
function displayData(omdbData, streamingData){
    // poster
    posterImg.attr('src', omdbData.Poster).attr('alt', streamingData.tagline)
    movieTitle.text(omdbData.Title)
    movieOverview.text(omdbData.Plot)

    // trailer video
    var youtube = getYouTubeLink(streamingData.video)
    trailer.attr('src', youtube)

    // streaming platform buttons
    var streamAvail = streamingData.streamingInfo
    var keys = Object.keys(streamAvail)
    var streamingPlatform = $('<p>')
    if (keys.length > 0){
        streamingPlatform.text('Available on:')
        for (var i = 0; i < keys.length; i++){
            var selectorString = '#' + keys[i]
            $(selectorString).attr('style', 'display: inline-block;')
        }
    }
    else{
        $('#na').attr('style', 'display: inline-block;')
    }
    
    
}

// event handlers

function searchBtnClicked(){
    var input = searchInput.val().trim()
    if (input === ''){
        return
    }
    var location = './searchPage.html?movie=' + input
    window.location.href = location
}


// add event handlers

searchBtn.on("click", searchBtnClicked)