document.addEventListener("DOMContentLoaded", function() {

    //This represents an example favorite's channel list. Just enter the names of your favorite twitch channels in this array.
    var channels = ["esl_sc2", "ogamingsc2", "freecodecamp", "callofduty", "ghudda", "habathcx", "simCopter1", "Lethalfrag", "noobs2ninjas", "beohoff", "comster404", "brunofin"];

    function render(channel) {
        var main = document.getElementsByTagName("main")[0];
        var row = document.createElement("div");
        var logo = document.createElement("img");
        var title = document.createElement("a");
        var status = document.createElement("p");
        var line = document.createElement("hr");
        logo.src = channel.logo;
        logo.classList.add("logo");
        title.innerHTML = channel.name;
        title.href = channel.url;
        title.classList.add("primary-text");
        title.setAttribute("target", "_blank");
        status.innerHTML = channel.status;
        status.classList.add("secondary-text");
        row.classList.add("row", "animated", "bounceInDown");
        row.appendChild(logo);
        row.appendChild(title);
        row.appendChild(status);
        main.appendChild(row);
    }

    //Gets info from Twitch API, creates an object with specific data for the channel, and passes the object to render()
    function getChannel(channel) {
        var streamReq = new XMLHttpRequest();
        var channelReq = new XMLHttpRequest();
        streamReq.open("GET", "https://api.twitch.tv/kraken/streams/" + channel, true);
        streamReq.onload = function() {
            var data = JSON.parse(streamReq.responseText);
            if (data.error) {
                render({
                    name: channel,
                    status: "No Account",
                    logo: "https://pixabay.com/static/uploads/photo/2013/04/07/06/42/error-101407_960_720.jpg",
                    url: "."
                });
            }
            else if (data.stream === null) {
                channelReq.open("GET", "https://api.twitch.tv/kraken/channels/" + channel, true);
                channelReq.onload = function() {
                    data = JSON.parse(channelReq.responseText);
                    var logo = data.logo;
                    if (logo === null) {
                        logo = "https://pixabay.com/static/uploads/photo/2014/02/21/07/57/question-mark-271039_960_720.jpg";
                    }
                    render({
                        name: data.display_name,
                        status: "Offline",
                        logo: logo,
                        url: "http://www.twitch.tv/" + channel
                    });
                }
                channelReq.send();
            }
            else {
                render({
                    name: data.stream.channel.display_name,
                    status: data.stream.channel.status,
                    logo: data.stream.channel.logo,
                    url: "http://www.twitch.tv/" + channel
                });
            }
        };
        streamReq.send()
    };

    //Get info for each channel in our channel array
    channels.map(function(elem) {
        getChannel(elem);
    });


});