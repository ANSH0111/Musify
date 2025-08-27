console.log("Hello let's make a spotify clone to understand the frontend using html css and javascript")

let currentsong = new Audio();
let songs;
let currfolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00"
    }
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


async function getsongs(folder) {
    currfolder = folder
    let a = await (fetch(`/${folder}/`))
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    //Show all the songs in the playlist
    let songol = document.querySelector(".songsList").getElementsByTagName("ol")[0]
    songol.innerHTML = " "
    for (const song of songs) {
        songol.innerHTML = songol.innerHTML + `
        <li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ").split('128 Kbps')} </div>
                <div>Song Artist</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="play">
            </div>
        </li>`;
    }

    //Attach an event listener to each song

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/Spotify%20Clone/songs/" + track);
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00"
}

async function displayAlbums(){
    let a = await (fetch(`/songs`))
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for(let i =0;i<array.length;i++)
    {
        const e = array[i];
        if(e.href.includes("/songs/")){
            let folder = (e.href.split("/songs/").slice(-1)[0])
            console.log(folder);
            //Get metadata of the folder
            let a = await (fetch(`/songs/${folder}/info.json`))
            let response = await a.json()
            cardcontainer.innerHTML = cardcontainer.innerHTML+ `
            <div data-folder="${folder}" class="card">
            <div class="play">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#1DB954" />
                <path d="M10 16.5V7.5L16 12l-6 4.5z" fill="black" />
              </svg>
            </div>
            
            <img src="/songs/${folder}/cover.jpg" alt="cover image">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`
        }
    }

    // Load playlist whenever the card is clicked 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", item => {
            songs = getsongs(`songs/${item.currentTarget.dataset.folder}`);
            console.log("Clicked")
        })
    })

}

async function main() {

    //Get all songs in the playlist
    await getsongs("songs/mixed");
    playMusic(songs[0], true)
    // Display all the albums on the page
    displayAlbums()


    //Pause and play on 'spacebar' press and next and previous song play
    document.addEventListener("keydown",e=>{
        if(e.code === 'Space' && !currentsong.paused){
            e.preventDefault()
            currentsong.pause()
            play.src = "play.svg"
        }
        else if(e.code ==='ArrowRight'){
            let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`).slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1])
            }
        }
        else if(e.code ==='ArrowLeft'){
            let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`).slice(-1)[0])
            if ((index - 1) >= 0) {
                playMusic(songs[index - 1])
            }
        }
        else{
            e.preventDefault()
            currentsong.play()
            play.src = "pause.svg"
        }
    })

    // Attach an event listener to play 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    //Listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (((currentsong.currentTime) / currentsong.duration) * 100) - 1 + "%"
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".circle").style.left = (percent) + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // Add an event listener for hamburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".first").style.left = 0;
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".first").style.left = "-100%";
    })

    // Add an event listener to previous and next button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`).slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`).slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

}
main()