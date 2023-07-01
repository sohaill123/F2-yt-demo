

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyAEJuKZ2h9ne_3m5Qy3WxtnJdPWOR9LV1k";
const container = document.getElementById("videos-container");


async function getVideos(q) {
  const url = `${BASE_URL}/search?key=${API_KEY}&q=${q}&type=video&maxResults=20`;
  const response = await fetch(url);
  const data = await response.json();
  const videos = data.items;
  getVideoData(videos);
}

async function getVideoData(videos) {
  const videoData = [];
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const videoId = video.id.videoId;
    const videoDetails = await getVideoDetails(videoId);
    videoData.push(videoDetails);
  }
  renderVideos(videoData);
}

async function getVideoDetails(videoId) {
  const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items[0];
}

async function getChannelDetails(channelId) {
  const url = `${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items[0].snippet;
}

async function renderVideos(videos) {
  container.innerHTML = "";
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const thumbnailUrl = video.snippet.thumbnails.high.url;
    const videoTitle = video.snippet.localized.title;
    const channelName = video.snippet.channelTitle;
    const viewCount = video.statistics.viewCount;
    const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();

   
    const channelDetails = await getChannelDetails(video.snippet.channelId);
    const channelLogo = channelDetails.thumbnails.default.url;

    container.innerHTML += `
      <div class="video-info" onclick="openVideoDetails('${video.id}')">
        <div class="video-image">
          <img src="${thumbnailUrl}" alt="video title" />
        </div>
        <div class="video-description">
          <div class="channel-avatar">
            <img src="${channelLogo}" alt="channel avatar" style="border-radius: 50%;/>
          </div>
       
          <div class="video-title">${videoTitle}</div>
          <div class="channel-description">
            <p class="channel-name">${channelName}</p>
            <p class="video-views">${viewCount} Views</p>
            <p class="video-time">${publishedAt}</p>
          </div>
          
        </div>
      </div>
    `;
  }
}

function openVideoDetails(videoId) {
  localStorage.setItem("videoId", videoId);
  window.open("/videoDetails.html");
}

async function searchVideos() {
  const searchInput = document.getElementById("searchInput").value;
  if (searchInput.trim() === "") {
    return;
  }
  getVideos(searchInput);
}

getVideos("");
